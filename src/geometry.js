import * as THREE from 'three';
import {stageModel,shootModels} from './data.js';
export const SOIL_SURFACE_Y=.38;
// Bounds use the same generated vertices and nested transforms as the renderer.
export function plantWorldBounds(stage,progress=.65) {
 let minY=Infinity,maxY=-Infinity;
 for(const shoot of shootModels(stage,progress).filter(s=>s.visible)){
  const placement=bulbPlacement(shoot,false,shoot.index),rotation=new THREE.Euler(...placement.rotation);
  const include=(geometry,local=p=>p)=>{
   const positions=geometry.attributes.position;
   for(let i=0;i<positions.count;i++){
    const p=local(new THREE.Vector3().fromBufferAttribute(positions,i)).multiplyScalar(placement.scale).applyEuler(rotation).add(new THREE.Vector3(...placement.position));
    minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);
   }
   geometry.dispose();
  };
  include(bulbGeometry());
  for(let i=0;i<13;i++)for(const branch of [false,true])include(new THREE.TubeGeometry(rootCurve(i+shoot.index*2,branch),branch?8:16,branch?.0035:.008,branch?3:4,false),p=>{p.y*=shoot.roots;return p;});
  if(shoot.leafLength>0)for(let i=0;i<shoot.leafCount;i++)include(leafGeometry(shoot.leafLength*(.66+((i*7+shoot.index*3)%9)/28),shoot.stageId==='maturity'?1.4+i*.23:.36+i*.19,i*2.4+shoot.index),p=>{p.add(new THREE.Vector3((i%2)*.07-.03,i*.025,Math.sin(i)*.065));p.y=p.y/placement.scale+1.4;return p;});
 }
 return {minY,maxY};
}
// One reference, never recalibrated per stage, zoom, soil visibility or orbit.
export function illustrationScale(referenceHeightCm) {
 const reference=plantWorldBounds(stageModel('bulbing'));
 const cmPerWorldUnit=referenceHeightCm/(reference.maxY-SOIL_SURFACE_Y);
 return {referenceHeightCm,cmPerWorldUnit,worldY:cm=>SOIL_SURFACE_Y+cm/cmPerWorldUnit,centimeters:y=>(y-SOIL_SURFACE_Y)*cmPerWorldUnit};
}
export function rulerVisible(mode,preparation,requested){return mode==='Tanaman utuh'&&!preparation&&requested;}
export function rulerTicks(calibration){
 return Array.from({length:11},(_,i)=>{const cm=-15+i*5;return {cm,y:calibration.worldY(cm)};});
}
// Planting depth follows the bulb tip, while later bulbs emerge above the soil.
export function bulbPlacement(stage,detail,index) {
 const id=stage.stageId||stage.id;
 const a=index*2.4,s=detail?1.25:stage.bulbScale,radius=index===0?0:.54;
 const depth=id==='planting'?1.58:id==='sprouting'?1.25:id==='tillering'?(index===0?1.25-.4*(stage.progress??.65):.9):id==='vegetative'?.85:0;
 const y=depth?.38-depth*s+(id==='planting'?.01:0):0;
 return {position:detail?[0,y,0]:[Math.cos(a)*radius,y,Math.sin(a)*radius],rotation:[detail?0:Math.cos(a)*.12,detail?-.15:a,detail?0:-Math.sin(a)*.17],scale:s};
}
// A transverse preparation cut, distinct from the anatomical side-sector view.
export const SEED_CUT_HEIGHT=1.58*2/3;
export const SEED_CUT_RADIUS=.33+(.22-.33)*(SEED_CUT_HEIGHT-1)/.21;
export function bulbGeometry(cutaway=false,topCut=false) {
 const profile = [[.06,0],[.23,.05],[.38,.16],[.49,.35],[.51,.55],[.45,.78],[.33,1],[.22,1.21],[.14,1.42],[.12,1.58]];
 const points = (topCut?[...profile.filter(p=>p[1]<SEED_CUT_HEIGHT),[SEED_CUT_RADIUS,SEED_CUT_HEIGHT]]:profile).map(p=>new THREE.Vector2(...p));
 const sector=cutaway&&!topCut;
 const g=new THREE.LatheGeometry(points,64,sector?Math.PI/2:0,sector?Math.PI*1.5:Math.PI*2);
 const colors=[]; const p=g.attributes.position; const c=new THREE.Color();
 for(let i=0;i<p.count;i++){
  const a=Math.atan2(p.getX(i),p.getZ(i)); const y=p.getY(i);
  const stripe=Math.pow((Math.sin(a*37+Math.sin(y*3)*.3)+1)/2,8);
  c.set('#996079').lerp(new THREE.Color('#dfbda7'),Math.min(.7,stripe*.38+Math.max(0,y-0.8)*.43));
  c.multiplyScalar(.92+Math.sin(a*11)*.09); colors.push(c.r,c.g,c.b);
 }
 g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3)); return g;
}
export function leafGeometry(length=3,bend=.7,angle=0) {
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(),new THREE.Vector3(Math.cos(angle)*bend*.2,length*.35,Math.sin(angle)*bend*.2),new THREE.Vector3(Math.cos(angle)*bend*.6,length*.75,Math.sin(angle)*bend*.6),new THREE.Vector3(Math.cos(angle)*bend,length,Math.sin(angle)*bend)]);
 const frames=curve.computeFrenetFrames(36,false), vertices=[],indices=[];
 // Open tip and an inner wall make a genuinely hollow, tapered leaf.
 for(let wall=0;wall<2;wall++)for(let i=0;i<=36;i++){
  const t=i/36,p=curve.getPointAt(t),r=(.083*Math.pow(1-t,.58)+.007)*(wall?.69:1);
  for(let j=0;j<=10;j++){const a=j/10*Math.PI*2;const v=p.clone().addScaledVector(frames.normals[i],Math.cos(a)*r).addScaledVector(frames.binormals[i],Math.sin(a)*r);vertices.push(v.x,v.y,v.z);}
 }
 for(let w=0;w<2;w++)for(let i=0;i<36;i++)for(let j=0;j<10;j++){const a=w*37*11+i*11+j,b=a+11;indices.push(...(w?[a,a+1,b,a+1,b+1,b]:[a,b,a+1,a+1,b,b+1]));}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function rootCurve(seed,branch=false) {
 const a=seed*2.39996,r=.16+(seed%4)*.07;
 const v=(radius,y,offset=0)=>new THREE.Vector3(Math.cos(a+offset)*radius,y,Math.sin(a+offset)*radius);
 return new THREE.CatmullRomCurve3(branch?[v(r*1.9,-.36),v(r*2.8,-.53,.22),v(r*3.2,-.71,.4)]:[v(r*.3,.03),v(r,-.25,.1),v(r*2,-.56,-.14),v(r*2.6,-.88-(seed%3)*.12,.23)]);
}
