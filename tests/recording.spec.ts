import { test, expect } from '@playwright/test';
test('Grava dois ciclos do cilindro',async({browser})=>{
 test.skip(!process.env.RECORD_POLE,'Gravação opcional: requer FFmpeg do Playwright e RECORD_POLE=1');
 const context=await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:'artifacts/pole-realista/video',size:{width:1440,height:1000}}});
 const page=await context.newPage();await page.goto('http://127.0.0.1:5173');await page.evaluate(()=>document.fonts.ready);await page.locator('.pole-structure').evaluate((e:HTMLImageElement)=>e.decode());
 await page.locator('.pole-stripes').evaluate(e=>{const a=e.getAnimations()[0];a.currentTime=0;});
 await page.waitForTimeout(4100);
 await expect(page.locator('.hero-heading')).toHaveCSS('padding-left','0px');
 const video=page.video()!;await context.close();await video.saveAs('artifacts/pole-realista/dois-ciclos.webm');
});
