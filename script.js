/* ===== tiny helpers ===== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function getNavOffset() {
  const nav = document.querySelector(".navbar.fixed-top");
  return Math.round(nav?.getBoundingClientRect().height || 92);
}

document.addEventListener("DOMContentLoaded", () => {
  const hasGSAP = typeof window.gsap !== "undefined";
  const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";
  const hasBootstrap = typeof window.bootstrap !== "undefined";

  /* ===== close mobile nav + smooth scroll with offset ===== */
  $$('a.nav-link[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id ? $(id) : null;
      if (!target) return;

      e.preventDefault();

      // close navbar on mobile
      const nav = $("#nav");
      if (hasBootstrap && nav && nav.classList.contains("show")) {
        try {
          window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
        } catch (_) {}
      }

      const offset = getNavOffset() + 8;
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  /* ===== Bootstrap ScrollSpy: init safely ===== */
  (function initScrollSpy() {
    const target = document.body.getAttribute("data-bs-target");
    if (!target || !hasBootstrap) return;

    try {
      window.bootstrap.ScrollSpy.getOrCreateInstance(document.body, {
        target,
        rootMargin: "0px 0px -40%",
      });
    } catch (_) {}
  })();
    // Scroll progress bar (only if exists + ScrollTrigger exists)
  if ($("#scrollProgress") && hasScrollTrigger) {
    window.gsap.to("#scrollProgress", {
      width: "100%",
      ease: "none",
      scrollTrigger: { scrub: 0.25, start: 0, end: "max" },
    });
  }
  /* ===== GSAP (guarded) ===== */
  if (!hasGSAP) return;

  // register plugin only if it exists
  if (hasScrollTrigger) {
    try {
      window.gsap.registerPlugin(window.ScrollTrigger);
    } catch (_) {}
  }

  // visible intro (landing + cv)
  if ($("#home")) {
    window.gsap.from("#home .neon-text", {
      opacity: 0,
      y: 18,
      duration: 0.9,
      stagger: 0.08,
      ease: "power2.out",
    });
    window.gsap.from("#home .subtitle", {
      opacity: 0,
      y: 14,
      duration: 0.8,
      delay: 0.1,
      ease: "power2.out",
    });
    if ($("#home .profile-img")) {
      window.gsap.from("#home .profile-img", {
        opacity: 0,
        scale: 0.92,
        duration: 0.9,
        delay: 0.05,
        ease: "power2.out",
      });
    }
  }

  // reveal cards on scroll (if ScrollTrigger is available)
  if (hasScrollTrigger) {
    window.gsap.utils.toArray(".card-glow, .section-title").forEach((el) => {
      window.gsap.from(el, {
        opacity: 0,
        y: 28,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%" },
      });
    });

    if ($(".skill-icon") && $("#skills")) {
      window.gsap.from(".skill-icon", {
        opacity: 0,
        scale: 0.7,
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: "#skills", start: "top 75%" },
      });
    }
  } else {
    // fallback: no ScrollTrigger
    if ($(".card-glow")) {
      window.gsap.from(".card-glow", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
      });
    }
  }
});
