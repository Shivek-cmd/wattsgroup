/* ═══════════════════════════════════════════════════════════
   WATTS GROUP — Global Scripts
   IntersectionObserver reveals, counters, FAQ accordion,
   testimonial slider, portfolio filter, TOC generator,
   scroll progress bar
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─── Scroll Reveal (IntersectionObserver) ─── */
  var revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            setTimeout(function () {
              entry.target.style.willChange = "auto";
            }, 800);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ─── Animated Counters ─── */
  var counters = document.querySelectorAll(".counter");
  if (counters.length > 0) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.getAttribute("data-target"), 10);
            var suffix = el.getAttribute("data-suffix") || "";
            var prefix = el.getAttribute("data-prefix") || "";
            var duration = 2000;
            var start = 0;
            var startTime = null;

            function animate(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              var current = Math.floor(eased * target);
              el.textContent = prefix + current + suffix;
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                el.textContent = prefix + target + suffix;
              }
            }

            requestAnimationFrame(animate);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ─── FAQ Accordion ─── */
  var faqTriggers = document.querySelectorAll(".faq-trigger");
  faqTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = this.closest(".faq-item");
      var isActive = item.classList.contains("active");
      var expanded = this.getAttribute("aria-expanded") === "true";

      /* Close all other items */
      var allItems = document.querySelectorAll(".faq-item");
      allItems.forEach(function (other) {
        other.classList.remove("active");
        var otherTrigger = other.querySelector(".faq-trigger");
        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
      });

      /* Toggle current */
      if (!isActive) {
        item.classList.add("active");
        this.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ─── Testimonial Slider ─── */
  var slider = document.querySelector(".testimonial-slider");
  if (slider) {
    var track = slider.querySelector(".testimonial-track");
    var slides = slider.querySelectorAll(".testimonial-slide");
    var prevBtn = slider.querySelector(".slider-prev");
    var nextBtn = slider.querySelector(".slider-next");
    var dotsContainer = slider.querySelector(".slider-dots");
    var currentIndex = 0;
    var slideCount = slides.length;
    var autoPlayInterval = null;

    /* Create dots */
    if (dotsContainer && slideCount > 0) {
      for (var i = 0; i < slideCount; i++) {
        var dot = document.createElement("button");
        dot.className = "slider-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        dot.setAttribute("data-index", i);
        dotsContainer.appendChild(dot);
      }
    }

    function goToSlide(index) {
      if (index < 0) index = slideCount - 1;
      if (index >= slideCount) index = 0;
      currentIndex = index;
      if (track) {
        track.style.transform = "translateX(-" + currentIndex * 100 + "%)";
      }
      var dots = dotsContainer ? dotsContainer.querySelectorAll(".slider-dot") : [];
      dots.forEach(function (d, di) {
        d.classList.toggle("active", di === currentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goToSlide(currentIndex + 1);
        resetAutoPlay();
      });
    }

    if (dotsContainer) {
      dotsContainer.addEventListener("click", function (e) {
        var dot = e.target.closest(".slider-dot");
        if (dot) {
          goToSlide(parseInt(dot.getAttribute("data-index"), 10));
          resetAutoPlay();
        }
      });
    }

    /* Touch/drag support */
    var touchStartX = 0;
    var touchEndX = 0;

    if (slider) {
      slider.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      slider.addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            goToSlide(currentIndex + 1);
          } else {
            goToSlide(currentIndex - 1);
          }
          resetAutoPlay();
        }
      }, { passive: true });
    }

    /* Auto-play */
    function startAutoPlay() {
      autoPlayInterval = setInterval(function () {
        goToSlide(currentIndex + 1);
      }, 5000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    if (slideCount > 1) {
      startAutoPlay();
    }
  }

  /* ─── Portfolio Filter ─── */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var portfolioItems = document.querySelectorAll(".portfolio-item");

  if (filterBtns.length > 0 && portfolioItems.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = this.getAttribute("data-filter");

        filterBtns.forEach(function (b) {
          b.classList.remove("active");
        });
        this.classList.add("active");

        portfolioItems.forEach(function (item) {
          if (filter === "all" || item.getAttribute("data-category") === filter) {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
            item.style.display = "";
          } else {
            item.style.opacity = "0";
            item.style.transform = "scale(0.95)";
            setTimeout(function () {
              item.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  /* ─── Table of Contents (Blog) ─── */
  var tocContainer = document.getElementById("toc-container");
  var postBody = document.getElementById("post-body");

  if (tocContainer && postBody) {
    var headings = postBody.querySelectorAll("h2, h3");
    if (headings.length > 0) {
      var tocList = document.createElement("ul");
      tocList.className = "toc-list";

      headings.forEach(function (heading) {
        if (!heading.id) {
          heading.id = heading.textContent
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }

        var li = document.createElement("li");
        li.className = "toc-item" + (heading.tagName === "H3" ? " toc-sub" : "");
        var a = document.createElement("a");
        a.href = "#" + heading.id;
        a.textContent = heading.textContent;
        li.appendChild(a);
        tocList.appendChild(li);
      });

      tocContainer.appendChild(tocList);
    }
  }

  /* ─── Pillar Tab Switching (Pattern 1) ─── */
  var pillarTabs = document.querySelectorAll(".pillar-tab");
  var pillarImgs = document.querySelectorAll(".pillar-img");

  if (pillarTabs.length > 0 && pillarImgs.length > 0) {
    pillarTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var pillar = this.getAttribute("data-pillar");

        /* Update tabs */
        pillarTabs.forEach(function (t) {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        this.classList.add("active");
        this.setAttribute("aria-selected", "true");

        /* Update images */
        pillarImgs.forEach(function (img) {
          img.classList.remove("active");
          if (img.getAttribute("data-pillar") === pillar) {
            img.classList.add("active");
          }
        });
      });
    });
  }

  /* ─── Slot-Machine Counter Animation (Pattern 4) ─── */
  var slotCounters = document.querySelectorAll(".counter[data-target]");
  if (slotCounters.length > 0) {
    var slotObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            if (el.classList.contains("counted")) return;
            el.classList.add("counted");

            var target = parseInt(el.getAttribute("data-target"), 10);
            var suffix = el.getAttribute("data-suffix") || "";
            var prefix = el.getAttribute("data-prefix") || "";
            var duration = 2000;
            var startTime = null;

            /* Add slot animation class */
            el.classList.add("animated");

            function animateSlot(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);
              /* Ease out cubic */
              var eased = 1 - Math.pow(1 - progress, 3);
              var current = Math.floor(eased * target);
              el.textContent = prefix + current + suffix;
              if (progress < 1) {
                requestAnimationFrame(animateSlot);
              } else {
                el.textContent = prefix + target + suffix;
              }
            }

            requestAnimationFrame(animateSlot);
            slotObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    slotCounters.forEach(function (el) {
      slotObserver.observe(el);
    });
  }

  /* ─── Smooth Scroll for Anchor Links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ─── Portfolio Scroll-Driven Horizontal Movement (Pinned) ─── */
  var scrollTrack = document.getElementById("portfolioScrollTrack");
  if (scrollTrack) {
    var scrollSection = scrollTrack.closest(".portfolio-scroll-section");
    var isMobile = window.innerWidth <= 768;

    function setupPortfolioPin() {
      isMobile = window.innerWidth <= 768;
      if (isMobile) {
        scrollSection.style.height = "";
        scrollTrack.style.transform = "";
        return;
      }
      var maxScroll = scrollTrack.scrollWidth - scrollTrack.parentElement.clientWidth;
      /* Make section tall enough: viewport height + horizontal overflow */
      var sectionH = window.innerHeight + maxScroll;
      scrollSection.style.height = sectionH + "px";
    }

    function updatePortfolioScroll() {
      if (isMobile) return;
      var maxScroll = scrollTrack.scrollWidth - scrollTrack.parentElement.clientWidth;
      var rect = scrollSection.getBoundingClientRect();
      /* Progress: 0 at top of section, 1 when sticky container would unstick */
      var scrollable = scrollSection.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      var progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      var translateX = progress * maxScroll;
      scrollTrack.style.transform = "translateX(-" + translateX + "px)";
    }

    setupPortfolioPin();
    window.addEventListener("scroll", updatePortfolioScroll, { passive: true });
    window.addEventListener("resize", function () {
      setupPortfolioPin();
      updatePortfolioScroll();
    });
    updatePortfolioScroll();
  }

  /* ─── Testimonials 3-Column Parallax ─── */
  var testimonialsSection = document.getElementById("testimonialsParallax");
  if (testimonialsSection) {
    var colLeft = testimonialsSection.querySelector(".testimonials-col-left");
    var colRight = testimonialsSection.querySelector(".testimonials-col-right");

    function updateTestimonialsParallax() {
      if (window.innerWidth <= 768) return;
      var rect = testimonialsSection.getBoundingClientRect();
      var viewH = window.innerHeight;
      var sectionH = testimonialsSection.offsetHeight;
      var progress = (viewH - rect.top) / (viewH + sectionH);
      progress = Math.max(0, Math.min(1, progress));
      var offset = (progress - 0.5) * 60;
      if (colLeft) colLeft.style.transform = "translateY(" + offset + "px)";
      if (colRight) colRight.style.transform = "translateY(" + (-offset) + "px)";
    }

    window.addEventListener("scroll", updateTestimonialsParallax, { passive: true });
    updateTestimonialsParallax();
  }

  /* ─── TOC Active Heading Highlight (Blog Detail Pages) ─── */
  var tocLinks = document.querySelectorAll(".toc a");
  if (tocLinks.length > 0) {
    var tocHeadings = [];
    tocLinks.forEach(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      var heading = document.getElementById(id);
      if (heading) tocHeadings.push({ el: heading, link: link });
    });

    if (tocHeadings.length > 0) {
      function updateActiveToc() {
        var scrollPos = window.scrollY + 120;
        var activeIndex = 0;

        for (var i = 0; i < tocHeadings.length; i++) {
          if (tocHeadings[i].el.offsetTop <= scrollPos) {
            activeIndex = i;
          }
        }

        tocLinks.forEach(function (link) {
          link.classList.remove("active");
        });
        tocHeadings[activeIndex].link.classList.add("active");
      }

      window.addEventListener("scroll", updateActiveToc, { passive: true });
      updateActiveToc();
    }
  }
})();
