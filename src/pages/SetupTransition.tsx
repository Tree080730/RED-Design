import { useLayoutEffect,useRef } from 'react';
import { clonePortrait,prepareMouthExpansion } from '../components/mouthExpansion';

const ease=(x:number)=>{const t=Math.max(0,Math.min(1,x));return t*t*t*(t*(t*6-15)+10);};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;

export function SetupTransition({onComplete}:{onComplete:()=>void}){
 const ref=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const layer=ref.current!,root=layer.parentElement!;
  const source=root.querySelector<SVGSVGElement>('.mouth-preview svg')!;
  const frame=root.querySelector<HTMLElement>('.mouth-frame-art')!;
  const setup=root.querySelector<HTMLElement>('.mouth-setup-layer')!;
  const rootBox=root.getBoundingClientRect(),start=source.getBoundingClientRect(),end=frame.getBoundingClientRect();
  const portrait=clonePortrait(source,'transition-');layer.append(portrait);
  const pose=prepareMouthExpansion(portrait,end.width,end.height);
  source.style.visibility='hidden';
  const animations:Animation[]=[];
  animations.push(setup.animate([{opacity:1},{opacity:0}],{duration:260,fill:'both',easing:'ease-out'}));
  const reveals=root.querySelectorAll<HTMLElement>('.diet-header,.diet-mouth-content .diet-group,.diet-mouth-action');
  reveals.forEach((el,i)=>animations.push(el.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,delay:1450+i*85,fill:'both',easing:'cubic-bezier(.22,1,.36,1)'})));
  const centerTop=rootBox.height/2-start.height/2;
  const centerLeft=(rootBox.width-start.width)/2;
  let raf=0,started:number|undefined,done=false;
  const tick=(now:number)=>{
   started??=now;const elapsed=now-started;
   const travel=ease(elapsed/480),enlarge=ease((elapsed-480)/470),opening=ease((elapsed-950)/600);
   const cx=mix(start.left-rootBox.left,centerLeft,travel),cy=mix(start.top-rootBox.top,centerTop,travel);
   // Scale the original SVG uniformly until the face reaches the page width.
   const fullWidth=end.width*660/(404*500/364);
   const fullHeight=start.height*fullWidth/start.width;
   const compactHeight=fullHeight;
   const compactTop=(rootBox.height-compactHeight)/2;
   const expandedTop=mix(compactTop,end.top-rootBox.top,opening);
   const expandedWidth=mix(fullWidth,end.width,opening);
   const expandedLeft=(rootBox.width-expandedWidth)/2;
   const expandedHeight=mix(compactHeight,end.height,opening);
   Object.assign(portrait.style,{position:'absolute',left:`${mix(cx,expandedLeft,enlarge)}px`,top:`${mix(cy,expandedTop,enlarge)}px`,width:`${mix(start.width,expandedWidth,enlarge)}px`,height:`${mix(start.height,expandedHeight,enlarge)}px`,overflow:'visible'});
   pose(opening);
   if(elapsed<2200)raf=requestAnimationFrame(tick);else {done=true;onComplete();}
  };
  // Paint the initial geometry synchronously; no first-frame flash.
  tick(performance.now());
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const finish=()=>{if(!done){done=true;cancelAnimationFrame(raf);onComplete();}};
  const motionChange=()=>{if(media.matches)finish();};
  media.addEventListener('change',motionChange);
  window.addEventListener('resize',finish,{once:true});
  return ()=>{cancelAnimationFrame(raf);animations.forEach(a=>a.cancel());source.style.visibility='';portrait.remove();media.removeEventListener('change',motionChange);window.removeEventListener('resize',finish);};
 },[onComplete]);
 return <div className="setup-transition-layer" ref={ref} aria-hidden="true"/>;
}
