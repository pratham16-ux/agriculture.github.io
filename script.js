/* ============================================
   STACKLY FARM — UNIFIED SCRIPT
   Hamburger + Scroll + Animation (Fixed)
============================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================
     HAMBURGER MENU
  ========================== */

  const menuToggle = document.querySelector(".menu-toggle");
  const closeMenu = document.querySelector(".close-menu");
  const navLinks = document.querySelector(".nav-links");
  const overlay = document.querySelector(".menu-overlay");

  function openMenu() {
    if (!navLinks || navLinks.classList.contains("active")) return;

    navLinks.classList.add("active");

    if (menuToggle) {
      menuToggle.classList.add("open");
    }

    document.body.style.overflow = "hidden";

    if (overlay) {
      overlay.style.display = "block";

      requestAnimationFrame(() => {
        overlay.classList.add("active");
      });
    }
  }

  function closeNav() {
    if (!navLinks) return;

    navLinks.classList.remove("active");

    if (menuToggle) {
      menuToggle.classList.remove("open");
    }

    document.body.style.overflow = "";

    if (overlay) {
      overlay.classList.remove("active");

      setTimeout(() => {
        if (!navLinks.classList.contains("active")) {
          overlay.style.display = "none";
        }
      }, 300);
    }
  }

  menuToggle?.addEventListener("click", openMenu);
  closeMenu?.addEventListener("click", closeNav);
  overlay?.addEventListener("click", closeNav);

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeNav();
    }
  });

  /* ==========================
     HEADER SCROLL EFFECT
  ========================== */

  const header = document.querySelector("header");

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 60) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader);

  /* ==========================
     SCROLL REVEAL
  ========================== */

  const revealItems = document.querySelectorAll(`
    .reveal-up,
    .reveal-left,
    .reveal-right,
    .reveal-down,
    .reveal-scale,
    .feature-card,
    .service-card,
    .stat-box,
    .product-card,
    .testimonial-card,
    .point,
    .impact-box,
    .about-image,
    .about-content,
    .blog-card,
    .mvs-card,
    .value-card,
    .team-card,
    .about-stat-box,
    .about-who-img,
    .about-who-txt
  `);

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }

      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -80px"
    }
  );

  revealItems.forEach((el) => {
    el.classList.add("will-reveal");
    revealObserver.observe(el);
  });

  /* ==========================
     STAGGER ANIMATION
  ========================== */

  document.querySelectorAll(".stagger-children").forEach(parent => {

    [...parent.children].forEach((child, index) => {
      child.style.transitionDelay =
        `${index * 0.12}s`;
    });

  });

  /* ==========================
     ACTIVE NAV LINK
  ========================== */

  const currentPage =
    window.location.pathname
      .split("/")
      .pop() || "index.html";

  document.querySelectorAll(".nav-links a").forEach(link => {

    const href = link.getAttribute("href");

    if (href === currentPage) {
      link.classList.add("active");
    }

  });

  /* ==========================
     SMOOTH SCROLL
  ========================== */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

      const target =
        document.querySelector(
          this.getAttribute("href")
        );

      if (!target) return;

      e.preventDefault();

      closeNav();

      setTimeout(() => {

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }, 150);

    });

  });

  /* ==========================
     COUNTER
  ========================== */

  function animateCounter(el) {

    const original =
      el.textContent.trim();

    const target =
      parseInt(
        original.replace(/\D/g, "")
      );

    if (isNaN(target)) return;

    const suffix =
      original.replace(/[0-9]/g, "");

    let current = 0;

    function update() {

      current += target / 70;

      if (current >= target) {
        el.textContent =
          target + suffix;
        return;
      }

      el.textContent =
        Math.floor(current) +
        suffix;

      requestAnimationFrame(update);
    }

    update();
  }

  const counterObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            animateCounter(
              entry.target
            );

            counterObserver
              .unobserve(
                entry.target
              );

          }

        });

      },
      {
        threshold: 0.5
      }
    );

  document
    .querySelectorAll(".count-up")
    .forEach(el =>
      counterObserver.observe(el)
    );

  console.log(
    "✅ Stackly Farm Loaded"
  );

});