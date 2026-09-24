import { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import './photo-confirm.css';
import { useDroolMotion } from './useDroolMotion';
import { JourneyMouth } from './JourneyMouth';
import { journeyMotion } from './journeyMotion';

type PhotoConfirmProps={onBack:()=>void;onRetake:()=>void};
const foods=['🥗','🍕','🍔','🌮','🍜','🍎','🥑','🍞','🧀','🥕','🍇','🍣'];
const FOOD_INTERVAL_MS=120;
type Phase='review'|'entering'|'chewing'|'result';
export default function PhotoConfirm({onBack,onRetake}:PhotoConfirmProps){
 const droolRef=useDroolMotion();
 const [phase,setPhase]=useState<Phase>('review');
 const [elapsed,setElapsed]=useState(0);
 const [food,setFood]=useState(0);
 const [result,setResult]=useState<'yes'|'no'|null>(null);
 const [successProgress,setSuccessProgress]=useState(0);
 const [demoOutcome]=useState<'yes'|'no'>(()=>new URLSearchParams(window.location.search).get('result')==='cannot-eat'?'no':'yes');
 const reduce=useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const change=()=>{reduce.current=media.matches;};
  media.addEventListener('change',change);return ()=>media.removeEventListener('change',change);
 },[]);
 const playing=phase==='entering'||phase==='chewing';
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
  const resultTimer=window.setTimeout(()=>{setResult(demoOutcome);setPhase('result');},3000);
  return ()=>{clearInterval(timer);clearTimeout(resultTimer);};
 },[phase,FOOD_INTERVAL_MS,demoOutcome]);
 useEffect(()=>{
  if(!result)return;
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
 return <main className={`confirm-page journey-page phase-${phase}`} aria-labelledby="photo-confirm-title">
  <header className="confirm-header">
   <Button type="text" className="confirm-back" aria-label={reviewing?'Back to camera':'Back to photo'} icon={<LeftOutlined/>} onClick={reviewing?onBack:reset}/>
   <h1 id="photo-confirm-title">{reviewing?'Look good?':phase==='result'?'Your food check':'Checking your food…'}</h1>
  </header>
  <div className="confirm-body">
   <div className="confirm-photo" role="img" aria-label="Captured photo placeholder" aria-hidden={!reviewing} style={{transform:`translateY(${motion.photoY/874*100}cqh) scale(${motion.photoScale})`,opacity:motion.photoOpacity}}/>
   <div className="journey-character" ref={droolRef}>
    <JourneyMouth progress={motion.face} chewing={phase==='chewing'} result={result} droolOpacity={motion.drool} closure={reduce.current&&!reviewing?1:motion.closure} chewWave={reduce.current?0:motion.chewWave} successProgress={successProgress}/>
   </div>
   <div className="confirm-actions" inert={!reviewing} aria-hidden={!reviewing} style={{opacity:motion.actions,transform:`translateY(${(1-motion.actions)*8}px)`}}>
    <Button type="primary" size="large" className="confirm-primary" onClick={()=>setPhase('entering')}>Check food</Button>
    <Button size="large" className="confirm-again" onClick={onRetake}>Again</Button>
   </div>
  </div>
  {(phase==='chewing'||phase==='result')&&<section className="journey-thought" aria-label="Food check demonstration" style={{opacity:motion.bubble,transform:`translateY(${(1-motion.bubble)*12}px) scale(${.96+.04*motion.bubble})`}}>
   <div className={`journey-bubble ${result?`result-${result}`:''}`}>
    {result?<span className="journey-result-food" aria-hidden="true">{foods[0]}</span>:<span className="journey-food" key={food} aria-hidden="true">{foods[food]}</span>}
   </div>
   <p className="journey-status" role="status">{result?(result==='yes'?'Can eat':'Cannot eat'):'Checking your preferences…'}</p>
  </section>}
 </main>;
}
