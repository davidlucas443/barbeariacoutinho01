import { test, expect } from '@playwright/test';
import { config } from '../src/config';
for(const width of [360,390])test(`Bio: acesso direto, reload e links ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:844});const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 const response=await page.goto(`${process.env.BIO_BASE_URL||'http://127.0.0.1:5173'}/bio`);expect(response?.status()).toBe(200);
 await expect(page.getByRole('heading',{name:'Barbearia Coutinho'})).toBeVisible();await expect(page.locator('.bio-since')).toHaveText('Desde 2014');
 const links=page.locator('.bio-links a');await expect(links).toHaveCount(4);
 await expect(links.nth(0)).toContainText('Consultar próximas turmas');
 for(let i=0;i<3;i++){const href=await links.nth(i).getAttribute('href');const url=new URL(href!);expect(url.origin+url.pathname).toBe(config.whatsapp);const text=i===0?config.messages.course:config.messages.unitCut.replace('{unit}',config.units[i-1].name).replace('{district}',config.units[i-1].district);expect(url.searchParams.get('text')).toBe(text);expect(href).toContain(encodeURIComponent(text));if(i>0)await expect(links.nth(i)).toContainText(`Agendar corte · ${config.units[i-1].district}`);}
 await expect(links.nth(3)).toHaveAttribute('href','/');await expect(links.nth(3)).toHaveText('Conhecer a Barbearia Coutinho→');
 await page.reload();await expect(page.locator('.bio-links a')).toHaveCount(4);await page.evaluate(()=>document.fonts.ready);await page.locator('.official-logo').evaluate((e:HTMLImageElement)=>e.decode());
 expect(requests.some(url=>/gsap|lenis|BarberPole|barber-pole|App\.tsx|assets\/main-/.test(url))).toBe(false);await expect(page.locator('.barber-pole,canvas')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);for(const link of await page.locator('.bio-links a').all()){await expect(link).toBeInViewport();expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(48);}
 await page.screenshot({path:`artifacts/bio/abertura-${width}.png`});await links.nth(3).click();await expect(page.getByRole('heading',{name:'Aqui transformamos estilos e construímos futuros.'})).toBeVisible();
});
