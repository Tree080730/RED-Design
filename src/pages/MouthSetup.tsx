import { useState } from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { FinalMouthPortrait, MouthOptionPreview, useMouthConfig, type MouthConfig } from '../components/MouthConfig';
import './mouth-setup.css';
const tabs=['Nose','Mouth','Teeth','Tongue','Hair'] as const;
function FeatureIcon({name}:{name:typeof tabs[number]}){
 // Paths measured in the supplied 1534px-wide reference; preserve optical offsets.
 const paths={
  Nose:'M116 65C129 41 160 41 174 65L204 118C216 139 208 158 189 166L161 178C151 183 141 183 130 178L102 166C83 158 77 139 88 119Z',
  Mouth:'M398 73H511C531 73 547 89 547 110V128C547 148 531 164 511 164H398C377 164 362 148 362 128V110C362 89 377 73 398 73Z',
  Teeth:'M697 84C692 59 714 47 733 59C752 70 770 68 790 58C811 47 832 60 827 85L816 169C814 184 800 188 792 176L774 151C767 140 757 140 750 151L731 176C722 188 710 182 708 169Z',
  Tongue:'M1022 69H990C978 69 969 79 969 90V98C969 109 978 118 990 118H1022M1118 69H1150C1162 69 1171 79 1171 90V98C1171 109 1162 118 1150 118H1118M1022 69H1118V139C1118 166 1097 189 1070 189C1043 189 1022 167 1022 139ZM1068 100V142',
  Hair:'M1403 48L1448 93L1353 188L1308 143M1433 78L1338 173M1385 66L1415 96M1365 86L1395 116M1345 106L1375 136M1325 126L1355 156'
 };
 return <svg viewBox={`${tabs.indexOf(name)*306.8} 0 306.8 246`} aria-hidden="true"><path d={paths[name]} fill="none" stroke="currentColor" strokeWidth={name==='Hair'?12:16} strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
const colors=[['#930600','Deep red'],['#E36165','Coral'],['#914D28','Cocoa'],['#70433D','Brown'],['#723045','Plum']] as const;
export default function MouthSetup({onContinue,onClose}:{onContinue:()=>void;onClose?:()=>void}){
 const {config,setConfig}=useMouthConfig();const [tab,setTab]=useState<typeof tabs[number]>('Nose');
 function choices<K extends keyof MouthConfig>(key:K,items:readonly (readonly [MouthConfig[K],string])[],viewBox?:string){return <div className="mouth-option-row">{items.map(([value,label])=><button className="mouth-option" key={String(value)} aria-label={label} aria-pressed={config[key]===value} onClick={()=>setConfig({...config,[key]:value})}><MouthOptionPreview patch={{[key]:value}} viewBox={viewBox}/></button>)}</div>;}
 function palette(key:'insideColor'|'tongueColor'|'hairColor',items:readonly (readonly [string,string])[]){return <div className="mouth-option-row mouth-color-row">{key==='hairColor'&&<button className="mouth-option" aria-label="No hair color" aria-pressed={config.hair==='none'} onClick={()=>setConfig({...config,hair:'none'})}><svg width="54" height="54" viewBox="0 0 54 54" aria-hidden="true"><circle cx="27" cy="27" r="24" fill="none" stroke="#AAC4FB" strokeWidth="3"/><path d="M10 44L44 10" stroke="#AAC4FB" strokeWidth="3"/></svg></button>}{items.map(([value,label])=><button key={value} className="mouth-option" aria-label={`${label} ${key==='insideColor'?'mouth interior':key==='tongueColor'?'tongue':'hair'}`} aria-pressed={config[key]===value&&(key!=='hairColor'||config.hair!=='none')} onClick={()=>setConfig({...config,[key]:value,...(key==='hairColor'&&config.hair==='none'?{hair:'smooth' as const}:{})})}><span className="mouth-color-swatch" style={{background:value}}/></button>)}</div>;}
 return <main className="mouth-setup" aria-labelledby="mouth-setup-title">
  <header className="mouth-setup-header"><Button type="text" className="mouth-close" aria-label="Back from mouth setup" icon={<LeftOutlined/>} onClick={onClose}/><h1 id="mouth-setup-title">Create your MOUTH</h1></header>
  <div className="mouth-preview"><FinalMouthPortrait/></div>
  <div className="mouth-tabs" role="tablist" aria-label="Mouth features">{tabs.map((t,i)=><button key={t} role="tab" aria-label={t} id={`mouth-tab-${t}`} aria-controls="mouth-config-panel" aria-selected={tab===t} tabIndex={tab===t?0:-1} onClick={()=>setTab(t)} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=tabs[(i+(e.key==='ArrowRight'?1:4))%5];setTab(next);document.getElementById(`mouth-tab-${next}`)?.focus();}}}><FeatureIcon name={t}/></button>)}</div>
  <section className="mouth-editor" data-feature={tab} id="mouth-config-panel" role="tabpanel" aria-labelledby={`mouth-tab-${tab}`} key={tab}>
   {tab==='Nose'&&<><h2>Nose Shape</h2>{choices('nose',[['round','Round nose'],['oval','Oval nose'],['triangle','Triangle nose'],['wide','Wide nose'],['bridge','Bridge nose']],'140 -8 120 100')}<h2>Nose Color</h2>{choices('noseDetail',[['lines','Line nostrils'],['dots','Round nostrils'],['stars','Star nostrils'],['slits','Slit nostrils'],['hearts','Heart nostrils']],'158 7 84 70')}</>}
   {tab==='Mouth'&&<><h2>Mouth Shape</h2>{choices('mouth',[['rounded','Rounded mouth'],['oval','Oval mouth'],['smile','Smile mouth'],['square','Square mouth']],'20 -10 360 300')}<h2>Mouth Color</h2>{palette('insideColor',colors)}</>}
   {tab==='Teeth'&&<><h2>Teeth Style</h2>{choices('teeth',[['classic','Classic teeth'],['buck','Buck teeth'],['gold','Gold tooth'],['decay','Cavity'],['gap','Tooth gap']],'65 20 270 224')}<h2>Teeth Stickers</h2>{choices('sticker',[['heart','Heart sticker'],['star','Star sticker'],['like','Like sticker'],['question','Question sticker'],['none','No sticker']],'60 22 200 166')}</>}
   {tab==='Tongue'&&<><h2>Tongue Shape</h2>{choices('tongue',[['double','Double tongue'],['round','Rounded tongue'],['flat','Flat tongue'],['pointed','Pointed tongue']],'160 45 215 179')}<h2>Tongue Color</h2>{palette('tongueColor',[['#D76568','Rose'],...colors])}</>}
   {tab==='Hair'&&<><h2>Hair Style</h2>{choices('hair',[['none','No hair'],['smooth','Smooth hair'],['spiky','Spiky hair'],['wave','Wavy hair']],'10 -140 380 316')}<h2>Hair Color</h2>{palette('hairColor',[['#FFEB60','Yellow'],['#505050','Charcoal'],['#C4C4C4','Silver'],['#70433D','Brown']])}</>}
  </section>
  <div className="mouth-setup-action"><Button type="primary" size="large" aria-label="Save mouth and continue" onClick={onContinue}>Continue</Button></div>
 </main>;
}
