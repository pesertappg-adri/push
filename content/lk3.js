/* LK3 / E-PORTOFOLIO 1: isi kartu di bawah berdasarkan artefak dan bukti autentik.
   Kartu dibuka dengan klik. Jangan mengubah status menjadi tersedia sebelum bukti benar-benar siap. */
window.EPORTO = window.EPORTO || {};
window.EPORTO.lk3 = {
  intro: "Bagian ini menghubungkan perangkat pembelajaran, materi, media, video praktik, kegiatan nonmengajar, serta instrumen asesmen. Setiap artefak dianalisis dari konteks, tujuan, kelebihan, keterbatasan, kaitan teori, dan tindak lanjut.",
  kartu: [
    {
      previewUrl: "", previewWidth: 100, previewHeight: 560, previewPosition: "atas",
      judul: "Perencanaan pembelajaran", ikon: "▤", status: "Berkas tersedia", ringkasan: "Empat modul ajar Berpikir Komputasional kelas VII beserta tujuan dan skenario pembelajarannya.",
      konteks: "Modul ajar kelas VII Fase D pada materi Algoritma, Optimasi Penjadwalan, Struktur Data, dan Representasi Data.",
      tujuan: "Merancang aktivitas yang membantu murid menyelesaikan persoalan melalui urutan langkah, optimasi sumber daya, penelusuran data, dan representasi biner.",
      kelebihan: "Modul menggunakan persoalan kontekstual dan aktivitas yang dapat dibantu media konkret, diskusi, serta pertanyaan pemandu.",
      kekurangan: "Beberapa bagian pemetaan asesmen awal pada berkas memerlukan pengisian hasil nyata. Analisis akhir juga harus ditautkan dengan pelaksanaan dan bukti per siklus.",
      teori: "Dapat dikaitkan dengan Problem Based Learning (PBL), scaffolding, asesmen formatif, dan penyesuaian pembelajaran dengan kesiapan murid—sejauh strategi itu memang tampak pada dokumen dan pelaksanaan.",
      tindak: "Lengkapi data asesmen awal yang benar-benar dikumpulkan, pasangkan LKPD dan rubrik yang digunakan, lalu catat revisi modul setelah praktik.",
      berkas: "assets/artefak/Modul_Ajar_1_Algoritma_Gelang_Warna_Warni.docx", labelTautan: "Buka modul ajar siklus 1"
    },
    {
      previewUrl: "", previewWidth: 100, previewHeight: 560, previewPosition: "atas",
      judul: "Media dan materi ajar", ikon: "▧", status: "Sebagian berkas tersedia", ringkasan: "Katalog media meliputi game HTML interaktif, presentasi, LKPD, dan alat peraga konkret yang perlu dipasangkan dengan konteks penggunaannya.",
      konteks: "Media pembelajaran disusun untuk mendukung pemahaman konsep dan keterlibatan murid. Beberapa game dalam paket saat ini terkait materi UKIN Fakta, Opini, dan Hoaks; jangan keliru menyebutnya sebagai media siklus BK jika tidak digunakan pada siklus tersebut.",
      tujuan: "Membuat konsep lebih mudah diakses dan memberi kesempatan kepada murid untuk berinteraksi dengan materi.",
      kelebihan: "Media konkret atau interaktif dapat membuka peluang murid untuk mencoba, berdiskusi, dan memperoleh umpan balik.",
      kekurangan: "Belum semua media disertai bukti pemakaian pada kelas atau siklus tertentu. Ada lebih dari satu versi game, sehingga versi final perlu dipilih.",
      teori: "Dapat dianalisis melalui keselarasan media dengan tujuan pembelajaran, aksesibilitas, representasi multimodal, dan keterlibatan peserta didik.",
      tindak: "Pilih versi final, tambahkan tangkapan layar penggunaan yang autentik, dan jelaskan media mana yang digunakan untuk tiap materi.",
      berkas: "assets/media/Game_Aktivitas_1_Titut_Meteor_Lebih_Banyak.html", labelTautan: "Buka contoh media interaktif"
    },
    {
      previewUrl: "", previewWidth: 100, previewHeight: 560, previewPosition: "atas",
      judul: "Cuplikan mengajar", ikon: "▷", status: "Menunggu tautan video", ringkasan: "Panel untuk video praktik UTS dan UAS, dengan analisis berdasarkan kejadian nyata dan cap waktu yang relevan.",
      konteks: "Video perlu dipasangkan dengan siklus, kelas, materi, dan modul yang benar.",
      tujuan: "Mendokumentasikan pelaksanaan pembelajaran, interaksi murid, strategi guru, penggunaan media, dan asesmen.",
      kelebihan: "Video dapat membantu meninjau kembali aspek praktik yang sulit dicatat secara lengkap ketika mengajar.",
      kekurangan: "Belum ada tautan rekaman praktik yang berhasil diidentifikasi dalam berkas paket ini, sehingga analisis kejadian spesifik belum dapat dibuat.",
      teori: "Analisis dapat diarahkan pada sintaks model pembelajaran, kejelasan instruksi, scaffolding, keterlibatan murid, dan asesmen—jika terlihat dalam rekaman.",
      tindak: "Tambahkan tautan video yang dapat diakses, catat cap waktu contoh kekuatan dan tantangan, serta pastikan izin publikasi.",
      catatanTambahan: "Jangan menulis seolah-olah peristiwa tertentu tampak dalam video sebelum rekamannya diperiksa. Edit content/video.js untuk menambahkan tautan.",
      labelTautan: "Lihat pengaturan video"
    },
    {
      previewUrl: "", previewWidth: 100, previewHeight: 560, previewPosition: "atas",
      judul: "Kegiatan nonmengajar 1 · Halaqah", ikon: "◎", status: "Menunggu bukti", ringkasan: "Slot dokumentasi kegiatan nonmengajar. Isi hanya jika kegiatan ini sesuai dengan pengalaman dan ketentuan PPL yang dinilai.",
      konteks: "Nama ini merupakan label awal mengikuti referensi tata letak. Tanggal, peran, dan bukti harus dikonfirmasi sebelum publikasi.",
      tujuan: "Jelaskan tujuan kegiatan berdasarkan kegiatan sebenarnya.",
      kelebihan: "Belum dinilai; lengkapi setelah bukti kegiatan diperiksa.",
      kekurangan: "Foto, tanggal, peran pribadi, dan refleksi belum tersedia dalam paket ini.",
      teori: "Hubungkan dengan kompetensi profesional atau sosial guru jika relevan dengan kegiatan yang benar-benar dilakukan.",
      tindak: "Unggah dokumentasi yang diizinkan di assets/bukti_kegiatan/ dan edit content/nonmengajar.js. Jika tidak relevan, ganti judul dengan kegiatan yang benar-benar dilakukan."
    },
    {
      previewUrl: "", previewWidth: 100, previewHeight: 560, previewPosition: "atas",
      judul: "Kegiatan nonmengajar 2 · Salat Duha", ikon: "◎", status: "Menunggu bukti", ringkasan: "Slot dokumentasi kegiatan nonmengajar; nama kegiatan harus diverifikasi dengan pengalaman dan bukti yang tersedia.",
      konteks: "Tanggal, peran mahasiswa, dan relevansi kegiatan terhadap PPL belum ditetapkan dalam inventarisasi.",
      tujuan: "Jelaskan tujuan dan konteks berdasarkan kegiatan yang benar-benar didokumentasikan.",
      kelebihan: "Belum dinilai; isi setelah dokumentasi dan peran pribadi diverifikasi.",
      kekurangan: "Foto atau dokumen bukti belum ditemukan secara pasti.",
      teori: "Gunakan kaitan teori hanya jika relevan dan didukung konteks kegiatan.",
      tindak: "Lengkapi bukti autentik dan refleksi, atau ganti dengan kegiatan nonmengajar yang benar-benar dilakukan."
    },
    {
      previewUrl: "", previewWidth: 100, previewHeight: 560, previewPosition: "atas",
      judul: "Kegiatan nonmengajar 3 · Kebersihan lingkungan", ikon: "◎", status: "Menunggu bukti", ringkasan: "Slot dokumentasi kontribusi di luar pembelajaran rutin; tunggu bukti sebelum menyatakan kegiatan telah dilaksanakan.",
      konteks: "Nama ini mengikuti contoh tata letak yang dirancang. Tanggal, peran, dan pelaksanaan belum diverifikasi.",
      tujuan: "Lengkapi tujuan kegiatan sesuai bukti yang tersedia.",
      kelebihan: "Belum dinilai.",
      kekurangan: "Bukti autentik dan refleksi belum tersedia dalam paket ini.",
      teori: "Jika sesuai, kaitkan dengan budaya sekolah, tanggung jawab, atau kolaborasi secara proporsional.",
      tindak: "Tambahkan foto atau dokumen yang diizinkan dan deskripsi kontribusi pribadi; ubah nama kegiatan bila contoh ini tidak sesuai."
    }
  ],
  rangkuman: {
    judul: "Analisis dan refleksi saya",
    isi: "Analisis LK3 perlu menunjukkan hubungan antara rancangan, materi, media, video, kegiatan nonmengajar, dan asesmen. Kesimpulan akhir ditulis setelah bukti tiap kategori diperiksa, sehingga kekuatan, keterbatasan, kaitan teori, dan tindak lanjut tidak hanya berupa asumsi.",
    tag: ["Konteks", "Tujuan", "Bukti", "Teori", "Tindak lanjut"]
  },
  asesmen: {
    judul: "Instrumen asesmen dan umpan balik",
    isi: "Instrumen yang tersedia perlu dipasangkan dengan tujuan dan siklus penggunaannya. Lampiran penilaian praktik terbimbing diperlakukan sebagai bukti pendukung sampai relevansinya dengan siklus UTS/UAS dikonfirmasi."
  }
};
