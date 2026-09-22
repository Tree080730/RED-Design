import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Button, Input, message, type InputRef } from 'antd';
import { EditOutlined, CheckOutlined, LeftOutlined } from '@ant-design/icons';
import './diet-preferences.css';
import { SimulatedKeyboard } from './SimulatedKeyboard';
import { MouthFrame } from '../components/MouthFrame';

const groups = [
 {key:'allergies',title:'Allergies',options:['Peanut','Tree nuts','Shellfish','Fish','Milk','Egg','Wheat','Soy','Sesame']},
 {key:'diet',title:'Dietary restrictions',options:['Vegetarian','Vegan','No pork','No beef']},
 {key:'preferences',title:'Preferences',options:['Mild spice','No cilantro','No organ meat']},
] as const;
type GroupKey = typeof groups[number]['key'];
type Choices = Record<GroupKey,string[]>;
const emptyChoices=():Choices=>({allergies:[],diet:[],preferences:[]});
export default function DietPreferences(){
 const [notice,noticeContext]=message.useMessage();
 const [selected,setSelected]=useState<Choices>(emptyChoices);
 const [custom,setCustom]=useState<Choices>(emptyChoices);
 const [editing,setEditing]=useState<GroupKey|null>(null);
 const [value,setValue]=useState('');const [error,setError]=useState('');
 const [view,setView]=useState<'select'|'confirm'>('select');
 const [simulate]=useState(()=>navigator.maxTouchPoints===0);
 const inputRef=useRef<InputRef>(null);
 const formRef=useRef<HTMLFormElement>(null);
 const viewportRef=useRef<HTMLDivElement>(null);
 const goTo=(next:'select'|'confirm')=>{setView(next);requestAnimationFrame(()=>viewportRef.current?.scrollTo({top:0}));};
 useEffect(()=>{
  if(!editing)return;
  const reveal=()=>revealInput();
  window.visualViewport?.addEventListener('resize',reveal);
  return ()=>window.visualViewport?.removeEventListener('resize',reveal);
 },[editing]);
 function revealInput(){
  const form=formRef.current;const viewport=viewportRef.current;
  if(!form||!viewport)return;
  const bounds=form.getBoundingClientRect();const visible=viewport.getBoundingClientRect();
  const gap=parseFloat(getComputedStyle(form).getPropertyValue('--ds-marginSM'));
  if(bounds.bottom>visible.bottom-gap)viewport.scrollTop+=bounds.bottom-visible.bottom+gap;
  else if(bounds.top<visible.top+gap)viewport.scrollTop+=bounds.top-visible.top-gap;
 }
 useEffect(()=>{if(editing&&simulate){const frame=requestAnimationFrame(revealInput);return ()=>cancelAnimationFrame(frame);}},[editing,simulate]);
 function typeKey(key:string){
  const input=inputRef.current?.input;if(!input)return;
  let start=input.selectionStart??value.length;const end=input.selectionEnd??start;
  if(key==='Backspace'&&start===end)start=Math.max(0,start-1);
  const text=key==='Backspace'?'':key;
  const next=value.slice(0,start)+text+value.slice(end);if(next.length>40)return;
  flushSync(()=>{setValue(next);setError('');});input.focus({preventScroll:true});input.setSelectionRange(start+text.length,start+text.length);
 }
 function begin(key:GroupKey,button:HTMLButtonElement){
  const width=button.getBoundingClientRect().width;
  flushSync(()=>{setEditing(key);setValue('');setError('');});
  // Keep focus in the original tap event so iOS can open its keyboard.
  inputRef.current?.focus({preventScroll:true});
  const form=formRef.current;
  if(form&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   const style=getComputedStyle(form);
   const duration=parseFloat(style.getPropertyValue('--ds-motionDurationSlow'))*1000;
   form.animate([{width:`${width}px`},{width:`${form.parentElement!.clientWidth}px`}],{duration,easing:style.getPropertyValue('--ds-motionEaseInOut').trim()});
  }
 }
 function cancel(){setEditing(null);setValue('');setError('');}
 const count=Object.values(selected).flat().length;
 function toggle(key:GroupKey,label:string){
  if(selected[key].includes(label)&&custom[key].includes(label)){
   setCustom(prev=>({...prev,[key]:prev[key].filter(x=>x!==label)}));
  }
  setSelected(prev=>({...prev,[key]:prev[key].includes(label)?prev[key].filter(x=>x!==label):[...prev[key],label]}));
 }
 function add(){
  if(!editing)return;const label=value.trim().replace(/\s+/g,' ');
  if(!label){setError('Enter a preference to add.');return;}
  const group=groups.find(g=>g.key===editing)!;
  const existing=[...group.options,...custom[editing]].find(x=>x.toLowerCase()===label.toLowerCase());
  if(existing){setSelected(prev=>({...prev,[editing]:Array.from(new Set([...prev[editing],existing]))}));}
  else{setCustom(prev=>({...prev,[editing]:[...prev[editing],label]}));setSelected(prev=>({...prev,[editing]:[...prev[editing],label]}));}
  setEditing(null);setValue('');setError('');
 }

 return <div className="diet-page" lang="en" aria-label="iPhone 17 Pro app prototype">
  {noticeContext}
  <div className="diet-viewport diet-mouth-viewport" ref={viewportRef} inert={view==='confirm'?true:undefined}>
   <header className="diet-header">
    <Button type="text" className="diet-back" aria-label="Go back" icon={<LeftOutlined/>} onClick={()=>{if(editing){cancel();return;}if(window.history.length>1)window.history.back();else void notice.info("You're at the first step of this demo.");}}/>
    <h1 id="diet-title">What do you avoid?</h1>
   </header>
   <main className="diet-mouth-scene" aria-labelledby="diet-title">
   <MouthFrame/>
   <div className="diet-mouth-content">
  {groups.map(g=><section className="diet-group" key={g.key} aria-labelledby={`heading-${g.key}`}><h2 id={`heading-${g.key}`}>{g.title}</h2><div className="diet-chips">{[...g.options,...custom[g.key]].map(label=><span className={`diet-chip-wrap ${selected[g.key].includes(label)?'is-selected':''}`} key={label}><button type="button" className="diet-chip" aria-label={label} aria-pressed={selected[g.key].includes(label)} onClick={()=>toggle(g.key,label)}>{label}</button></span>)}<div className="diet-add-slot">{editing===g.key?<form ref={formRef} className="diet-inline-form" onSubmit={e=>{e.preventDefault();add();}} onBlur={e=>{if(e.relatedTarget&&(e.currentTarget.contains(e.relatedTarget as Node)||(e.relatedTarget as HTMLElement).closest('.sim-keyboard')))return;if(value.trim())add();else cancel();}}>
 <EditOutlined aria-hidden="true"/><Input ref={inputRef} variant="borderless" aria-label="Your preference" aria-invalid={!!error} aria-describedby={error?`error-${g.key}`:undefined} placeholder="Add your own" value={value} maxLength={40} enterKeyHint="done" autoComplete="off" onChange={e=>{setValue(e.target.value);setError('');}} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();cancel();}if(e.key==='Enter'&&e.nativeEvent.isComposing)e.preventDefault();}}/>
 <button type="submit" className="diet-inline-done" aria-label="Add preference" onPointerDown={e=>e.preventDefault()}><CheckOutlined/></button>
 </form>:<button className="diet-chip diet-add" onClick={e=>begin(g.key,e.currentTarget)} aria-label={`Add other ${g.title.toLowerCase()}`}><EditOutlined/> Add your own</button>}{editing===g.key&&error&&<p className="diet-inline-error" id={`error-${g.key}`} role="alert">{error}</p>}</div></div></section>)}
   </div>
   </main>
  <div className="diet-bottom diet-mouth-action"><Button type="primary" size="large" className="diet-continue" onClick={()=>goTo('confirm')}>Continue</Button><span className="diet-sr-only" role="status">{count} preferences selected across all categories</span></div>
  </div>
  {view==='confirm'&&<div className="diet-confirm-overlay">
   <button type="button" className="diet-confirm-backdrop" aria-label="Close confirmation" onClick={()=>goTo('select')}/>
   <main className="diet-sheet diet-confirm-sheet" aria-labelledby="confirm-title">
  <h1 id="confirm-title" className="diet-confirm-title">Confirm your preferences</h1>
  {count?<>{groups.map(g=><section className="diet-group" key={g.key} aria-labelledby={`confirm-${g.key}`}><h2 id={`confirm-${g.key}`}>{g.title}</h2>{selected[g.key].length?<div className="diet-chips">{selected[g.key].map(label=><span className="diet-chip-wrap is-selected is-static" key={label}><span className="diet-chip">{label}</span></span>)}</div>:<p className="diet-none">None selected</p>}</section>)}<p className="diet-review-note">Your selections stay together across all three categories.</p></>:<p className="diet-empty">You can explore without preferences. Add your food requirements before getting a personalized match.</p>}
  <p className="diet-review-note">Demo preview · This confirms your selections. The next screen is not part of this prototype yet.</p>
  <div className="diet-bottom"><Button type="primary" size="large" className="diet-continue" onClick={()=>goTo('select')}>Back to edit</Button></div>
   </main>
  </div>}
 {view==='select'&&editing&&simulate&&<SimulatedKeyboard onKey={typeKey} onDone={add} onDismiss={()=>{if(value.trim())add();else cancel();}} onReveal={revealInput}/>}
 </div>;
}
