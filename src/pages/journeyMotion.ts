const clamp=(value:number)=>Math.max(0,Math.min(1,value));
const smooth=(value:number)=>{const t=clamp(value);return t*t*t*(10+t*(-15+6*t));};

// All tracks use the same elapsed time; no per-keyframe easing restarts.
export function journeyMotion(elapsed:number){
 const fall=clamp((elapsed-60)/1400);
 const chewTime=Math.max(0,elapsed-1540);
 return {
  face:smooth(elapsed/1680),
  photoY:426*fall*fall,
  photoScale:Math.exp(Math.log(.035)*smooth(fall)),
  photoOpacity:1-smooth((fall-.91)/.09),
  actions:1-smooth(elapsed/220),
  drool:1-smooth(elapsed/260),
  closure:smooth(chewTime/460),
  chewWave:(1-Math.cos(2*Math.PI*chewTime/940))/2,
  bubble:smooth((elapsed-1500)/460),
 };
}
