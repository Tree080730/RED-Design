import { useLayoutEffect,useRef } from 'react';
import { FinalMouthPortrait,useMouthConfig } from './MouthConfig';
import { prepareMouthExpansion,clonePortrait } from './mouthExpansion';

export function MouthFrame({className=''}:{className?:string}={}){
 const {config}=useMouthConfig();const ref=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const host=ref.current!;
  const source=host.querySelector<SVGSVGElement>('.mouth-frame-source svg')!;
  const output=host.querySelector<HTMLDivElement>('.mouth-frame-output')!;
  const resize=()=>{
   const {width,height}=host.getBoundingClientRect();if(!width||!height)return;
   const svg=clonePortrait(source,'expanded-');output.replaceChildren(svg);prepareMouthExpansion(svg,width,height)(1);
  };
  resize();const observer=new ResizeObserver(resize);observer.observe(host);
  return ()=>observer.disconnect();
 },[config]);
 return <div ref={ref} className={`mouth-frame-art mouth-frame-configured ${className}`} aria-hidden="true"><div className="mouth-frame-source" hidden><FinalMouthPortrait/></div><div className="mouth-frame-output"/></div>;
}
