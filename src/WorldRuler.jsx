import React,{useMemo,useEffect} from 'react';
import {Html} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {illustrationScale,rulerTicks,SOIL_SURFACE_Y} from './geometry.js';
// Explicit illustration reference; see the visible calibration note.
export const CALIBRATION=illustrationScale(30);
function Label({text,position}){
 const texture=useMemo(()=>{
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=80;
  const c=canvas.getContext('2d');c.clearRect(0,0,256,80);
  c.fillStyle='#414b39';c.font='52px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(text,128,40);
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;
 },[text]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <sprite position={position} scale={[.75,.255,1]} renderOrder={3}><spriteMaterial map={texture} transparent opacity={.7} depthWrite={false} depthTest toneMapped={false}/></sprite>;
}
export default function WorldRuler(){
 const ticks=useMemo(()=>rulerTicks(CALIBRATION),[]);
 const {gl}=useThree();const portal=useMemo(()=>({current:gl.domElement.parentElement}),[gl]);
 const positions=useMemo(()=>{
  const p=[-1.8,ticks[0].y,0,-1.8,ticks.at(-1).y,0];
  for(const tick of ticks)p.push(-1.8,tick.y,0,-1.6,tick.y,0);
  // A datum reaches the specimen even with the soil hidden.
  p.push(-1.8,SOIL_SURFACE_Y,0,0,SOIL_SURFACE_Y,0);
  return new Float32Array(p);
 },[ticks]);
 return <group name="world-centimeter-ruler">
  <lineSegments renderOrder={2}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><lineBasicMaterial color="#58654e" transparent opacity={.55} depthWrite={false}/></lineSegments>
  {ticks.map(({cm,y})=><Label key={cm} text={`${cm>0?'+':''}${cm} cm`} position={[-2.33,y,0]}/>)}
  <Html portal={portal} position={[-1.8,SOIL_SURFACE_Y,0]} style={{pointerEvents:'none'}}><span className="sr-only" data-ruler-origin={SOIL_SURFACE_Y} data-cm-reference={CALIBRATION.referenceHeightCm}>Penggaris ruang 3D, nol di permukaan tanah</span></Html>
 </group>;
}
