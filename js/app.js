(function () {
  'use strict';
  const D = window.EPORTO || {};
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const localPath = (path) => {
    const value = String(path || '').trim();
    if (!value || /^(javascript|data|vbscript):/i.test(value)) return '';
    if (/^https?:\/\//i.test(value)) return value;
    return value.replace(/^\/+/, '').replace(/\\/g, '/');
  };
  const link = (path, label, cls = 'btn btn-outline', opts = {}) => {
    const href = localPath(path);
    if (!href) return `<span class="small-note">Tautan belum ditambahkan.</span>`;
    const external = /^https?:\/\//i.test(href);
    const newTab = opts.newTab || external;
    const target = newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const download = opts.download ? ' download' : '';
    return `<a class="${esc(cls)}" href="${esc(href)}"${target}${download}>${esc(label)}</a>`;
  };
  const status = (label, type = 'wait') => `<span class="status ${type === 'good' ? 'good' : type === 'neutral' ? '' : 'wait'}">${esc(label)}</span>`;
  const iconFor = (name) => ({
    'Perencanaan pembelajaran':'▤', 'Media dan materi ajar':'▧', 'Video praktik mengajar':'▷',
    'Kegiatan nonmengajar 1':'◎', 'Kegiatan nonmengajar 2':'◎', 'Kegiatan nonmengajar 3':'◎',
    'Instrumen penilaian':'☷', 'Analisis dan refleksi':'↗'
  }[name] || '▣');
  const moduleByCycle = (n) => (D.produk || []).find(p => String(p.nomor) === String(n)) || (D.produk || [])[0] || {};
  const moduleCard = (m, cta = 'Buka modul ajar') => `
    <article class="module-mini-card">
      <span class="status neutral">${esc(m.siklus || 'Modul ajar')}</span>
      <span class="module-context">${esc(m.konteks || '')}</span>
      <h3>${esc(m.nama || 'Modul ajar')}</h3>
      <p>${esc(m.tujuan || m.catatan || '')}</p>
      <div class="card-bottom">${link(m.berkas || m.path, cta, 'btn btn-outline btn-small', {download: true})}</div>
    </article>`;

  // Semua preview dokumen ditampilkan langsung di halaman, bukan hanya di modal.
  function previewSource(url) {
    const raw = String(url || '').trim();
    if (!raw) return '';
    const drive = raw.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]+)/i);
    const docs = raw.match(/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([A-Za-z0-9_-]+)/i);
    const yt = raw.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
    if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
    if (docs) return `https://docs.google.com/${docs[1]}/d/${docs[2]}/preview`;
    if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
    if (/\.pdf(?:$|[?#])/i.test(raw) || !/^https?:\/\//i.test(raw)) return raw;
    return '';
  }
  function inlineDocPreview(path, title, height = 470) {
    const original = localPath(path);
    if (!original) return `<div class="inline-preview-empty">Pratinjau dokumen belum tersedia.</div>`;
    let pdfPath = original;
    if (/\.docx$/i.test(original)) {
      const fileName = original.split('/').pop().replace(/\.docx$/i, '_preview.pdf');
      pdfPath = `assets/preview_pdf/${fileName}`;
    } else if (/\.doc$/i.test(original) || /\.pptx?$/i.test(original)) {
      pdfPath = '';
    }
    const frame = pdfPath && /\.pdf(?:$|[?#])/i.test(pdfPath)
      ? `<div class="document-frame-wrap"><iframe class="document-frame" src="${esc(pdfPath)}#view=FitH" title="Pratinjau ${esc(title || 'dokumen')}" loading="lazy" style="height:${Math.max(300, Math.min(580, Number(height) || 470))}px"></iframe></div>`
      : `<div class="inline-preview-empty"><strong>Preview otomatis tidak tersedia untuk format ini.</strong><span>Gunakan tombol di bawah untuk membuka atau mengunduh dokumen.</span></div>`;
    return `${frame}<div class="preview-actions">${link(original, 'Unduh dokumen asli', 'btn btn-outline btn-small', {download: true})}${pdfPath && /\.pdf/i.test(pdfPath) ? link(pdfPath, 'Buka PDF penuh ↗', 'btn btn-primary btn-small', {newTab:true}) : ''}</div>`;
  }
  function modulePreviewRow(m, idx = 0) {
    const path = m.berkas || m.path || '';
    return `<article class="module-preview-row">
      <div class="module-preview-copy"><div class="section-kicker">${esc(m.siklus || `Siklus ${idx + 1}`)}</div><h3>${esc(m.nama || 'Modul ajar')}${m.konteks ? ` <span>— ${esc(m.konteks)}</span>` : ''}</h3><p class="module-purpose">${esc(m.tujuan || '')}</p>
        <div class="module-analysis-mini"><div><b>Tantangan</b><p>${esc(m.tantangan || 'Catatan tantangan dapat dilengkapi berdasarkan refleksi praktik.')}</p></div><div><b>Tindak lanjut</b><p>${esc(m.perbaikan || 'Tindak lanjut disesuaikan dengan refleksi dan bukti praktik.')}</p></div></div>
        <div class="preview-actions">${link(path, /\.pdf$/i.test(path) ? 'Buka / unduh modul ajar (.pdf)' : 'Unduh modul ajar (.docx)', 'btn btn-primary btn-small', {download:true})}</div>
      </div>
      <div class="module-preview-document">${inlineDocPreview(path, `${m.siklus || ''} ${m.nama || 'Modul ajar'}`, 470)}</div>
    </article>`;
  }

  // Beranda
  const home = D.beranda || {};
  if ($('heroLabel')) $('heroLabel').textContent = home.label || 'E-PORTOFOLIO · SEMESTER 2';
  if ($('heroTitle')) $('heroTitle').innerHTML = esc(home.judul || 'Belajar mengajar,\nbertumbuh melalui refleksi.').replace(/\n/g, '<br>').replace(/(bertumbuh melalui refleksi\.)/i, '<span>$1</span>');
  if ($('heroSubtitle')) $('heroSubtitle').textContent = home.subjudul || home.subtitle || 'Dokumentasi praktik sebagai calon guru Informatika.';
  if ($('heroNote')) { $('heroNote').textContent = home.catatan || ''; $('heroNote').hidden = !home.catatan; }
  if ($('heroStats')) $('heroStats').innerHTML = (home.metrik || []).map(m => { const hasNumber = String(m.angka || '').trim() !== ''; return `<div class="stat-card${hasNumber ? '' : ' stat-card--identity'}">${hasNumber ? `<span class="stat-number">${esc(m.angka)}</span>` : ''}<span class="stat-label">${esc(m.label)}</span></div>`; }).join('');

  // Profil: potret menggunakan file yang ditetapkan pada content/profil.js
  const p = D.profil || {};
  if ($('profileGrid')) {
    const fokus = (p.fokus || p.focus || []).map(x => `<span class="focus-tag">${esc(x)}</span>`).join('');
    const contact = p.kontak || p.email || '';
    $('profileGrid').innerHTML = `
      <article class="profile-panel">
        <div class="profile-photo-wrap">
          <img class="profile-photo" src="${esc(localPath(p.foto || p.photo || 'assets/profile/foto-profil-placeholder.svg'))}" alt="Foto profil ${esc(p.nama || 'mahasiswa')}" loading="lazy" onerror="this.onerror=null;this.src='assets/profile/foto-profil-placeholder.svg';">
        </div>
        <div class="profile-body">
          <div class="profile-title-row"><h3>${esc([p.nama || 'Adri Faisal', p.gelar || 'S.Kom.'].filter(Boolean).join(' '))}</h3><span class="profile-role">Calon Guru Informatika</span></div>
          <p class="profile-bio">${esc(p.bio || '')}</p>
          <div class="profile-meta-grid">
            <div class="profile-meta"><b>${esc(p.labelPendidikan || 'Pendidikan')}</b><span>${esc(p.pendidikan || 'Universitas Nahdlatul Ulama Al Ghazali Cilacap')}</span></div>
            <div class="profile-meta"><b>Program</b><span>${esc(p.program || 'PPG Calon Guru · Semester 2')}</span></div>
            <div class="profile-meta"><b>Sekolah PPL</b><span>${esc(p.sekolah || 'SMP Muhammadiyah 10 Surakarta')}</span></div>
            <div class="profile-meta"><b>Bidang studi</b><span>${esc(p.peran || 'Informatika')}</span></div>
          </div>
          <div class="profile-focus">${fokus}</div>
          <div class="quote-panel"><p>“${esc(p.kutipan || 'Teknologi memberi ruang bagi murid untuk berpikir, mencoba, dan menciptakan solusi.') }”</p></div>
          <div class="profile-contact">${contact ? `Kontak profesional: <a href="${esc(/^https?:\/\//i.test(contact) ? contact : 'mailto:' + contact)}"${/^https?:\/\//i.test(contact) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(contact)}</a>` : 'Kontak profesional: tambahkan email atau tautan profesional di content/profil.js sebelum publikasi.'}</div>
        </div>
      </article>`;
    const homeContact = $('heroContactLine');
    if (homeContact) {
      const contactText = contact
        ? `<a href="${esc(/^https?:\/\//i.test(contact) ? contact : 'mailto:' + contact)}"${/^https?:\/\//i.test(contact) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(contact)}</a>`
        : 'Kontak profesional: lengkapi di content/profil.js sebelum publikasi.';
      homeContact.innerHTML = `<b>${esc([p.nama || 'Adri Faisal', p.gelar || 'S.Kom.'].filter(Boolean).join(' '))} · ${esc(p.peran || 'Calon Guru Informatika')}</b>${contactText}`;
    }
  }

  // Modal artefak
  const modal = $('detailModal');
  const modalTitle = $('modalTitle');
  const modalBody = $('modalBody');
  const openDetail = (item) => {
    if (!modal || !modalTitle || !modalBody || !item) return;
    modalTitle.textContent = item.judul || item.nama || 'Detail artefak';
    const fields = [
      ['Konteks', item.konteks || item.lokasi || item.tanggal || 'Lengkapi konteks artefak.'],
      ['Tujuan', item.tujuan || item.isi || item.deskripsi || 'Lengkapi tujuan artefak berdasarkan dokumen atau kegiatan.'],
      ['Kelebihan', item.kelebihan || item.kekuatan || 'Tambahkan kelebihan berdasarkan bukti yang tersedia.'],
      ['Kekurangan atau keterbatasan', item.kekurangan || item.tantangan || 'Tambahkan keterbatasan yang benar-benar teridentifikasi.'],
      ['Kaitan teori', item.teori || 'Hubungkan artefak dengan teori atau prinsip pembelajaran yang relevan dan memang dipelajari.'],
      ['Tindak lanjut', item.tindak || item.perbaikan || item.catatan || 'Tuliskan rencana perbaikan yang konkret.']
    ];
    const hideEmpty = fields.filter(([_, value]) => String(value || '').trim());
    const previewUrl = String(item.previewUrl || '').trim();
    let previewSrc = '';
    if (previewUrl) {
      const drive = previewUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]+)/i);
      const docs = previewUrl.match(/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([A-Za-z0-9_-]+)/i);
      const yt = previewUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
      if (drive) previewSrc = `https://drive.google.com/file/d/${drive[1]}/preview`;
      else if (docs) previewSrc = `https://docs.google.com/${docs[1]}/d/${docs[2]}/preview`;
      else if (yt) previewSrc = `https://www.youtube-nocookie.com/embed/${yt[1]}`;
      else if (/\.pdf(?:$|[?#])/i.test(previewUrl)) previewSrc = previewUrl;
    }
    const previewWidth = Math.max(20, Math.min(100, Number(item.previewWidth) || 100));
    const previewHeight = Math.max(160, Math.min(1600, Number(item.previewHeight) || 560));
    const previewMarkup = previewSrc ? `<div class="artifact-preview-wrap" style="width:${previewWidth}%;"><iframe class="artifact-preview" style="height:${previewHeight}px" src="${esc(previewSrc)}" title="Pratinjau ${esc(item.judul || 'artefak')}" loading="lazy" allowfullscreen></iframe><a class="btn btn-outline btn-small" href="${esc(previewUrl)}" target="_blank" rel="noopener noreferrer">Buka di tab baru ↗</a></div>` : '';
    const previewTop = previewMarkup && String(item.previewPosition || 'atas').toLowerCase() !== 'bawah' ? previewMarkup : '';
    const previewBottom = previewMarkup && String(item.previewPosition || 'atas').toLowerCase() === 'bawah' ? previewMarkup : '';
    modalBody.innerHTML = `${item.status ? `<div class="modal-status">${status(item.status, /tersedia|ada artefak|dokumen tersedia/i.test(item.status) && !/perlu/i.test(item.status) ? 'good' : 'wait')}</div>` : ''}
      ${item.ringkasan ? `<p>${esc(item.ringkasan)}</p>` : ''}
      ${previewTop}
      ${hideEmpty.map(([label, value]) => `<div class="modal-field"><b>${esc(label)}</b><p>${esc(value)}</p></div>`).join('')}
      ${previewBottom}
      ${item.tautan || item.berkas || item.dokumen || item.path ? `<div class="modal-actions">${link(item.tautan || item.berkas || item.dokumen || item.path, item.labelTautan || 'Buka dokumen pendukung', 'btn btn-primary', {download: true})}</div>` : ''}
      ${item.catatanTambahan ? `<div class="note-box">${esc(item.catatanTambahan)}</div>` : ''}`;
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', 'open');
  };
  if ($('modalClose') && modal) $('modalClose').addEventListener('click', () => modal.close());
  if (modal) {
    modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
    modal.addEventListener('close', () => { if ($('modalClose')) $('modalClose').blur(); });
  }

  // LK3: kartu visual
  const lk3 = D.lk3 || {};
  if ($('lk3Intro')) $('lk3Intro').textContent = lk3.intro || '';
  const lk3Cards = lk3.kartu || lk3.analisis || [];
  if ($('lk3Grid')) $('lk3Grid').innerHTML = lk3Cards.map((a, i) => {
    const item = { ...a, judul: a.judul || a.nama };
    const good = /tersedia|ada artefak|sudah ada/i.test(a.status || '') && !/perlu/i.test(a.status || '');
    const src = previewSource(a.previewUrl || '');
    const h = Math.max(220, Math.min(480, Number(a.previewHeight) || 310));
    const directPreview = src ? `<div class="artifact-inline-preview"><iframe src="${esc(src)}" title="Pratinjau ${esc(item.judul)}" loading="lazy" style="height:${h}px" allowfullscreen></iframe><a href="${esc(a.previewUrl)}" target="_blank" rel="noopener noreferrer">Buka tautan asli ↗</a></div>` : '';
    return `<article class="analysis-card"><div class="analysis-card-top"><span class="card-icon" aria-hidden="true">${esc(a.ikon || iconFor(item.judul))}</span>${status(a.status || 'Perlu verifikasi', good ? 'good' : 'wait')}</div><h3>${esc(item.judul)}</h3><p>${esc(a.ringkasan || a.isi || a.deskripsi || '')}</p>${directPreview}<button class="card-detail-button" type="button" data-detail="${i}" aria-label="Buka analisis ${esc(item.judul)}">Baca analisis lengkap <span aria-hidden="true">↗</span></button></article>`;
  }).join('');
  if ($('lk3Grid')) $('lk3Grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-detail]');
    if (!button) return;
    const item = lk3Cards[Number(button.dataset.detail)];
    openDetail({ ...item, judul: item.judul || item.nama });
  });
  const synthesis = lk3.rangkuman || {};
  if ($('lk3Synthesis')) $('lk3Synthesis').innerHTML = `<div class="section-kicker">SINTESIS ANALISIS</div><h3>${esc(synthesis.judul || 'Analisis dan refleksi saya')}</h3><p>${esc(synthesis.isi || 'Rangkum temuan dari artefak yang benar-benar diperiksa, kaitkan dengan teori, dan tetapkan perbaikan berikutnya.')}</p><div class="synthesis-tags">${(synthesis.tag || ['Konteks','Bukti','Teori','Tindak lanjut']).map(t => `<span class="focus-tag">${esc(t)}</span>`).join('')}</div>`;
  const assm = lk3.asesmen || {};
  if ($('lk3Assessment')) $('lk3Assessment').innerHTML = `<div class="section-kicker">INSTRUMEN PENILAIAN</div><h3>${esc(assm.judul || 'Asesmen dan umpan balik')}</h3><p>${esc(assm.isi || 'Hubungkan indikator, tujuan pembelajaran, hasil asesmen, dan tindak lanjut.')}</p>${link('#asesmen','Buka bagian Asesmen','btn btn-outline btn-small')}`;

  // Komponen video digunakan di tab UTS dan UAS.
  function videoMarkup(video, cycleText) {
    if (!video) return `<div class="video-empty"><strong>Video belum dikonfigurasi</strong>Lengkapi content/video.js jika rekaman sudah tersedia.</div>`;
    const url = String(video.url || '').trim();
    let preview = '';
    if (url) {
      let embed = '';
      const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
      const drive = url.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/i);
      if (youtube) embed = `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
      else if (drive) embed = `https://drive.google.com/file/d/${drive[1]}/preview`;
      if (embed) preview = `<iframe class="video-embed" src="${esc(embed)}" title="${esc(video.judul || 'Video praktik mengajar')}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe><a class="btn btn-outline btn-small video-open-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Buka video di tab baru ↗</a>`;
      else preview = `<div class="video-empty"><strong>Tautan video sudah dicantumkan</strong>Pratinjau otomatis tidak tersedia untuk format tautan ini.</div><a class="btn btn-outline btn-small video-open-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Buka video praktik ↗</a>`;
    } else {
      preview = `<div class="video-empty"><strong>Bukti video perlu dilengkapi</strong>Belum ada tautan rekaman yang dicantumkan. Edit <code>content/video.js</code> setelah tautan video siap dan bisa diakses.</div>`;
    }
    return `<div class="video-card"><div class="video-heading"><span class="video-symbol" aria-hidden="true">▷</span><div><h3>${esc(video.judul || 'Video praktik mengajar')}</h3><p>${esc(video.modul || cycleText || 'Pilih siklus yang sesuai dengan rekaman.')}</p></div></div>${preview}<div class="video-analysis-grid">${(video.analisis || []).map((a, i) => `<div class="video-analysis-item"><b>${esc(['Fokus pengamatan 1','Fokus pengamatan 2','Fokus pengamatan 3'][i] || 'Fokus pengamatan')}</b><p>${esc(a)}</p></div>`).join('')}</div></div>`;
  }
  function analysisDetails(items) {
    return `<div class="analysis-detail-grid">${items.map(i => `<article class="analysis-detail"><h4>${esc(i.judul)}</h4><p>${esc(i.isi)}</p></article>`).join('')}</div>`;
  }
  function reflectionSummary(cycle) {
    const p = moduleByCycle(cycle);
    return analysisDetails([
      { judul: 'Tujuan dan konteks', isi: p.tujuan || 'Pastikan tujuan pembelajaran terlihat jelas dalam perangkat dan pelaksanaan.' },
      { judul: 'Kekuatan rancangan', isi: p.kekuatan || 'Tambahkan bukti yang mendukung kelebihan rancangan.' },
      { judul: 'Keterbatasan', isi: p.tantangan || 'Catat bagian yang belum optimal dengan merujuk dokumen atau video.' },
      { judul: 'Tindak lanjut', isi: p.perbaikan || 'Tentukan langkah perbaikan yang bisa diamati pada pembelajaran berikutnya.' }
    ]);
  }
  const uts = D.uts || {};
  const uas = D.uas || {};
  const videos = D.video || {};
  function renderUtsTab(tab) {
    const m = moduleByCycle(1);
    const target = $('utsTabContent');
    if (!target) return;
    if (tab === 'all') {
      const title = uts.judul || 'Praktik Mengajar Mandiri · UTS';
      target.innerHTML = `<section class="portfolio-lead"><div class="section-kicker">PAKET PRAKTIK UTS</div><h3>${esc(title)}</h3><p>${esc(uts.ringkasan || '')}</p><p>${esc(uts.konteksTambahan || '')}</p></section>
        <section class="portfolio-subsection"><div class="portfolio-subhead"><span>01</span><div><h3>Modul ajar · Siklus 1</h3><p>Algoritma — Gelang Warna-Warni</p></div></div>${modulePreviewRow({...m, ...{siklus: m.siklus || 'Siklus 1'}}, 0)}</section>
        <section class="portfolio-subsection"><div class="portfolio-subhead"><span>02</span><div><h3>Media dan LKPD</h3><p>Media yang tercantum dalam rancangan pembelajaran</p></div></div><div class="content-note-card"><p>Perangkat Siklus 1 mencantumkan PPT materi, ilustrasi gelang/manik-manik, dan alat peraga manik-manik atau kancing warna-warni. LKPD dapat ditampilkan sebagai tautan terpisah apabila berkas finalnya tersedia.</p><div class="preview-actions">${link(m.berkas || uts.berkas, 'Lihat dokumen yang menjelaskan media', 'btn btn-outline btn-small', {download:true})}</div></div></section>
        <section class="portfolio-subsection"><div class="portfolio-subhead"><span>03</span><div><h3>Video praktik mengajar</h3><p>Video dan catatan pengamatan</p></div></div>${videoMarkup(videos.uts, 'Siklus 1 · Algoritma')}</section>
        <section class="portfolio-subsection"><div class="portfolio-subhead"><span>04</span><div><h3>Analisis dan refleksi</h3><p>Ringkasan evaluasi perencanaan dan pelaksanaan</p></div></div><p class="preserve-lines analysis-summary">${esc(uts.analisis || '')}</p>${reflectionSummary(1)}<div class="inline-links"><a href="#asesmen" class="btn btn-outline btn-small">Lihat bagian asesmen</a><a href="#refleksi" class="btn btn-outline btn-small">Lihat refleksi umum</a></div></section>`;
      return;
    }
    if (tab === 'ringkasan') {
      target.innerHTML = `<div class="tab-overview-grid"><div><div class="section-kicker">PAKET PRAKTIK UTS</div><h3>${esc(uts.judul || 'Praktik Mengajar Siklus 1')}</h3><p>${esc(uts.ringkasan || '')}</p><p>${esc(uts.konteksTambahan || 'Bagian ini menyajikan perangkat ajar, bukti praktik, analisis, dan refleksi berdasarkan siklus yang ditetapkan untuk UTS.')}</p><div class="inline-links">${link(uts.berkas || m.berkas, 'Buka modul ajar siklus 1', 'btn btn-primary', {download:true})}<a class="btn btn-outline" href="#lk3">Lihat analisis LK3</a></div></div><aside class="side-note"><h4>Komponen yang disiapkan</h4><p>Gunakan panel ini untuk melihat apakah paket bukti sudah lengkap sebelum dibagikan.</p><ul class="check-list"><li>Modul ajar atau RPP lengkap</li><li>Media dan LKPD yang relevan</li><li>Video praktik dari siklus yang tepat</li><li>Asesmen, analisis, dan refleksi</li></ul></aside></div>`;
    } else if (tab === 'perangkat') {
      target.innerHTML = `<div class="document-feature"><div class="document-feature-main"><span class="meta-line">${esc(m.siklus || 'Siklus 1')} · INFORMATIKA KELAS VII</span><h3>${esc(m.nama || 'Algoritma')} — ${esc(m.konteks || 'Gelang Warna-Warni')}</h3><p>${esc(m.tujuan || '')}</p><p>Dokumen lengkap tersedia untuk ditinjau. Sesuaikan identitas siklus dan tanggal pelaksanaan dengan bukti atau instruksi penilaian yang digunakan.</p>${link(uts.berkas || m.berkas, 'Unduh modul ajar (.docx)', 'btn btn-primary', {download:true})}</div><aside class="document-feature-side"><h4>Isi yang perlu diperiksa</h4><ul class="check-list"><li>Identitas dan tujuan pembelajaran</li><li>Langkah-langkah kegiatan dan alokasi waktu</li><li>Media, LKPD, dan sumber belajar</li><li>Asesmen dan tindak lanjut</li></ul></aside></div>`;
    } else if (tab === 'media') {
      target.innerHTML = `<h3 class="tab-panel-heading">Media dan LKPD pada praktik</h3><p>Modul Algoritma menyebut ilustrasi gelang warna-warni, manik-manik atau kancing warna-warni, PPT materi, dan LKPD sebagai bagian dari rancangan. Gunakan tautan di bawah untuk membuka modul lengkap. Berkas media atau LKPD khusus yang belum dimasukkan ke paket ini tetap perlu ditambahkan jika tersedia.</p><div class="file-grid"><article class="file-card"><div class="file-icon">DOCX</div><div><h3>Modul Ajar Algoritma</h3><p>Rancangan pembelajaran dan informasi media yang direncanakan.</p>${link(uts.berkas || m.berkas,'Buka modul','btn btn-outline btn-small',{download:true})}</div></article><article class="file-card"><div class="file-icon">LKPD</div><div><h3>LKPD atau bahan aktivitas</h3><p>Tambahkan file LKPD yang benar-benar digunakan pada siklus ini apabila terpisah dari modul.</p><span class="status wait">Perlu verifikasi</span></div></article></div>`;
    } else if (tab === 'video') {
      target.innerHTML = videoMarkup(videos.uts, 'Siklus 1') + `<div class="note-box">Jika ada dokumentasi hasil kerja murid, tangkapan layar, atau umpan balik GP/DPL, masukkan hanya setelah relevansi siklus dan izin publikasinya dipastikan.</div>`;
    } else {
      target.innerHTML = `<h3 class="tab-panel-heading">Analisis dan refleksi siklus 1</h3><p>${esc(uts.analisis || '')}</p>${reflectionSummary(1)}<div class="inline-links">${link('assets/artefak/LK4_Empat_Refleksi_PPL_Mandiri.docx','Buka dokumen LK4','btn btn-outline btn-small',{download:true})}<a href="#refleksi" class="btn btn-outline btn-small">Lihat refleksi diri</a></div>`;
    }
  }
  function renderUasTab(tab) {
    const target = $('uasTabContent');
    if (!target) return;
    const pilihan = uas.pilihan || (D.produk || []).filter(p => Number(p.nomor) > 1);
    if (tab === 'all') {
      const assessmentDocs = (D.asesmen && D.asesmen.dokumen) || [];
      target.innerHTML = `<section class="portfolio-lead"><div class="section-kicker">PAKET PRAKTIK UAS</div><h3>${esc(uas.judul || 'Praktik Mengajar Mandiri · Siklus 2–4')}</h3><p>${esc(uas.ringkasan || '')}</p></section>
        <section class="portfolio-subsection"><div class="portfolio-subhead"><span>01</span><div><h3>Perangkat ajar Siklus 2–4</h3><p>Semua modul tersedia berurutan dengan preview langsung</p></div></div><div class="module-preview-list">${pilihan.map((m,i)=>modulePreviewRow(m,i)).join('')}</div></section>
        <section class="portfolio-subsection"><div class="portfolio-subhead"><span>02</span><div><h3>Video praktik mengajar UAS</h3><p>Video utama dari salah satu siklus yang dipilih</p></div></div>${videoMarkup(videos.uas, 'Siklus 2, 3, atau 4')}</section>
        <section class="portfolio-subsection"><div class="portfolio-subhead"><span>03</span><div><h3>Instrumen asesmen pendukung</h3><p>Dokumen yang tersedia dalam paket</p></div></div><div class="resource-grid">${assessmentDocs.map(d=>`<article class="resource-card"><span class="resource-badge">${esc(d.tipe || 'DOC')}</span><h4>${esc(d.judul || 'Instrumen asesmen')}</h4><p>${esc(d.deskripsi || '')}</p>${link(d.path, 'Buka / unduh dokumen ↗', 'btn btn-outline btn-small', {download:true})}</article>`).join('') || '<div class="inline-preview-empty">Belum ada instrumen yang ditautkan.</div>'}</div><p class="small-note">Pasangkan instrumen dengan siklus praktik yang sesuai. Dokumen pendukung tidak otomatis dianggap sebagai hasil asesmen Siklus 2–4.</p></section>
        <section class="portfolio-subsection"><div class="portfolio-subhead"><span>04</span><div><h3>Analisis keseluruhan UAS</h3><p>Kesimpulan dari tiga topik praktik</p></div></div><p class="preserve-lines analysis-summary">${esc(uas.analisis || '')}</p><div class="analysis-detail-grid">${pilihan.map(m=>`<article class="analysis-detail"><h4>${esc(m.siklus || '')} · ${esc(m.nama || '')}</h4><p><b>Tujuan:</b> ${esc(m.tujuan || '')}</p><p><b>Tantangan:</b> ${esc(m.tantangan || '')}</p><p><b>Tindak lanjut:</b> ${esc(m.perbaikan || '')}</p></article>`).join('')}</div></section>`;
      return;
    }
    if (tab === 'ringkasan') {
      target.innerHTML = `<div class="tab-overview-grid"><div><div class="section-kicker">PAKET PRAKTIK UAS</div><h3>${esc(uas.judul || 'Praktik Mengajar Mandiri Siklus 2–4')}</h3><p>${esc(uas.ringkasan || '')}</p><p>Ketiga perangkat dipertahankan sebagai bukti perkembangan. Video utama dipilih dari siklus 2, 3, atau 4 setelah rekaman dan kelengkapan buktinya diperiksa.</p><div class="inline-links"><a class="btn btn-primary" href="#dokumen">Cari dokumen</a><a class="btn btn-outline" href="#refleksi">Lihat refleksi</a></div></div><aside class="side-note"><h4>Kriteria memilih produk utama</h4><ul class="check-list"><li>Tujuan dan langkah pembelajaran jelas</li><li>Media sesuai dengan konsep yang dipelajari</li><li>Analisis didukung bukti praktik</li><li>Video sesuai dengan modul yang dipilih</li></ul></aside></div>`;
    } else if (tab === 'perangkat') {
      target.innerHTML = `<h3 class="tab-panel-heading">Perangkat ajar siklus 2–4</h3><p>Pilih dan buka modul yang sesuai dengan siklus praktik. Penetapan produk UAS terbaik akan dilakukan setelah bukti pelaksanaan dan video ditinjau.</p><div class="module-grid">${pilihan.map(m => moduleCard(m,'Unduh modul')).join('')}</div>`;
    } else if (tab === 'bukti') {
      const aset = (D.asesmen && D.asesmen.dokumen) || [];
      target.innerHTML = `<h3 class="tab-panel-heading">Media, LKPD, dan bukti asesmen</h3><p>Pasangkan media dan instrumen dengan siklus tempat artefak digunakan. Instrumen penilaian praktik terbimbing yang tersedia merupakan bukti pendukung dan tidak otomatis menjadi penilaian praktik mandiri.</p><div class="file-grid">${aset.map(d=>`<article class="file-card"><div class="file-icon">${esc((d.path.split('.').pop()||'DOC').toUpperCase())}</div><div><h3>${esc(d.judul)}</h3><p>${esc(d.deskripsi)}</p>${link(d.path,'Buka instrumen','btn btn-outline btn-small',{download:true})}</div></article>`).join('')}</div><div class="note-box">Tambahkan LKPD, contoh hasil kerja yang diizinkan untuk dibagikan, dan rekap hasil asesmen yang benar-benar berasal dari siklus terkait. Jangan mengunggah data pribadi murid.</div>`;
    } else if (tab === 'video') {
      target.innerHTML = videoMarkup(videos.uas, (videos.uas && videos.uas.modul) || 'Pilih siklus 2, 3, atau 4') + `<div class="note-box">Tautan video UAS belum tersedia dalam paket ini. Setelah dipilih, perbarui judul, siklus, dan analisis pada <code>content/video.js</code>.</div>`;
    } else {
      target.innerHTML = `<h3 class="tab-panel-heading">Analisis perkembangan praktik</h3><p>${esc(uas.analisis || '')}</p><div class="module-grid">${pilihan.map(m=>`<article class="module-mini-card"><span class="status neutral">${esc(m.siklus || m.nama || '')}</span><h3>${esc(m.nama || '')}</h3><p>${esc(m.tantangan || m.catatan || '')}</p><div class="analysis-block"><b>Rencana perbaikan</b><p>${esc(m.perbaikan || 'Lengkapi dengan hasil refleksi dan bukti praktik yang sesuai.')}</p></div></article>`).join('')}</div><div class="inline-links"><a href="#refleksi" class="btn btn-outline btn-small">Lihat rencana pengembangan diri</a></div>`;
    }
  }
  function setupTabs(group, renderer) {
    const buttons = Array.from(document.querySelectorAll(`[data-tab-group="${group}"]`));
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-selected', String(active)); });
        const content = $(group + 'TabContent');
        if (content) content.setAttribute('aria-labelledby', button.id);
        renderer(button.dataset.tab);
      });
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        const i = buttons.indexOf(button);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next].focus(); buttons[next].click();
      });
    });
    renderer('ringkasan');
  }
  renderUtsTab('all');
  renderUasTab('all');

  // Media: dua game utama dapat dimainkan langsung di dalam halaman.
  const mediaItems = D.media || [];
  const mediaIcons = { 'Game HTML':'🎮', 'PPTX':'▤', 'DOCX':'▧', 'PDF':'▥', 'HTML':'⌘' };
  const playableGamePath = (path) => /(?:Game_Aktivitas_1_Titut_Meteor_Lebih_Banyak|Game_Aktivitas_2_Mitchell_Baker_Kick_Animation)\.html?$/i.test(String(path || ''));
  if ($('mediaGrid')) $('mediaGrid').innerHTML = mediaItems.map((item, index) => {
    const path = localPath(item.path || '');
    const playable = playableGamePath(path);
    const title = item.nama || item.judul || 'Media pembelajaran';
    const safeTitle = esc(title);
    const description = esc(item.deskripsi || item.detail || '');
    const base = `<div class="media-card-heading"><div class="media-card-heading-icon" aria-hidden="true">${esc(mediaIcons[item.tipe] || '▧')}</div><div><div class="media-type">${esc(item.tipe || 'Media')}</div><h3>${safeTitle}</h3><p>${description}</p></div></div>`;
    if (playable) {
      return `<article class="media-card media-card--playable" data-playable-media="${index}">${base}<div class="media-game-frame"><iframe class="media-game-embed" src="${esc(path)}" title="Permainan interaktif ${safeTitle}" loading="lazy" allow="fullscreen; autoplay; gamepad" allowfullscreen></iframe></div><div class="media-game-actions"><span class="media-play-note"><span class="media-live-dot"></span> Permainan aktif di halaman ini</span><div class="media-action-buttons"><button type="button" class="btn btn-outline btn-small" data-game-fullscreen="${index}">Perbesar permainan ⛶</button><a class="btn btn-text btn-small" href="${esc(path)}" target="_blank" rel="noopener noreferrer">Buka versi penuh ↗</a></div></div></article>`;
    }
    const isHtml = /\.html?$/i.test(path);
    return `<article class="media-card">${base}<div class="media-card-actions">${link(path, item.aksi || (isHtml ? 'Buka media' : 'Unduh media'), 'btn btn-outline btn-small', {download: !isHtml, newTab: isHtml})}</div></article>`;
  }).join('');

  document.querySelectorAll('[data-game-fullscreen]').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.media-card--playable');
      const frame = card && card.querySelector('iframe');
      if (frame && typeof frame.requestFullscreen === 'function') {
        frame.requestFullscreen().catch(() => {});
      } else if (frame) {
        frame.focus();
        button.textContent = 'Gunakan mode layar penuh browser';
      }
    });
  });

  // Kegiatan nonmengajar
  const n = D.nonmengajar || {};
  if ($('nonmengajarIntro')) $('nonmengajarIntro').textContent = n.intro || '';
  if ($('nonmengajarGrid')) $('nonmengajarGrid').innerHTML = (n.kegiatan || []).map((k, i) => `<article class="activity-card"><div class="analysis-card-top"><span class="card-icon" aria-hidden="true">${esc(k.ikon || '◎')}</span>${status(k.status || 'Perlu dilengkapi', /tersedia|terdokumentasi/i.test(k.status || '') && !/perlu/i.test(k.status || '') ? 'good' : 'wait')}</div><h3>${esc(k.judul || `Kegiatan ${i+1}`)}</h3><div class="activity-meta">${esc(k.lokasi || 'Lokasi perlu dilengkapi')} · ${esc(k.tanggal || 'Tanggal perlu dilengkapi')}</div><p>${esc(k.isi || '')}</p><div class="activity-note">${esc(k.catatan || 'Tambahkan refleksi dan dokumentasi yang sesuai.')}</div>${k.dokumen ? link(k.dokumen, k.labelTautan || 'Buka dokumen pendukung', 'btn btn-outline btn-small', {download:true}) : ''}</article>`).join('');
  if ($('nonmengajarChallenge')) $('nonmengajarChallenge').textContent = n.tantangan || '';

  // Asesmen
  const a = D.asesmen || {};
  if ($('assessmentIntro')) $('assessmentIntro').textContent = a.intro || '';
  if ($('assessmentGrid')) $('assessmentGrid').innerHTML = (a.analisis || []).map(item => `<article class="assessment-item"><h3>${esc(item.judul)}</h3><p>${esc(item.isi)}</p></article>`).join('');
  if ($('assessmentFiles')) $('assessmentFiles').innerHTML = (a.dokumen || []).map(d => `<article class="file-card"><div class="file-icon">${esc((d.tipe || d.path.split('.').pop() || 'DOC').toUpperCase())}</div><div><h3>${esc(d.judul)}</h3><p>${esc(d.deskripsi)}</p>${link(d.path, 'Buka/unduh instrumen', 'btn btn-outline btn-small', {download:true})}</div></article>`).join('');
  if ($('assessmentReminder')) $('assessmentReminder').textContent = a.pengingat || '';

  // Refleksi: filosofi, pengalaman, dan rencana pengembangan menjadi tiga bagian terpisah.
  const f = D.filosofi || {};
  if ($('philosophyContent')) $('philosophyContent').innerHTML = `<article class="philosophy-card"><div class="philosophy-main"><div class="section-kicker">BAGIAN 1 · FILOSOFI MENGAJAR</div><h3>${esc(f.judul || 'Keyakinan saya sebagai calon guru')}</h3><p>${esc(f.isi || '')}</p></div><div class="principle-grid">${(f.prinsip || []).map((item, i) => `<div class="principle"><span class="principle-number">${String(i+1).padStart(2,'0')}</span><div><b>${esc(item.judul)}</b><span>${esc(item.isi)}</span></div></div>`).join('')}</div></article>`;
  const r = D.refleksi || {};
  if ($('reflectionIntro')) $('reflectionIntro').textContent = r.umum || '';
  if ($('reflectionGrid')) $('reflectionGrid').innerHTML = (r.pengalaman || []).map((item, i) => `<article class="reflection-card"><div class="number">${String(i+1).padStart(2,'0')}</div><h3>${esc(item.judul)}</h3><p>${esc(item.isi)}</p></article>`).join('');
  const dev = D.rencana_pengembangan || {};
  if ($('developmentGrid')) $('developmentGrid').innerHTML = (dev.prioritas || []).map((item, i) => `<article class="development-card"><div class="development-meta">PRIORITAS ${String(i+1).padStart(2,'0')}</div><h3>${esc(item.judul)}</h3><p>${esc(item.tindakan)}</p><p><b>Indikator:</b> ${esc(item.indikator)}</p><p><b>Target:</b> ${esc(item.target)}</p></article>`).join('');
  if ($('reflectionDoc') && r.dokumen) $('reflectionDoc').href = localPath(r.dokumen);
  const fb = D.umpanbalik || {};
  if ($('feedbackMini')) $('feedbackMini').innerHTML = `<b>Umpan balik GP/DPL:</b> ${esc(fb.teks || 'Masukkan catatan asli dari Guru Pamong atau Dosen Pembimbing.')} ${status(fb.status || 'Perlu dilengkapi', 'wait')}`;

  // Pusat dokumen dengan pencarian langsung
  const docs = D.dokumen || [];
  const grid = $('documentsGrid');
  function drawDocs(query = '') {
    const q = query.toLowerCase().trim();
    const filtered = docs.filter(d => [d.judul, d.detail, d.kategori, d.tipe].join(' ').toLowerCase().includes(q));
    if (grid) grid.innerHTML = filtered.map(d => `<article class="document-card"><div class="file-icon">${esc(d.tipe || 'DOC')}</div><div><div class="category">${esc(d.kategori || 'Dokumen')}</div><h3>${esc(d.judul)}</h3><p>${esc(d.detail || '')}</p>${link(d.path, /html/i.test(d.tipe || '') ? 'Jalankan media' : /pdf/i.test(d.tipe || '') ? 'Buka PDF' : 'Unduh berkas', 'btn btn-outline btn-small', {download: !/html/i.test(d.tipe || ''), newTab: /html/i.test(d.tipe || '')})}</div></article>`).join('');
    if ($('documentCount')) $('documentCount').textContent = `${filtered.length} dari ${docs.length} berkas`;
    if ($('documentsEmpty')) $('documentsEmpty').hidden = filtered.length > 0;
  }
  drawDocs();
  if ($('documentSearch')) $('documentSearch').addEventListener('input', event => drawDocs(event.target.value));

  // Urutan bagian dapat diatur melalui dashboard admin (_sectionOrder).
  const sectionOrder = Array.isArray(D._sectionOrder) ? D._sectionOrder : [];
  if (sectionOrder.length) {
    const main = document.querySelector('main');
    const navLinks = $('mainNav');
    sectionOrder.forEach(id => {
      const section = $(id);
      if (section && main && section.parentElement === main) main.appendChild(section);
      if (navLinks) { const linkEl = navLinks.querySelector('a[href="#' + CSS.escape(id) + '"]'); if (linkEl) navLinks.appendChild(linkEl); }
    });
  }

  // Navigasi mobile dan penanda bagian aktif yang mengikuti posisi gulir secara konsisten.
  const menu = $('menuToggle'), nav = $('mainNav');
  if (menu && nav) menu.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
  });
  if (nav) nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    if (menu) menu.setAttribute('aria-expanded', 'false');
  }));
  const backTop = $('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => backTop.classList.toggle('show', window.scrollY > 450), {passive:true});
    backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }
  if (nav) {
    const navItems = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const sections = navItems.map(a => $(a.getAttribute('href').slice(1))).filter(Boolean);
    const currentName = $('navCurrentName');
    const setCurrentSection = (section) => {
      if (!section) return;
      navItems.forEach(a => {
        const active = a.getAttribute('href') === '#' + section.id;
        a.classList.toggle('active', active);
        if (active) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
      const activeLink = navItems.find(a => a.getAttribute('href') === '#' + section.id);
      if (currentName) currentName.textContent = activeLink ? activeLink.textContent.trim() : section.id;
    };
    const updateActiveSection = () => {
      const header = document.querySelector('.topbar');
      const threshold = (header ? header.getBoundingClientRect().height : 76) + 44;
      const candidates = sections.map(section => ({section, top: section.getBoundingClientRect().top}))
        .filter(entry => entry.top <= threshold + 1)
        .sort((a,b) => b.top - a.top);
      let current = candidates.length ? candidates[0].section : sections[0];
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections.slice().sort((a,b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top).slice(-1)[0] || current;
      }
      setCurrentSection(current);
    };
    let sectionTicking = false;
    const requestSectionUpdate = () => {
      if (sectionTicking) return;
      sectionTicking = true;
      window.requestAnimationFrame(() => { updateActiveSection(); sectionTicking = false; });
    };
    window.addEventListener('scroll', requestSectionUpdate, {passive:true});
    window.addEventListener('resize', requestSectionUpdate);
    window.addEventListener('hashchange', requestSectionUpdate);
    navItems.forEach(a => a.addEventListener('click', () => {
      const target = $(a.getAttribute('href').slice(1));
      setCurrentSection(target);
      window.setTimeout(requestSectionUpdate, 120);
    }));
    requestSectionUpdate();
    window.addEventListener('load', () => window.setTimeout(requestSectionUpdate, 80), {once:true});
  }
})();
