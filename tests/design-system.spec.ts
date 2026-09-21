import { test, expect } from '@playwright/test';

test('shared selections, modal, character config, unknown and reduced motion', async ({page}) => {
 await page.setViewportSize({width:1600,height:1000});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/design-system');
 await expect(page.getByRole('heading',{name:'好奇每一口，设计每一步。'})).toBeVisible();
 await page.getByRole('navigation').getByRole('button',{name:'组件规范'}).click();
 await page.getByRole('tab',{name:/饮食限制/}).click();
 await page.getByRole('checkbox',{name:'不吃猪肉',exact:true}).check();
 await page.getByRole('tab',{name:/过敏/}).click();
 await expect(page.getByRole('checkbox',{name:'花生',exact:true})).toBeChecked();
 await expect(page.locator('.selection-summary')).toContainText('花生 · 少辣 · 不吃猪肉');
 await page.getByRole('button',{name:'展示沟通卡',exact:true}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button',{name:'完成',exact:true}).click();
 await expect(page.getByRole('dialog')).toBeHidden();
 await page.getByRole('navigation').getByRole('button',{name:'人物与动效'}).click();
 await page.getByRole('button',{name:'短发',exact:true}).click();
 await expect(page.getByRole('button',{name:'短发',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('tab',{name:'服装',exact:true}).click();
 await page.getByRole('button',{name:'紫色上衣'}).click();
 await page.getByRole('tab',{name:'眼镜',exact:true}).click();
 await page.getByRole('button',{name:'圆框眼镜',exact:true}).click();
 await page.getByRole('button',{name:'保存人物并预览'}).click();
 await page.getByRole('button',{name:'播放动作',exact:true}).click();
 await expect(page.getByTestId('character-stage')).toHaveAttribute('data-mood','match');
 await expect(page.getByTestId('character-stage')).toHaveAttribute('data-hair','crop');
 await expect(page.getByTestId('character-stage')).toHaveAttribute('data-shirt','#CE82FF');
 await expect(page.getByTestId('character-stage').getByRole('img',{name:/原创人物.*戴眼镜/})).toBeVisible();
 await page.getByText('待确认',{exact:true}).click();
 await expect(page.getByRole('radio',{name:'待确认',exact:true})).toBeChecked();
 await page.getByRole('button',{name:'播放动作',exact:true}).click();
 await expect(page.getByTestId('character-stage')).toHaveAttribute('data-mood','unknown');
 await page.getByText('不符',{exact:true}).click();
 await expect(page.getByRole('radio',{name:'不符',exact:true})).toBeChecked();
 await page.getByRole('switch',{name:'动作设置：减少动态效果'}).click();
 await page.getByRole('button',{name:'播放动作',exact:true}).click();
 await expect(page.getByTestId('character-stage')).toHaveAttribute('data-mood','conflict');
 await page.getByRole('button',{name:'重置动作'}).click();
 await expect(page.getByTestId('character-stage')).toHaveAttribute('data-hair','crop');
 await expect(page.getByTestId('character-stage')).toHaveAttribute('data-mood','idle');
 expect(errors).toEqual([]);
});

test('all sections fit mobile and desktop; live token source',async({page})=>{
 await page.goto('/design-system');
 for(const width of [360,390,430,1440]){
  await page.setViewportSize({width,height:950});
  for(const name of ['设计师手册','系统总览','品牌色彩','字体排版','基础变量','组件规范','人物与动效','使用约束']){
   await page.getByRole('navigation').getByRole('button',{name,exact:true}).click();
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
   expect(overflow,`${name} at ${width}`).toBe(false);
  }
 }
 await page.getByRole('navigation').getByRole('button',{name:'基础变量'}).click();
 await page.getByRole('textbox',{name:'搜索 token'}).fill('borderRadius');
 await expect(page.locator('.token-table tbody tr')).toHaveCount(3);
 await expect(page.getByRole('cell',{name:'存在覆盖',exact:true})).toHaveCount(0);
});

test('system reduced motion produces immediate static state and keyboard focus visible',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/design-system');
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'跳转到内容'})).toBeFocused();
 await page.getByRole('navigation').getByRole('button',{name:'人物与动效'}).click();
 await page.getByRole('button',{name:'保存人物并预览'}).click();
 await page.getByRole('button',{name:'播放动作',exact:true}).click();
 await expect(page.getByTestId('character-stage')).toHaveAttribute('data-mood','match');
});


test('avatar draft cancel, preset, and appearance persist across editor categories',async({page})=>{
 await page.setViewportSize({width:1600,height:1050});
 const svgErrors:string[]=[];page.on('console',m=>{if(m.type()==='error')svgErrors.push(m.text());});
 await page.goto('/design-system');
 await page.getByRole('navigation').getByRole('button',{name:'人物与动效'}).click();
 for(const hair of ['短发','波波头','蓬松卷','马尾','无发型','自然卷']){
   await page.getByRole('button',{name:hair,exact:true}).click();
   await expect(page.getByRole('button',{name:hair,exact:true})).toHaveAttribute('aria-pressed','true');
 }
 await page.getByRole('button',{name:'试用栗子人物'}).click();
 await expect(page.getByTestId('avatar-preview')).toHaveAttribute('data-hair','bob');
 await page.getByRole('button',{name:'取消人物修改'}).click();
 await expect(page.getByTestId('avatar-preview')).toHaveAttribute('data-hair','wave');
 await page.getByRole('button',{name:'试用阿洛人物'}).click();
 await page.getByRole('button',{name:'保存人物并预览'}).click();
 await expect(page.getByTestId('character-stage')).toHaveAttribute('data-hair','curly');
 await page.getByText('创建人物',{exact:true}).click();
 await page.getByRole('tab',{name:'轮廓',exact:true}).click();
 await page.getByRole('button',{name:'修长脸型',exact:true}).click();
 await page.getByRole('tab',{name:'发色',exact:true}).click();
 await page.getByRole('button',{name:'发色 3',exact:true}).click();
 await page.getByRole('tab',{name:'发型',exact:true}).click();
 await expect(page.getByRole('button',{name:'蓬松卷',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.getByTestId('avatar-preview')).toHaveAttribute('data-face','long');
 await page.getByRole('button',{name:'取消人物修改'}).click();
 await expect(page.getByTestId('avatar-preview')).toHaveAttribute('data-face','soft');
 await expect(page.getByTestId('avatar-preview')).toHaveAttribute('data-hair','curly');
 expect(svgErrors).toEqual([]);
 await expect(page.locator('.ant-message-notice')).toHaveCount(0);
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:'docs/delivery/avatar-v2-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:'docs/delivery/avatar-v2-mobile.png',fullPage:true});
});
