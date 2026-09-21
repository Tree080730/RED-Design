import assert from 'node:assert/strict';
import { theme } from 'antd';
import { brandTheme } from '../src/design-system/theme';
const base = theme.getDesignToken();
const branded = theme.getDesignToken(brandTheme);
let checked = 0;
for (const [key,value] of Object.entries(base)) {
  if (/color/i.test(key) || (typeof value === 'string' && /^(#|rgba?\(|hsla?\(|transparent$)/.test(value))) continue;
  assert.deepEqual(branded[key as keyof typeof branded], value, `Non-color token changed: ${key}`);
  checked++;
}
for (const key of Object.keys(brandTheme.token ?? {})) assert.match(key, /^color/, `Only color overrides allowed: ${key}`);
console.log(`PASS: ${checked} non-color tokens equal antd 6.0.0 defaults; overrides are color-only.`);

for (const [component,config] of Object.entries(brandTheme.components ?? {})) {
  for (const key of Object.keys(config ?? {})) assert.match(key, /color/i, `Non-color component override: ${component}.${key}`);
}
console.log('PASS: component overrides are color-only.');
