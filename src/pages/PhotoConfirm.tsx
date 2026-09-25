import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import './photo-confirm.css';
import { useDroolMotion } from './useDroolMotion';
import { JourneyMouth } from './JourneyMouth';
import { journeyMotion } from './journeyMotion';
import FoodCheckDetails from './FoodCheckDetails';
import WaiterCheck from './WaiterCheck';
import { getDemoMatchedChoices, type DietChoices } from './dietChoices';
import { demoFood } from './demoFood';

type PhotoConfirmProps={choices:DietChoices;captureBounds?:DOMRect|null;onBack:()=>void;onRetake:()=>void};
const foods=demoFood.scanEmojis;
const FOOD_INTERVAL_MS=120;
type Phase='review'|'entering'|'chewing'|'result';
export default function PhotoConfirm({onBack,onRetake,captureBounds,choices}:PhotoConfirmProps){
 const [droolReady,setDroolReady]=useState(!captureBounds);
 const droolRef=useDroolMotion(droolReady);
 const pageRef=useRef<HTMLElement>(null);
 const [arriving,setArriving]=useState(()=>!!captureBounds&&!matchMedia('(prefers-reduced-motion: reduce)').matches);
 useLayoutEffect(()=>{
  if(!captureBounds||!arriving)return;
  const root=pageRef.current!,photo=root.querySelector<HTMLElement>('.confirm-photo')!;
  const pageBox=root.getBoundingClientRect(),target=photo.getBoundingClientRect();
  const animations:Animation[]=[];
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const finish=()=>{setDroolReady(true);setArriving(false);};
  if(media.matches){finish();return;}
  // Animate the same photo surface from the measured viewfinder to its review slot.
  animations.push(photo.animate([
   {left:`${captureBounds.left-pageBox.left}px`,top:`${captureBounds.top-pageBox.top}px`,width:`${captureBounds.width}px`,height:`${captureBounds.height}px`,borderRadius:'0px'},
   {left:`${target.left-pageBox.left}px`,top:`${target.top-pageBox.top}px`,width:`${target.width}px`,height:`${target.height}px`,borderRadius:getComputedStyle(photo).borderRadius},
  ],{duration:820,fill:'both',easing:'cubic-bezier(.4,0,.2,1)'}));
  root.querySelectorAll<HTMLElement>('.confirm-header,.journey-character,.confirm-actions').forEach((el,i)=>{
   animations.push(el.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],
    {duration:360,delay:820+i*100,fill:'both',easing:'cubic-bezier(.22,1,.36,1)'}));
  });
  // The mouth starts revealing at 920ms; start its drool at the same moment.
  const droolTimer=window.setTimeout(()=>setDroolReady(true),920);
  animations.at(-1)!.addEventListener('finish',finish);
  const motionChange=()=>{if(media.matches)finish();};
  media.addEventListener('change',motionChange);
  window.addEventListener('resize',finish,{once:true});
  return ()=>{clearTimeout(droolTimer);animations.forEach(a=>a.cancel());media.removeEventListener('change',motionChange);window.removeEventListener('resize',finish);};
 },[captureBounds,arriving]);
 const [phase,setPhase]=useState<Phase>('review');
 const [elapsed,setElapsed]=useState(0);
 const [food,setFood]=useState(0);
 const [result,setResult]=useState<'yes'|'no'|'unknown'|null>(null);
 const [successProgress,setSuccessProgress]=useState(0);
 const [showDetails,setShowDetails]=useState(false);
 const [showWaiter,setShowWaiter]=useState(false);
 const [demoOutcome]=useState<'yes'|'no'|'unknown'>(()=>{
  const value=new URLSearchParams(window.location.search).get('result');
  return value==='cannot-eat'?'no':value==='unknown'?'unknown':'yes';
 });
 const reduce=useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const change=()=>{reduce.current=media.matches;};
  media.addEventListener('change',change);return ()=>media.removeEventListener('change',change);
 },[]);
 const playing=phase==='entering'||phase==='chewing'||result==='unknown';
 useEffect(()=>{
  if(!playing)return;
  let frame=0;const start=performance.now();
  let entered=false;
  const step=(now:number)=>{
   const time=reduce.current?2000:now-start;
   setElapsed(time);
   if(time>=1500&&!entered){entered=true;setPhase('chewing');}
   frame=requestAnimationFrame(step);
  };
  frame=requestAnimationFrame(step);return ()=>cancelAnimationFrame(frame);
 },[playing]);
 useEffect(()=>{
  if(phase!=='chewing')return;
  const timer=window.setInterval(()=>{if(!reduce.current)setFood(i=>(i+1)%foods.length);},FOOD_INTERVAL_MS);
  const settleTimer=window.setTimeout(()=>clearInterval(timer),3000-FOOD_INTERVAL_MS);
  const resultTimer=window.setTimeout(()=>{setResult(demoOutcome);setPhase('result');},3000);
  return ()=>{clearInterval(timer);clearTimeout(settleTimer);clearTimeout(resultTimer);};
 },[phase,FOOD_INTERVAL_MS,demoOutcome]);
 useEffect(()=>{
  if(!result||result==='unknown')return;
  let frame=0;const start=performance.now();
  const step=(now:number)=>{
   const t=reduce.current?1:Math.min(1,(now-start)/720);
   setSuccessProgress(t*t*t*(10+t*(-15+6*t)));
   if(t<1)frame=requestAnimationFrame(step);
  };
  frame=requestAnimationFrame(step);return ()=>cancelAnimationFrame(frame);
 },[result]);
 const reset=()=>{setPhase('review');setElapsed(0);setResult(null);setSuccessProgress(0);setFood(0);};
 const reviewing=phase==='review';
 const motion=journeyMotion(elapsed);
 const matchedChoices=getDemoMatchedChoices(choices);
 const primaryReason=matchedChoices[0]??demoFood.matchedLabels[0];
 const resultEmoji=demoFood.reasonEmojis[primaryReason as keyof typeof demoFood.reasonEmojis]??'⚠️';
 return <><main className={`confirm-page journey-page phase-${phase}`} aria-labelledby="photo-confirm-title" ref={pageRef} inert={arriving?true:undefined} data-arriving={arriving}>
  <header className="confirm-header app-page-header">
   <Button type="text" className="confirm-back" aria-label={reviewing?'Back to camera':'Back to photo'} icon={<LeftOutlined/>} onClick={reviewing?onBack:reset}/>
   <h1 id="photo-confirm-title">{reviewing?'Look good?':'Checking your food…'}</h1>
  </header>
  <div className="confirm-body">
   <div className="confirm-photo" role="img" aria-label={`Captured ${demoFood.name} photo`} aria-hidden={!reviewing} style={{backgroundImage:`url(${demoFood.imageSrc})`,transform:`translateY(${motion.photoY/874*100}cqh) scale(${motion.photoScale})`,opacity:motion.photoOpacity}}/>
   <div className="journey-character" ref={droolRef}>
    <JourneyMouth progress={motion.face} chewing={phase==='chewing'||result==='unknown'} result={result} droolOpacity={motion.drool} closure={reduce.current&&!reviewing?1:motion.closure} chewWave={reduce.current?0:motion.chewWave} successProgress={successProgress}/>
   </div>
   <div className="confirm-actions" inert={!reviewing} aria-hidden={!reviewing} style={{opacity:motion.actions,transform:`translateY(${(1-motion.actions)*8}px)`}}>
    <Button type="primary" size="large" className="confirm-primary" onClick={()=>setPhase('entering')}>Check food</Button>
    <Button size="large" className="confirm-again" onClick={onRetake}>Again</Button>
   </div>
  </div>
  {(phase==='chewing'||phase==='result')&&<section className={`journey-thought ${result==='no'?'journey-thought-cannot':result==='unknown'?'journey-thought-unknown':''}`} aria-label="Food check demonstration" style={{opacity:motion.bubble,transform:`translateY(${(1-motion.bubble)*12}px) scale(${.96+.04*motion.bubble})`}}>
   <div className={`journey-bubble ${result?`result-${result}`:''}`}>
    <span className={`journey-food${result?' journey-food-previous':''}`} key={food} aria-hidden="true">{foods[food]}</span>
    {result&&<span className="journey-food journey-food-final" aria-hidden="true">{result==='no'?resultEmoji:result==='unknown'?'❓':'✓'}</span>}
   </div>
   {result==='no'?<>
    <p className="journey-result-title" role="status">Can’t Eat:(</p>
    <button type="button" className="journey-result-details" onClick={()=>setShowDetails(true)}>Checking Details <span aria-hidden="true">›</span></button>
    {!!matchedChoices.length&&<div className="journey-result-reasons" aria-label="Matched preferences">{matchedChoices.map(label=><span className="journey-result-reason" key={label}>{label}</span>)}</div>}
   </>:result==='unknown'?<>
    <p className="journey-result-title" role="status">Not sure yet</p>
    <p className="journey-result-guidance">Need to check with the waiter</p>
    <div className="journey-result-action"><Button type="primary" onClick={()=>setShowWaiter(true)}>Show the waiter</Button></div>
   </>:<p className="journey-status" role="status">{result==='yes'?'Can eat':'AI is analyzing ingredients…'}</p>}
  </section>}
 </main>{showDetails&&<FoodCheckDetails choices={choices} onBack={()=>setShowDetails(false)}/>} {showWaiter&&<WaiterCheck onBack={()=>setShowWaiter(false)}/>}</>;
}
