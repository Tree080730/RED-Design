import { useLayoutEffect,useRef } from 'react';
import { FinalMouthPortrait,useMouthConfig } from './MouthConfig';
import { prepareMouthExpansion,clonePortrait,type MouthExpansionTarget } from './mouthExpansion';

type SourceRect={x:number;y:number;width:number;height:number};
type MouthFrameProps={className?:string;progress?:number;sourceRect?:SourceRect;target?:MouthExpansionTarget;openingOpacity?:number};

export function MouthFrame({className='',progress=1,sourceRect,target,openingOpacity=1}:MouthFrameProps={}){
 const {config}=useMouthConfig();const ref=useRef<HTMLDivElement>(null);const applyRef=useRef<((progress:number)=>void)|null>(null);const progressRef=useRef(progress);const opacityRef=useRef(openingOpacity);
 progressRef.current=progress;opacityRef.current=openingOpacity;
 useLayoutEffect(()=>{
  const host=ref.current!;
  const source=host.querySelector<SVGSVGElement>('.mouth-frame-source svg')!;
  const output=host.querySelector<HTMLDivElement>('.mouth-frame-output')!;
  const resize=()=>{
   const {width,height}=host.getBoundingClientRect();if(!width||!height)return;
   const svg=clonePortrait(source,'expanded-');
   if(sourceRect){
    const [vx,vy,vw,vh]=svg.viewBox.baseVal?[svg.viewBox.baseVal.x,svg.viewBox.baseVal.y,svg.viewBox.baseVal.width,svg.viewBox.baseVal.height]:[-130,-48,660,432];
    const framedWidth=vw*width/sourceRect.width,framedHeight=vh*height/sourceRect.height;
    svg.setAttribute('viewBox',`${vx-sourceRect.x*framedWidth/width} ${vy-sourceRect.y*framedHeight/height} ${framedWidth} ${framedHeight}`);
    svg.setAttribute('preserveAspectRatio','none');
   }
   output.replaceChildren(svg);applyRef.current=prepareMouthExpansion(svg,width,height,target);applyRef.current(progressRef.current);
   svg.querySelector('[data-part="opening"]')?.setAttribute('opacity',String(opacityRef.current));
  };
  resize();const observer=new ResizeObserver(resize);observer.observe(host);
  return ()=>{observer.disconnect();applyRef.current=null;};
 },[config,sourceRect,target]);
 useLayoutEffect(()=>{applyRef.current?.(progress);},[progress]);
 useLayoutEffect(()=>{ref.current?.querySelector('.mouth-frame-output [data-part="opening"]')?.setAttribute('opacity',String(openingOpacity));},[openingOpacity]);
 return <div ref={ref} className={`mouth-frame-art mouth-frame-configured ${className}`} aria-hidden="true"><div className="mouth-frame-source" hidden><FinalMouthPortrait/></div><div className="mouth-frame-output"/></div>;
}
