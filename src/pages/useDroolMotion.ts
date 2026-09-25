import { useEffect, useRef } from 'react';

// Sample a damped spring continuously rather than easing between pose changes.
export function useDroolMotion(enabled=true){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const root=ref.current;
  if(!root)return;
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  let animations:Animation[]=[];
  const start=()=>{
   animations.forEach(animation=>animation.cancel());animations=[];
   if(!enabled||media.matches)return;
   const strand:Keyframe[]=[],drop:Keyframe[]=[],bead:Keyframe[]=[];
   const seconds=4.2,steps=504,dt=seconds/steps;
   let stretch=1;
   for(let i=0;i<=steps;i++){
    const t=i*dt,w=9,d=3;
    const decay=Math.exp(-d*t);
    const spring=91-82*decay*(Math.cos(w*t)+d/w*Math.sin(w*t));
    const speed=82*decay*(w+d*d/w)*Math.sin(w*t);
    // A slow, smooth return has zero velocity and acceleration at both ends.
    const u=Math.max(0,Math.min(1,(t-3)/1.2));
    const blend=u*u*u*(10+u*(-15+6*u));
    const blendSpeed=30*u*u*(1-u)*(1-u)/1.2;
    const y=spring*(1-blend)+9*blend;
    const velocity=speed*(1-blend)+(9-spring)*blendSpeed;
    // Low-pass deformation follows motion with a slight lag, preserving volume.
    const target=1+.24*Math.tanh(velocity/200)*(1-blend);
    stretch+=(target-stretch)*(1-Math.exp(-dt/.075));
    const sy=1+(stretch-1)*(1-blend),sx=1/Math.sqrt(sy);
    const offset=i/steps;
    strand.push({offset,transform:`scale(${1/Math.sqrt(Math.max(.4,y/91))},${y/91})`});
    drop.push({offset,transform:`translateY(${y}px)`});
    bead.push({offset,transform:`scale(${sx},${sy})`});
   }
   const options:KeyframeAnimationOptions={duration:seconds*1000,iterations:Infinity,easing:'linear'};
   for(const [selector,frames] of [['.confirm-drool-strand',strand],['.confirm-drool-drop',drop],['.confirm-drool-bead',bead]] as const){
    const element=root.querySelector(selector);
    if(element)animations.push(element.animate(frames,options));
   }
  };
  start();media.addEventListener('change',start);
  return ()=>{animations.forEach(animation=>animation.cancel());media.removeEventListener('change',start);};
 },[enabled]);
 return ref;
}
