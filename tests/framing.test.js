import test from 'node:test';
import assert from 'node:assert/strict';
import { viewSettings } from '../src/data.js';
test('whole specimen framing reserves room for leaf tips and roots',()=>{
 const view=viewSettings('Tanaman utuh');
 assert.ok(view.distance>=10.5);
 assert.equal(view.target[1],1.6);
 const forming=viewSettings('Tanaman utuh','tillering');
 assert.ok(forming.distance<view.distance,'new lateral shoots need a closer educational view');
 assert.ok(forming.distance>=7,'retain room for soil volume');
 assert.ok(forming.target[1]<1);
});
