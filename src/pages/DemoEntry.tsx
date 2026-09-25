import DietPreferences from './DietPreferences';
import DemoScenarioSelector from './DemoScenarioSelector';

const validDemoResults=new Set(['can-eat','cannot-eat','unknown']);

export default function DemoEntry(){
 const resultParam=new URLSearchParams(window.location.search).get('result');
 if(resultParam!==null&&validDemoResults.has(resultParam))return <DietPreferences/>;
 return <DemoScenarioSelector/>;
}
