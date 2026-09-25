import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { getDemoMatchedChoices, type DietChoices } from './dietChoices';
import { demoFood } from './demoFood';
import './food-check-details.css';

type FoodCheckDetailsProps={choices:DietChoices;onBack:()=>void;onDone:()=>void;variant?:'can-eat'|'cannot-eat'};

export default function FoodCheckDetails({choices,onBack,onDone,variant='cannot-eat'}:FoodCheckDetailsProps){
 const matchedChoices=getDemoMatchedChoices(choices);
 const canEat=variant==='can-eat';
 return <main className="food-details-page" aria-labelledby="food-details-title">
  <header className="food-details-header app-page-header">
   <Button type="text" className="food-details-back" aria-label="Back to food check result" icon={<LeftOutlined/>} onClick={onBack}/>
   <h1 id="food-details-title">{canEat?'Why can I eat this?':'Why can’t I eat this?'}</h1>
  </header>
  <div className="food-details-content">
   <section className="food-details-meal" aria-labelledby="food-details-meal-name">
    <img className="food-details-thumbnail" src={demoFood.imageSrc} alt={demoFood.imageAlt}/>
    <h2 id="food-details-meal-name">{demoFood.name}</h2>
   </section>
   <section className="food-details-copy" aria-labelledby="food-details-what">
    <h2 id="food-details-what">What’s this?</h2>
    <p>{demoFood.description}</p>
   </section>
   <section className="food-details-copy" aria-labelledby="food-details-why">
    <h2 id="food-details-why">{canEat?'Why can eat?':'Why can’t eat?'}</h2>
    <p>{canEat?'No obvious conflicts found with the food preferences you saved.':matchedChoices.length?'This dish conflicts with food preferences you saved. Check the matched items before eating.':'The demo cannot confirm that this dish meets your saved food preferences.'}</p>
    {!!matchedChoices.length&&!canEat&&<div className="food-details-tags" aria-label="Matched reasons">{matchedChoices.map(label=><span key={label}>{label}</span>)}</div>}
   </section>
   <div className="food-details-actions">
    <Button type="primary" size="large" block onClick={onDone}>Done</Button>
   </div>
  </div>
 </main>;
}
