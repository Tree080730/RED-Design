import { useEffect } from 'react';
import { RightOutlined } from '@ant-design/icons';
import './demo-scenario-selector.css';

type DemoScenarioResult='can-eat'|'cannot-eat'|'unknown';
type DemoScenario={result:DemoScenarioResult;title:string;description:string};

const demoScenarios:DemoScenario[]=[
 {result:'can-eat',title:'可以吃',description:'未发现明显冲突。'},
 {result:'cannot-eat',title:'不能吃',description:'花生与已保存的饮食条件冲突。'},
 {result:'unknown',title:'还不确定',description:'向服务员确认不确定的食材。'},
];

export default function DemoScenarioSelector(){
 useEffect(()=>{document.documentElement.lang='zh-CN';},[]);
 const selectScenario=(result:DemoScenarioResult)=>{
  // Build the next URL from the current location so platform proxy prefixes (/s/{appId}/) are preserved.
  const nextUrl=new URL(window.location.href);
  nextUrl.searchParams.set('result',result);
  window.location.assign(nextUrl.toString());
 };
 return <main className="demo-scenario-page" aria-labelledby="demo-scenario-title">
  <header className="demo-scenario-header">
   <h1 id="demo-scenario-title">选择 Demo 场景</h1>
   <p>预览 MouthMate 在不同置信度下的反应。</p>
  </header>
  <div className="demo-scenario-list" role="list" aria-label="Demo 场景">
   {demoScenarios.map(scenario=>(
    <button key={scenario.result} type="button" className="demo-scenario-card" onClick={()=>selectScenario(scenario.result)}>
     <span className="demo-scenario-copy">
      <span className="demo-scenario-title">{scenario.title}</span>
      <span className="demo-scenario-description">{scenario.description}</span>
     </span>
     <RightOutlined className="demo-scenario-arrow" aria-hidden="true"/>
    </button>
   ))}
  </div>
  <p className="demo-scenario-note">Demo 场景仅用于预览可能的结果。真实产品中，MouthMate 会通过 AI 食材分析判断结果。</p>
 </main>;
}
