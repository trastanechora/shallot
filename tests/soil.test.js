import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as THREE from 'three';
import {STAGES,shootModels} from '../src/data.js';
import {bulbGeometry,rootCurve,bulbPlacement} from '../src/geometry.js';

test('rendered soil intersects every bulb and buries basal plates and root origins at every stage',()=>{
 const source=readFileSync(new URL('../src/PlantCanvas.jsx',import.meta.url),'utf8');
 const soil=source.match(/soil&&!preparation&&<mesh renderOrder=\{1\} position=\{\[0,([\d.-]+),0\]\}><cylinderGeometry args=\{\[2,2,([\d.]+),64\]/);
 assert.ok(soil,'read the actual rendered soil cylinder');
 const top=Number(soil[1])+Number(soil[2])/2;
 assert.match(source,/<group \{\.\.\.placement\}>/);
 assert.match(source,/placement=preparation\?[^;]+:bulbPlacement\(stage,single,index\)/);
 const bulb=bulbGeometry();
 assert.match(source,/shootModels\(stage,progress\)/,'scene renders individual shoot development');
 for(const base of STAGES) for(const progress of [0,.05,.21,.41,.61,.65,1]) for(const detail of [false,true]) for(const stage of shootModels(base,progress).filter(s=>s.visible&&(!detail||s.index===0))){
  const index=stage.index;
  const placement=bulbPlacement(stage,detail,index);
  const rotation=new THREE.Euler(...placement.rotation);
  const transform=p=>p.multiplyScalar(placement.scale).applyEuler(rotation).add(new THREE.Vector3(...placement.position));
  const ys=Array.from({length:bulb.attributes.position.count},(_,i)=>transform(new THREE.Vector3().fromBufferAttribute(bulb.attributes.position,i)).y);
  const label=`${stage.id}, detail=${detail}, bulb=${index}, soilTop=${top}`;
  assert.ok(Math.min(...ys)<top && Math.max(...ys)>top,`soil must intersect bulb: ${label}`);
  if(stage.stageId==='planting')assert.ok(Math.abs(Math.max(...ys)-top)<.04,`planted bulb tip must meet soil surface: ${label}`);
  for(let n=0;n<32;n++){
   const angle=n/32*Math.PI*2;
   const plateTop=transform(new THREE.Vector3(Math.cos(angle)*.235,.095,Math.sin(angle)*.235));
   assert.ok(plateTop.y<top,`entire basal plate must be underground: ${label}`);
  }
  for(let n=0;n<13;n++){
   const origin=rootCurve(n+index*2).getPoint(0);origin.y*=stage.roots;
   assert.ok(transform(origin).y+.01*placement.scale<top,`root origin must be underground: ${label}`);
  }
 }
 bulb.dispose();
});
