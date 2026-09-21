import { palette as c } from '../design-system/theme';
export type Mood = 'idle' | 'eating' | 'match' | 'conflict' | 'unknown';
export type HairStyle = 'crop' | 'wave' | 'bob' | 'curly' | 'ponytail' | 'bald';
export type AvatarConfig = {
  skin: string; hair: HairStyle; hairColor: string; shirt: string;
  glasses: boolean; glassesShape: 'round' | 'square';
  face: 'soft' | 'long'; body: 'regular' | 'broad'; outfit: 'tee' | 'hoodie'; background: string;
};
export const avatarColors = {
  skins: ['#F8D8B8','#EDB48B','#CE8B62','#A86742','#78432F','#4E2E25'],
  hair: ['#3D2A28','#764535','#B96735','#E9B85E','#646476'],
  shirts: [c.macaw,c.feather,c.beetle,c.fox,c.humpback,c.cardinal],
  backgrounds: ['#E9E0FF','#DDF4FF','#E9F8D9','#FFF2BF','#FFE5DF'],
} as const;
export const defaultAvatar: AvatarConfig = {
  skin: '#EDB48B', hair: 'wave', hairColor: '#3D2A28', shirt: c.macaw,
  glasses: false, glassesShape: 'round', face: 'soft', body: 'regular', outfit: 'tee', background: '#E9E0FF',
};
export const avatarPresets: { name:string; description:string; config:AvatarConfig }[] = [
  {name:'晴天', description:'卷发 · 清新蓝',config:{...defaultAvatar}},
  {name:'栗子', description:'短波波 · 暖棕色',config:{...defaultAvatar,skin:'#F8D8B8',hair:'bob',hairColor:'#B96735',shirt:c.beetle,face:'long',background:'#FFF2BF'}},
  {name:'阿洛', description:'蓬松卷 · 阳光橙',config:{...defaultAvatar,skin:'#78432F',hair:'curly',hairColor:'#3D2A28',shirt:c.fox,body:'broad',outfit:'hoodie',background:'#DDF4FF'}},
  {name:'小满', description:'马尾 · 草地绿',config:{...defaultAvatar,skin:'#CE8B62',hair:'ponytail',hairColor:'#764535',shirt:c.feather,glasses:true,face:'long',background:'#FFE5DF'}},
];
function shade(hex:string, amount:number){return '#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(hex.slice(i,i+2),16)+amount)).toString(16).padStart(2,'0')).join('');}

/** A single modular portrait renderer shared by thumbnails, editor and reactions. */
export function Avatar({ config = defaultAvatar, mood = 'idle', className = '' }: { config?: AvatarConfig; mood?: Mood; className?: string }) {
  const {skin,hair,hairColor,shirt,face,body,outfit,glasses,glassesShape}=config;
  const ink='#332826', skinShade=shade(skin,-22);
  const faceD=face==='soft'?'M61 91Q61 48 118 47Q178 48 178 95V142Q177 190 122 195Q64 190 61 145Z':'M68 87Q68 47 119 47Q172 46 172 91V151Q171 203 122 207Q70 201 68 152Z';
  return <svg className={`avatar avatar-${mood} ${className}`} viewBox="0 0 240 280" role="img" aria-label={`原创人物，${mood} 状态，${hair} 发型${glasses?'，戴眼镜':''}`} data-face={face} data-outfit={outfit}>
    <g className="avatar-body">
      {hair==='ponytail'&&<path d="M155 61Q215 19 222 90L228 210Q190 227 178 197L175 101Z" fill={hairColor}/>}
      {hair==='bob'&&<path d="M48 89Q41 25 119 25Q193 25 191 104L198 205Q179 224 156 207H76Q44 225 39 202Z" fill={hairColor}/>}
      <path d={body==='broad'?'M3 280V262Q3 216 69 209L103 197H139L173 209Q237 218 237 262V280Z':'M18 280V267Q18 221 77 210L103 197H139L164 210Q222 222 222 267V280Z'} fill={shirt}/>
      <path d="M98 178H144V214Q122 241 98 214Z" fill={skin}/>
      <path d="M98 178H144V199Q121 211 98 200Z" fill={skinShade}/>
      {outfit==='hoodie'?<g><path d="M91 206L71 213Q78 236 115 247L97 214M150 206L173 213Q164 236 128 247L144 214" fill={shade(shirt,-25)}/><path d="M108 239v30m25-30v30" stroke={c.snow} strokeWidth="5" strokeLinecap="round"/></g>:<path d="M91 208Q121 235 151 208" stroke={shade(shirt,-27)} strokeWidth="10" fill="none"/>}
      <path d="M48 262v18m145-18v18" stroke={shade(shirt,-20)} strokeWidth="8" strokeLinecap="round"/>
      <g className="avatar-head">
        <ellipse cx="62" cy="129" rx="17" ry="21" fill={skin}/><ellipse cx="177" cy="129" rx="17" ry="21" fill={skin}/>
        <path d="M54 128q9-9 13 4m102-4q9-9 13 4" stroke={skinShade} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d={faceD} fill={skin}/>
        {hair==='crop'&&<path d="M61 113Q48 77 63 52Q65 26 120 28Q168 27 181 54L178 112L159 85V66Q128 84 77 64L77 91Z" fill={hairColor}/>}
        {hair==='wave'&&<path d="M62 117Q40 98 44 66Q32 45 63 39Q69 16 96 24Q112 4 139 26Q174 11 179 43Q201 51 187  80 L178 116L165 76Q153 75 149 61Q126 89 99 69Q82 84 74 75L74 105Z" fill={hairColor}/>}
        {hair==='bob'&&<path d="M58 120L53 82Q53 31 119 31Q184 31 181 89L177 125L163 90L158 69Q120 88 76 76L73 114Z" fill={hairColor}/>}
        {hair==='curly'&&<g fill={hairColor}><path d="M58 107V69Q54 32 117  30 Q183 32 182 87L177 115L163 84H75L73 113Z"/><circle cx="57" cy="68" r="22"/><circle cx="69" cy="44" r="24"/><circle cx="100" cy="32" r="24"/><circle cx="135" cy="31" r="25"/><circle cx="164" cy="46" r="25"/><circle cx="183" cy="71" r="21"/></g>}
        {hair==='ponytail'&&<g fill={hairColor}><path d="M 60 116Q 40 65 67  40 Q110 4 155 34Q192 42 181 111L165 87L159 66Q111 95  70  80 L75 113Z"/><circle cx="181" cy="49" r="24"/><path d="M165 38q10 11 14 25" fill="none" stroke={c.beetle} strokeWidth="8"/></g>}
        <g className="avatar-brows" stroke={hairColor} strokeWidth="7" fill="none" strokeLinecap="round">
          {mood==='unknown'?<><path d="M78 92q12-9 25-4"/><path d="m137 94 19 4"/></>:mood==='conflict'?<><path d="m77 92 26 7"/><path d="m135 99 23-8"/></>:<><path d="M78 92q12-6 25-1"/><path d="M136 91q11-5 22 1"/></>}
        </g>
        {mood==='match'?<g stroke={ink} strokeWidth="7" fill="none" strokeLinecap="round"><path d="M78 124q12-18 25 0M137 124q11-18 23 0"/></g>:mood==='conflict'?<g stroke={ink} strokeWidth="6" fill="none" strokeLinecap="round"><path d="m79 112 23 20m0-20-23 20m59-20 21 20m0-20-21 20"/></g>:<g><rect x="74" y="101" width="36" height=" 40" rx="17" fill={c.snow}/><rect x="132" y="101" width="36" height=" 40" rx="17" fill={c.snow}/><rect x={mood==='unknown'?82:91} y="111" width="13" height="23" rx="6.5" fill={ink}/><rect x={mood==='unknown'?139:149} y="111" width="13" height="23" rx="6.5" fill={ink}/></g>}
        <path d="M116 126Q128 124 128 137Q142 145 129 153H115Q105 151 110 143Z" fill={skinShade}/>
        {mood==='eating'?<g><ellipse cx="121" cy="173" rx="19" ry="22" fill={ink}/><path d="M109 184q12-11 25 0" fill={c.cardinal}/></g>:mood==='unknown'?<path d="M108 173q13-5 25 0" stroke={ink} strokeWidth="6" strokeLinecap="round" fill="none"/>:mood==='conflict'?<g><path d="M107 178q13-20 29 0" fill={ink}/><path d="M119 175v8q8 8 12 0v-8" fill={c.cardinal}/></g>:<g><path d="M102 164Q123 170 145 159Q141 190 121 188Q105 184 102 164Z" fill={ink}/><path d="M105 165Q123 170 142 163L138 172Q122 178 109 171Z" fill={c.snow}/><path d="M116 185q11-11 20-5q-9 11-20 5" fill={c.cardinal}/></g>}
        {glasses&&<g fill="none" stroke={ink} strokeWidth="5"><rect x="68" y="97" width="46" height="49" rx={glassesShape==='round'?23:10}/><rect x="128" y="97" width="46" height="49" rx={glassesShape==='round'?23:10}/><path d="M114 115h14M59 111l9 4m106 0 9-4"/></g>}
      </g>
    </g>
  </svg>;
}
export function FoodSticker({ className = '' }: { className?: string }) {
  return <svg className={`food-sticker ${className}`} viewBox="0 0 240 180" role="img" aria-label="面条食物贴纸示意">
    <g stroke={c.snow} strokeWidth="12" strokeLinejoin="round"><path d="M28 91q6 73 91 75q83-2 91-75Z" fill={c.macaw}/><ellipse cx="119" cy="88" rx="94" ry="36" fill={c.bee}/><path d="m155 6-51 100m82-89-63 90" stroke={c.snow}/></g>
    <path d="M28 91q6 73 91 75q83-2 91-75Z" fill={c.macaw}/><path d="M41 119q80 53 156-2q-19 51-77 49q-59-1-79-47" fill={c.humpback}/>
    <ellipse cx="119" cy="88" rx="94" ry="36" fill={c.fox}/><ellipse cx="119" cy="84" rx="81" ry="25" fill={c.bee}/>
    <g stroke="#B66E28" fill="none" strokeWidth="5" strokeLinecap="round"><path d="M56 77q20-20 41 2t40 0t37 3M51 91q20-20 41 2t40 0t42 1M67 103q20-15 41-1t43-6"/></g>
    <path d="m154 7-49 94m79-87-61 92" stroke={c.eel} strokeWidth="7" strokeLinecap="round"/>
    <path d="m69 64 11 9m78 20 12 5m-61-36 12 4" stroke={c.feather} strokeWidth="9" strokeLinecap="round"/>
    <ellipse cx="87" cy="94" rx="7" ry="5" fill={c.cardinal}/><ellipse cx="146" cy="74" rx="7" ry="5" fill={c.cardinal}/>
    <path d="M79 135q37 17 69 0" fill="none" stroke={c.snow} strokeWidth="5" strokeLinecap="round"/>
  </svg>;
}
export function PassportIcon() {
  return <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="3" width="35" height="42" rx="7" fill={c.blue}/><path d="M16 14v8m5-8v8m-5-3h5m-2 3v12m13-20v20m0-20q-8 8 0 10" fill="none" stroke={c.snow} strokeWidth="2.5" strokeLinecap="round"/></svg>;
}
