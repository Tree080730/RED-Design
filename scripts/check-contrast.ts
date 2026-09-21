import assert from 'node:assert/strict';
import {resolvedTokens as t} from '../src/design-system/theme';
function luminance(hex:string){
 assert.match(hex,/^#[a-f\d]{6}$/i);
 const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
 return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
}
const pairs=[['body',t.colorText,t.colorBgContainer],['secondary',t.colorTextSecondary,t.colorBgContainer],['primary',t.colorTextLightSolid,t.colorPrimary],['primary-hover',t.colorTextLightSolid,t.colorPrimaryHover],['primary-active',t.colorTextLightSolid,t.colorPrimaryActive],['match',t.colorSuccessText,t.colorSuccessBg],['conflict',t.colorErrorText,t.colorErrorBg],['unknown',t.colorWarningText,t.colorWarningBg],['info',t.colorInfoText,t.colorInfoBg],['selected-text',t.colorPrimaryText,t.colorBgContainer]];
for(const [name,fg,bg] of pairs){const l=[luminance(fg),luminance(bg)].sort((a,b)=>a-b);const ratio=(l[1]+.05)/(l[0]+.05);assert.ok(ratio>=4.5,`${name}: ${ratio}`);console.log(`${name}: ${ratio.toFixed(2)}:1`);}
console.log(`PASS: ${pairs.length} key text color pairs >= 4.5:1.`);
