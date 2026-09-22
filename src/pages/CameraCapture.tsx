import { useLayoutEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { LeftOutlined, SyncOutlined, ThunderboltOutlined } from '@ant-design/icons';
import './camera-capture.css';

type CameraCaptureProps={onBack:()=>void;onCapture:()=>void};
const zoomLevels=['0.5','1','2','5'] as const;
type ZoomLevel=typeof zoomLevels[number];

export default function CameraCapture({onBack,onCapture}:CameraCaptureProps){
 const [zoom,setZoom]=useState<ZoomLevel>('1');
 const [flash,setFlash]=useState(false);
 const [inverted,setInverted]=useState(false);
 const zoomRef=useRef<HTMLDivElement>(null);
 const zoomTrackRef=useRef<HTMLDivElement>(null);
 const zoomButtons=useRef<(HTMLButtonElement|null)[]>([]);
 const indicatorRef=useRef<HTMLSpanElement>(null);
 const previousOffset=useRef<number|null>(null);
 const trackAnimationRef=useRef<Animation|null>(null);
 const indicatorAnimationRef=useRef<Animation|null>(null);
 useLayoutEffect(()=>{
  const row=zoomRef.current;const track=zoomTrackRef.current;const indicator=indicatorRef.current;const target=zoomButtons.current[zoomLevels.indexOf(zoom)];
  if(!row||!track||!indicator||!target)return;
  const targetCenter=target.offsetLeft+target.offsetWidth/2;
  const targetX=row.clientWidth/2-targetCenter;
  if(previousOffset.current===null||window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   trackAnimationRef.current?.cancel();indicatorAnimationRef.current?.cancel();track.style.transform=`translateX(${targetX}px)`;previousOffset.current=targetX;return;
  }
  const rowBox=row.getBoundingClientRect();
  const currentX=trackAnimationRef.current?.playState==='running'?track.getBoundingClientRect().left-rowBox.left:previousOffset.current;
  trackAnimationRef.current?.cancel();indicatorAnimationRef.current?.cancel();track.style.transform=`translateX(${targetX}px)`;
  if(Math.abs(targetX-currentX)<.5){previousOffset.current=targetX;return;}
  trackAnimationRef.current=track.animate([
   {transform:`translateX(${currentX}px)`},
   {transform:`translateX(${targetX}px)`},
  ],{duration:440,easing:'cubic-bezier(.4,0,.2,1)'});
  indicatorAnimationRef.current=indicator.animate([
   {transform:'translateX(-50%) scale(1)',offset:0},
   {transform:'translateX(-50%) scale(.58)',offset:.22},
   {transform:'translateX(-50%) scale(.58)',offset:.72},
   {transform:'translateX(-50%) scale(1)',offset:1},
  ],{duration:440,easing:'cubic-bezier(.4,0,.2,1)'});
  previousOffset.current=targetX;
 },[zoom]);
 const capture=()=>onCapture();
 return <main className="camera-page" aria-labelledby="camera-title">
  <header className="camera-header">
   <Button type="text" className="camera-back" aria-label="Back to preferences" icon={<LeftOutlined/>} onClick={onBack}/>
   <h1 id="camera-title">What’s on the table?</h1>
  </header>
  <section className="camera-viewfinder" aria-label="Camera preview">
   <div className="camera-zoom" aria-label="Camera zoom" ref={zoomRef}>
    <span className="camera-zoom-indicator" ref={indicatorRef} aria-hidden="true"/>
    <div className="camera-zoom-track" ref={zoomTrackRef}>
     {zoomLevels.map((level,index)=><button type="button" key={level} ref={element=>{zoomButtons.current[index]=element;}} aria-label={`${level}× zoom`} aria-pressed={zoom===level} onClick={()=>setZoom(level)}>{level}{zoom===level?'x':''}</button>)}
    </div>
   </div>
  </section>
  <div className="camera-capture-area">
   <Button type="primary" size="large" className={`camera-tool camera-flash ${flash?'is-active':''}`} icon={<ThunderboltOutlined/>} aria-pressed={flash} onClick={()=>setFlash(value=>!value)}>Flash</Button>
   <button type="button" className="camera-shutter" aria-label="Capture photo" onClick={capture}><span/></button>
   <Button type="primary" size="large" className={`camera-tool ${inverted?'is-active':''}`} icon={<SyncOutlined/>} aria-pressed={inverted} onClick={()=>setInverted(value=>!value)}>Invert</Button>
  </div>
 </main>;
}
