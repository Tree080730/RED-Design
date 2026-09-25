import { useState } from 'react';
import { Button, Checkbox } from 'antd';
import { CheckOutlined, EditOutlined, GlobalOutlined, LeftOutlined } from '@ant-design/icons';
import { demoFood } from './demoFood';
import './waiter-check.css';

type WaiterCheckProps={onBack:()=>void};
type WaiterLanguage='zh-CN'|'ja-JP';

const languageOptions:[WaiterLanguage,string,string][]=[
 ['zh-CN','简体中文','Chinese'],
 ['ja-JP','日本語','Japanese'],
];

export default function WaiterCheck({onBack}:WaiterCheckProps){
 const [askPeanut,setAskPeanut]=useState(true);
 const [askSpice,setAskSpice]=useState(true);
 const [editing,setEditing]=useState(false);
 const [acknowledged,setAcknowledged]=useState(false);
 const [language,setLanguage]=useState<WaiterLanguage>('zh-CN');
 const [showLanguages,setShowLanguages]=useState(false);
 const englishMessage=askPeanut&&askSpice
  ?'I have a peanut allergy and can only eat mildly spicy food. Please confirm that this dish contains no foods I am allergic to (peanuts), will not come into contact with peanuts during preparation, and can be made mildly spicy. If you cannot confirm, please tell me.'
  :askPeanut
   ?'I have a peanut allergy. Please confirm that this dish contains no peanuts and will not come into contact with peanuts during preparation. If you cannot confirm, please tell me.'
   :askSpice
    ?'I can only eat mildly spicy food. Please confirm that this dish can be made mildly spicy. If you cannot confirm, please tell me.'
    :'Please tell me what is in this dish and how it was prepared. If you cannot confirm, please tell me.';
 const chineseLead=askPeanut&&askSpice?'我对花生过敏，也只能吃微辣的食物。':askPeanut?'我对花生过敏。':askSpice?'我只能吃微辣的食物。':'我需要确认这道菜的信息。';
 const chineseQuestion=askPeanut&&askSpice?'请确认这道菜不含会引起我过敏的食物（花生），制作时也不会接触花生，并且可以做成微辣。':askPeanut?'请确认这道菜不含花生，并且制作时不会接触花生。':askSpice?'请确认这道菜可以做成微辣。':'请告诉我这道菜使用了哪些食材，以及如何制作。';
 const japaneseLead=askPeanut&&askSpice?'私はピーナッツアレルギーがあり、辛さは控えめしか食べられません。':askPeanut?'私はピーナッツアレルギーがあります。':askSpice?'辛さは控えめしか食べられません。':'この料理について確認が必要です。';
 const japaneseQuestion=askPeanut&&askSpice?'この料理にアレルギーの原因となる食品（ピーナッツ）が含まれておらず、調理中にもピーナッツに触れず、辛さ控えめにできることを確認してください。':askPeanut?'この料理にピーナッツが含まれておらず、調理中にもピーナッツに触れないことを確認してください。':askSpice?'この料理を辛さ控えめにできることを確認してください。':'この料理の材料と調理方法を教えてください。';
 const waiterCopy=language==='zh-CN'
  ?{lead:chineseLead,question:chineseQuestion,fallback:'如果无法确认，请告诉我。',action:'我已阅读',done:'已阅读'}
  :{lead:japaneseLead,question:japaneseQuestion,fallback:'確認できない場合は、そう伝えてください。',action:'読みました',done:'確認済み'};
 const languageLabel=language==='zh-CN'?'中文':'日本語';
 const updateConcern=(kind:'peanut'|'spice',checked:boolean)=>{setAcknowledged(false);if(kind==='peanut')setAskPeanut(checked);else setAskSpice(checked);};
 const selectLanguage=(nextLanguage:WaiterLanguage)=>{setLanguage(nextLanguage);setAcknowledged(false);setShowLanguages(false);};
 return <main className="waiter-check-page" aria-labelledby="waiter-check-title">
  <header className="waiter-check-header app-page-header" inert={showLanguages?true:undefined}>
   <Button type="text" className="waiter-check-back" aria-label="Back to unknown result" icon={<LeftOutlined/>} onClick={onBack}/>
   <h1 id="waiter-check-title">Show the waiter</h1>
   <Button type="text" className="waiter-check-language" aria-label={`Select language, current ${languageLabel}`} icon={<GlobalOutlined/>} onClick={()=>setShowLanguages(true)}>{languageLabel}</Button>
  </header>
  <div className="waiter-check-content" inert={showLanguages?true:undefined}>
   <section className="waiter-check-card" aria-labelledby="waiter-card-title" lang={language}>
    <img className="waiter-check-card-photo" src={demoFood.imageSrc} alt="Captured food to confirm"/>
    <div className="waiter-check-card-copy">
     <p id="waiter-card-title" className="waiter-check-card-lead">{waiterCopy.lead}</p>
     <p>{waiterCopy.question}</p>
     <p>{waiterCopy.fallback}</p>
    </div>
   </section>

   <section className="waiter-check-preview" aria-labelledby="waiter-preview-title">
    <div className="waiter-check-section-label">
     <span id="waiter-preview-title">For you</span>
     <Button type="text" size="small" className="waiter-check-edit" aria-label={editing?'Finish editing message':'Edit message'} icon={editing?<CheckOutlined/>:<EditOutlined/>} onClick={()=>setEditing(value=>!value)}>{editing?'Done':'Edit'}</Button>
    </div>
    <p>{englishMessage}</p>
    {editing&&<div className="waiter-check-options" aria-label="Questions to show the waiter">
     <Checkbox checked={askPeanut} onChange={event=>updateConcern('peanut',event.target.checked)}>Peanut allergy</Checkbox>
     <Checkbox checked={askSpice} onChange={event=>updateConcern('spice',event.target.checked)}>Mild spice</Checkbox>
    </div>}
   </section>
  </div>
  <div className="waiter-check-actions" inert={showLanguages?true:undefined}>
   <Button type="primary" size="large" block aria-label={acknowledged?waiterCopy.done:waiterCopy.action} icon={acknowledged?<CheckOutlined/>:undefined} onClick={()=>setAcknowledged(true)}>{acknowledged?waiterCopy.done:waiterCopy.action}</Button>
  </div>
  {showLanguages&&<section className="waiter-language-page" aria-labelledby="waiter-language-title">
   <header className="waiter-language-header app-page-header">
    <Button type="text" className="waiter-language-back" aria-label="Back to waiter message" icon={<LeftOutlined/>} onClick={()=>setShowLanguages(false)}/>
    <h2 id="waiter-language-title">Select language</h2>
   </header>
   <div className="waiter-language-content">
    <p className="waiter-language-description">Choose the language the restaurant staff will read.</p>
    <div className="waiter-language-list" role="list">
     {languageOptions.map(([value,nativeName,englishName])=><button key={value} type="button" className={`waiter-language-option${language===value?' is-selected':''}`} aria-pressed={language===value} onClick={()=>selectLanguage(value)}>
      <span><strong>{nativeName}</strong><small>{englishName}</small></span>
      {language===value&&<CheckOutlined aria-hidden="true"/>}
     </button>)}
    </div>
   </div>
  </section>}
 </main>;
}
