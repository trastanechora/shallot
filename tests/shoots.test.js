import test from 'node:test';
import assert from 'node:assert/strict';
import * as data from '../src/data.js';
import {bulbPlacement} from '../src/geometry.js';

test('lateral shoots emerge gradually with persistent identities before their bases swell',()=>{
 assert.equal(typeof data.shootModels,'function','model needs individual daughter-shoot development, not equal bulb copies');
 const model=(id,p)=>data.shootModels(data.stageModel(id),p);
 const start=model('tillering',0),end=model('tillering',1);
 assert.equal(start.filter(s=>s.visible).length,1);
 assert.equal(end.filter(s=>s.visible).length,5);
 assert.equal(start[0].id,'utama');
 assert.deepEqual(start.map(s=>s.id),end.map(s=>s.id));
 for(let i=1;i<5;i++){
  assert.equal(end[i].role,'anakan');
  assert.ok(end[i].bulbScale<end[0].bulbScale*.5);
  assert.ok(end[i].leafLength<end[0].leafLength);
  const vegetative=model('vegetative')[i],bulbing=model('bulbing')[i];
  assert.ok(vegetative.bulbScale>=end[i].bulbScale);
  assert.ok(bulbing.bulbScale>vegetative.bulbScale*2);
  for(const id of ['tillering','vegetative','bulbing','maturity']){
   const s=model(id,1)[i];assert.equal(s.id,end[i].id);
   const pos=bulbPlacement(s,false,i).position;
   const original=bulbPlacement(end[i],false,i).position;
   assert.equal(pos[0],original[0]);assert.equal(pos[2],original[2]);
   assert.ok(Math.hypot(pos[0],pos[2])<=.56,'anakan stays clustered beside mother');
  }
 }
 for(let step=1;step<=100;step++){
  const prev=model('tillering',(step-1)/100),next=model('tillering',step/100);
  for(let i=1;i<5;i++){
   assert.ok(next[i].bulbScale>=prev[i].bulbScale);
   assert.ok(next[i].bulbScale-prev[i].bulbScale<.015,'no sudden full bulb');
   assert.ok(next[i].leafLength-prev[i].leafLength<.08);
  }
 }
});
