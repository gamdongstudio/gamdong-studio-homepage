/* =========================================================
   ★ 사진관 기본 정보 — 여기만 고치면 모든 페이지에 반영됩니다 ★
   (따옴표 " " 안의 글자만 바꿔주세요)
   ========================================================= */
const INFO = {
  name: "감동사진관",
  phone: "032-711-7878",                       // 대표 전화번호
  address: "경기도 광명시 ○○로 00, 1층",           // 도로명 주소
  addressHint: "광명사거리역 ○번 출구에서 도보 5분",   // 찾아오는 길 한 줄 설명
  hours: "평일 10:00 – 20:00 · 주말 10:00 – 18:00",
  closed: "매주 화요일 휴무 (예약 시 조정 가능)",
  parking: "건물 뒤편 주차장 1시간 무료",
  kakao: "https://pf.kakao.com/",               // 카카오톡 채널 주소
  naverBooking: "https://booking.naver.com/",   // 네이버 예약 주소
  instagram: "https://instagram.com/",
  mapQuery: "광명시청",                          // 지도에 표시할 검색어 (실제 주소로 바꿔주세요)
  bizInfo: "대표 ○○○ · 사업자등록번호 000-00-00000",
};

/* ---------- 이 아래는 수정하지 않으셔도 됩니다 ---------- */
const PAGES = [
  ["family.html", "가족사진"],
  ["id-photo.html", "증명·여권사진"],
  ["profile.html", "프로필사진"],
  ["gallery.html", "갤러리"],
  ["price.html", "가격안내"],
  ["contact.html", "오시는 길"],
];

const here = location.pathname.split("/").pop() || "index.html";
const tel = "tel:" + INFO.phone.replace(/[^0-9]/g, "");

// 상단 메뉴
document.querySelector("[data-header]").outerHTML = `
<header class="header">
  <div class="container">
    <a class="logo" href="index.html">${INFO.name}<small>GWANGMYEONG PHOTO STUDIO</small></a>
    <nav class="nav" id="nav">
      ${PAGES.map(([h, t]) => `<a href="${h}" class="${h === here ? "active" : ""}">${t}</a>`).join("")}
      <a class="btn btn-primary" href="contact.html#reserve">예약·문의</a>
    </nav>
    <button class="menu-toggle" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
  </div>
</header>`;

// 하단 정보 + 휴대폰 하단 고정 버튼
document.querySelector("[data-footer]").outerHTML = `
<footer class="footer">
  <div class="container">
    <div>
      <div class="logo">${INFO.name}</div>
      <p>가족의 오늘을 오래 남기는 광명의 사진관</p>
    </div>
    <div>
      <h4>연락처 · 영업시간</h4>
      <p><a href="${tel}">${INFO.phone}</a><br>${INFO.hours}<br>${INFO.closed}</p>
    </div>
    <div>
      <h4>주소</h4>
      <p>${INFO.address}<br>${INFO.parking}<br><a href="${INFO.instagram}" target="_blank" rel="noopener">인스타그램 보기 →</a></p>
    </div>
    <div class="copy">${INFO.bizInfo}<br>© ${new Date().getFullYear()} ${INFO.name}. 모든 사진의 저작권은 감동사진관에 있습니다.</div>
  </div>
</footer>
<div class="mobile-bar">
  <a class="mb-call" href="${tel}">📞 전화</a>
  <a class="mb-kakao" href="${INFO.kakao}" target="_blank" rel="noopener">💬 카톡</a>
  <a class="mb-book" href="contact.html#reserve">촬영 예약하기</a>
</div>
<div class="lightbox" id="lightbox">
  <button class="lb-close" aria-label="닫기">×</button>
  <button class="lb-prev" aria-label="이전 사진">‹</button>
  <img alt="">
  <button class="lb-next" aria-label="다음 사진">›</button>
  <div class="lb-cap"></div>
</div>`;

// 페이지 곳곳의 정보 채우기 (예: <span data-info="phone">)
document.querySelectorAll("[data-info]").forEach((el) => { el.textContent = INFO[el.dataset.info]; });
document.querySelectorAll("[data-link]").forEach((el) => {
  const k = el.dataset.link;
  el.href = k === "phone" ? tel : INFO[k];
  if (k !== "phone") { el.target = "_blank"; el.rel = "noopener"; }
});
const mapFrame = document.querySelector("[data-map]");
if (mapFrame) mapFrame.src = "https://maps.google.com/maps?q=" + encodeURIComponent(INFO.mapQuery) + "&z=16&output=embed";
document.querySelectorAll("[data-maplink]").forEach((el) => {
  const q = encodeURIComponent(INFO.address);
  el.href = { naver: "https://map.naver.com/p/search/" + q, kakao: "https://map.kakao.com/?q=" + q, google: "https://www.google.com/maps/search/" + q }[el.dataset.maplink];
  el.target = "_blank"; el.rel = "noopener";
});

// 휴대폰 메뉴 열기/닫기
const toggle = document.querySelector(".menu-toggle");
toggle.addEventListener("click", () => {
  const open = document.getElementById("nav").classList.toggle("open");
  document.body.classList.toggle("menu-open", open);
  document.body.style.overflow = open ? "hidden" : "";
});

// 갤러리 분류 버튼
document.querySelectorAll(".filters button").forEach((b) => {
  b.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach((x) => x.classList.toggle("on", x === b));
    document.querySelectorAll(".g-item").forEach((it) => {
      it.classList.toggle("hide", b.dataset.f !== "all" && it.dataset.cat !== b.dataset.f);
    });
  });
});

// 사진 크게 보기
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector("img");
let items = [], idx = 0;
function show(i) {
  idx = (i + items.length) % items.length;
  lbImg.src = items[idx].dataset.full;
  lb.querySelector(".lb-cap").textContent = items[idx].dataset.caption || "";
}
document.querySelectorAll(".g-item").forEach((it) => {
  it.addEventListener("click", () => {
    items = [...document.querySelectorAll(".g-item:not(.hide)")];
    show(items.indexOf(it));
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});
function closeLb() { lb.classList.remove("open"); document.body.style.overflow = ""; }
lb.querySelector(".lb-close").onclick = closeLb;
lb.querySelector(".lb-prev").onclick = (e) => { e.stopPropagation(); show(idx - 1); };
lb.querySelector(".lb-next").onclick = (e) => { e.stopPropagation(); show(idx + 1); };
lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") show(idx - 1);
  if (e.key === "ArrowRight") show(idx + 1);
});
// 휴대폰에서 손가락으로 넘기기
let sx = 0;
lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
});

// 예약 문의서 → 문자 메시지로 보내기
const form = document.getElementById("reserveForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const msg = `[${INFO.name} 예약문의]\n이름: ${d.get("name")}\n연락처: ${d.get("phone")}\n촬영: ${d.get("type")}\n인원: ${d.get("people") || "-"}\n희망일: ${d.get("date") || "-"} ${d.get("time") || ""}\n요청사항: ${d.get("memo") || "-"}`;
    location.href = "sms:" + INFO.phone.replace(/[^0-9]/g, "") + "?&body=" + encodeURIComponent(msg);
  });
  const t = new URLSearchParams(location.search).get("type");
  if (t) form.querySelector("[name=type]").value = t;
}

// 스크롤하면 부드럽게 나타나기
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
