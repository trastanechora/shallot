import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';

test('Indonesian identity and regional guidance are visible',async({page})=>{
 await page.goto(process.env.ATLAS_URL || 'http://127.0.0.1:5173');
 await expect(page.locator('html')).toHaveAttribute('lang','id');
 await expect(page).toHaveTitle('Atlas Bawang Merah — Kisah dalam lapisan');
 await expect(page.getByRole('link',{name:'Beranda Atlas Bawang Merah'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Brebes, Jawa Tengah'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Enrekang, Sulawesi Selatan'})).toBeVisible();
 await page.getByRole('button',{name:'Tentang & sumber'}).click();
 await expect(page.getByRole('dialog')).toHaveAttribute('aria-label','Tentang Atlas Bawang Merah dan sumber');
 await expect(page.getByRole('dialog').getByRole('link')).toHaveCount(4);
 await expect(page.getByRole('dialog')).toContainText('26 April 2012');
 await page.getByRole('button',{name:'Tutup dialog'}).click();
});

test('soil-on stages, exposed anatomy and mobile have rendered evidence',async({page})=>{
 test.setTimeout(90000);mkdirSync('screenshots',{recursive:true});
 await page.setViewportSize({width:1440,height:1080});
 await page.goto(process.env.ATLAS_URL || 'http://127.0.0.1:5173');
 await expect(page.locator('canvas')).toBeVisible();
 await expect(page.getByRole('switch',{name:'Tampilkan tanah'})).toHaveAttribute('aria-checked','true');
 for(const [i,name] of ['Penanaman','Bertunas','Pembentukan anakan','Pertumbuhan daun','Pembentukan umbi','Pematangan'].entries()){
  await page.getByRole('button',{name:`${i+1} ${name}`}).click();
  await page.waitForTimeout(800);
  await page.screenshot({path:`screenshots/soil-stage-${i+1}.png`,fullPage:true});
 }
 await page.getByRole('button',{name:'5 Pembentukan umbi'}).click();
 await page.getByRole('switch',{name:'Tampilkan tanah'}).click();
 await page.getByRole('button',{name:'Irisan umbi',exact:true}).click();
 await page.waitForTimeout(800);await page.screenshot({path:'screenshots/irisan-umbi.png',fullPage:true});
 await page.getByRole('button',{name:'Tanaman utuh',exact:true}).click();
 await page.getByRole('switch',{name:'Tampilkan tanah'}).click();
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(800);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'screenshots/mobile-id.png',fullPage:true});
});
test('explorer controls, dialog and responsive layout',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.ATLAS_URL || 'http://127.0.0.1:5173');
 await expect(page.getByRole('heading',{name:'Kisah dalam lapisan.'})).toBeVisible();
 await expect(page.locator('canvas')).toBeVisible();
 await page.getByRole('button',{name:'01 Daun'}).click();
 await expect(page.getByRole('heading',{name:'Daun berongga'})).toBeVisible();
 await page.getByRole('button',{name:'1 Penanaman'}).click();
 await expect(page.getByText('Awal kehidupan di dalam umbi')).toBeVisible();
 await page.getByRole('button',{name:'Irisan umbi',exact:true}).click();
 await expect(page.getByText('Irisan memperlihatkan lapisan umbi yang berdaging.')).toBeVisible();
 await page.getByRole('switch',{name:'Tampilkan tanah'}).click();
 await expect(page.getByRole('switch',{name:'Tampilkan tanah'})).toHaveAttribute('aria-checked','false');
 await page.getByRole('button',{name:'Tentang & sumber'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.setViewportSize({width:390,height:844});
 await expect(page.getByRole('heading',{name:'Kisah dalam lapisan.'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);
});
test('all stages, anatomy, camera controls and mesh picking work',async({page})=>{
 await page.goto(process.env.ATLAS_URL || 'http://127.0.0.1:5173');await expect(page.locator('canvas')).toBeVisible();
 for(const [i,name] of ['Penanaman','Bertunas','Pembentukan anakan','Pertumbuhan daun','Pembentukan umbi','Pematangan'].entries()){
  const button=page.getByRole('button',{name:`${i+1} ${name}`});await button.click();await expect(button).toHaveAttribute('aria-pressed','true');
 }
 for(const [button,heading] of [['03 Cakram dasar','Cakram dasar'],['04 Akar','Akar serabut'],['02 Umbi','Rumpun umbi']]){
  await page.getByRole('button',{name:button,exact:true}).click();await expect(page.getByRole('heading',{name:heading,exact:true})).toBeVisible();
 }
 await page.getByRole('button',{name:'5 Pembentukan umbi'}).click();
 await page.getByRole('button',{name:'Detail umbi',exact:true}).click();
 await page.getByRole('button',{name:'01 Daun',exact:true}).click();
 const box=await page.locator('canvas').boundingBox();
 await page.mouse.click(box.x+box.width/2,box.y+box.height*.4);
 await expect(page.getByRole('heading',{name:'Rumpun umbi'})).toBeVisible();
 for(const name of ['Perbesar','Perkecil','Atur ulang tampilan'])await page.getByRole('button',{name,exact:true}).click();
 await page.getByRole('switch',{name:'Putar otomatis'}).click();await expect(page.getByRole('switch',{name:'Putar otomatis'})).toHaveAttribute('aria-checked','true');
});
test('WebGL fallback preserves educational controls',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:original.call(this,type,...args);};});
 await page.goto(process.env.ATLAS_URL || 'http://127.0.0.1:5173');await expect(page.getByText('Cara lain untuk menjelajah.')).toBeVisible();
 await page.getByRole('button',{name:'04 Akar',exact:true}).click();await expect(page.getByRole('heading',{name:'Akar serabut'})).toBeVisible();
});
test('reduced motion starts paused',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(process.env.ATLAS_URL || 'http://127.0.0.1:5173');
 await expect(page.getByRole('switch',{name:'Putar otomatis'})).toHaveAttribute('aria-checked','false');
});
