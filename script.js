// ===== 1. Pengaturan: ganti dengan data Anda =====
const NOMOR_WA = "82333916196"; // format: 62 + nomor tanpa angka 0 di depan
const EMAIL = "sukamatel@gmail.com"; // email tujuan pesan

// ===== 2. Menu di HP =====
const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  const terbuka = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", terbuka);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// ===== 2. Daftar video portofolio =====
// youtube: isi dengan ID video YouTube Shorts (bagian sesudah /shorts/ pada tautan)
// tiktok : tautan video TikTok (opsional, muncul sebagai tautan di bawah video)
const DAFTAR_VIDEO = [
  {
    judul: "Klip podcast",
    youtube: "QNHCqV-Mp6Q",
    tiktok: "https://www.tiktok.com/@tempatbercerita76/video/7689472863245536532",
  },
];

const grid = document.getElementById("portfolio-grid");
DAFTAR_VIDEO.forEach((v) => {
  const item = document.createElement("div");
  item.className = "item";
  const frame = v.youtube
    ? '<iframe src="https://www.youtube.com/embed/' + v.youtube + '" title="' + v.judul + '" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>'
    : '<div class="empty"><strong>' + v.judul + '</strong><span>Isi ID video YouTube di script.js agar video bisa diputar di sini.</span></div>';
  const tautan = v.tiktok ? '<a href="' + v.tiktok + '" target="_blank" rel="noopener">Tonton di TikTok</a>' : "";
  item.innerHTML = '<div class="frame">' + frame + "</div><h3>" + v.judul + "</h3>" + tautan;
  grid.appendChild(item);
});

// ===== 3. Form kontak: WhatsApp atau email dengan pesan siap kirim =====
const form = document.getElementById("form");
const statusForm = document.getElementById("form-status");

// Email di bagian bawah form ikut pengaturan EMAIL di atas
const emailLink = document.getElementById("email-link");
emailLink.href = "mailto:" + EMAIL;
emailLink.textContent = EMAIL;

function susunPesan() {
  const d = new FormData(form);
  let pesan =
    "Halo Framecut Studio, saya " + d.get("nama") +
    ". Saya ingin memesan paket " + d.get("paket") +
    ". Video saya: " + d.get("link") + ".";
  if (d.get("catatan").trim()) pesan += " Catatan: " + d.get("catatan").trim();
  return pesan;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = "https://wa.me/" + NOMOR_WA + "?text=" + encodeURIComponent(susunPesan());
  // Jika browser memblokir tab baru (sering terjadi di HP), buka WhatsApp di tab yang sama
  if (!window.open(url, "_blank")) window.location.href = url;
  statusForm.textContent = "WhatsApp dibuka. Tekan kirim di sana untuk menyelesaikan pesanan.";
});

document.getElementById("kirim-email").addEventListener("click", () => {
  if (!form.reportValidity()) return; // tampilkan peringatan jika ada kolom yang belum diisi
  window.location.href =
    "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Pesanan klip - Framecut Studio") +
    "&body=" + encodeURIComponent(susunPesan());
  statusForm.textContent = "Aplikasi email Anda akan terbuka dengan pesan siap kirim.";
});

// Tombol "Pilih ..." di bagian paket otomatis memilih paket di form
document.querySelectorAll("[data-paket]").forEach((t) =>
  t.addEventListener("click", () => { form.elements["paket"].value = t.dataset.paket; })
);

// ===== 4. Tahun otomatis di footer =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== 5. Penanda menu aktif: garis hitam bergeser ke menu yang diklik / bagian yang sedang dilihat =====
const menuLinks = [...nav.querySelectorAll("a:not(.btn)")];
const bar = document.createElement("span");
bar.className = "nav-bar";
nav.appendChild(bar);

let aktif = "";
let terkunci = false; // mencegah garis loncat-loncat saat halaman sedang bergulir karena klik

function setAktif(id) {
  aktif = id;
  const a = menuLinks.find((l) => l.getAttribute("href") === "#" + id);
  menuLinks.forEach((l) => l.classList.toggle("active", l === a));
  if (!a) { bar.style.opacity = 0; return; }
  bar.style.opacity = 1;
  bar.style.width = a.offsetWidth + "px";
  bar.style.transform = "translateX(" + a.offsetLeft + "px)";
}

menuLinks.forEach((l) =>
  l.addEventListener("click", () => {
    setAktif(l.getAttribute("href").slice(1));
    terkunci = true;
    setTimeout(() => (terkunci = false), 900);
  })
);

const pengamat = new IntersectionObserver(
  (daftar) => {
    if (terkunci) return;
    daftar.forEach((e) => { if (e.isIntersecting) setAktif(e.target.id); });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => pengamat.observe(s));

window.addEventListener("resize", () => setAktif(aktif));
window.addEventListener("load", () => setAktif(aktif));
