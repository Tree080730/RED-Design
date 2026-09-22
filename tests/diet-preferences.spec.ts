import {test,expect} from '@playwright/test';
test('diet first page keeps choices across groups and custom edits',async({page})=>{
 await page.goto('/demo');await page.setViewportSize({width:390,height:844});
 for(const name of ['Peanut','No pork','Mild spice'])await page.getByRole('button',{name,exact:true}).click();
 await page.getByRole('button',{name:'Add other preferences',exact:true}).click();
 await page.getByLabel('Your preference').fill('No mushrooms');await page.getByRole('button',{name:'Add preference',exact:true}).click();
 await expect(page.getByRole('button',{name:'No mushrooms',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Confirm your preferences'})).toBeVisible();
 await expect(page.locator('.diet-sheet')).toContainText('No mushrooms');await expect(page.locator('.diet-sheet')).toContainText('Peanut');
 await page.getByRole('button',{name:'Back to edit'}).click();
 for(const name of ['Peanut','No pork','Mild spice'])await expect(page.getByRole('button',{name,exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'No mushrooms',exact:true}).click();await expect(page.getByRole('button',{name:'No mushrooms',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Peanut',exact:true}).click();await expect(page.getByRole('button',{name:'Peanut',exact:true})).toHaveAttribute('aria-pressed','false');
 await page.getByRole('button',{name:'Add other preferences',exact:true}).click();await page.getByLabel('Your preference').fill('No mushrooms');await page.getByRole('button',{name:'Add preference',exact:true}).click();await expect(page.getByRole('button',{name:'No mushrooms',exact:true})).toHaveAttribute('aria-pressed','true');
 for(const width of [360,390,430,750]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);}
 await page.setViewportSize({width:390,height:844});await page.goto('/demo');await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:'docs/delivery/diet-preferences-mobile.png',fullPage:true});
});
test('empty choices are not treated as personal match and custom duplicates are reused',async({page})=>{
 await page.goto('/demo');await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.locator('.diet-sheet')).toContainText('Add your food requirements');await page.getByRole('button',{name:'Back to edit'}).click();
 await page.getByRole('button',{name:'Add other allergies'}).click();await page.getByLabel('Your preference').fill('  peanut  ');await page.getByRole('button',{name:'Add preference',exact:true}).click();await expect(page.getByRole('button',{name:'Peanut',exact:true})).toHaveCount(1);await expect(page.getByRole('button',{name:'Peanut',exact:true})).toHaveAttribute('aria-pressed','true');
});

test('iPhone 17 Pro fits default and selected content without scrolling',async({page})=>{
 await page.setViewportSize({width:402,height:874});await page.goto('/demo');
 const fits=async()=>{expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight)).toBe(true);expect(await page.locator('.diet-continue').evaluate(e=>e.getBoundingClientRect().bottom)).toBeLessThanOrEqual(874);};
 await fits();for(const button of await page.locator('.diet-chip[aria-pressed]').all())await button.click();await fits();
 await page.setViewportSize({width:1440,height:1000});expect(await page.locator('.diet-page').evaluate(e=>e.scrollHeight<=e.clientHeight)).toBe(true);
});

test('custom entry expands inline, focuses, and accepts keyboard submission',async({page})=>{
 await page.setViewportSize({width:402,height:874});await page.goto('/demo');
 await page.getByRole('button',{name:'Add other preferences',exact:true}).click();
 const input=page.getByRole('textbox',{name:'Your preference'});await expect(input).toBeFocused();await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect.poll(async()=>page.locator('.diet-inline-form').evaluate(e=>Math.abs(e.getBoundingClientRect().width-e.parentElement!.clientWidth))).toBeLessThan(1);
 await input.fill('No onion');await input.press('Enter');await expect(page.getByRole('button',{name:'No onion',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Add other preferences',exact:true}).click();await input.fill('discard');await input.press('Escape');await expect(page.getByRole('button',{name:'discard',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Add other preferences',exact:true}).click();await input.fill('No garlic');await page.getByRole('heading',{name:'Preferences',exact:true}).click();await expect(page.getByRole('button',{name:'No garlic',exact:true})).toHaveAttribute('aria-pressed','true');
});

test('simulated keyboard types, deletes, submits, and keeps input visible',async({page})=>{
 await page.setViewportSize({width:402,height:874});await page.goto('/demo');await page.getByRole('button',{name:'Add other preferences',exact:true}).click();
 const keyboard=page.getByRole('region',{name:'Simulated keyboard'});await expect(keyboard).toBeVisible();
 for(const key of ['a','b','c'])await keyboard.getByRole('button',{name:`Type ${key}`,exact:true}).click();
 await keyboard.getByRole('button',{name:'Delete character'}).click();await keyboard.getByRole('button',{name:'Space',exact:true}).click();await keyboard.getByRole('button',{name:'Type d',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Your preference'})).toHaveValue('ab d');
 expect(await page.locator('.diet-inline-form').evaluate(e=>e.getBoundingClientRect().bottom)).toBeLessThanOrEqual(await keyboard.evaluate(e=>e.getBoundingClientRect().top));
 await keyboard.getByRole('button',{name:'Done',exact:true}).click();await expect(keyboard).toHaveCount(0);await expect(page.getByRole('button',{name:'ab d',exact:true})).toHaveAttribute('aria-pressed','true');
});

test('touch devices do not display a duplicate simulated keyboard',async({browser})=>{
 const context=await browser.newContext({hasTouch:true,viewport:{width:402,height:874}});const page=await context.newPage();await page.goto('/demo');await page.getByRole('button',{name:'Add other allergies'}).click();await expect(page.getByRole('textbox',{name:'Your preference'})).toBeFocused();await expect(page.getByRole('region',{name:'Simulated keyboard'})).toHaveCount(0);await context.close();
});
