import test from 'node:test';
import assert from 'node:assert/strict';
import {bulbGeometry,rootCurve} from '../src/geometry.js';
import {viewSettings} from '../src/data.js';
import * as THREE from 'three';

test('preparation close-up frames the complete seed and root tips',()=>{
 const v=viewSettings('Persiapan bibit');
 assert.ok(v.distance<7,'dedicated close preparation framing');
 assert.ok(v.elevation>2,'see the transverse cut surface');
 for(const aspect of [883/486,358/455]){
  const camera=new THREE.PerspectiveCamera(42,aspect,.1,100);
  camera.position.set(.3,v.target[1]+v.elevation,v.distance);camera.lookAt(...v.target);camera.updateMatrixWorld();
  const points=[new THREE.Vector3(0,1.58*1.65,0)];
  for(let i=0;i<13;i++)for(const branch of [false,true])for(let t=0;t<=1;t+=.1){const p=rootCurve(i,branch).getPoint(t);p.y*=.35;points.push(p.multiplyScalar(1.65).applyAxisAngle(new THREE.Vector3(0,1,0),-.25));}
  for(const p of points){p.project(camera);assert.ok(Math.abs(p.y)<.90&&Math.abs(p.x)<.90,'roots and neck fit inside viewport with margin');}
 }
});

test('seed top cut removes upper third without removing lower bulb or opening a side sector',()=>{
 const whole=bulbGeometry(false),cut=bulbGeometry(false,true);
 whole.computeBoundingBox();cut.computeBoundingBox();
 assert.ok(Math.abs(cut.boundingBox.max.y-whole.boundingBox.max.y*2/3)<.001,'upper third is physically absent');
 assert.equal(cut.boundingBox.min.y,whole.boundingBox.min.y,'base is preserved');
 assert.equal(cut.parameters.phiLength,Math.PI*2,'not the anatomical side cutaway');
 const lower=g=>{const p=g.attributes.position;return Array.from({length:p.count},(_,i)=>[p.getX(i),p.getY(i),p.getZ(i)]).filter(v=>v[1]<=1).map(v=>v.join(',')).sort();};
 assert.deepEqual(lower(cut),lower(whole),'all lower vertices remain identical');
 whole.dispose();cut.dispose();
});
