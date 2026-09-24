const NS='http://www.w3.org/2000/svg';
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const numbers=(s:string)=>s.match(/-?\d*\.?\d+/g)!.map(Number);
const set=(e:Element,v:Record<string,number|string>)=>Object.entries(v).forEach(([k,value])=>e.setAttribute(k,String(value)));
function samples(shape:SVGGeometryElement,matrix=new DOMMatrix()){
 const length=shape.getTotalLength();
 const points=Array.from({length:192},(_,i)=>{const p=shape.getPointAtLength(i*length/192);return new DOMPoint(p.x,p.y).matrixTransform(matrix);});
 const center=(Math.min(...points.map(p=>p.x))+Math.max(...points.map(p=>p.x)))/2,top=Math.min(...points.map(p=>p.y));
 const start=points.reduce((best,p,i)=>Math.hypot(p.x-center,p.y-top)<Math.hypot(points[best].x-center,points[best].y-top)?i:best,0);
 return [...points.slice(start),...points.slice(0,start)];
}
// Both the transition and the settled preferences frame use this same pose.
export function prepareMouthExpansion(svg:SVGSVGElement,width:number,height:number){
 const unit=660/width,H=height*unit,inset=32*unit;
 const part=<T extends Element>(name:string)=>svg.querySelector<T>(`[data-part="${name}"]`)!;
 const face=part<SVGGElement>('face'),faceRect=face.querySelector('rect')!;
 const sourceFace={x:200-202*500/364,y:191-110*500/364,w:404*500/364,h:222*500/364,r:108*500/364};
 const cavity=part<SVGClipPathElement>('cavity');
 const from=samples(cavity.firstElementChild as SVGGeometryElement,cavity.transform.baseVal.consolidate()!.matrix);
 const compactH=Math.min(H,400);
 const x=-130+inset,y=inset,w=660-2*inset,r=40*unit;
 const roundedOutline=(height:number)=>{const h=height-2*inset;return `M${x+r} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${y+h-r}Q${x+w} ${y+h} ${x+w-r} ${y+h}H${x+r}Q${x} ${y+h} ${x} ${y+h-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`;};
 const targetD=roundedOutline(compactH);
 const targetShape=document.createElementNS(NS,'path');targetShape.setAttribute('d',targetD);svg.append(targetShape);
 targetShape.remove();
 const outline=document.createElementNS(NS,'path');cavity.replaceChildren(outline);cavity.removeAttribute('transform');
 const inner=part<SVGClipPathElement>('interior-clip').querySelector('rect')!;
 const innerY=Number(inner.getAttribute('y')),innerHeight=Number(inner.getAttribute('height'));
 const tongue=part<SVGGElement>('tongue'),teeth=part<SVGGElement>('teeth'),nose=part<SVGGElement>('nose');
 const tv=numbers(tongue.getAttribute('transform')!),dv=numbers(teeth.getAttribute('transform')!),nv=numbers(nose.getAttribute('transform')!);
 const view=numbers(svg.getAttribute('viewBox')!);
 const hair=part<SVGGElement>('hair'),hairTransform=hair?.getAttribute('transform'),gap=part<SVGRectElement>('gap-bridge');
 const ears=svg.querySelectorAll<SVGRectElement>('[data-mouth-ears] rect');
 svg.querySelectorAll('[data-part="opening"] rect[width="600"]').forEach(e=>set(e,{x:-500,y:-500,width:1400,height:H+1000}));
 return (progress:number)=>{
  const currentH=H;
  const t=Math.max(0,Math.min(1,progress));
  set(svg,{viewBox:`-130 ${mix(view[1],0,t)} 660 ${mix(view[3],currentH,t)}`});face.removeAttribute('transform');
  const fx=mix(sourceFace.x,-130,t),fy=mix(sourceFace.y,0,t),fw=mix(sourceFace.w,660,t),fh=mix(sourceFace.h,currentH,t);
  set(faceRect,{x:fx,y:fy,width:fw,height:fh,rx:mix(sourceFace.r,64*unit,t)});
  // Enlargement never changes the original silhouette. During opening,
  // extend a straight middle section between the rounded upper/lower ends.
  const minX=Math.min(...from.map(p=>p.x)),maxX=Math.max(...from.map(p=>p.x));
  const minY=Math.min(...from.map(p=>p.y)),maxY=Math.max(...from.map(p=>p.y));
  const ox=mix(minX,x,t),oy=mix(minY,y,t),ow=mix(maxX-minX,w,t),oh=mix(maxY-minY,H-2*inset,t);
  const radius=mix(Math.min(maxX-minX,maxY-minY)/2,r,t);
  const rr=Math.min(radius,ow/2,oh/2);
  outline.setAttribute('d',t===0?from.map((p,i)=>`${i?'L':'M'}${p.x} ${p.y}`).join('')+'Z':`M${ox+rr} ${oy}H${ox+ow-rr}A${rr} ${rr} 0 0 1 ${ox+ow} ${oy+rr}V${oy+oh-rr}A${rr} ${rr} 0 0 1 ${ox+ow-rr} ${oy+oh}H${ox+rr}A${rr} ${rr} 0 0 1 ${ox} ${oy+oh-rr}V${oy+rr}A${rr} ${rr} 0 0 1 ${ox+rr} ${oy}Z`);
  const topBand=40*unit,bottomBand=24*unit;
  set(inner,{y:mix(innerY,inset+topBand,t),height:mix(innerHeight,currentH-inset*2-topBand-bottomBand,t)});
  tongue.setAttribute('transform',`translate(200 ${mix(tv[1],currentH-inset-bottomBand,t)}) scale(${mix(tv[2],(660-2*inset)/500,t)}) translate(-200 -278)`);
  teeth.setAttribute('transform',`translate(200 ${mix(dv[1],inset,t)}) scale(${mix(dv[2],topBand/38,t)}) translate(-200 -66)`);
  nose.setAttribute('transform',`translate(200 ${mix(nv[1],0,t)}) scale(${mix(nv[2],32*unit/124,t)}) translate(-200 -170)`);
  // Keep the hair attached to the forehead and clear of the page heading.
  if(hair)hair.setAttribute('transform',`translate(200 ${sourceFace.y*(1-t)}) scale(${mix(1,.32,t)}) translate(-200 ${-sourceFace.y}) ${hairTransform}`);
  if(gap)gap.setAttribute('opacity',String(1-t));
  const eh=fw*116/1056,ew=fw*150/1056,protrusion=fw*86/1056;
  ears.forEach((e,i)=>set(e,{x:i?fx+fw+protrusion-ew:fx-protrusion,y:fy+fh*334/584-eh/2,width:ew,height:eh,rx:eh/2}));
 };
}

export function clonePortrait(source:SVGSVGElement,prefix:string){
 const svg=source.cloneNode(true) as SVGSVGElement;
 svg.querySelectorAll('[id]').forEach(e=>{const id=e.id;svg.querySelectorAll('[clip-path]').forEach(p=>{if(p.getAttribute('clip-path')===`url(#${id})`)p.setAttribute('clip-path',`url(#${prefix}${id})`);});e.id=prefix+id;});
 return svg;
}
