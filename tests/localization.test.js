import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STAGES,ANATOMY,MODES} from '../src/data.js';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
test('Indonesian practical and regional notes cite official sources without blanket prescriptions',()=>{
 const ui=read('src/main.jsx');
 for(const text of ['Brebes, Jawa Tengah','Enrekang, Sulawesi Selatan','25 Februari 2025','26 April 2012','28 Desember 2025','pustaka.bppsdmp.pertanian.go.id','bbpplembang.bppsdmp.pertanian.go.id','hortikultura.pertanian.go.id','bibit sehat','cuaca dan tahap pertumbuhan'])assert.ok(ui.includes(text),text);
 assert.doesNotMatch(ui,/rhs.org.uk|How to grow|species overview/);
});
test('Indonesian identity, stages, anatomy and accessible controls are localized',()=>{
 assert.match(read('index.html'),/lang="id"/);
 assert.match(read('index.html'),/<title>Atlas Bawang Merah/);
 assert.deepEqual(STAGES.map(s=>s.name),['Penanaman','Bertunas','Pembentukan anakan','Pertumbuhan daun','Pembentukan umbi','Pematangan']);
 assert.deepEqual(Object.values(ANATOMY).map(a=>a.short),['Daun','Umbi','Cakram dasar','Akar']);
 assert.deepEqual(MODES,['Tanaman utuh','Detail umbi','Irisan umbi']);
 const ui=read('src/main.jsx');
 for(const label of ['Perbesar','Perkecil','Atur ulang tampilan','Tutup dialog','Tampilkan tanah'])assert.ok(ui.includes(label),label);
 assert.match(ui,/\[soil,setSoil\]=useState\(true\)/);
 assert.match(read('src/PlantCanvas.jsx'),/Model 3D memerlukan WebGL/);
 assert.doesNotMatch(ui,/Show soil|A study in|About & sources|not growing advice|Drag to rotate|Scroll to zoom/);
});
