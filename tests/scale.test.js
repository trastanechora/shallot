import test from 'node:test';
import assert from 'node:assert/strict';
import * as scale from '../src/geometry.js';
import {STAGES,viewSettings} from '../src/data.js';
import * as THREE from 'three';

test('all ruler ticks fit reset whole views including close anakan view on mobile',()=>{
 const calibration=scale.illustrationScale(30);
 for(const stage of STAGES){
  const view=viewSettings('Tanaman utuh',stage.id,true);
  const camera=new THREE.PerspectiveCamera(42,358/440,.1,100);
  camera.position.set(.3,view.target[1]+.75,view.distance);camera.lookAt(...view.target);camera.updateMatrixWorld();
  for(const tick of scale.rulerTicks(calibration)){
   const p=new THREE.Vector3(-2.83,tick.y,0).project(camera);
   assert.ok(Math.abs(p.y)<.94&&Math.abs(p.x)<.94,stage.id+' '+tick.cm+' cm must fit mobile');
  }
 }
});
import {readFileSync} from 'node:fs';

test('ruler lines and labels are translucent and offset from the bulb',()=>{
 const source=readFileSync(new URL('../src/WorldRuler.jsx',import.meta.url),'utf8');
 assert.match(source,/scale=\{\[\.75,\.255,1\]\}/);
 assert.match(source,/opacity=\{\.55\}/);
 assert.match(source,/opacity=\{\.7\}/);
 assert.match(source,/position=\{\[-2\.33,y,0\]\}/);
 assert.match(source,/const p=\[-1\.8,/);
});

test('calibration is disclosed with Indonesian range sources and schematic root caveat',()=>{
 const source=readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
 assert.match(source,/30 cm/);
 assert.match(source,/15–50 cm/);
 assert.match(source,/15–20 cm/);
 assert.match(source,/16540\/7\/7\.%20BAB%20II_2018242PTN\.pdf/);
 assert.match(source,/bukan kedalaman akar terukur/);
});

test('transparent soil preserves depth testing and ruler is restricted to unscaled whole views',()=>{
 const source=readFileSync(new URL('../src/PlantCanvas.jsx',import.meta.url),'utf8');
 assert.match(source,/transparent opacity=\{\.22\} depthWrite=\{false\}/,'soil must reveal roots without writing an opaque depth mask');
 assert.equal(typeof scale.rulerVisible,'function');
 for(const mode of ['Tanaman utuh','Detail umbi','Irisan umbi'])for(const preparation of [false,true])for(const requested of [false,true])assert.equal(scale.rulerVisible(mode,preparation,requested),mode==='Tanaman utuh'&&!preparation&&requested);
 assert.match(source,/<WorldRuler/,'world geometry mounted outside scaled specimen groups');
 const soil=source.match(/position=\{\[0,([\d.-]+),0\]\}><cylinderGeometry args=\{\[2,2,([\d.]+),64\]/);
 assert.ok(soil);assert.ok(Math.abs(Number(soil[1])+Number(soil[2])/2-scale.SOIL_SURFACE_Y)<1e-12);
 assert.match(source,/<mesh renderOrder=\{1\} position=\{\[0,-\.635,0\]/);
});

test('illustrative calibration uses actual mature world geometry and preserves soil zero',()=>{
 assert.equal(typeof scale.illustrationScale,'function','missing calibrated illustration scale');
 const reference=scale.plantWorldBounds(STAGES.find(s=>s.id==='bulbing'));
 const calibration=scale.illustrationScale(30);
 assert.ok(Math.abs((reference.maxY-scale.SOIL_SURFACE_Y)*calibration.cmPerWorldUnit-30)<1e-9);
 assert.equal(calibration.worldY(0),scale.SOIL_SURFACE_Y);
 for(const cm of [-20,-5,0,5,30,40])assert.ok(Math.abs(calibration.centimeters(calibration.worldY(cm))-cm)<1e-9);
 for(const stage of STAGES)for(const progress of [0,.05,.21,.41,.61,.65,1]){
  const bounds=scale.plantWorldBounds(stage,progress);
  assert.ok(bounds.minY<scale.SOIL_SURFACE_Y);
  assert.ok(bounds.maxY>scale.SOIL_SURFACE_Y);
  const ticks=scale.rulerTicks(calibration);
  assert.ok(ticks[0].y<=bounds.minY&&ticks.at(-1).y>=bounds.maxY,stage.id+' complete range');
  for(let i=1;i<ticks.length;i++)assert.ok(Math.abs((ticks[i].y-ticks[i-1].y)*calibration.cmPerWorldUnit-5)<1e-9);
 }
});
