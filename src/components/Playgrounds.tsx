import { useState } from 'react';
import { Button, Checkbox, Modal, Radio, Switch, Tabs, theme } from 'antd';
import { CheckOutlined, QuestionOutlined, ExclamationOutlined, ArrowRightOutlined } from '@ant-design/icons';

export function StatusLabel({ state }: { state: 'match'|'conflict'|'unknown' }) {
  const labels = { match: ['符合样例条件', <CheckOutlined />], conflict: ['条件不符', <ExclamationOutlined />], unknown: ['需要确认', <QuestionOutlined />] };
  return <span className={`status-label status-${state}`}>{labels[state][1]}{labels[state][0]}</span>;
}
const categories = [
  { key: 'allergy', label: '过敏', options: ['花生', '牛奶', '芝麻'] },
  { key: 'diet', label: '饮食限制', options: ['不吃猪肉', '素食', '纯素'] },
  { key: 'preference', label: '偏好', options: ['少辣', '不吃香菜', '不吃内脏'] },
];
export function ChoiceDemo() {
  const [selected, setSelected] = useState<string[]>(['花生', '少辣']);
  return <div className="choice-demo"><Tabs items={categories.map(c => ({key:c.key,label:`${c.label} ${selected.filter(v=>c.options.includes(v)).length || ''}`,children:<div className="choice-options">{c.options.map(o=><Checkbox key={o} checked={selected.includes(o)} onChange={e=>setSelected(s=>e.target.checked ? [...s,o] : s.filter(v=>v!==o))}>{o}</Checkbox>)}</div>}))}/><div className="selection-summary" aria-live="polite"><span>同时生效</span><strong>{selected.join(' · ') || '未设置条件'}</strong></div></div>;
}
export function ComponentsDemo() {
  const [open, setOpen] = useState(false);
  const { token } = theme.useToken();
  return <div className="component-grid">
    <article className="demo-card"><div className="card-heading"><h3>按钮与操作</h3><span className="source-label">Ant Design</span></div><div className="button-stack"><Button aria-label="展示沟通卡" type="primary" size="large" icon={<ArrowRightOutlined />} onClick={()=>setOpen(true)}>展示沟通卡</Button><div className="row wrap"><Button onClick={()=>setOpen(true)}>次要操作</Button><Button disabled>不可用</Button><Button loading>处理中</Button></div></div><p className="small muted">沿用原生尺寸与圆角。品牌蓝用于操作，不代表安全结论。</p></article>
    <article className="demo-card"><div className="card-heading"><h3>选择可以共存</h3><span className="source-label">Tabs + Checkbox</span></div><ChoiceDemo /></article>
    <article className="demo-card"><div className="card-heading"><h3>状态有形，也有字</h3><span className="source-label">组合组件</span></div><div className="status-stack"><StatusLabel state="match"/><StatusLabel state="conflict"/><StatusLabel state="unknown"/></div><p className="small muted">三种信息状态，不能只用颜色区分。未设置条件不输出匹配结论。</p></article>
    <article className="demo-card"><div className="card-heading"><h3>输入与反馈</h3><span className="source-label">Ant Design</span></div><label className="row between"><span>减少动态效果</span><Switch aria-label="控件示例：减少动态效果"/></label><div className="divider"/><Radio.Group defaultValue="food" options={[{label:'食物',value:'food'},{label:'菜单',value:'menu'}]} optionType="button"/><p className="small muted">此处为控件样例；完整动作设置见「人物与动效」。</p></article>
    <Modal getContainer={() => document.querySelector('.ds-root') as HTMLElement} title="向店员展示" open={open} onCancel={()=>setOpen(false)} footer={<Button aria-label="完成" type="primary" onClick={()=>setOpen(false)}>完成</Button>}><p style={{fontSize:token.fontSizeHeading3,lineHeight:token.lineHeightHeading3}}>我对花生过敏。请问这道菜里是否有花生？如果无法确认，请告诉我。</p><p className="muted">I have a peanut allergy. Does this dish contain peanuts?</p><span className="source-label">沟通卡组件示例 · 不代表真实询问结果</span></Modal>
  </div>;
}
