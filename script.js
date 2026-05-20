/* ============================================
   STACKLY FARM — UNIFIED SCRIPT
   Working Hamburger + Scroll Animations
============================================ */

/* ── HAMBURGER ── */
const menuToggle = document.querySelector(".menu-toggle");
const closeMenu  = document.querySelector(".close-menu");
const navLinks   = document.querySelector(".nav-links");
const overlay    = document.querySelector(".menu-overlay");

function openMenu() {
  if (!navLinks) return;
  navLinks.classList.add("active");
  if (menuToggle) menuToggle.classList.add("open");
  document.body.style.overflow = "hidden";
  if (overlay) {
    overlay.style.display = "block";
    setTimeout(() => overlay.classList.add("active"), 10);
  }
}

function closeNav() {
  if (!navLinks) return;
  navLinks.classList.remove("active");
  if (menuToggle) menuToggle.classList.remove("open");
  document.body.style.overflow = "";
  if (overlay) {
    overlay.classList.remove("active");
    setTimeout(() => { overlay.style.display = "none"; }, 400);
  }
}

if (menuToggle) menuToggle.addEventListener("click", openMenu);
if (closeMenu)  closeMenu.addEventListener("click",  closeNav);
if (overlay)    overlay.addEventListener("click",    closeNav);

document.querySelectorAll(".nav-links li a").forEach(a => {
  a.addEventListener("click", closeNav);
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeNav();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) closeNav();
});

/* ── HEADER SCROLL ── */
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (!header) return;
  if (window.scrollY > 60) {
    header.style.background = "rgba(255,255,255,.97)";
    header.style.boxShadow  = "0 8px 30px rgba(0,0,0,.10)";
  } else {
    header.style.background = "rgba(245,249,245,.88)";
    header.style.boxShadow  = "0 2px 20px rgba(0,0,0,.06)";
  }
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll(
  ".reveal-up, .reveal-left, .reveal-right, .reveal-down, .reveal-scale, " +
  ".feature-card, .service-card, .stat-box, .product-card, .testimonial-card, " +
  ".point, .impact-box, .about-image, .about-content, .blog-card, .mvs-card, " +
  ".value-card, .team-card, .about-stat-box, .about-who-img, .about-who-txt"
);

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => {
  el.classList.add("will-reveal");
  revealObs.observe(el);
});

/* ── STAGGER CHILDREN ── */
document.querySelectorAll(".stagger-children").forEach(parent => {
  [...parent.children].forEach((child, i) => {
    child.style.transitionDelay = (i * 0.12) + "s";
  });
});

/* ── ACTIVE NAV LINK ── */
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links li a").forEach(link => {
  if (link.getAttribute("href") === currentPage) link.classList.add("active");
});

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", function(e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      closeNav();
      setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 100);
    }
  });
});

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const raw    = el.textContent.trim();
  const target = parseInt(raw.replace(/[^0-9]/g, ""));
  if (isNaN(target)) return;
  const suffix = raw.replace(/[0-9]/g, "");
  let current  = 0;
  const step   = target / 60;
  const timer  = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 25);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".count-up").forEach(el => counterObs.observe(el));

console.log("Stackly Farm — Loaded ✅");