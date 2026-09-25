export const demoFood={
 name:'Kung Pao Chicken',
 imageSrc:'/kung-pao-chicken-demo.png',
 imageAlt:'A plate of Kung Pao chicken with peanuts and dried red chilies',
 description:'A Sichuan stir-fry made with diced chicken, roasted peanuts, dried red chilies and scallions in a savory sauce.',
 scanEmojis:['🍗','🥜','🌶️','🧅','🥢'] as const,
 matchedLabels:['Peanut','Mild spice'] as const,
 reasonEmojis:{Peanut:'🥜','Mild spice':'🌶️'} as const,
} as const;
