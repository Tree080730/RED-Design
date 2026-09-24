import { createContext, useContext, useState, useId, type ReactNode } from 'react';

export type MouthConfig={nose:'round'|'oval'|'triangle'|'wide'|'bridge';noseSize:number;noseDetail:'lines'|'dots'|'stars'|'slits'|'hearts';mouth:'rounded'|'oval'|'smile'|'square';mouthSize:number;teeth:'classic'|'buck'|'decay'|'gold'|'gap';sticker:'none'|'heart'|'star'|'like'|'question';tongue:'double'|'round'|'pointed'|'flat';tongueColor:string;insideColor:string;hair:'none'|'smooth'|'spiky'|'wave';hairColor:string};
export const defaultMouth:MouthConfig={nose:'round',noseSize:100,noseDetail:'lines',mouth:'rounded',mouthSize:100,teeth:'classic',sticker:'none',tongue:'double',tongueColor:'#D76568',insideColor:'#930600',hair:'none',hairColor:'#FFEB60'};
const Context=createContext<{config:MouthConfig;setConfig:(value:MouthConfig)=>void}>({config:defaultMouth,setConfig:()=>{}});
export function MouthConfigProvider({children}:{children:ReactNode}){
 const [config,setConfig]=useState<MouthConfig>(defaultMouth);
 return <Context.Provider value={{config,setConfig}}>{children}</Context.Provider>;
}
export const useMouthConfig=()=>useContext(Context);

function NostrilMarks({x,y,width,height}:{x:number;y:number;width:number;height:number}){
 const {config}=useMouthConfig();
 return <g transform={`translate(${x} ${y}) scale(${width/100} ${height/100})`} fill="#EEC6B6" stroke="#EEC6B6" strokeLinecap="round" strokeLinejoin="round">
  {[25,75].map((cx,i)=>config.noseDetail==='dots'?<circle key={i} cx={cx} cy="50" r="20" stroke="none"/>:config.noseDetail==='stars'?<path key={i} transform={`translate(${cx} 50)`} strokeWidth="3" d="M0 -21L5 -6H21L8 4L13 20L0 10L-13 20L-8 4L-21 -6H-5Z"/>:config.noseDetail==='slits'?<path key={i} strokeWidth="10" d={`M${cx-15} 50H${cx+15}`}/>:config.noseDetail==='hearts'?<path key={i} transform={`translate(${cx} 51)`} stroke="none" d="M0 18L-17 2C-29 -10 -13 -27 0 -14C13 -27 29 -10 17 2Z"/>:<path key={i} strokeWidth="10" d={`M${cx} 35V65`}/>)}
 </g>;
}

export function CustomNose({x,y,width,height}:{x:number;y:number;width:number;height:number}){
 const {config}=useMouthConfig();const scale=config.noseSize/100;
 return <g transform={`translate(${x+width/2} ${y+height}) scale(${scale}) translate(${-width/2} ${-height})`} fill="#FDDECB">
  {config.nose==='triangle'?<path d={`M${width*.38} ${-height*.25}Q${width*.5} ${-height*.45} ${width*.62} ${-height*.25}L${width*1.1} ${height*.55}V${height}H${-width*.1}V${height*.55}Z`}/>:config.nose==='oval'?<ellipse cx={width/2} cy={height*.8} rx={width*.62} ry={height}/>:config.nose==='wide'?<rect x={-width*.18} y={height*.22} width={width*1.36} height={height*.78} rx={height*.39}/>:config.nose==='bridge'?<path d={`M${-width*.15} ${height}Q${-width*.12} ${height*.65} ${width*.17} ${height*.58}L${width*.34} 0Q${width*.5} ${-height*.18} ${width*.66} 0L${width*.83} ${height*.58}Q${width*1.12} ${height*.65} ${width*1.15} ${height}Z`}/>:<rect width={width} height={height} rx={height*.5}/>}
  <NostrilMarks x={width*.24} y={height*.08} width={width*.52} height={height*.92}/>
 </g>;
}
function ToothSticker({x,y,size}:{x:number;y:number;size:number}){
 const {config}=useMouthConfig();
 if(config.sticker==='none')return null;
 const shapes={heart:{color:'#FF8078',d:'M24 41L8 25C-3 12 13 1 23 13C31 -1 48 8 42 21Z'},star:{color:'#FFC800',d:'M24 3L30 16 45 18 34 28 36 43 23 36 10 43 12 28 1 18 17 16Z'},like:{color:'#08AF59',d:'M8 42V24H14L21 13 22 4Q30 0 31 10L28 21 39 21Q47 22 42 28Q48 31 42 35Q46 39 39 42L17 45Z'},question:{color:'#FF5426',d:'M12 15Q12 2 26 2Q42 2 42 15Q42 22 32 27L30 33H20V25Q20 21 27 18Q33 16 30 12Q26 8 23 14Z M20 38H30V47H20Z'}};
 const shape=shapes[config.sticker];
 return <g transform={`translate(${x} ${y}) scale(${size/48}) rotate(-12 24 24)`} strokeLinejoin="round"><path d={shape.d} fill="#DADADA" stroke="#DADADA" strokeWidth="7" transform="translate(0 1.5)"/><path d={shape.d} fill={shape.color} stroke="#FFFFFF" strokeWidth="5" paintOrder="stroke"/></g>;
}
export function CustomTeeth({x,y,width,height}:{x:number;y:number;width:number;height:number}){
 const {config}=useMouthConfig();const tooth=width*.115;
 return <g transform={`translate(${x} ${y})`}>
  {config.teeth==='buck'&&<g fill="#FFFFFF"><rect x={width/2-tooth-2} width={tooth} height={height*1.4} rx={height*.46}/><rect x={width/2+2} width={tooth} height={height*1.4} rx={height*.46}/></g>}
  {config.teeth==='gold'&&<rect x={width*.74} width={tooth} height={tooth*1.057} rx={tooth*.19} fill="#FFDB13"/>}
  {config.teeth==='gap'&&<rect x={width*.49} width={width*.035} height={height*1.3} fill={config.insideColor}/>}
  {config.teeth==='decay'&&<path fill="#61443A" d={`M${width*.29} 2l${tooth*.55} 4 -2 ${height*.42} -${tooth*.32} ${height*.3} -${tooth*.4} -5 2 -${height*.4}Z`}/>}
  <ToothSticker x={width*.12} y={height*.1} size={height*.8}/>
 </g>;
}
export function CustomTongue({x,y,width,height}:{x:number;y:number;width:number;height:number}){
 const {config}=useMouthConfig();
 const d=config.tongue==='flat'?'M10 40V12Q10 5 20 5H180Q190 5 190 12V40Z':config.tongue==='round'?'M0 40C0 -13 200 -13 200 40Z':config.tongue==='pointed'?'M0 40Q35 30 86 2Q100 -5 114 2Q165 30 200 40Z':'M0 40C12 0 62 -10 100 16C138 -10 188 0 200 40Z';
 return <svg x={x} y={y} width={width} height={height} viewBox="0 0 200 40" preserveAspectRatio="none" overflow="visible"><path d={d} fill={config.tongueColor}/></svg>;
}
export function MouthPortrait({viewBox='0 0 400 280'}:{viewBox?:string}){
 const {config}=useMouthConfig();
 const clip=useId();
 // Default cavity is an exact 18-unit inset of the face (including its corner radius).
 const mouthPath=config.mouth==='square'?'M65 65H335V224H65Z':config.mouth==='oval'?'M117 146a83 83 0 1 0 166 0a83 83 0 1 0 -166 0':config.mouth==='smile'?'M92 65H308Q344 65 334 101C320 179 267 224 200 224C133 224 80 179 66 101Q56 65 92 65Z':'M131 56H269A87 87 0 0 1 356 143V147A87 87 0 0 1 269 234H131A87 87 0 0 1 44 147V143A87 87 0 0 1 131 56Z';
 return <svg viewBox={viewBox} className="mouth-portrait" role="img" aria-label="Your custom mouth preview">
  <defs><clipPath id={clip}><path d={mouthPath}/></clipPath></defs>
  {config.hair!=='none'&&<path fill={config.hairColor} d={config.hair==='spiky'?'M26 150V20L88 40 145 -34 200 14 255 -34 312 40 374 20V150Z':config.hair==='wave'?'M26 150V35Q15 -5 65 3Q106 -38 161 -8Q216 -40 265 -8Q316 -26 350 10Q385 12 374 150Z':'M26 150V30Q26 -4 65 -4H335Q374 -4 374 30V150Z'}/>}
  <g fill="#FDDECB"><rect x="26" y="38" width="348" height="214" rx="105"/><rect x="2" y="132" width="60" height="44" rx="22"/><rect x="338" y="132" width="60" height="44" rx="22"/></g>
  <CustomNose x={183} y={24} width={34} height={26}/>
  <g transform={`translate(200 145) scale(${config.mouthSize/100}) translate(-200 -145)`}>
   <g clipPath={`url(#${clip})`}><path fill={config.insideColor} d="M40 30H360V240H40Z"/><path fill="#FFFFFF" d="M40 40H360V84H40ZM40 206H360V240H40Z"/><CustomTeeth x={62} y={63} width={276} height={21}/><CustomTongue x={184} y={176} width={152} height={30}/></g>
  </g>
 </svg>;
}
function NoseOptionArt({detail}:{detail:boolean}){
 const {config}=useMouthConfig();
 return <svg viewBox="0 0 400 336" className="mouth-portrait" aria-hidden="true" preserveAspectRatio="none">
  <g fill="#FDDECB">{detail?<rect x="84" y="100" width="232" height="144" rx="72"/>:config.nose==='round'?<rect x="138" y="120" width="124" height="80" rx="40"/>:config.nose==='oval'?<circle cx="200" cy="186" r="78"/>:config.nose==='triangle'?<path d="M124 152L186 90Q200 76 214 90L276 152V190H124Z"/>:config.nose==='wide'?<rect x="108" y="120" width="184" height="76" rx="38"/>:<path d="M132 190Q136 154 166 146L181 100Q200 80 219 100L234 146Q264 154 268 190Z"/>}<path d={detail?'M0 196H400V336H0Z':'M0 170H400V336H0Z'}/></g>
  <NostrilMarks x={detail?122:167} y={detail?84:108} width={detail?156:66} height={detail?156:84}/>
 </svg>;
}
function MouthShapeOptionArt(){
 const {config}=useMouthConfig();
 return <svg viewBox="0 0 400 336" className="mouth-portrait" aria-hidden="true" preserveAspectRatio="none">
  <rect x="-2" y="64" width="404" height="222" rx="108" fill="#FDDECB"/>
  <CustomNose x={180} y={48} width={40} height={24}/>
  <g fill={config.insideColor}>
   {config.mouth==='rounded'?<rect x="18" y="83" width="364" height="182" rx="91"/>:config.mouth==='oval'?<circle cx="200" cy="172" r="99"/>:config.mouth==='smile'?<path d="M84 89H316C345 89 367 108 367 137C367 204 313 259 246 259H154C87 259 33 204 33 137C33 108 55 89 84 89Z"/>:<path d="M62 92H338V264H62Z"/>}
  </g>
 </svg>;
}
function TeethOptionArt({sticker}:{sticker:boolean}){
 const {config}=useMouthConfig();
 return <svg viewBox="0 0 400 336" className="mouth-portrait" aria-hidden="true" preserveAspectRatio="none">
  {sticker?<><path d="M0 96H400V336H0Z" fill="#FDDECB"/><CustomNose x={160} y={66} width={80} height={46}/><path d="M0 134H400V205H0Z" fill="#FFFFFF"/><path d="M0 205H400V336H0Z" fill={config.insideColor}/><ToothSticker x={42} y={152} size={40}/></>:<>
   <path fill="#FDDECB" d="M-60 130C-60 79 0 40 66 40H334C400 40 460 79 460 130V245C460 305 397 336 334 336H66C3 336 -60 305 -60 245Z"/>
   <CustomNose x={172} y={20} width={56} height={34}/>
   <path fill="#FFFFFF" d="M-50 149C-50 103 16 66 76 66H324C384 66 450 103 450 149V233C450 279 385 314 324 314H76C15 314 -50 279 -50 233Z"/>
   <path fill={config.insideColor} d="M0 104H400V278H0Z"/>
   <CustomTeeth x={0} y={66} width={400} height={38}/>
   <CustomTongue x={172} y={236} width={240} height={42}/>
  </>}
 </svg>;
}
export function MouthOptionPreview({patch,viewBox}:{patch:Partial<MouthConfig>;viewBox?:string}){const {config}=useMouthConfig();return <Context.Provider value={{config:{...config,...patch,...('teeth' in patch?{sticker:'none' as const}:{})},setConfig:()=>{}}}>{'nose' in patch||'noseDetail' in patch?<NoseOptionArt detail={'noseDetail' in patch}/>: 'mouth' in patch?<MouthShapeOptionArt/>:'teeth' in patch||'sticker' in patch?<TeethOptionArt sticker={'sticker' in patch}/>:<MouthPortrait viewBox={viewBox}/>}</Context.Provider>;}
