/* === Main JavaScript === */
/* Minimal, purposeful. The site works without this. */

(function () {
  "use strict";

  /* -----------------------------------------
     HEADER SCROLL BEHAVIOR
     ----------------------------------------- */
  const header = document.querySelector(".site-header");

  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* -----------------------------------------
     MOBILE NAVIGATION
     ----------------------------------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".site-nav__list");
  const navOverlay = document.querySelector(".nav-overlay");

  function closeNav() {
    if (!navToggle) return;
    navToggle.setAttribute("aria-expanded", "false");
    navList?.classList.remove("open");
    navOverlay?.classList.remove("visible");
    document.body.style.overflow = "";
  }

  function openNav() {
    if (!navToggle) return;
    navToggle.setAttribute("aria-expanded", "true");
    navList?.classList.add("open");
    navOverlay?.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeNav() : openNav();
  });

  navOverlay?.addEventListener("click", closeNav);

  // Close nav on external link click (mobile)
  navList?.querySelectorAll(".site-nav__link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("#")) {
      link.addEventListener("click", closeNav);
    }
  });

  // Close nav on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* -----------------------------------------
     ACTIVE NAV LINK ON SCROLL
     ----------------------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".site-nav__link[href^='#']");

  if (sections.length && navLinks.length) {
    const observerOptions = {
      rootMargin: "-20% 0px -75% 0px",
      threshold: 0,
    };

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => navObserver.observe(section));
  }

  /* -----------------------------------------
     SCROLL REVEAL
     ----------------------------------------- */
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length && "IntersectionObserver" in window) {
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
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.1,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately
    revealElements.forEach((el) => el.classList.add("revealed"));
  }

  /* -----------------------------------------
     SMOOTH SCROLL FOR ANCHOR LINKS
     ----------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();

        const wasNavOpen = navList?.classList.contains("open");
        if (wasNavOpen) {
          closeNav();
        }

        const scrollAction = () => {
          const headerHeight = header?.offsetHeight || 0;
          const top =
            target.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({ top, behavior: "smooth" });
          history.pushState(null, "", targetId);
        };

        if (wasNavOpen) {
          requestAnimationFrame(() => {
            setTimeout(scrollAction, 20);
          });
        } else {
          scrollAction();
        }
      }
    });
  });

  /* -----------------------------------------
     FOOTER YEAR
     ----------------------------------------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
