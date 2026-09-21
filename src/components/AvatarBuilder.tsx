import { useEffect, useRef, useState } from 'react';
import { App as AntApp, Button, Radio, Switch, Tabs, theme } from 'antd';
import { CheckOutlined, PlayCircleOutlined, ReloadOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Avatar, FoodSticker, defaultAvatar, avatarColors, avatarPresets, type Mood, type AvatarConfig, type HairStyle } from './Illustrations';
import { StatusLabel } from './Playgrounds';

const hairOptions: {value:HairStyle;label:string}[] = [
  {value:'wave',label:'自然卷'},{value:'crop',label:'短发'},{value:'bob',label:'波波头'},
  {value:'curly',label:'蓬松卷'},{value:'ponytail',label:'马尾'},{value:'bald',label:'无发型'},
];
const categories = [{key:'hair',label:'发型'},{key:'face',label:'轮廓'},{key:'skin',label:'肤色'},{key:'hairColor',label:'发色'},{key:'outfit',label:'服装'},{key:'glasses',label:'眼镜'},{key:'background',label:'背景'}];
const colorNames:Record<string,string> = {'#1CB0F6':'蓝色','#58CC02':'绿色','#CE82FF':'紫色','#FF9600':'橙色','#2B70C9':'深蓝','#FF4B4B':'红色'};
const colorContrast = (hex:string) => {const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));return c[0]*.299+c[1]*.587+c[2]*.114<145?'#FFFFFF':'#332826';};

export function CharacterLab() {
  const { token }=theme.useToken(); const { message }=AntApp.useApp();
  const [saved,setSaved]=useState<AvatarConfig>(defaultAvatar);
  const [draft,setDraft]=useState<AvatarConfig>(defaultAvatar);
  const [mode,setMode]=useState<'edit'|'motion'>('edit');
  const [category,setCategory]=useState('hair');
  const [outcome,setOutcome]=useState<'match'|'conflict'|'unknown'>('match');
  const [mood,setMood]=useState<Mood>('idle');const [reduce,setReduce]=useState(false);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const clear=()=>{if(timer.current)clearTimeout(timer.current);timer.current=null;};
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  const dirty=JSON.stringify(saved)!==JSON.stringify(draft);
  const update=(patch:Partial<AvatarConfig>)=>setDraft(a=>({...a,...patch}));
  const changeMode=(next:'edit'|'motion')=>{clear();setMood('idle');setMode(next);};
  const save=()=>{setSaved({...draft});clear();setMood('idle');setMode('motion');message.success({content:'人物已保存，试试它的反应。',key:'avatar-status',duration:1.5});};
  const play=()=>{clear();if(reduce||matchMedia('(prefers-reduced-motion: reduce)').matches||outcome==='unknown'){setMood(outcome);return;}setMood('eating');timer.current=setTimeout(()=>{setMood(outcome);timer.current=null;},parseFloat(token.motionDurationSlow)*4000);};
  function colorOptions(values:readonly string[],field:'skin'|'hairColor'|'shirt'|'background',label:string){
    return <div className="avatar-color-options">{values.map((color,i)=><button key={color} aria-label={field==='shirt'?`${colorNames[color]}上衣`:`${label} ${i+1}`} aria-pressed={draft[field]===color} className="avatar-color-option" style={{background:color,color:colorContrast(color)}} onClick={()=>update({[field]:color})}>{draft[field]===color?<CheckOutlined/>:null}</button>)}</div>;
  }
  function pictureOption(label:string,patch:Partial<AvatarConfig>,selected:boolean){return <button key={label} aria-label={label} aria-pressed={selected} className={`avatar-part-option ${selected?'selected':''}`} onClick={()=>update(patch)}><span className="part-portrait" aria-hidden="true"><Avatar config={{...draft,...patch}}/></span><span>{label}</span>{selected&&<span className="part-check"><CheckOutlined/></span>}</button>;}
  function categoryContent(){
    if(category==='hair')return <><div className="editor-option-heading"><h3>从发型开始，找到感觉。</h3><span>6 种轮廓</span></div><div className="avatar-part-grid">{hairOptions.map(h=>pictureOption(h.label,{hair:h.value},draft.hair===h.value))}</div></>;
    if(category==='face')return <><div className="editor-option-heading"><h3>每个人都有自己的轮廓。</h3></div><div className="avatar-part-grid two">{pictureOption('圆润脸型',{face:'soft'},draft.face==='soft')}{pictureOption('修长脸型',{face:'long'},draft.face==='long')}</div><fieldset className="avatar-field"><legend>肩部轮廓</legend><Radio.Group aria-label="肩部轮廓" optionType="button" value={draft.body} onChange={e=>update({body:e.target.value})} options={[{label:'标准',value:'regular'},{label:'宽肩',value:'broad'}]}/></fieldset></>;
    if(category==='skin')return <><div className="editor-option-heading"><h3>你的肤色，自在选择。</h3></div>{colorOptions(avatarColors.skins,'skin','肤色')}<p className="editor-help">外观只表达你，不推断任何饮食条件。</p></>;
    if(category==='hairColor')return <><div className="editor-option-heading"><h3>给头发一点个性。</h3></div>{colorOptions(avatarColors.hair,'hairColor','发色')}<p className="editor-help">发色会同时应用到眉毛，保持角色风格一致。</p></>;
    if(category==='outfit')return <><div className="editor-option-heading"><h3>穿上今天的好心情。</h3></div><div className="avatar-part-grid two">{pictureOption('圆领上衣',{outfit:'tee'},draft.outfit==='tee')}{pictureOption('连帽衫',{outfit:'hoodie'},draft.outfit==='hoodie')}</div><fieldset className="avatar-field"><legend>上衣颜色</legend>{colorOptions(avatarColors.shirts,'shirt','上衣')}</fieldset></>;
    if(category==='glasses')return <><div className="editor-option-heading"><h3>小配饰，大不同。</h3></div><div className="avatar-part-grid">{pictureOption('不戴眼镜',{glasses:false},!draft.glasses)}{pictureOption('圆框眼镜',{glasses:true,glassesShape:'round'},draft.glasses&&draft.glassesShape==='round')}{pictureOption('方框眼镜',{glasses:true,glassesShape:'square'},draft.glasses&&draft.glassesShape==='square')}</div><p className="editor-help">眼镜跟随头部运动，不遮住嘴部与表情。</p></>;
    return <><div className="editor-option-heading"><h3>选一块属于你的底色。</h3></div>{colorOptions(avatarColors.backgrounds,'background','背景')}<p className="editor-help">背景用于人物预览，不改变全局品牌主题。</p></>;
  }
  const shown=mode==='edit'?draft:saved;
  return <div className="avatar-system-v2">
    <div className="avatar-system-bar"><div><span className="eyebrow">YOUR FOOD ALTER EGO</span><h2>创造一个，很像你的你。</h2><p className="muted">用轮廓、发型和小细节，创造你的中国美食旅伴。</p></div><Radio.Group aria-label="人物工作台" optionType="button" value={mode} onChange={e=>changeMode(e.target.value)} options={[{label:'创建人物',value:'edit'},{label:'反应预览',value:'motion'}]}/></div>
    <div className={`avatar-builder mode-${mode}`}>
      <div className="avatar-preview-panel" style={{background:shown.background}}>
        <div className="avatar-preview-caption"><span className="avatar-studio-dot"/> FOOD PASSPORT <span>AVATAR / 02</span></div>
        {mode==='edit'?<div className="portrait-preview" data-testid="avatar-preview" data-hair={draft.hair} data-shirt={draft.shirt} data-face={draft.face}><span className="portrait-halo"/><span className="portrait-decoration decor-left">✧</span><Avatar config={draft}/><span className="portrait-decoration decor-right">✦</span></div>:<div className={`character-stage stage-${mood} avatar-reaction-stage`} data-testid="character-stage" data-mood={mood} data-hair={saved.hair} data-shirt={saved.shirt}><div className="stage-art"><FoodSticker/><Avatar config={saved} mood={mood}/></div><div className="stage-caption" aria-live="polite">{mood==='idle'?<span>准备好，认识这道菜。</span>:mood==='eating'?<span>尝一口的动画演示…</span>:<StatusLabel state={mood}/>}</div></div>}
        <div className="portrait-preview-footer"><span className="portrait-chip">{mode==='edit'?'你的食物分身':'同一个你，每一种反应'}</span><small>{mode==='edit'?(dirty?'正在编辑 · 尚未保存':'原创组合人物 · 可自由调整'):'已保存形象 · 模拟结果'}</small></div>
      </div>
      <div className="avatar-editor-panel">
        {mode==='edit'?<><Tabs className="avatar-category-tabs" aria-label="人物部件分类" activeKey={category} onChange={setCategory} items={categories.map(c=>({...c,children:category===c.key?<div className="avatar-options-panel" aria-label={`${c.label}选项`}>{categoryContent()}</div>:null}))}/><div className="avatar-editor-footer"><span aria-live="polite">{dirty?'有未保存的调整':'当前形象已保存'}</span><div className="row"><Button aria-label="取消人物修改" disabled={!dirty} onClick={()=>{setDraft({...saved});message.info({content:'已恢复上次保存的形象。',key:'avatar-status',duration:1.5});}}>取消修改</Button><Button type="primary" icon={<ArrowRightOutlined/>} iconPlacement="end" aria-label="保存人物并预览" onClick={save}>保存人物</Button></div></div></>:<div className="reaction-controls"><span className="eyebrow">EXPRESSION, NOT PREDICTION</span><h3>让表情接着说。</h3><p className="muted">眉毛、眼睛与嘴型一起变化。外观始终来自你保存的人物。</p><fieldset className="avatar-field"><legend>选择一个反应</legend><Radio.Group optionType="button" block value={outcome} onChange={e=>{clear();setMood('idle');setOutcome(e.target.value);}} options={[{label:'满足',value:'match'},{label:'不符',value:'conflict'},{label:'待确认',value:'unknown'}]}/></fieldset><label className="row between"><span>减少动态效果</span><Switch aria-label="动作设置：减少动态效果" checked={reduce} onChange={v=>{clear();setMood('idle');setReduce(v);}}/></label><div className="reaction-note"><span>✦</span><p>这里展示角色的表现能力。最终负向动作和未知状态的分镜仍逐步确认。</p></div><div className="row"><Button type="primary" aria-label="播放动作" icon={<PlayCircleOutlined/>} onClick={play}>播放动作</Button><Button aria-label="重置动作" icon={<ReloadOutlined/>} onClick={()=>{clear();setMood('idle');}}/></div>{dirty&&<p className="small muted">编辑区还有未保存的修改；此处使用上次保存的形象。</p>}</div>}
      </div>
    </div>
    <div className="avatar-presets-header"><div><h3>或者，从一种感觉开始。</h3><p className="muted small">选择起点，再调整成自己的样子。</p></div><span className="source-label">4 个原创搭配</span></div>
    <div className="avatar-presets">{avatarPresets.map(p=><button key={p.name} className="avatar-preset-card" aria-label={`试用${p.name}人物`} onClick={()=>{clear();setMood('idle');setDraft({...p.config});setMode('edit');}}><span className="preset-portrait" style={{background:p.config.background}}><Avatar config={p.config}/></span><span className="preset-meta"><strong>{p.name}</strong><small>{p.description}</small><ArrowRightOutlined/></span></button>)}</div>
  </div>;
}
