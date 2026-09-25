import { demoFood } from './demoFood';

export const dietGroups = [
 {key:'allergies',title:'Allergies',options:['Peanut','Tree nuts','Shellfish','Fish','Milk','Egg','Wheat','Soy','Sesame']},
 {key:'diet',title:'Dietary restrictions',options:['Vegetarian','Vegan','No pork','No beef']},
 {key:'preferences',title:'Preferences',options:['Mild spice','No cilantro','No organ meat']},
] as const;

export type DietGroupKey = typeof dietGroups[number]['key'];
export type DietChoices = Record<DietGroupKey,string[]>;

export const emptyDietChoices=():DietChoices=>({allergies:[],diet:[],preferences:[]});

const demoMatchedLabels=new Set<string>(demoFood.matchedLabels);
export const getDemoMatchedChoices=(choices:DietChoices)=>
 dietGroups.flatMap(group=>choices[group.key]).filter(label=>demoMatchedLabels.has(label));
