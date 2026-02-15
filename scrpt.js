// =========================
// UTILIDADES
// =========================
function escapeHtml(str){
  return str.replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

// Año
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();


// =========================
// MENÚ MOBILE (PRO)
// - usa clase .is-open en vez de style.display
// - cierra al click fuera / al click en link / al hacer scroll
// - setea aria-expanded + aria-label
// - cierra si pasas a desktop (resize)
// =========================
const navBtn = document.getElementById("navBtn");
const mobileNav = document.getElementById("mobileNav");

function openMobileNav(){
  if (!mobileNav) return;
  mobileNav.classList.add("is-open");
  navBtn?.setAttribute("aria-expanded", "true");
  navBtn?.setAttribute("aria-label", "Cerrar menú");
}

function closeMobileNav(){
  if (!mobileNav) return;
  mobileNav.classList.remove("is-open");
  navBtn?.setAttribute("aria-expanded", "false");
  navBtn?.setAttribute("aria-label", "Abrir menú");
}

function toggleMobileNav(){
  if (!mobileNav) return;
  const isOpen = mobileNav.classList.contains("is-open");
  isOpen ? closeMobileNav() : openMobileNav();
}

if (navBtn && mobileNav) {
  navBtn.setAttribute("aria-expanded", "false");
  navBtn.setAttribute("aria-label", "Abrir menú");

  navBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMobileNav();
  });

  // Cerrar al click en cualquier link del menú
  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => closeMobileNav());
  });

  // Cerrar al click fuera
  document.addEventListener("click", (e) => {
    const clickedInside = mobileNav.contains(e.target) || navBtn.contains(e.target);
    if (!clickedInside) closeMobileNav();
  });

  // Cerrar al hacer scroll (se siente más pro)
  window.addEventListener("scroll", () => closeMobileNav(), { passive: true });

  // Cerrar si cambias a desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMobileNav();
  });
}


// =========================
// SCROLL botones destacados
// =========================
const row = document.getElementById("productRow");
document.querySelectorAll("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!row) return;
    const dir = btn.getAttribute("data-scroll");
    const amt = dir === "left" ? -340 : 340;
    row.scrollBy({ left: amt, behavior: "smooth" });
  });
});


// =========================
// ACCORDION (PRO)
// - solo 1 abierto
// - animación con max-height
// - aria-expanded
// =========================
const accButtons = Array.from(document.querySelectorAll(".acc"));

function closePanel(btn){
  const id = btn.getAttribute("data-acc");
  const panel = document.getElementById(id);
  if (!panel) return;

  panel.style.maxHeight = "0px";
  panel.classList.remove("is-open");
  btn.setAttribute("aria-expanded", "false");

  const icon = btn.querySelector(".acc__icon");
  if (icon) icon.textContent = "＋";
}

function openPanel(btn){
  const id = btn.getAttribute("data-acc");
  const panel = document.getElementById(id);
  if (!panel) return;

  panel.classList.add("is-open");
  panel.style.maxHeight = panel.scrollHeight + "px";
  btn.setAttribute("aria-expanded", "true");

  const icon = btn.querySelector(".acc__icon");
  if (icon) icon.textContent = "－";
}

accButtons.forEach(b => {
  b.setAttribute("aria-expanded", "false");

  b.addEventListener("click", () => {
    const id = b.getAttribute("data-acc");
    const panel = document.getElementById(id);
    if (!panel) return;

    const wasOpen = panel.classList.contains("is-open");

    // cerrar todos
    accButtons.forEach(closePanel);

    // abrir solo si no estaba abierto
    if (!wasOpen) openPanel(b);
  });
});

// Recalcular height al cambiar tamaño (para acordeón abierto)
window.addEventListener("resize", () => {
  accButtons.forEach(btn => {
    const id = btn.getAttribute("data-acc");
    const panel = document.getElementById(id);
    if (!panel) return;
    if (panel.classList.contains("is-open")) {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});


// =========================
// TRACKING (PRO)
// - Enter para buscar
// - botón "Pedir ayuda" incluye el código escrito
// =========================
const trk = document.getElementById("trk");
const trkBtn = document.getElementById("trkBtn");
const trkResult = document.getElementById("trkResult");

// Link ayuda por id (más robusto)
const helpLink = document.getElementById("trkHelp");

function renderTrackingResult(v){
  if (!trkResult) return;
  trkResult.style.display = "block";

  if (!v) {
    trkResult.textContent = "Ingresa un código de seguimiento (ej: CX123456789CL).";
    return;
  }

  trkResult.innerHTML = `
    <strong>Resultado (demo):</strong><br>
    Código: <b>${escapeHtml(v)}</b><br>
    Estado: <b>En tránsito</b><br>
    Nota: para tracking real necesitas el link oficial del courier o una API.
  `;

  // Actualiza el link de ayuda con el código
  if (helpLink) {
    const msg = encodeURIComponent(`Hola ZOE PREMIUN, quiero rastrear mi pedido. Mi código es: ${v}`);
    helpLink.href = `https://wa.me/56961822928?text=${msg}`;
  }
}

if (trkBtn && trk) {
  trkBtn.addEventListener("click", () => {
    const v = (trk.value || "").trim();
    renderTrackingResult(v);
  });

  trk.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = (trk.value || "").trim();
      renderTrackingResult(v);
    }
  });
}


// =========================
// MODALES (PRO)
// - bloquea scroll
// - cerrar con ESC
// - click fuera cierra
// =========================
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

const MODALS = {
  guia: {
    t: "Guía rápida",
    b: "Escríbenos por WhatsApp y te recomendamos el modelo ideal según tu uso (running, urbano, outdoor) y tu preferencia de tamaño."
  },
  envios: {
    t: "Envíos",
    b: "Envíos a todo Chile. Confirmamos costo/tiempo según comuna y courier. Entrega de comprobante y seguimiento cuando aplique."
  },
  pagos: {
    t: "Pagos",
    b: "Coordinamos transferencia o pago con tarjeta según disponibilidad. Confirmamos el método y total antes de cerrar la compra."
  },
  cambios: {
    t: "Cambios",
    b: "Si hubo error de despacho o falla, escríbenos. Evaluamos el caso y coordinamos solución (define aquí tus condiciones reales)."
  }
};

function openModal(title, body){
  if (!modal) return;
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal(){
  if (!modal) return;
  modal.style.display = "none";
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-modal]").forEach(el => {
  el.addEventListener("click", () => {
    const key = el.getAttribute("data-modal");
    const data = MODALS[key];
    if (!data) return;
    openModal(data.t, data.b);
  });
});

if (modalClose) modalClose.addEventListener("click", closeModal);

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && modal.style.display === "flex") {
    closeModal();
  }
});