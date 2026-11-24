import { test, expect } from '@playwright/test';
for(const width of [360,390,1440])test(`Transições reversíveis e âncoras ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:width<900?844:1000});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 const top=await page.locator('#curso').evaluate(e=>e.getBoundingClientRect().top+scrollY);
 const height=await page.evaluate(()=>innerHeight);
 const seek=async(y:number)=>{await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(180);};
 const state=()=>page.locator('.school').evaluate(e=>({y:new DOMMatrix(getComputedStyle(e).transform).m42,opacity:Number(getComputedStyle(document.querySelector('.school-stat')!).opacity)}));
 await seek(top-height*.95);const early=await state();
 await seek(top-height*.7);const middle=await state();
 await seek(top-height*.45);const late=await state();
 expect(early.y).toBeGreaterThan(middle.y);expect(middle.y).toBeGreaterThan(late.y);expect(late.y).toBeCloseTo(0,1);expect(early.opacity).toBeLessThan(middle.opacity);expect(late.opacity).toBe(1);
 await seek(top-height*.95);const reverse=await state();expect(reverse.y).toBeCloseTo(early.y,0);expect(reverse.opacity).toBeCloseTo(early.opacity,1);
 await seek(0);await page.getByRole('link',{name:'Conhecer o curso',exact:true}).click();await expect.poll(async()=>(await state()).y).toBe(0);await expect(page.locator('.school-stat')).toBeInViewport();
 await expect.poll(async()=>Math.abs((await page.locator('#curso').boundingBox())!.y-18)).toBeLessThan(2);
 for(const [name,id] of [['A barbearia','#barbearia'],['A escola','#curso']]){await seek(0);await page.locator('.header').getByRole('link',{name,exact:true}).click();await expect(page.locator(id)).toBeInViewport();}
 await expect(page.locator('.pin-spacer,.school-stripe')).toHaveCount(0);
});
test('Transições desligadas com movimento reduzido',async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');for(const selector of ['.school','.school-stat','.barber-main','.units-heading','.unit-grid'])expect(await page.locator(selector).evaluate(e=>getComputedStyle(e).transform)).toBe('none');await page.getByRole('link',{name:'Conhecer o curso',exact:true}).click();await expect(page.locator('.school-stat')).toBeInViewport();});
test('Grava transição mobile nos dois sentidos',async({browser})=>{
 test.skip(!process.env.RECORD_SCROLL,'Gravação opcional: requer FFmpeg e RECORD_SCROLL=1');
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,recordVideo:{dir:'artifacts/transicoes/video',size:{width:390,height:844}}});
 const page=await context.newPage();await page.goto('http://127.0.0.1:5173');await page.evaluate(()=>document.fonts.ready);await page.locator('.pole-structure').evaluate((e:HTMLImageElement)=>e.decode());await page.waitForTimeout(500);
 const top=await page.locator('#curso').evaluate(e=>e.getBoundingClientRect().top+scrollY);
 const scroll=async(from:number,to:number)=>{for(let i=0;i<=90;i++){await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),from+(to-from)*i/90);await page.waitForTimeout(33);}};
 await scroll(0,top);await page.waitForTimeout(500);await scroll(top,0);await page.waitForTimeout(500);await page.getByRole('link',{name:'Conhecer o curso',exact:true}).click();await page.waitForTimeout(1100);
 const video=page.video()!;await context.close();await video.saveAs('artifacts/transicoes/abertura-escola-390.webm');
});
