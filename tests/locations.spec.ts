import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
const units=[
 {name:'Unidade I',district:'Recanto Campo Belo',address:'Endereço sintético I',hours:'',coordinates:{latitude:-23.792,longitude:-46.7327},locationConfirmed:true,googleMapsUrl:'',googlePlaceId:'fixture-place-i',confirmationSource:'Fixture de teste, não é endereço real',approximateArea:''},
 {name:'Unidade II',district:'Nora Ney – Socorro',address:'Endereço sintético II',hours:'',coordinates:{latitude:-23.668,longitude:-46.723},locationConfirmed:true,googleMapsUrl:'',googlePlaceId:'fixture-place-ii',confirmationSource:'Fixture de teste, não é endereço real',approximateArea:''},
];
async function confirmed(page:Page){await page.route('**/src/config.ts*',async route=>{const response=await route.fetch();const body=(await response.text()).replace(/units:\s*\[[\s\S]*?\]/,`units: ${JSON.stringify(units)}`);await route.fulfill({response,body});});}
test('Destinos provisórios: região, WhatsApp e nenhuma solicitação de localização',async({page})=>{
 await page.addInitScript(()=>{navigator.geolocation.getCurrentPosition=()=>{throw new Error('Localização não pode ser pedida');};});
 await page.goto('/');await expect(page.getByRole('button',{name:'Ver unidade mais próxima'})).toHaveCount(0);
 await expect(page.getByRole('link',{name:'Traçar rota'})).toHaveCount(0);
 const cards=page.locator('.unit-card');await expect(cards).toHaveCount(2);
 for(let i=0;i<2;i++){
  const card=cards.nth(i);await expect(card).toContainText('Endereço da unidade ainda não confirmado');
  const region=new URL((await card.getByRole('link',{name:'Ver região no mapa'}).getAttribute('href'))!);
  expect(region.hostname).toBe('www.google.com');expect(region.searchParams.get('api')).toBe('1');expect(region.searchParams.get('query')).toContain(i===0?'Recanto Campo Belo':'Rua Nora Ney');
  const wa=decodeURIComponent((await card.getByRole('link',{name:'Agendar corte'}).getAttribute('href'))!);expect(wa).toContain('Gostaria de agendar um corte na');expect(wa).toContain(i===0?'Unidade I — Recanto':'Unidade II — Nora');
 }
});
test('Geolocalização concedida: calcula somente após toque e aponta cada unidade',async({page,context})=>{
 await confirmed(page);await context.grantPermissions(['geolocation']);await context.setGeolocation({latitude:-23.792,longitude:-46.7327});
 await page.goto('/');await expect(page.locator('.is-nearest')).toHaveCount(0);
 await page.getByRole('button',{name:'Ver unidade mais próxima'}).click();await expect(page.locator('.is-nearest')).toContainText('Recanto Campo Belo');
 await expect(page.getByRole('status')).toContainText('linha reta');
 await context.setGeolocation({latitude:-23.668,longitude:-46.723});await page.getByRole('button',{name:'Ver unidade mais próxima'}).click();await expect(page.locator('.is-nearest')).toContainText('Nora Ney');
 const links=page.getByRole('link',{name:'Traçar rota'});for(let i=0;i<2;i++){const url=new URL((await links.nth(i).getAttribute('href'))!);expect(url.origin+url.pathname).toBe('https://www.google.com/maps/dir/');expect(url.searchParams.get('api')).toBe('1');expect(url.searchParams.get('destination_place_id')).toBe(units[i].googlePlaceId);expect(url.searchParams.get('destination')).toBe(`${units[i].coordinates.latitude},${units[i].coordinates.longitude}`);expect(url.searchParams.has('origin')).toBe(false);}
});
test('Geolocalização negada: mantém escolha manual',async({page})=>{
 await confirmed(page);await page.addInitScript(()=>{navigator.geolocation.getCurrentPosition=(_ok,fail)=>fail?.({code:1,message:'denied',PERMISSION_DENIED:1,POSITION_UNAVAILABLE:2,TIMEOUT:3});});
 await page.goto('/');await page.getByRole('button',{name:'Ver unidade mais próxima'}).click();await expect(page.getByRole('status')).toContainText('Permissão de localização negada');await expect(page.getByRole('link',{name:'Traçar rota'})).toHaveCount(2);await expect(page.locator('.is-nearest')).toHaveCount(0);
});
test('Localização indisponível: informa e mantém cards',async({page})=>{
 await confirmed(page);await page.addInitScript(()=>{navigator.geolocation.getCurrentPosition=(_ok,fail)=>fail?.({code:2,message:'unavailable',PERMISSION_DENIED:1,POSITION_UNAVAILABLE:2,TIMEOUT:3});});
 await page.goto('/');await page.getByRole('button',{name:'Ver unidade mais próxima'}).click();await expect(page.getByRole('status')).toContainText('Não foi possível');await expect(page.locator('.unit-card')).toHaveCount(2);
});
