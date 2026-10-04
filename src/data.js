export const STAGES = [
 { id:'planting', name:'Penanaman', eyebrow:'Awal kehidupan di dalam umbi', text:'Umbi bibit menyimpan cadangan makanan. Saat ditanam, ujung umbi berada setinggi permukaan tanah; akar dan tunas baru mulai tumbuh.', count:1, leafLength:0, bulbScale:0.65, roots:0.35 },
 { id:'sprouting', name:'Bertunas', eyebrow:'Hijau pertama mulai muncul', text:'Daun muda yang berongga tumbuh dari leher umbi. Akar memanjang dari cakram dasar, sementara cadangan makanan menopang pertumbuhan awal.', count:1, leafLength:0.9, bulbScale:0.64, roots:0.65 },
 { id:'tillering', name:'Pembentukan anakan', eyebrow:'Tunas kecil di sisi tunas utama', text:'Di antara pangkal daun, tunas lateral berkembang menjadi anakan di dekat tunas utama. Anakan membentuk cakram dasar dan daun sendiri; pangkalnya belum menjadi umbi besar.', count:5, leafLength:1.65, bulbScale:0.64, roots:0.75 },
 { id:'vegetative', name:'Pertumbuhan daun', eyebrow:'Menangkap cahaya bersama', text:'Daun tunas utama dan anakan memanjang untuk fotosintesis. Anakan tetap berkelompok; pangkalnya masih kecil sebelum menebal menjadi umbi. Pembentukan anakan dan pertumbuhan daun dapat berlangsung bersamaan.', count:5, leafLength:3.2, bulbScale:0.64, roots:0.85 },
 { id:'bulbing', name:'Pembentukan umbi', eyebrow:'Satu rumpun, berlapis kehidupan', text:'Pangkal daun menebal menjadi lapisan umbi yang menyimpan cadangan makanan. Tanaman dari satu umbi bibit dapat membentuk beberapa umbi anakan.', count:5, leafLength:3.35, bulbScale:1, roots:1 },
 { id:'maturity', name:'Pematangan', eyebrow:'Cadangan untuk musim berikutnya', text:'Umbi membesar dan bagian atasnya dapat menonjol di permukaan tanah. Leher melunak, daun menguning dan rebah; lapisan luar mengering menjadi kulit pelindung.', count:5, leafLength:2.65, bulbScale:1.12, roots:0.9 }
];
export function stageModel(id) { return STAGES.find(s=>s.id===id) || STAGES.find(s=>s.id==='bulbing'); }
// Persistent shoot identities and anchors; sizes are illustrative, not measurements.
// The slider exposes staggered bud emergence; it is not a clock or a yield model.
export function shootModels(stage,progress=0.65) {
 const p=Math.max(0,Math.min(1,Number.isFinite(progress)?progress:0.65));
 const early=['planting','sprouting'].includes(stage.id);
 return Array.from({length:5},(_,index)=>{
  const daughter=index>0;
  const onset=[0,0.04,0.2,0.4,0.6][index];
  const growth=early?0:stage.id==='tillering'?Math.max(0,(p-onset)/(1-onset)):1;
  const smallScale=.30-index*.025;
  const smallLeaf=stage.leafLength*(.65-index*.07);
  const bulbScale=!daughter?stage.bulbScale:early?0:stage.id==='tillering'?smallScale*growth:stage.id==='vegetative'?smallScale+.025:stage.bulbScale*(.88-index*.06);
  const leafLength=!daughter?(stage.id==='tillering'?.9+(.75*p):stage.leafLength):smallLeaf*growth;
  return {...stage,stageId:stage.id,id:daughter?`anakan-${index}`:'utama',role:daughter?'anakan':'utama',index,visible:!daughter||growth>0,bulbScale,leafLength,leafCount:daughter&&['tillering','vegetative'].includes(stage.id)?3:5,progress:p};
 });
}
export const ANATOMY = {
 leaf:{ name:'Daun berongga', short:'Daun', number:'01', subtitle:'Penangkap cahaya', text:'Daun hijau berbentuk tabung berongga menangkap cahaya untuk fotosintesis. Pangkal daun yang saling membungkus membentuk leher di atas umbi.', fact:'Bentuk · tabung berongga yang meruncing' },
 bulb:{ name:'Rumpun umbi', short:'Umbi', number:'02', subtitle:'Tempat menyimpan cadangan', text:'Umbi tersusun dari pangkal daun berdaging yang menyimpan cadangan makanan. Kulit luar yang kering melindungi lapisan di dalamnya; umbi anakan tumbuh bersama membentuk rumpun.', fact:'Susunan · pangkal daun yang menebal' },
 plate:{ name:'Cakram dasar', short:'Cakram dasar', number:'03', subtitle:'Batang kecil yang penting', text:'Batang yang sangat pendek di dasar umbi menghubungkan lapisan umbi, tunas, dan akar. Bagian ini adalah batang, bukan akar, dan berada di bawah permukaan tanah.', fact:'Susunan · batang yang memendek' },
 roots:{ name:'Akar serabut', short:'Akar', number:'04', subtitle:'Penghubung dengan tanah', text:'Akar halus tumbuh dari cakram dasar dan bercabang di dalam tanah untuk menyerap air serta unsur hara mineral. Sembunyikan tanah untuk mengamati akar pada model.', fact:'Asal · cakram dasar umbi' }
};
export const MODES = ['Tanaman utuh','Detail umbi','Irisan umbi'];
export function viewSettings(mode,stageId,ruler=false) {
 if(mode==='Persiapan bibit')return {leaves:false,cutaway:false,target:[0,.65,0],distance:5.8,elevation:3.3};
 if(mode==='Tanaman utuh'&&stageId==='tillering'&&!ruler)return {leaves:true,cutaway:false,target:[0,.55,0],distance:7.2};
 return mode==='Detail umbi' ? {leaves:false,cutaway:false,target:[0,0.45,0],distance:5.1} : mode==='Irisan umbi' ? {leaves:false,cutaway:true,target:[0,0.45,0],distance:5.1} : {leaves:true,cutaway:false,target:[0,1.6,0],distance:10.5};
}
export function motionEnabled(requested,reduced) { return requested && !reduced; }
