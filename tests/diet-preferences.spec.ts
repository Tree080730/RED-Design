import {test,expect} from '@playwright/test';
const openDiet=async(page:any,url='/demo')=>{await page.goto(url);await page.getByRole('button',{name:'Save mouth and continue'}).click();await expect(page.locator('.setup-transition-layer')).toHaveCount(0);};
test('mouth setup uses the light layout and saves before dietary preferences',async({page})=>{
 await page.setViewportSize({width:402,height:874});await page.goto('/demo');
 await expect(page.getByRole('heading',{name:'Create your MOUTH'})).toBeVisible();
 for(const label of ['Wide nose','Bridge nose','Slit nostrils','Heart nostrils'])await expect(page.getByRole('button',{name:label,exact:true})).toBeAttached();
 await page.getByRole('button',{name:'Bridge nose',exact:true}).click();await page.getByRole('button',{name:'Heart nostrils',exact:true}).click();
 await page.getByRole('tab',{name:'Mouth',exact:true}).click();await page.getByRole('tab',{name:'Nose',exact:true}).click();
 await expect(page.getByRole('button',{name:'Bridge nose',exact:true})).toHaveAttribute('aria-pressed','true');await expect(page.getByRole('button',{name:'Heart nostrils',exact:true})).toHaveAttribute('aria-pressed','true');
 for(const tab of ['Nose','Mouth','Teeth','Tongue','Hair']){await page.getByRole('tab',{name:tab,exact:true}).click();await expect(page.getByRole('tab',{name:tab,exact:true})).toHaveAttribute('aria-selected','true');}
 await page.getByRole('button',{name:'Spiky hair',exact:true}).click();
 await page.getByRole('tab',{name:'Teeth',exact:true}).click();await page.getByRole('button',{name:'Star sticker',exact:true}).click();
 await page.getByRole('tab',{name:'Hair',exact:true}).click();await expect(page.getByRole('button',{name:'Spiky hair',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('tab',{name:'Mouth',exact:true}).click();await page.getByRole('button',{name:/Plum mouth interior/}).click();
 expect(await page.locator('.mouth-setup').evaluate(e=>e.scrollHeight<=e.clientHeight)).toBe(true);
 await page.getByRole('button',{name:'Save mouth and continue'}).click();await expect(page.getByRole('heading',{name:'What do you avoid?'})).toBeVisible();
});
test('diet first page keeps choices across groups and custom edits',async({page})=>{
 await page.setViewportSize({width:390,height:844});await openDiet(page);
 for(const name of ['Peanut','No pork','Mild spice'])await page.getByRole('button',{name,exact:true}).click();
 await page.getByRole('button',{name:'Add other preferences',exact:true}).click();
 await page.getByLabel('Your preference').fill('No mushrooms');await page.getByRole('button',{name:'Add preference',exact:true}).click();
 await expect(page.getByRole('button',{name:'No mushrooms',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Confirm your preferences'})).toBeVisible();
 await expect(page.locator('.diet-sheet')).toContainText('No mushrooms');await expect(page.locator('.diet-sheet')).toContainText('Peanut');
 await page.getByRole('button',{name:'Confirm',exact:true}).click();await expect(page.getByRole('heading',{name:'What’s on the table?'})).toBeVisible();
 await page.getByRole('button',{name:'Back to preferences'}).click();
 for(const name of ['Peanut','No pork','Mild spice'])await expect(page.getByRole('button',{name,exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'No mushrooms',exact:true}).click();await expect(page.getByRole('button',{name:'No mushrooms',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Peanut',exact:true}).click();await expect(page.getByRole('button',{name:'Peanut',exact:true})).toHaveAttribute('aria-pressed','false');
 await page.getByRole('button',{name:'Add other preferences',exact:true}).click();await page.getByLabel('Your preference').fill('No mushrooms');await page.getByRole('button',{name:'Add preference',exact:true}).click();await expect(page.getByRole('button',{name:'No mushrooms',exact:true})).toHaveAttribute('aria-pressed','true');
 for(const width of [360,390,430,750]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);}
 await page.setViewportSize({width:390,height:844});await openDiet(page);await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:'docs/delivery/diet-preferences-mobile.png',fullPage:true});
});
test('empty choices are not treated as personal match and custom duplicates are reused',async({page})=>{
 await openDiet(page);await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.locator('.diet-sheet')).toContainText('Add your food requirements');await page.getByRole('button',{name:'Confirm',exact:true}).click();await page.getByRole('button',{name:'Back to preferences'}).click();
 await page.getByRole('button',{name:'Add other allergies'}).click();await page.getByLabel('Your preference').fill('  peanut  ');await page.getByRole('button',{name:'Add preference',exact:true}).click();await expect(page.getByRole('button',{name:'Peanut',exact:true})).toHaveCount(1);await expect(page.getByRole('button',{name:'Peanut',exact:true})).toHaveAttribute('aria-pressed','true');
});

test('confirm opens camera page with shutter',async({page})=>{
 await page.setViewportSize({width:402,height:874});await openDiet(page);await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Confirm',exact:true}).click();
 await expect(page.getByRole('heading',{name:'What’s on the table?'})).toBeVisible();await expect(page.getByLabel('Camera preview')).toBeVisible();
 await expect(page.locator('.camera-food-preview')).toHaveAttribute('src','/kung-pao-chicken-demo.png');
 const zoomTwo=page.getByRole('button',{name:'2× zoom'});await zoomTwo.click();await expect(zoomTwo).toHaveText('2x');await expect(zoomTwo).toHaveAttribute('aria-pressed','true');
 const expectSelectedZoomCentered=async()=>expect.poll(async()=>page.evaluate(()=>{const preview=document.querySelector('.camera-viewfinder')!.getBoundingClientRect();const indicator=document.querySelector('.camera-zoom-indicator')!.getBoundingClientRect();const selected=document.querySelector('.camera-zoom button[aria-pressed=true]')!.getBoundingClientRect();return Math.max(Math.abs(indicator.left+indicator.width/2-selected.left-selected.width/2),Math.abs(preview.left+preview.width/2-selected.left-selected.width/2));})).toBeLessThan(1);
 await expectSelectedZoomCentered();
 for(const level of ['0.5','1','5']){await page.getByRole('button',{name:`${level}× zoom`,exact:true}).click();await expectSelectedZoomCentered();}
 const flash=page.locator('.camera-flash');await expect(flash).toHaveAttribute('aria-pressed','false');await flash.click();await expect(flash).toHaveAttribute('aria-pressed','true');await flash.click();await expect(flash).toHaveAttribute('aria-pressed','false');
 const controlAlignment=await page.evaluate(()=>{const pageBox=document.querySelector('.camera-page')!.getBoundingClientRect();const controls=[...document.querySelectorAll('.camera-tool')] as HTMLElement[];const shutter=document.querySelector('.camera-shutter')!.getBoundingClientRect();return {left:controls[0].getBoundingClientRect().left-pageBox.left,right:pageBox.right-controls[1].getBoundingClientRect().right,center:Math.abs(shutter.left+shutter.width/2-(pageBox.left+pageBox.width/2))};});expect(controlAlignment.left).toBeCloseTo(32,0);expect(controlAlignment.right).toBeCloseTo(32,0);expect(controlAlignment.center).toBeLessThan(1);
 await page.getByRole('button',{name:'Capture photo'}).click();await expect(page.getByRole('heading',{name:'Look good?'})).toBeVisible();
 await expect(page.getByRole('img',{name:'Captured Kung Pao Chicken photo'})).toHaveCSS('background-image',/kung-pao-chicken-demo\.png/);
 expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight&&document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Again',exact:true}).click();await expect(page.getByLabel('Camera preview')).toBeVisible();
 await page.getByRole('button',{name:'Back to preferences'}).click();await expect(page.getByRole('heading',{name:'What do you avoid?'})).toBeVisible();
});

test('app controls have no hover-only visual state',async({page})=>{
 await page.setViewportSize({width:402,height:874});await openDiet(page);
 const expectHoverStable=async(targetSelector:string,styleSelector=targetSelector)=>{await page.mouse.move(1,1);await page.waitForTimeout(250);const read=()=>page.locator(styleSelector).first().evaluate(element=>{const style=getComputedStyle(element);return [style.backgroundColor,style.color,style.borderTopColor,style.boxShadow].join('|');});const before=await read();await page.locator(targetSelector).first().hover();await page.waitForTimeout(250);expect(await read()).toBe(before);};
 await expectHoverStable('.diet-chip','.diet-chip-wrap');await expectHoverStable('.diet-back');await expectHoverStable('.diet-continue');
 await page.locator('.diet-continue').click();await expectHoverStable('.diet-confirm-sheet .diet-continue');await page.locator('.diet-confirm-sheet .diet-continue').click();
 await expectHoverStable('.camera-back');await expectHoverStable('.camera-flash');await expectHoverStable('.camera-tool:not(.camera-flash)');
 await page.locator('.camera-flash').click();await expectHoverStable('.camera-flash');
});

test('iPhone 17 Pro fits default and selected content without scrolling',async({page})=>{
 await page.setViewportSize({width:402,height:874});await openDiet(page);
 const fits=async()=>{expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight)).toBe(true);expect(await page.locator('.diet-continue').evaluate(e=>e.getBoundingClientRect().bottom)).toBeLessThanOrEqual(874);};
 await fits();for(const button of await page.locator('.diet-chip[aria-pressed]').all())await button.click();await fits();
 await page.setViewportSize({width:1440,height:1000});expect(await page.locator('.diet-page').evaluate(e=>e.scrollHeight<=e.clientHeight)).toBe(true);
});

test('custom entry expands inline, focuses, and accepts keyboard submission',async({page})=>{
 await page.setViewportSize({width:402,height:874});await openDiet(page);
 await page.getByRole('button',{name:'Add other preferences',exact:true}).click();
 const input=page.getByRole('textbox',{name:'Your preference'});await expect(input).toBeFocused();await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect.poll(async()=>page.locator('.diet-inline-form').evaluate(e=>Math.abs(e.getBoundingClientRect().width-e.parentElement!.clientWidth))).toBeLessThan(1);
 await input.fill('No onion');await input.press('Enter');await expect(page.getByRole('button',{name:'No onion',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Add other preferences',exact:true}).click();await input.fill('discard');await input.press('Escape');await expect(page.getByRole('button',{name:'discard',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Add other preferences',exact:true}).click();await input.fill('No garlic');await page.getByRole('heading',{name:'Preferences',exact:true}).click();await expect(page.getByRole('button',{name:'No garlic',exact:true})).toHaveAttribute('aria-pressed','true');
});

test('simulated keyboard types, deletes, submits, and keeps input visible',async({page})=>{
 await page.setViewportSize({width:402,height:874});await openDiet(page);await page.getByRole('button',{name:'Add other preferences',exact:true}).click();
 const keyboard=page.getByRole('region',{name:'Simulated keyboard'});await expect(keyboard).toBeVisible();
 for(const key of ['a','b','c'])await keyboard.getByRole('button',{name:`Type ${key}`,exact:true}).click();
 await keyboard.getByRole('button',{name:'Delete character'}).click();await keyboard.getByRole('button',{name:'Space',exact:true}).click();await keyboard.getByRole('button',{name:'Type d',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Your preference'})).toHaveValue('ab d');
 expect(await page.locator('.diet-inline-form').evaluate(e=>e.getBoundingClientRect().bottom)).toBeLessThanOrEqual(await keyboard.evaluate(e=>e.getBoundingClientRect().top));
 await keyboard.getByRole('button',{name:'Done',exact:true}).click();await expect(keyboard).toHaveCount(0);await expect(page.getByRole('button',{name:'ab d',exact:true})).toHaveAttribute('aria-pressed','true');
});

test('touch devices do not display a duplicate simulated keyboard',async({browser})=>{
 const context=await browser.newContext({hasTouch:true,viewport:{width:402,height:874}});const page=await context.newPage();await openDiet(page);await page.getByRole('button',{name:'Add other allergies'}).click();await expect(page.getByRole('textbox',{name:'Your preference'})).toBeFocused();await expect(page.getByRole('region',{name:'Simulated keyboard'})).toHaveCount(0);await context.close();
});

test('photo morphs into chewing with a food thought display',async({page})=>{
 await page.setViewportSize({width:402,height:874});await openDiet(page);
 for(const name of ['Continue','Confirm','Capture photo'])await page.getByRole('button',{name,exact:true}).click();
 await page.locator('.journey-face').evaluate(e=>e.setAttribute('data-persistent','true'));
 await page.getByRole('button',{name:'Check food',exact:true}).click();
 await expect(page.locator('.journey-page')).toHaveClass(/phase-entering/);
 await expect(page.getByRole('button',{name:'Again',exact:true})).toHaveCount(0);
 await expect(page.locator('.journey-page')).toHaveClass(/phase-chewing/);
 await expect(page.locator('.journey-face')).toHaveAttribute('data-persistent','true');
 await expect(page.locator('.journey-mouth-opening')).toHaveClass(/is-chewing/);
 await expect(page.locator('.journey-bubble')).toBeVisible();
 await expect(page.locator('.journey-bubble')).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
 await expect(page.locator('.journey-demo-controls')).toHaveCount(0);
 await page.getByRole('button',{name:'Back to photo',exact:true}).click();
 await expect(page.locator('.journey-page')).toHaveClass(/phase-review/);
 await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'Check food',exact:true}).click();
 await expect(page.locator('.journey-page')).toHaveClass(/phase-chewing/);
 expect(await page.locator('.journey-mouth-opening').evaluate(e=>e.getAnimations().length)).toBe(0);
});


test('configured mouth opens continuously into preferences and respects reduced motion',async({page})=>{
 await page.setViewportSize({width:402,height:874});await page.goto('/demo');
 await page.getByRole('tab',{name:'Teeth',exact:true}).click();await page.getByRole('button',{name:'Gold tooth',exact:true}).click();
 await page.getByRole('button',{name:'Save mouth and continue'}).click();
 await expect(page.locator('.setup-transition-layer > svg')).toHaveCount(1);
 await expect(page.locator('.diet-mouth-viewport')).toHaveAttribute('inert','');
 await expect(page.locator('.setup-transition-layer [fill="#FFDB13"]')).toHaveCount(1);
 await expect(page.locator('.setup-transition-layer')).toHaveCount(0);
 await expect(page.locator('.mouth-frame-output [fill="#FFDB13"]')).toHaveCount(1);
 await page.getByRole('button',{name:'Peanut',exact:true}).click();
 await expect(page.getByRole('button',{name:'Peanut',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Edit your mouth'}).click();
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.getByRole('button',{name:'Save mouth and continue'}).click();
 await expect(page.locator('.setup-transition-layer')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Peanut',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Confirm',exact:true}).click();await page.getByRole('button',{name:'Capture photo'}).click();
 await expect(page.locator('.journey-shared-mouth .mouth-frame-output [data-part="face"]')).toHaveCount(1);
 await expect(page.locator('.journey-shared-mouth .mouth-frame-output [fill="#FFDB13"]')).toHaveCount(1);
});

test('capture carries the viewfinder into the photo before revealing review controls',async({page})=>{
 await page.setViewportSize({width:402,height:874});await openDiet(page);
 await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Confirm',exact:true}).click();
 const source=await page.locator('.camera-viewfinder').boundingBox();
 await page.getByRole('button',{name:'Capture photo'}).click();
 const start=await page.locator('.confirm-page').evaluate(root=>{
  root.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=0;});
  const r=root.querySelector('.confirm-photo')!.getBoundingClientRect();
  return {x:r.x,y:r.y,width:r.width,height:r.height,actions:getComputedStyle(root.querySelector('.confirm-actions')!).opacity};
 });
 for(const k of ['x','y','width','height'] as const)expect(start[k]).toBeCloseTo(source![k],0);
 expect(start.actions).toBe('0');
 await page.locator('.confirm-page').evaluate(root=>root.getAnimations({subtree:true}).forEach(a=>a.play()));
 await expect(page.locator('.confirm-page')).toHaveAttribute('data-arriving','false');
 await page.getByRole('button',{name:'Again',exact:true}).click();await page.emulateMedia({reducedMotion:'reduce'});
 await page.getByRole('button',{name:'Capture photo'}).click();
 await expect(page.locator('.confirm-page')).toHaveAttribute('data-arriving','false');
 await expect(page.getByRole('button',{name:'Check food',exact:true})).toBeEnabled();
});

test('cannot-eat result opens personalized details and returns without replaying',async({page})=>{
 await page.setViewportSize({width:402,height:874});await openDiet(page,'/demo?result=cannot-eat');
 for(const name of ['Peanut','Mild spice'])await expect(page.getByRole('button',{name,exact:true})).toHaveAttribute('aria-pressed','true');
 for(const name of ['Continue','Confirm','Capture photo','Check food'])await page.getByRole('button',{name,exact:true}).click();
 await expect(page.locator('.journey-page')).toHaveClass(/phase-chewing/);
 const cyclingEmojiSize=await page.locator('.journey-food').evaluate(e=>getComputedStyle(e).fontSize);
 const details=page.getByRole('button',{name:'Checking Details'});await expect(details).toBeVisible({timeout:7000});
 await expect(page.locator('.journey-food-final')).toHaveCSS('font-size',cyclingEmojiSize);
 await expect(page.locator('.journey-thought')).toHaveCSS('transition-property','top');
 await expect(page.getByLabel('Matched preferences')).toHaveText('PeanutMild spice');
 await expect(page.locator('.journey-food-final')).toHaveText('🥜');
 expect(await page.locator('.journey-food-final').evaluate(e=>e.getAnimations().some(animation=>(animation as CSSAnimation).animationName==='journey-result-food-in'))).toBe(true);
 expect(await details.evaluate(e=>e.getAnimations().some(animation=>(animation as CSSAnimation).animationName==='journey-result-copy-in'))).toBe(true);
 await details.click();
 await expect(page.getByRole('heading',{name:'Why can’t I eat this?'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Kung Pao Chicken'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'What’s this?'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Why can’t eat?'})).toBeVisible();
 await expect(page.getByLabel('Matched reasons')).toHaveText('PeanutMild spice');
 await expect(page.getByRole('button',{name:'I need to check with waiter'})).toHaveCount(0);
 await expect(page.locator('.journey-sick-mouth')).toBeVisible();
 expect(await page.locator('.food-details-page').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
 await page.getByRole('button',{name:'Back to food check result'}).click();
 await expect(page.getByRole('button',{name:'Checking Details'})).toBeVisible();
 await expect(page.locator('.journey-page')).toHaveClass(/phase-result/);
});

test('unknown result keeps chewing and opens the waiter confirmation page',async({page})=>{
 await page.setViewportSize({width:402,height:874});await openDiet(page,'/demo?result=unknown');
 for(const name of ['Peanut','Mild spice'])await expect(page.getByRole('button',{name,exact:true})).toHaveAttribute('aria-pressed','true');
 for(const name of ['Continue','Confirm','Capture photo','Check food'])await page.getByRole('button',{name,exact:true}).click();
 await expect(page.getByRole('status',{name:''}).filter({hasText:'Not sure yet'})).toBeVisible({timeout:7000});
 await expect(page.getByText('Need to check with the waiter',{exact:true})).toBeVisible();
 await expect(page.getByRole('img',{name:'Mouth chewing'})).toBeVisible();
 await expect(page.locator('.journey-mouth-opening')).toHaveClass(/is-chewing/);
 await expect(page.locator('.journey-sick-mouth')).toHaveCount(0);
 await expect(page.locator('.journey-happy-mouth')).toHaveCount(0);
 await page.getByRole('button',{name:'Show the waiter',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Show the waiter'})).toBeVisible();
 const waiterPage=page.locator('.waiter-check-page');
 await expect(waiterPage.getByText('Kung Pao Chicken',{exact:true})).toHaveCount(0);
 await expect(waiterPage.getByText('Peanut',{exact:true})).toHaveCount(0);
 await expect(waiterPage.getByText('Mild spice',{exact:true})).toHaveCount(0);
 await expect(page.getByRole('img',{name:'Captured food to confirm'})).toBeVisible();
 await expect(page.getByText('I have a peanut allergy and can only eat mildly spicy food.',{exact:false})).toBeVisible();
 await expect(page.getByText('我对花生过敏，也只能吃微辣的食物。',{exact:true})).toBeVisible();
 await expect(page.getByText('请确认这道菜不含会引起我过敏的食物（花生），制作时也不会接触花生，并且可以做成微辣。',{exact:true})).toBeVisible();
 await expect(page.getByText('辣度如何',{exact:false})).toHaveCount(0);
 expect(await page.locator('.waiter-check-page').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
 await page.getByRole('button',{name:'Edit message',exact:true}).click();
 await page.getByRole('checkbox',{name:'Mild spice',exact:true}).uncheck();
 await expect(page.getByText('我对花生过敏。',{exact:true})).toBeVisible();
 await expect(page.getByText('我对花生过敏，也只能吃微辣的食物。',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Finish editing message',exact:true}).click();
 await page.getByRole('button',{name:'Select language, current 中文',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Select language'})).toBeVisible();
 await expect(page.getByText('Choose the language the restaurant staff will read.',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:/日本語 Japanese/}).click();
 await expect(page.getByRole('button',{name:'Select language, current 日本語',exact:true})).toBeVisible();
 await expect(page.getByText('私はピーナッツアレルギーがあります。',{exact:true})).toBeVisible();
 await expect(page.getByText('この料理にピーナッツが含まれておらず、調理中にもピーナッツに触れないことを確認してください。',{exact:true})).toBeVisible();
 await expect(page.getByText('I have a peanut allergy. Please confirm that this dish contains no peanuts',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'読みました',exact:true}).click();
 await expect(page.getByRole('button',{name:'確認済み',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Back to unknown result'}).click();
 await expect(page.getByText('Not sure yet',{exact:true})).toBeVisible();
 await expect(page.locator('.journey-mouth-opening')).toHaveClass(/is-chewing/);
});
