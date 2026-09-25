import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import './analyzing.css';
import { demoFood } from './demoFood';

type AnalyzingProps={onBack:()=>void};

const emojis=demoFood.scanEmojis;
const statuses=['Reading the ingredients…','Matching your preferences…','Checking for allergens…','Almost done…'];

export default function Analyzing({onBack}:AnalyzingProps){
 const [emojiIndex,setEmojiIndex]=useState(0);
 const [statusIndex,setStatusIndex]=useState(0);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  let emojiTimer:number|undefined;
  const startReel=()=>{
   window.clearInterval(emojiTimer);
   if(!media.matches)emojiTimer=window.setInterval(()=>setEmojiIndex(index=>(index+1)%emojis.length),200);
  };
  startReel();media.addEventListener('change',startReel);
  const statusTimer=window.setInterval(()=>setStatusIndex(index=>(index+1)%statuses.length),1800);
  return ()=>{window.clearInterval(emojiTimer);window.clearInterval(statusTimer);media.removeEventListener('change',startReel);};
 },[]);
 return <>
  <main className="analyzing-page" aria-labelledby="analyzing-title">
   <header className="analyzing-header app-page-header">
    <Button type="text" className="analyzing-back" aria-label="Back to photo" icon={<LeftOutlined/>} onClick={onBack}/>
    <h1 id="analyzing-title">Checking your food…</h1>
   </header>
   <section className="analyzing-thinking" role="status" aria-live="polite">
    <span className="analyzing-emoji" key={emojiIndex} aria-hidden="true">{emojis[emojiIndex]}</span>
    <p className="analyzing-status" key={`s-${statusIndex}`}>{statuses[statusIndex]}</p>
   </section>
   <div className="analyzing-mouth-scene" aria-hidden="true">
    <svg viewBox="0 0 750 594" preserveAspectRatio="none" focusable="false">
     <defs><clipPath id="analyzing-mouth-clip"><rect x="-70" y="92" width="890" height="482" rx="200"/></clipPath></defs>
     <rect x="-100" y="42" width="950" height="580" rx="210" fill="#FDDECB"/>
     <rect x="322" y="0" width="100" height="72" rx="34" fill="#FDDECB"/>
     <g clipPath="url(#analyzing-mouth-clip)">
      <rect x="-70" y="92" width="890" height="482" fill="#FFFFFF"/>
      <path d="M-70 166H820V500H-70Z" fill="#930600"/>
      <path d="M323 500C339 410 469 375 556 443C643 375 773 410 789 500Z" fill="#D76568"/>
     </g>
    </svg>
   </div>
  </main>
 </>;
}
