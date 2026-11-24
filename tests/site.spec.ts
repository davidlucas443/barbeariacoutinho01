import { test, expect } from '@playwright/test';
for(const width of [360,390,1440])test(`Layout e navegação ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:width<600?844:1000});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/'); await page.evaluate(()=>document.fonts.ready);
 await expect(page.getByRole('heading',{name:'Aqui transformamos estilos e construímos futuros.'})).toBeVisible();
 await expect(page.locator('.school-stripe')).toHaveCount(0); await expect(page.locator('.hero .pole-structure')).toBeVisible();
 await expect(page.getByRole('link',{name:'Conhecer o curso',exact:true})).toBeInViewport();
 await expect(page.locator('.hero').getByRole('link',{name:'Agendar corte',exact:true})).toBeInViewport();
 await expect(page.locator('canvas,.pin-spacer')).toHaveCount(0);
 await expect(page.locator('.haircut-gallery')).toHaveCount(0);
 await page.locator('.pole-structure').evaluate((e:HTMLImageElement)=>e.decode());
 await expect(page.locator('.hero-stripe')).toHaveCount(0);
 if(width===390)await page.waitForTimeout(700);
 if(width===1440)await page.screenshot({path:'artifacts/pole-sem-suporte/desktop.png'});
 if(width===390)await page.screenshot({path:'artifacts/pole-sem-suporte/abertura-390.png'});
 await page.getByRole('link',{name:'Conhecer o curso',exact:true}).click();await expect(page.locator('#curso')).toBeInViewport();
 await page.waitForTimeout(700);
 await expect.poll(async()=>Number(await page.locator('.school-stat').evaluate(e=>getComputedStyle(e).opacity))).toBeGreaterThan(.95);
 if(width===390)await page.locator('#curso').screenshot({path:'artifacts/pole-sem-suporte/curso-390.png'});
 const course=await page.getByRole('link',{name:'Consultar próximas turmas'}).getAttribute('href');
 const cut=await page.getByRole('link',{name:'Agendar meu corte'}).getAttribute('href');
 expect(course).toContain('https://wa.me/5511948716883?text=');expect(decodeURIComponent(course!)).toContain('curso de barbeiro');expect(decodeURIComponent(cut!)).toContain('agendar um corte');expect(course).not.toBe(cut);
 await expect(page.getByRole('heading',{name:'Recanto Campo Belo'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Nora Ney – Socorro'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Ver rota'})).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 if(width<600){const logo=await page.locator('.header .compact-logo').boundingBox();expect(logo!.width).toBeGreaterThanOrEqual(28);expect(logo!.width).toBeLessThanOrEqual(32);await expect(page.locator('.header')).toContainText('Desde 2014');}
 await page.locator('#unidades').screenshot({path:`artifacts/pole-sem-suporte/unidades-${width}.png`}); await page.screenshot({path:`artifacts/pole-sem-suporte/pagina-${width}.png`,fullPage:true});expect(errors).toEqual([]);
});
test('Movimento reduzido e cena estática',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.locator('.school-stripe')).toHaveCount(0);
 expect(await page.locator('.pole-stripes').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
 await page.getByRole('link',{name:'Conhecer o curso',exact:true}).click();
 await expect(page.locator('#curso')).toBeInViewport();
 expect(await page.locator('.school-stat').evaluate(e=>getComputedStyle(e).opacity)).toBe('1');
 await expect(page.locator('.pin-spacer')).toHaveCount(0);
});
test('Scroll vertical natural sobre o cartaz',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await context.newPage();await page.goto('http://127.0.0.1:5173');
 await page.locator('.hero-visual').scrollIntoViewIfNeeded();
 const box=await page.locator('.hero-visual').boundingBox();const x=box!.x+box!.width/2,y=box!.y+box!.height*.75;
 const before=await page.evaluate(()=>scrollY);const cdp=await context.newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-i*20}]});await page.waitForTimeout(20);}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before+60);
 await context.close();
});
// The production gallery is intentionally hidden. Synthetic SVG fixtures exercise its future controls.
test('Vitrine opcional: três imagens, controles e deslize',async({page})=>{
 const fixture='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="tan"/></svg>');
 await page.route('**/src/config.ts*',async route=>{const response=await route.fetch();let body=await response.text();body=body.replace(/haircut:\s*\{[^}]*\}/,`haircut: { front: ${JSON.stringify(fixture)}, profile: ${JSON.stringify(fixture)}, back: ${JSON.stringify(fixture)} }`);await route.fulfill({response,body});});
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('.haircut-gallery')).toBeVisible();
 for(const label of ['Frente','Perfil','Nuca']){await page.getByRole('button',{name:label,exact:true}).click();await expect(page.getByRole('button',{name:label,exact:true})).toHaveAttribute('aria-pressed','true');}
 await page.getByRole('button',{name:'Frente',exact:true}).click();
 const box=await page.locator('.haircut-image').boundingBox();const x=box!.x+box!.width*.7,y=box!.y+box!.height*.5;
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-100,y,{steps:8});await page.mouse.up();
 await expect(page.getByRole('button',{name:'Perfil',exact:true})).toHaveAttribute('aria-pressed','true');
 expect(await page.locator('.haircut-image').evaluate(e=>getComputedStyle(e).touchAction)).toBe('pan-y');
});

for(const width of [360,390])test('Barber pole contínuo e contido '+width,async({page})=>{await page.setViewportSize({width,height:844});await page.goto('/');const pole=page.locator('.barber-pole');await expect(pole).toHaveAttribute('aria-hidden','true');const box=await pole.boundingBox();expect(box!.height).toBeGreaterThan(200);await expect(page.locator('.header .barber-pole')).toHaveCount(0);const button=await page.getByRole('link',{name:'Conhecer o curso',exact:true}).boundingBox();const heading=await page.locator('.hero-heading').boundingBox();expect(box!.x).toBeGreaterThanOrEqual(heading!.x+heading!.width);expect(box!.y+box!.height).toBeLessThanOrEqual(button!.y);expect(button!.y+button!.height).toBeLessThan(844);expect(box!.y).toBeGreaterThan(0);expect(await page.locator('.header').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);const result=await page.locator('.pole-stripes').evaluate(e=>{const animation=e.getAnimations()[0];animation.pause();animation.currentTime=0;const first=getComputedStyle(e).transform;animation.currentTime=1000;const middle=new DOMMatrix(getComputedStyle(e).transform).m42;animation.currentTime=2000;return {first,last:getComputedStyle(e).transform,middle,duration:getComputedStyle(e).animationDuration,timing:getComputedStyle(e).animationTimingFunction,overflow:getComputedStyle(e.parentElement!).overflow};});expect(result.first).toBe(result.last);expect(result.middle).toBeCloseTo(45);expect(result.duration).toBe('2s');expect(result.timing).toBe('linear');expect(result.overflow).toBe('hidden');expect(await pole.boundingBox()).toEqual(box);});
