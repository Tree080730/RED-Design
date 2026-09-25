import { useState } from 'react';
import { App as AntApp, Button, Input, theme } from 'antd';
import { AppstoreOutlined, BgColorsOutlined, FontSizeOutlined, SlidersOutlined, BuildOutlined, SmileOutlined, BookOutlined, ArrowRightOutlined, ExportOutlined, CheckCircleFilled, SearchOutlined, CopyOutlined, GithubOutlined } from '@ant-design/icons';
import { palette, nonColorTokenNames, baseTokens } from './design-system/theme';
import { Avatar, FoodSticker, PassportIcon } from './components/Illustrations';
import { ComponentsDemo } from './components/Playgrounds';
import { DesignerHandbook } from './components/DesignerHandbook';
import { CharacterLab } from './components/AvatarBuilder';

type Section = 'guide'|'overview'|'colors'|'type'|'tokens'|'components'|'character'|'rules';
const nav = [
 {id:'guide',label:'设计师手册',en:'Designer handbook',icon:<BookOutlined/>},
 {id:'overview',label:'系统总览',en:'Overview',icon:<AppstoreOutlined/>},
 {id:'colors',label:'品牌色彩',en:'Colors',icon:<BgColorsOutlined/>},
 {id:'type',label:'字体排版',en:'Typography',icon:<FontSizeOutlined/>},
 {id:'tokens',label:'基础变量',en:'Tokens',icon:<SlidersOutlined/>},
 {id:'components',label:'组件规范',en:'Components',icon:<BuildOutlined/>},
 {id:'character',label:'人物与动效',en:'Character & motion',icon:<SmileOutlined/>},
 {id:'rules',label:'使用约束',en:'Guidelines',icon:<BookOutlined/>},
] as const;
const coreColors = [
 ['blue','Passport Blue','品牌与主操作'],['macaw','Macaw','信息与辅助'],['bee','Bee','等待与注意'],['cardinal','Cardinal','冲突与错误'],['beetle','Beetle','人物与点缀'],['eel','Eel','主要文字'],
] as const;
function Head({index,title,sub}: {index:string;title:string;sub:string}) {return <div className="section-heading"><div><span className="eyebrow">{index}</span><h2>{title}</h2></div><p>{sub}</p></div>;}
function ColorCards({full = false}: {full?:boolean}) {
 const { message }=AntApp.useApp();
 const entries=full?Object.entries(palette).map(([k,v])=>[k,k,v]):coreColors.map(([k,name])=>[k,name,palette[k]]);
 async function copy(value:string){try{await navigator.clipboard.writeText(value);message.success(`已复制 ${value}`);}catch{message.info(`颜色值：${value}`);}}
 return <div className="color-grid">{entries.map(([key,name,value],i)=><button className="color-card" key={key} onClick={()=>void copy(value)} aria-label={`复制 ${name} ${value}`}><span className="color-swatch" style={{background:value}}><span className="swatch-number" style={{color:['blue','eel','humpback','wolf'].includes(key)?palette.snow:palette.eel}}>{String(i+1).padStart(2,'0')}</span><CopyOutlined style={{color:['blue','eel','humpback','wolf'].includes(key)?palette.snow:palette.eel}}/></span><span className="color-meta"><strong>{name}</strong><code>{value}</code></span></button>)}</div>;
}
function TokenTable(){
 const [search,setSearch]=useState('');const {token}=theme.useToken();
 return <><Input prefix={<SearchOutlined/>} placeholder="搜索 token，如 radius、font、padding" aria-label="搜索 token" value={search} onChange={e=>setSearch(e.target.value)} allowClear className="token-search"/><div className="table-scroll"><table className="token-table"><thead><tr><th>Token</th><th>当前实际值</th><th>来源 / 校验</th></tr></thead><tbody>{nonColorTokenNames.filter(k=>k.toLowerCase().includes(search.toLowerCase())).map(k=><tr key={k}><td><code>{k}</code></td><td><code>{String(token[k])}</code></td><td><span className="inherited"><CheckCircleFilled/> {token[k]===baseTokens[k]?'原值继承':'存在覆盖'}</span></td></tr>)}</tbody></table>{!nonColorTokenNames.some(k=>k.toLowerCase().includes(search.toLowerCase()))&&<p className="empty">没有匹配项，试试 font 或 motion。</p>}</div></>;
}
function Typography(){const {token:t}=theme.useToken();const rows=[['Heading 1','fontSizeHeading1',t.fontSizeHeading1,t.lineHeightHeading1,'每一口，都更懂你。'],['Heading 2','fontSizeHeading2',t.fontSizeHeading2,t.lineHeightHeading2,'A little curiosity. A lot of discovery.'],['Heading 3','fontSizeHeading3',t.fontSizeHeading3,t.lineHeightHeading3,'让角色表达，让文字补充。'],['Body','fontSize',t.fontSize,t.lineHeight,'看懂未知食物，也看见自己的饮食条件。'],['Caption','fontSizeSM',t.fontSizeSM,t.lineHeightSM,'DEMO ONLY · SAMPLE INFORMATION']] as const;return <div className="type-specimens">{rows.map(([name,key,size,lineHeight,text])=><article key={key} className="type-row"><div><strong>{name}</strong><code>{key}</code><span>{size}px · {Number(lineHeight).toFixed(2)}</span></div><p style={{fontSize:size,lineHeight,fontWeight:name.includes('Heading')?t.fontWeightStrong:undefined}}>{text}</p></article>)}<div className="note"><FontSizeOutlined/><p>使用 Ant Design 默认字体栈、字号与行高。中文与英文共用同一层级，不加载多邻国专有字体。</p></div></div>;}
function Rules(){return <div className="rule-grid">{[
 ['01','让角色表达','人物与食物是主角。先展示动作、短标签与原因图标，解释按需展开。'],
 ['02','颜色不是结论','品牌蓝用于操作。匹配、冲突、待确认必须同时具有文字或图标，不把绿色理解为安全保证。'],
 ['03','基础值只认一个来源','字体、间距、圆角、尺寸、阴影和基础动效全部读取 antd 6.0.0；禁止另写一套相似数值。'],
 ['04','一个角色贯穿全程','外观配置独立于结果状态。换装不改变条件判断，进入动画不能换回默认角色。'],
 ['05','图标少字，但不无字','纯图标按钮有可访问名称，键盘有焦点，减少动态效果时有等价静态反馈。'],
 ['06','规范与实现同步','修改颜色映射或组件后同步规范预览和文档。最终业务分镜仍逐页确认。'],
].map(([n,title,text])=><article className="rule-card" key={n}><span className="rule-number">{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div>;}
export default function App(){
 const [section,setSection]=useState<Section>(()=>window.location.hash==='#guide'?'guide':'overview');
 const {token: t} = theme.useToken();
 const current=nav.find(n=>n.id===section)!;
 const go=(s:Section)=>{setSection(s);window.history.replaceState(null,'',s==='guide'?'#guide':window.location.pathname);window.scrollTo({top:0,behavior:'instant'});};
 return <div className="app-shell">
  <a className="skip-link" href="#main">跳转到内容</a>
  <aside className="sidebar"><a href="./design-system" className="wordmark" aria-label="Food Passport 设计系统首页"><PassportIcon/><span>food<span className="wordmark-brand">passport</span><small>DESIGN SYSTEM</small></span></a><div className="sidebar-label">BUILD WITH CHARACTER</div><nav aria-label="设计系统导航">{nav.map(n=><button key={n.id} aria-label={n.label} aria-current={section===n.id?'page':undefined} onClick={()=>go(n.id)} className={`nav-item ${section===n.id?'active':''}`}>{n.icon}<span>{n.label}</span>{section===n.id&&<span className="nav-dot"/>}</button>)}</nav><div className="sidebar-bottom"><div className="sidebar-note"><span className="leaf">✦</span><strong>一致，让好设计生长。</strong><p>从一颗 token，<br/>到每一次有温度的体验。</p></div><span className="version-pill"><span/> v0.1 · DESIGN FOUNDATION</span><div className="sidebar-source">Food Passport · Blue Edition<br/>Powered by Ant Design 6.0</div></div></aside>
  <div className="main-shell"><header className="topbar"><span>设计规范 <span className="slash">/</span> <strong>{current.label}</strong></span><div className="topbar-right"><span className="live-label"><span/>规范预览</span><a href="https://ant.design/docs/react/customize-theme/" target="_blank" rel="noreferrer">Ant Design 6.0 <ExportOutlined/></a></div></header>
  <main id="main" tabIndex={-1}>
   {section==='overview'?<>
    <div className="page-intro"><span className="eyebrow">FOOD PASSPORT / DESIGN SYSTEM</span><div className="intro-title"><h1>好奇每一口，设计每一步。</h1><span className="outline-badge">v0.1</span></div><p>用鲜明的色彩和有表情的角色，让陌生食物变得容易理解。</p></div>
    <section className="hero"><div className="hero-copy"><span className="hero-kicker"><span/> MADE FOR CURIOUS EATERS</span><h2>一点好奇，<br/>一整个新世界。</h2><p>清爽蓝色与亲切的人物，<br/>遇见 Ant Design 的系统与秩序。</p><Button type="primary" size="large" icon={<ArrowRightOutlined/>} iconPlacement="end" onClick={()=>go('components')}>探索组件</Button><span className="hero-caption">品牌有性格，基础有规范。</span></div><div className="hero-art" aria-label="原创人物与面条贴纸插画"><span className="hero-circle"/><div className="hero-sticker"><FoodSticker/></div><div className="hero-avatar"><Avatar mood="match"/></div><span className="floating-label label-yum">你好，世界！ <span>✦</span></span><span className="floating-label label-small">LET’S EXPLORE</span><span className="hero-spark spark-a">✧</span><span className="hero-spark spark-b">✦</span></div></section>
    <div className="foundation-strip"><div><BgColorsOutlined/><span><strong>Food Passport 蓝</strong><small>品牌与情绪表达</small></span></div><div><BuildOutlined/><span><strong>Ant Design 6.0</strong><small>基础 token 原值继承</small></span></div><div><SmileOutlined/><span><strong>Character first</strong><small>人物与食物先表达</small></span></div></div>
    <div className="note"><BookOutlined/><p>想从设计角度完整阅读？<button className="guide-entry" onClick={()=>go('guide')}>打开设计师手册与完整性检查</button></p></div>
    <Head index="01 / COLOR PALETTE" title="明亮，但各有分工。" sub="品牌色表达个性，语义色帮助理解。"/><ColorCards/>
    <div className="section-link"><button onClick={()=>go('colors')}>查看完整色板与使用规则 <ArrowRightOutlined/></button></div>
    <Head index="02 / SYSTEM FOUNDATIONS" title="一个来源，一套秩序。" sub="其余基础 tokens 不重造，直接来自 Ant Design 6.0。"/>
    <div className="foundation-grid"><button className="foundation-card" onClick={()=>go('type')}><div className="foundation-art typography-art">Aa<span>字</span></div><h3>字体排版 <ExportOutlined/></h3><p>默认字体栈 · 字号 · 行高 · 字重</p><span className="source-label">INHERITED</span></button><button className="foundation-card" onClick={()=>go('tokens')}><div className="foundation-art spacing-art"><i/><i/><i/><i/><i/></div><h3>间距与尺寸 <ExportOutlined/></h3><p>4px 基础单位 · 默认尺寸阶梯</p><span className="source-label">INHERITED</span></button><button className="foundation-card" onClick={()=>go('character')}><div className="foundation-art mini-character"><Avatar/></div><h3>人物与动效 <ExportOutlined/></h3><p>共用形象 · 状态表达 · 动态降级</p><span className="source-label">PRODUCT PATTERN</span></button></div>
    <Head index="03 / COMPONENTS IN ACTION" title="不止规范，也能亲手试试。" sub="共享真实组件，避免展示与实现成为两套系统。"/><ComponentsDemo/>
   </>:<>
    <div className="page-intro"><span className="eyebrow">{current.en.toUpperCase()} / FOOD PASSPORT</span><h1>{current.label}</h1><p>{({guide:'用视觉样例和使用规则阅读设计系统，明确已实现与待确认的边界。',colors:'品牌蓝用于操作与导航，搭配独立的状态色和插画辅助色。',type:'字体家族、字号和行高，全部继承 Ant Design 6.0 默认值。',tokens:'实时读取当前主题，与原生 token 逐项对照。',components:'原生组件作为基础，组合出清晰、可操作的体验。',character:'同一个人物，从配置预览走进每一幕动画。',rules:'让每一个后续页面，都在同一套约束中生长。'} as Record<string,string>)[section]}</p></div>
    {section==='colors'&&<><ColorCards full/><Head index="SEMANTIC LAYER" title="鲜明色块，清晰文字。" sub="亮色用于点缀和底色；小字使用更深的衍生色。"/><div className="semantic-grid">{[['主操作',t.colorPrimary,t.colorTextLightSolid,'colorPrimary / colorTextLightSolid'],['条件不符',t.colorErrorBg,t.colorErrorText,'colorErrorText'],['需要确认',t.colorWarningBg,t.colorWarningText,'colorWarningText'],['辅助信息',t.colorInfoBg,t.colorInfoText,'colorInfoText']].map(([name,bg,fg,code])=><article className="demo-card" key={name}><span className="semantic-sample" style={{background:bg,color:fg}}>{name}</span><code>{code}</code><p className="small muted">颜色与含义分开管理，状态同时提供文字。</p></article>)}</div><div className="note"><BookOutlined/><p>人物风格参考：<a href="https://blog.duolingo.com/avatar-creator/" target="_blank" rel="noreferrer">Duolingo Avatar Creator <ExportOutlined/></a>。品牌主色为 Food Passport 蓝 #2563EB，辅助色延续活泼的插画表达。</p></div></>}
    {section==='guide'&&<DesignerHandbook/>}
    {section==='type'&&<Typography/>}
    {section==='tokens'&&<TokenTable/>}
    {section==='components'&&<ComponentsDemo/>}
    {section==='character'&&<><CharacterLab/><Head index="MOTION CONTRACT" title="动作有表情，规则有边界。" sub="技术示意不等于最终角色与业务分镜。"/><div className="rule-grid">{[['外观与状态分离','发型、肤色、衣服和眼镜保持一致，结果状态只控制表情与动作。'],['待确认不强行吃下','待确认示例直接停在中性状态，不播放已确定的正向或负向反应。'],['始终可以停下来','减少动态效果会直接展示结果。重播不产生新记录，离开页面取消动画。']].map(([title,desc])=><article className="rule-card" key={title}><h3>{title}</h3><p>{desc}</p></article>)}</div></>}
    {section==='rules'&&<><Rules/><div className="note"><GithubOutlined/><p>规范源：<code>src/design-system/theme.ts</code> · 组件直接读取主题 · 原值校验：<code>npm run check:tokens</code></p></div></>}
   </>}
   <footer><div><PassportIcon/><span>Food Passport <span className="muted">Design System</span></span></div><span>Food Passport · Blue Edition · Ant Design 6.0 · 原创示意角色</span></footer>
  </main></div>
 </div>;
}
