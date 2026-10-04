import React from 'react';
export function SeedChoices({cut,onChoose,preparation,onReturn}){
 return <div className="seed-control" role="group" aria-label="Persiapan umbi bibit · opsional">
  <p className="eyebrow">PERSIAPAN BIBIT · OPSIONAL</p>
  <button aria-pressed={!cut} onClick={()=>onChoose(false)}>Umbi utuh</button>
  <button aria-pressed={cut} onClick={()=>onChoose(true)}>Ujung atas dipotong ±⅓</button>
  <p>Pilih untuk membandingkan bibit sebelum ditanam, tanpa tanah. Bukan tampilan “Irisan umbi”.</p>
  {preparation&&<button className="text-action" onClick={onReturn}>Kembali ke penanaman</button>}
  <p>Kembali, atur ulang, ganti tampilan atau tahap: bibit kembali utuh. Pilihan tanah sebelumnya dipulihkan.</p>
 </div>;
}
export function SeedGuidance(){
 return <section className="seed-guidance" aria-label="Pemotongan bukan kewajiban">
  <div><p className="eyebrow">CATATAN PERSIAPAN BIBIT</p><h2>Pemotongan<br/><em>bukan kewajiban.</em></h2></div>
  <div><p>Jika umbi bibit belum cukup masa simpan dan masih dalam dormansi, pemotongan sekitar sepertiga ujung atas dapat membantu tunas muncul. Tidak wajib bila bibit sudah siap bertunas; jangan memotong bila tunas sudah terlihat, dan hindari merusak tunas yang mungkin sudah tumbuh di dalam.</p>
  <p>Kesiapan simpan bervariasi menurut varietas dan kondisi penyimpanan, bukan satu batas waktu untuk semua bibit. Panduan teknis Januari 2025 membedakan bibit yang disimpan kurang dari dua bulan dengan yang lebih lama; ini konteks panduan, bukan patokan universal atau jaminan hasil.</p>
  <p><strong>Yang dipotong adalah ujung atas / leher, bukan pangkal akar.</strong> Jangan merusak cakram dasar di bagian bawah, tempat akar dan tunas berawal. Model mempertahankan cakram dasar dan akar; lapisan berdaging pada bidang potong hanya ilustrasi.</p>
  <p>Memotong menciptakan luka. Gunakan bahan tanam sehat dan alat bersih; pertimbangkan kondisi bibit bersama penyuluh setempat, bukan menjadikan pemotongan langkah wajib.</p>
  <div className="seed-sources"><a href="https://pustaka.bppsdmp.pertanian.go.id/info-literasi/info-teknologi-sukses-budi-daya-bawang-merah" target="_blank" rel="noreferrer">Kementan · Sukses Budi Daya Bawang Merah · 25 Februari 2025 ↗</a><a href="https://data.hortikultura.pertanian.go.id/jica/Materials/Chapter%205/5-44%20Panduan%20teknis%20tentang%20bawang%20merah.pdf" target="_blank" rel="noreferrer">Bawang Merah — Panduan Dasar Budidaya · Januari 2025 · Persiapan Benih (PDF) ↗</a></div>
  </div>
 </section>;
}
