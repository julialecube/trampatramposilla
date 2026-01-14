// Fotos: img/01.jpg fins img/27.jpg
const imgs = Array.from({ length: 27 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { src: `img/${n}.jpg`, name: `${n}.jpg` };
});

// Elements
const feed = document.getElementById("infiniteFeed");
const enterZone = document.getElementById("enterZone");
const startGateBtn = document.getElementById("startGateBtn");
const enterNote = document.getElementById("enterNote");

const gate = document.getElementById("gate");
const gateBtn = document.getElementById("gateBtn");
const gateMsg = document.getElementById("gateMsg");

const baitZone = document.getElementById("baitZone");
const baitWall = document.getElementById("baitWall");
const pixelGrid = document.getElementById("pixelGrid");

const viewer = document.getElementById("viewer");
const bigImg = document.getElementById("bigImg");
const currentNameEl = document.getElementById("currentName");
const statusEl = document.getElementById("status");

const nextBtn = document.getElementById("nextBtn");
const moveBtn = document.getElementById("moveBtn");
const loadBtn = document.getElementById("loadBtn");
const dlBtn = document.getElementById("dlBtn");

const loader = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");
const cancelFake = document.getElementById("cancelFake");

const progressWrap = document.getElementById("progressWrap");
const progressBar = document.getElementById("progressBar");
const progressPct = document.getElementById("progressPct");
const progressLabel = document.getElementById("progressLabel");
const progressNote = document.getElementById("progressNote");

const finalRow = document.getElementById("finalRow");

// Estat
let currentName = null;
let lastIndex = -1;
let dotsTimer = null;

// ---------- TEXT INFINIT ----------
let lines = 0;
const REVEAL_AFTER_LINES = 22; // quantitat de "mes abaix plis" abans que surti "entrar"
const BATCH = 8;

function addLine(text) {
  const p = document.createElement("p");
  p.className = "feedLine";
  p.textContent = text;
  feed.appendChild(p);
  lines++;
}

function addBatch() {
  for (let i = 0; i < BATCH; i++) addLine("mes abaix plis");
  if (lines >= REVEAL_AFTER_LINES && enterZone && enterZone.hidden) {
    enterZone.hidden = false;
    // No fem scroll automàtic: apareix “entrar” quan hi arribes fent scroll
  }
}

// Inicial
if (feed) addBatch();
if (feed) addBatch();

// Scroll: si arribes al final, afegeix més text
window.addEventListener("scroll", () => {
  // Si ja s’ha revelat "entrar", NO afegeixis més text.
  if (enterZone && !enterZone.hidden) return;

  const y = window.scrollY || document.documentElement.scrollTop;
  const nearBottom = window.innerHeight + y >= document.body.offsetHeight - 120;

  if (nearBottom) addBatch();
});

// ---------- ENTRAR / PASSADÍS ----------
function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
}

if (startGateBtn) {
  startGateBtn.addEventListener("click", () => {
    if (gate) gate.hidden = false;
    if (enterNote) enterNote.textContent = "ok. ara baixa una mica.";
    // No scroll automàtic
  });
}

const gateSteps = [
  { msg: "clica aquí per veure les fotos", btn: "aquí" },
  { msg: "aquí aquí", btn: "aquí" },
  { msg: "eii no, però aquí sí!", btn: "aquí sí" },
  { msg: "bait!! ara enserio es aquí", btn: "venga va" },
];

let step = 0;

if (gateBtn) {
  gateBtn.addEventListener("click", () => {
    step++;

    if (step <= gateSteps.length) {
      const s = gateSteps[step - 1];
      if (gateMsg) gateMsg.textContent = s.msg;
      gateBtn.textContent = s.btn;
    }

    if (step === gateSteps.length) {
      if (baitZone) baitZone.hidden = false;
      if (finalRow) finalRow.hidden = false;
      buildBaitWall();
      buildPixelGallery();
      // No obrim cap foto sola: primer veus pixelades
    }
  });
}

// ---------- BAIT WALL ----------
function buildBaitWall() {
  if (!baitWall) return;
  baitWall.innerHTML = "";
  const total = 16;
  for (let i = 0; i < total; i++) {
    const d = document.createElement("div");
    d.className = "baitBlock" + (i % 5 === 0 ? " big" : "");
    d.textContent = "BAIT";
    baitWall.appendChild(d);
  }
}

// ---------- GALERIA PIXELADA ----------
function buildPixelGallery() {
  if (!pixelGrid) return;
  pixelGrid.innerHTML = "";

  imgs.forEach((it) => {
    const btn = document.createElement("button");
    btn.className = "thumb pixelWrap";
    btn.type = "button";
    btn.innerHTML = `
      <img class="pixelImg" src="${it.src}" alt="preview">
      <span class="pixelTag">clica aquí per veure</span>
    `;
    btn.addEventListener("click", () => openImage(it));
    pixelGrid.appendChild(btn);
  });
}

// ---------- VISOR (foto gran) ----------
function openImage(it) {
  if (!viewer || !bigImg) return;

  currentName = it.name;
  viewer.hidden = false;
  bigImg.src = it.src;
  if (currentNameEl) currentNameEl.textContent = currentName;

  // reset trampes
  setStatus("problemes…");

  if (loader) loader.hidden = true;
  if (dotsTimer) clearInterval(dotsTimer);
  dotsTimer = null;

  if (progressWrap) progressWrap.hidden = true;
  if (progressBar) progressBar.style.width = "0%";
  if (progressPct) progressPct.textContent = "0%";
  if (progressNote) progressNote.textContent = "—";

  setTimeout(() => setStatus("ok ara sí (parcial)"), 600);

  // IMPORTANT: en clicar miniatura, baixa a la foto gran
  viewer.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showRandomImage() {
  if (!imgs.length) return;
  let idx = Math.floor(Math.random() * imgs.length);
  if (imgs.length > 1) {
    while (idx === lastIndex) idx = Math.floor(Math.random() * imgs.length);
  }
  lastIndex = idx;
  openImage(imgs[idx]);
}

if (nextBtn) nextBtn.addEventListener("click", () => showRandomImage());

// Botó que es mou
if (moveBtn) {
  moveBtn.addEventListener("click", () => {
    const parent = moveBtn.parentElement;
    const maxX = Math.max(0, parent.clientWidth - moveBtn.offsetWidth);
    const maxY = 120;

    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);

    moveBtn.style.position = "relative";
    moveBtn.style.left = x + "px";
    moveBtn.style.top = y + "px";

    const msgs = ["ups", "gairebé", "no", "sí", "bait"];
    setStatus(msgs[Math.floor(Math.random() * msgs.length)]);
  });
}

// Loading infinit
if (loadBtn) {
  loadBtn.addEventListener("click", () => {
    if (!loader || !loaderText) return;

    loader.hidden = false;
    setStatus("carregant…");

    let dots = 0;
    if (dotsTimer) clearInterval(dotsTimer);
    dotsTimer = setInterval(() => {
      dots = (dots + 1) % 4;
      loaderText.textContent = "carregant" + ".".repeat(dots);
    }, 450);
  });
}

if (cancelFake) {
  cancelFake.addEventListener("click", () => {
    if (loader) loader.hidden = true;
    if (dotsTimer) clearInterval(dotsTimer);
    dotsTimer = null;
    setStatus("cancel·lat (però no)");
  });
}

// Descàrrega fake 99%
if (dlBtn) {
  dlBtn.addEventListener("click", () => {
    if (!currentName) {
      setStatus("obre una imatge primer");
      return;
    }
    if (!progressWrap || !progressBar || !progressPct || !progressLabel || !progressNote) return;

    progressWrap.hidden = false;
    progressLabel.textContent = `descarregant ${currentName}…`;
    progressNote.textContent = "preparant…";
    setStatus("");

    let p = 0;
    progressBar.style.width = "0%";
    progressPct.textContent = "0%";

    const interval = setInterval(() => {
      if (p < 90) p += 10;
      else if (p < 99) p += 1;
      else p = 99;

      progressBar.style.width = p + "%";
      progressPct.textContent = p + "%";

      if (p === 99) {
        progressNote.textContent = "quasi. però no.";
        setStatus("99% per sempre.");
        clearInterval(interval);
      }
    }, 200);
  });
}
