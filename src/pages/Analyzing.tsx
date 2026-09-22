import { useEffect, useState, type CSSProperties } from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { MouthFrame } from '../components/MouthFrame';
import './analyzing.css';

type AnalyzingProps={onBack:()=>void};

const emojis=['🥗','🍕','🍔','🌮','🍜','🍎','🥑','🍞','🧀','🥕','🍇','🍣'];
const statuses=['Reading the ingredients…','Matching your preferences…','Checking for allergens…','Almost done…'];

type Tune={topPct:number;sidePct:number;bottomPct:number;cavityInset:number;interiorTop:number;interiorBottom:number;tongueH:number;frameRadius:number;emojiTopPct:number};
const defaultTune:Tune={topPct:70,sidePct:0,bottomPct:0,cavityInset:16,interiorTop:24,interiorBottom:16,tongueH:39,frameRadius:56,emojiTopPct:28};

export default function Analyzing({onBack}:AnalyzingProps){
 const [emojiIndex,setEmojiIndex]=useState(0);
 const [statusIndex,setStatusIndex]=useState(0);
 const [tune,setTune]=useState<Tune>(defaultTune);
 useEffect(()=>{
  const emojiTimer=window.setInterval(()=>setEmojiIndex(index=>(index+1)%emojis.length),450);
  const statusTimer=window.setInterval(()=>setStatusIndex(index=>(index+1)%statuses.length),1800);
  return ()=>{window.clearInterval(emojiTimer);window.clearInterval(statusTimer);};
 },[]);
 const style={
  '--a-top':`${tune.topPct}%`,
  '--a-side':`${tune.sidePct}%`,
  '--a-bottom':`${tune.bottomPct}%`,
  '--a-cavity':`${tune.cavityInset}px`,
  '--a-int-top':`${tune.interiorTop}px`,
  '--a-int-bot':`${tune.interiorBottom}px`,
  '--a-tongue':`${tune.tongueH}px`,
  '--a-frame-radius':`${tune.frameRadius}px`,
  '--a-emoji-top':`${tune.emojiTopPct}%`,
 } as CSSProperties;
 return <>
  <main className="analyzing-page" aria-labelledby="analyzing-title" style={style}>
   <header className="analyzing-header">
    <Button type="text" className="analyzing-back" aria-label="Back to photo" icon={<LeftOutlined/>} onClick={onBack}/>
    <h1 id="analyzing-title">Checking your food…</h1>
   </header>
   <section className="analyzing-thinking" role="status" aria-live="polite">
    <span className="analyzing-emoji" key={emojiIndex} aria-hidden="true">{emojis[emojiIndex]}</span>
    <p className="analyzing-status" key={`s-${statusIndex}`}>{statuses[statusIndex]}</p>
   </section>
   <div className="analyzing-mouth-scene"><MouthFrame className="analyzing-mouth"/></div>
  </main>
  <aside className="analyzing-tuner" aria-label="Analyzing tuner">
   <div className="analyzing-tuner-title">Mouth tuner<button type="button" className="analyzing-tuner-reset" onClick={()=>setTune(defaultTune)}>Reset</button></div>
   {([
    ['Face top %','topPct',40,90,1,'%'],
    ['Side inset %','sidePct',-20,20,1,'%'],
    ['Bottom offset %','bottomPct',-20,20,1,'%'],
    ['Frame radius','frameRadius',0,120,1,'px'],
    ['Cavity inset','cavityInset',0,60,1,'px'],
    ['Interior top','interiorTop',0,80,1,'px'],
    ['Interior bottom','interiorBottom',0,80,1,'px'],
    ['Tongue height','tongueH',4,60,1,'px'],
    ['Emoji top %','emojiTopPct',10,50,1,'%'],
   ] as const).map(([label,key,min,max,step,unit])=><label className="analyzing-tuner-row" key={key}>
    <span>{label}</span>
    <input type="range" min={min} max={max} step={step} value={tune[key]} onChange={e=>setTune(previous=>({...previous,[key]:Number(e.target.value)}))}/>
    <output>{tune[key]}{unit}</output>
   </label>)}
  </aside>
 </>;
}
