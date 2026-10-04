import test from 'node:test';
import assert from 'node:assert/strict';
import { viewSettings, motionEnabled } from '../src/data.js';
test('view modes change visible geometry and reduced motion wins',()=>{
 assert.equal(viewSettings('Tanaman utuh').leaves,true);
 assert.equal(viewSettings('Detail umbi').leaves,false);
 assert.equal(viewSettings('Irisan umbi').cutaway,true);
 assert.equal(motionEnabled(true,true),false);
 assert.equal(motionEnabled(true,false),true);
});
test('procedural bulb and hollow leaf geometry have finite vertices and cutaway removes a sector',async()=>{
 const {bulbGeometry,leafGeometry}=await import('../src/geometry.js');
 const whole=bulbGeometry(false),cut=bulbGeometry(true),leaf=leafGeometry(2,0.7,0.4);
 for(const g of [whole,cut,leaf]){assert.ok(g.attributes.position.count>100);assert.ok([...g.attributes.position.array].every(Number.isFinite));assert.ok(g.attributes.normal);}
 assert.ok(whole.parameters.phiLength>cut.parameters.phiLength);
 assert.ok(whole.attributes.color);
});
