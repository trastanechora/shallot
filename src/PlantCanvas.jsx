import React,{useMemo,useRef,useEffect,Component} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {OrbitControls,Html} from '@react-three/drei';
import * as THREE from 'three';
import {bulbGeometry,leafGeometry,rootCurve,bulbPlacement,SEED_CUT_HEIGHT,SEED_CUT_RADIUS} from './geometry';
import {stageModel,viewSettings,shootModels} from './data';
import {rulerVisible} from './geometry.js';
import WorldRuler from './WorldRuler';

class SceneBoundary extends Component {
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<Fallback/>:this.props.children;}
}
function Fallback(){return <div className="fallback"><span className="fallback-symbol">◌</span><h3>Cara lain untuk menjelajah.</h3><p>Model 3D memerlukan WebGL. Anda tetap dapat menjelajahi setiap tahap pertumbuhan dan catatan bagian tanaman melalui tombol yang tersedia.</p></div>;}
function Leaf({length,bend,angle,color,onClick,selected}){
 const geometry=useMemo(()=>leafGeometry(length,bend,angle),[length,bend,angle]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} onClick={onClick}><meshStandardMaterial color={color} roughness={.64} side={THREE.DoubleSide} emissive={selected?'#35452b':'#000000'} emissiveIntensity={.18}/></mesh>;
}
function Bulb({index,stage,mode,selected,onSelect,preparation=false,topCut=false}){
 const settings=viewSettings(mode), single=mode!=='Tanaman utuh';
 const {gl}=useThree();
 // Keep label roots on one DOM target while R3F connects pointer events.
 const labelPortal=useMemo(()=>({current:gl.domElement.parentElement}),[gl]);
 const g=useMemo(()=>bulbGeometry(settings.cutaway,topCut),[settings.cutaway,topCut]);
 const roots=useMemo(()=>Array.from({length:13},(_,i)=>[new THREE.TubeGeometry(rootCurve(i+index*2),16,.008,4,false),new THREE.TubeGeometry(rootCurve(i+index*2,true),8,.0035,3,false)]),[index]);
 useEffect(()=>()=>{g.dispose();},[g]);useEffect(()=>()=>roots.flat().forEach(g=>g.dispose()),[roots]);
 const placement=preparation?{position:[0,0,0],rotation:[0,0,0],scale:1.65}:bulbPlacement(stage,single,index);
 const select=part=>e=>{e.stopPropagation();onSelect(part);};
 const s=single?1.25:stage.bulbScale;
 return <group {...placement}>
  {stage.stageId==='tillering'&&!single&&index<2&&<Html portal={labelPortal} position={[index===0?0:-.8,1.65+stage.leafLength/s,0]} center style={{pointerEvents:'none'}}><span className={`shoot-label ${index?'daughter':''}`}>{index?'Anakan':'Tunas utama'}</span></Html>}
  <mesh geometry={g} onClick={select('bulb')}><meshStandardMaterial vertexColors roughness={.53} side={THREE.DoubleSide} emissive={selected==='bulb'?'#602a43':'#000'} emissiveIntensity={.08}/></mesh>
  {topCut&&<group position={[0,SEED_CUT_HEIGHT,0]} rotation={[-Math.PI/2,0,0]}>{Array.from({length:9},(_,i)=><mesh key={i} position={[0,0,i*.0002]} onClick={select('bulb')}><ringGeometry args={[i===8?0:SEED_CUT_RADIUS*(1-(i+1)/9),SEED_CUT_RADIUS*(1-i/9),96]}/><meshStandardMaterial color={i%2?'#e1aabd':'#f6e2d6'} roughness={.58} side={THREE.DoubleSide}/></mesh>)}</group>}
  {settings.cutaway&&!topCut&&<group>{[.87,.7,.53,.36,.19].map((s,i)=><mesh key={s} geometry={g} scale={[s,.99,s]} onClick={select('bulb')}><meshStandardMaterial color={i%2?'#d3a1b0':'#f3dfd5'} side={THREE.DoubleSide} roughness={.7}/></mesh>)}</group>}
  <mesh position={[0,.045,0]} onClick={select('plate')}><cylinderGeometry args={[.235,.18,.1,32]}/><meshStandardMaterial color={selected==='plate'?'#b78a4b':'#b19b77'} roughness={.95}/></mesh>
  <group scale={[1,stage.roots,1]} onClick={select('roots')}>{roots.map((pair,i)=><group key={i}>{pair.map((r,j)=><mesh geometry={r} key={j}><meshStandardMaterial color={selected==='roots'?'#aa764e':'#bba98a'} roughness={1}/></mesh>)}</group>)}</group>
  {settings.leaves&&stage.leafLength>0&&<group position={[0,1.4,0]} scale={[1,1/s,1]}>{Array.from({length:stage.leafCount},(_,i)=><group key={i} position={[(i%2)*.07-.03,i*.025,Math.sin(i)*.065]}><Leaf length={stage.leafLength*(.66+((i*7+index*3)%9)/28)} bend={stage.stageId==='maturity'?1.4+i*.23:.36+i*.19} angle={i*2.4+index} color={stage.stageId==='maturity'?['#8b8d4d','#a59c60','#757b43'][i%3]:['#61764a','#768a57','#4e683f','#829362','#5b754d'][i%5]} selected={selected==='leaf'} onClick={select('leaf')}/></group>)}</group>}
 </group>;
}
function CameraRig({mode,stageId,reset,zoom,animate,preparation,ruler}){
 const controls=useRef(); const {camera}=useThree();
 useEffect(()=>{const v=viewSettings(preparation?'Persiapan bibit':mode,stageId,ruler);camera.position.set(.3,v.target[1]+(v.elevation??.75),v.distance);controls.current.target.set(...v.target);controls.current.update();},[mode,stageId,reset,camera,preparation,ruler]);
 useEffect(()=>{if(!controls.current||zoom.key===0)return;const target=controls.current.target;camera.position.sub(target).multiplyScalar(zoom.direction==='in'?.82:1.22).clampLength(2.8,13).add(target);controls.current.update();},[zoom,camera]);
 return <OrbitControls ref={controls} enablePan={false} minDistance={2.8} maxDistance={13} minPolarAngle={.25} maxPolarAngle={Math.PI*.78} autoRotate={animate} autoRotateSpeed={.35} enableDamping dampingFactor={.08}/>;
}
function Scene({stage:stageId,progress,mode,selected,onSelect,soil,ruler,animate,reset,zoom,preparation:requestedPreparation,seedCut}){
 const preparation=stageId==='planting'&&requestedPreparation;
 const stage=stageModel(stageId),detail=mode!=='Tanaman utuh';
 return <>
 <ambientLight intensity={1.6}/><directionalLight position={[-4,7,6]} intensity={3}/><directionalLight position={[4,3,-4]} intensity={1.3} color="#e3eaca"/>
 <group rotation={[0,-.25,0]}>{shootModels(stage,progress).filter(s=>s.visible&&(!detail||s.index===0)).map(shoot=><Bulb key={shoot.id} index={shoot.index} stage={shoot} mode={preparation?'Detail umbi':mode} selected={selected} onSelect={onSelect} preparation={preparation} topCut={preparation&&seedCut}/>)}</group>
 {/* Surface y=.38 intersects every growth-stage bulb; plates and root origins remain buried. */}
 {soil&&!preparation&&<mesh renderOrder={1} position={[0,-.635,0]}><cylinderGeometry args={[2,2,2.03,64]}/><meshStandardMaterial color="#8e7c5d" roughness={1} transparent opacity={.22} depthWrite={false} side={THREE.FrontSide}/></mesh>}
 {rulerVisible(mode,preparation,ruler)&&<WorldRuler/>}
 <CameraRig mode={mode} stageId={stageId} reset={reset} zoom={zoom} animate={animate} preparation={preparation} ruler={ruler}/>
 </>;
}
export default function PlantCanvas(props){
 const available=useMemo(()=>{try{const c=document.createElement('canvas');return !!c.getContext('webgl2');}catch{return false;}},[]);
 return <SceneBoundary>{available?<Canvas camera={{position:[.3,2.25,8.3],fov:42}} dpr={[1,1.75]} gl={{antialias:true,alpha:true}} onCreated={({gl})=>gl.setClearColor('#f5f3eb',0)}><Scene {...props}/></Canvas>:<Fallback/>}</SceneBoundary>;
}
