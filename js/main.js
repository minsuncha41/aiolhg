/* ==========================================================================
   야르한끼 브랜드 홈페이지 — main.js
   순수 Vanilla JavaScript, 외부 프레임워크 미사용
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- 1. 헤더 스크롤 상태 ---------- */
  const header = document.getElementById("siteHeader");
  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 800) {
      header.classList.add("is-scrolled");
      header.classList.remove("scrolled");
    } else {
      header.classList.remove("is-scrolled");
      header.classList.add("scrolled");
    }
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------- 2. 모바일 메뉴 토글 ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  const brandmark = document.getElementById("brand-mark");

  function closeNav() {
    if (!mainNav || !navToggle || !brandmark) return;
    mainNav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    brandmark.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      brandmark.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ---------- 3. 부드러운 스크롤 시 헤더 높이 보정 없이 앵커 이동 ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#" || targetId === "#top") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 84;
        window.scrollTo({ top: y, behavior: "smooth" });
        closeNav();
      }
    });
  });

  /* ---------- 4. 히어로 영상 폴백 (영상이 없으면 이미지로 대체) ---------- */
  const heroVideo = document.getElementById("heroVideo");
  const heroImgFallback = document.getElementById("heroImgFallback");

  function showImageFallback() {
    if (heroVideo) heroVideo.style.display = "none";
    if (heroImgFallback) heroImgFallback.style.display = "block";
  }

  if (heroVideo) {
    const source = heroVideo.querySelector("source");
    if (source && source.getAttribute("src")) {
      heroVideo.addEventListener("error", showImageFallback);
      heroVideo.addEventListener("loadeddata", function () {
        heroVideo.play().catch(function () {
          /* 자동재생 실패 시 무시 */
        });
      });
      // 소스가 실제로 로드되는지 짧게 시도, 실패하면 폴백
      heroVideo.load();
      setTimeout(function () {
        if (heroVideo.readyState === 0) showImageFallback();
      }, 2500);
    } else {
      showImageFallback();
    }
  } else {
    showImageFallback();
  }

  /* ---------- 5. 히어로 문구 로테이션 (SNS 밈 카피 활용) ---------- */
  const heroPhrases = [
    "야르! 든든하게 한 끼!",
    "야르! 오늘도 한 끼 완료!",
    "야르! 결국 또 냉면!",
    "야르! 돈까스 미쳤다!",
    "야르! 밥도둑! 밥경찰!",
    "야르한끼! 완전 야르!",
    "싸고 맛있는 야르한끼!",
  ];
  const heroRotateEl = document.getElementById("heroRotate");
  let heroIndex = 0;

  if (heroRotateEl) {
    setInterval(function () {
      heroIndex = (heroIndex + 1) % heroPhrases.length;
      heroRotateEl.style.opacity = "0";
      heroRotateEl.style.transform = "translateY(10px)";
      setTimeout(function () {
        heroRotateEl.textContent = heroPhrases[heroIndex];
        heroRotateEl.style.transition = "opacity .6s ease, transform .6s ease";
        heroRotateEl.style.opacity = "1";
        heroRotateEl.style.transform = "translateY(0)";
      }, 420);
    }, 3200);
  }

  /* ---------- 6. 스크롤 리빌 애니메이션 (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- 7. 전체 메뉴 탭 ---------- */
  const menuTabs = document.querySelectorAll(".menu-tab");
  const menuPanels = document.querySelectorAll(".menu-panel");

  menuTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const targetId = tab.getAttribute("data-target");
      if (!targetId) return;

      menuTabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      menuPanels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel.id === targetId);
      });
    });
  });

  /* ---------- 8. FAQ 아코디언 ---------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;

    q.addEventListener("click", function () {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        const otherA = other.querySelector(".faq-a");
        if (otherA) otherA.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("is-open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- 9. 후기 슬라이더 (드래그 + 버튼) ---------- */
  const track = document.getElementById("reviewTrack");
  const prevBtn = document.getElementById("reviewPrev");
  const nextBtn = document.getElementById("reviewNext");

  if (track) {
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    function pointerDown(x) {
      isDown = true;
      track.classList.add("is-dragging");
      startX = x;
      scrollStart = track.scrollLeft;
    }
    function pointerMove(x) {
      if (!isDown) return;
      const delta = x - startX;
      track.scrollLeft = scrollStart - delta;
    }
    function pointerUp() {
      isDown = false;
      track.classList.remove("is-dragging");
    }

    track.addEventListener("mousedown", function (e) {
      pointerDown(e.pageX);
    });
    window.addEventListener("mousemove", function (e) {
      pointerMove(e.pageX);
    });
    window.addEventListener("mouseup", pointerUp);

    track.addEventListener(
      "touchstart",
      function (e) {
        pointerDown(e.touches[0].pageX);
      },
      { passive: true },
    );
    track.addEventListener(
      "touchmove",
      function (e) {
        pointerMove(e.touches[0].pageX);
      },
      { passive: true },
    );
    track.addEventListener("touchend", pointerUp);

    function scrollByCard(direction) {
      const card = track.querySelector(".review-card");
      const gap = 22;
      const cardWidth = card ? card.getBoundingClientRect().width + gap : 300;
      track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
    }

    if (prevBtn)
      prevBtn.addEventListener("click", function () {
        scrollByCard(-1);
      });
    if (nextBtn)
      nextBtn.addEventListener("click", function () {
        scrollByCard(1);
      });
  }

  /* ---------- 10. 활성 네비게이션 링크 하이라이트 ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + id,
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  // 팝업창
  const popup = document.getElementById("pop1");
  const closeBtn = document.getElementById("popupClose");
  const closeBtn1 = document.getElementById("popupClose1");
  const hideToday = document.getElementById("hideToday");

  window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("popupHideUntil")) {
      const expire = Number(localStorage.getItem("popupHideUntil"));

      if (Date.now() < expire) {
        popup.classList.add("hide");
      }
    }
  });

  closeBtn.addEventListener("click", () => {
    if (hideToday.checked) {
      const oneDay = 24 * 60 * 60 * 1000;

      localStorage.setItem("popupHideUntil", Date.now() + oneDay);
    }

    popup.classList.add("hide");
  });
  closeBtn1.addEventListener("click", () => {
    if (hideToday.checked) {
      const oneDay = 24 * 60 * 60 * 1000;

      localStorage.setItem("popupHideUntil", Date.now() + oneDay);
    }

    popup.classList.add("hide");
  });
})();
