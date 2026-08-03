/* ============================================
   ELITE CALCULATOR — MAIN JAVASCRIPT
   Controls all landing page interactivity
============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* ========================================
     1. INITIALIZE LUCIDE ICONS
     
     WHY: We loaded the Lucide library in HTML.
     But the icons won't show until we tell
     Lucide to scan the page and replace every
     <i data-lucide="name"> with actual SVG.
  ======================================== */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ========================================
     2. LOADING SCREEN
     
     WHY: The loading screen covers the whole
     page when it first loads. After 2.5 seconds
     we add the 'hidden' class which triggers
     a CSS fade out. Then we fully remove it
     so it doesn't block clicks underneath.
  ======================================== */
  var loadingScreen = document.getElementById('loading-screen');

  if (loadingScreen) {
    setTimeout(function() {
      loadingScreen.classList.add('hidden');
    }, 2500);

    loadingScreen.addEventListener('transitionend', function() {
      if (loadingScreen.classList.contains('hidden')) {
        loadingScreen.style.display = 'none';
      }
    });
  }

  /* ========================================
     3. NAVBAR GLASS EFFECT ON SCROLL
     
     WHY: When you first load the page, the
     nav is transparent. As you scroll down,
     we add a class that makes it frosted glass.
     This keeps the nav readable over content.
  ======================================== */
  var navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (!navbar) return;

    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll);

  /* ========================================
     4. MOBILE HAMBURGER MENU
     
     WHY: On mobile screens, nav links are
     hidden. The hamburger button opens them.
     Tapping it toggles 'active' on the icon
     (turns it into an X) and 'open' on the
     menu panel (slides it down).
  ======================================== */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    var mobileLinks = mobileMenu.querySelectorAll(
      '.mobile-nav-link, .mobile-cta'
    );

    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ========================================
     5. SCROLL PROGRESS BAR
     
     WHY: A thin neon bar at the top of the
     page fills as you scroll. It shows how
     far down the page you've read. This is
     a premium UX touch.
     
     HOW: We calculate what percentage of
     the total page you've scrolled, then
     set the bar width to that percentage.
  ======================================== */
  var scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgress) return;

    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight;
    var winHeight = window.innerHeight;
    var scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

    scrollProgress.style.width = scrollPercent + '%';
  }

  window.addEventListener('scroll', updateScrollProgress);

  /* ========================================
     6. SMOOTH SCROLL FOR ANCHOR LINKS
     
     WHY: When someone clicks "Features" in
     the nav, we want the page to smoothly
     glide to that section instead of jumping.
     
     HOW: We intercept the click, find the
     target section, calculate its position
     minus the navbar height, then scroll
     there smoothly.
  ======================================== */
  var anchorLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = this.getAttribute('href');

      if (href && href.length > 1 && href.startsWith('#')) {
        var target = document.querySelector(href);

        if (target) {
          e.preventDefault();

          var navHeight = navbar ? navbar.offsetHeight : 0;
          var targetTop = target.offsetTop - navHeight - 20;

          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });  /* ========================================
     7. SCROLL REVEAL SYSTEM
     
     WHY: Elements with class 'reveal' start
     invisible (defined in animations.css).
     As the user scrolls and an element enters
     the viewport, we add 'visible' class
     which triggers the CSS fade-up animation.
     
     HOW: We use IntersectionObserver — a
     built-in browser tool that watches
     elements and tells us when they become
     visible on screen. Much more efficient
     than checking scroll position manually.
  ======================================== */
  var revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
  );

  if (revealElements.length > 0) {

    var revealObserver = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            /* Once revealed, stop watching it
               to save performance */
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        /* trigger when 15% of element is visible */
        threshold: 0.15,
        /* start detecting 50px before element
           enters viewport for smoother feel */
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  }

  /* ========================================
     8. ANIMATED NUMBER COUNTER
     
     WHY: In the hero section, we show stats
     like "10 Calc Modes" and "170 Currencies".
     Instead of just showing the number, we
     count up from 0 which feels dynamic.
     
     HOW: We find elements with data-count
     attribute. When they become visible,
     we animate from 0 to the target number
     over 2 seconds using requestAnimationFrame.
  ======================================== */
  var statNumbers = document.querySelectorAll(
    '.hero-stat-number[data-count]'
  );

  function animateCounter(element) {
    var target = parseInt(element.getAttribute('data-count'));
    var duration = 2000;
    var startTime = null;

    function updateCount(currentTime) {
      if (!startTime) startTime = currentTime;

      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);

      /* easeOutExpo — starts fast, slows down
         at the end. Feels natural. */
      var eased = 1 - Math.pow(1 - progress, 4);
      var currentValue = Math.floor(eased * target);

      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(updateCount);
  }

  /* Watch stat numbers and trigger counter
     when they scroll into view */
  if (statNumbers.length > 0) {

    var statsObserver = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function(stat) {
      statsObserver.observe(stat);
    });
  }

  /* ========================================
     9. FAQ ACCORDION
     
     WHY: FAQs are collapsed by default.
     Clicking a question opens its answer.
     Clicking again closes it. Only one
     can be open at a time to keep things
     clean and focused.
     
     HOW: We toggle 'active' on the faq-item
     and 'open' on the faq-answer. The CSS
     uses max-height transition to animate
     the answer sliding open/closed.
  ======================================== */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function(item) {
    var question = item.querySelector('.faq-question');

    if (question) {
      question.addEventListener('click', function() {

        var isActive = item.classList.contains('active');

        /* Close all other FAQ items first
           so only one is open at a time */
        faqItems.forEach(function(otherItem) {
          var otherAnswer = otherItem.querySelector('.faq-answer');
          otherItem.classList.remove('active');

          if (otherAnswer) {
            otherAnswer.classList.remove('open');
          }

          /* Update aria attribute for accessibility */
          var otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) {
            otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        /* If clicked item was NOT active, open it.
           If it WAS active, it stays closed
           because we just closed everything above */
        if (!isActive) {
          var answer = item.querySelector('.faq-answer');
          item.classList.add('active');

          if (answer) {
            answer.classList.add('open');
          }

          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* ========================================
     10. BUTTON RIPPLE EFFECT
     
     WHY: When user clicks a primary button,
     a circle expands outward from the click
     point. This gives satisfying feedback.
     
     HOW: On click, we create a small circle
     element at the click coordinates inside
     the button. CSS animation expands it.
     After animation ends, we remove it.
  ======================================== */
  var rippleButtons = document.querySelectorAll('.btn-primary');

  rippleButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      /* Get click position relative to button */
      var rect = button.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      /* Create ripple element */
      var ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      /* Add to button */
      button.appendChild(ripple);

      /* Remove after animation completes */
      setTimeout(function() {
        ripple.remove();
      }, 600);
    });  /* ========================================
     11. ACTIVE NAV LINK HIGHLIGHT
     
     WHY: As the user scrolls through sections,
     the matching nav link should highlight
     so they know where they are on the page.
     
     HOW: We check which section is currently
     in the viewport. Then we add a visual
     highlight to the corresponding nav link.
  ======================================== */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function highlightActiveNav() {
    var scrollPos = window.scrollY + 150;

    sections.forEach(function(section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        /* Remove active from all links */
        navLinks.forEach(function(link) {
          link.style.color = '';
          link.style.background = '';
        });

        /* Find the matching link and highlight it */
        var activeLink = document.querySelector(
          '.nav-link[href="#' + sectionId + '"]'
        );

        if (activeLink) {
          activeLink.style.color = '#00FF88';
          activeLink.style.background = 'rgba(0,255,136,0.08)';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav);

  /* ========================================
     12. PAGE TRANSITION EFFECT
     
     WHY: When navigating to app.html, we
     want a smooth fade-out instead of an
     abrupt page change. This feels premium.
     
     HOW: We intercept clicks on links that
     go to app.html. We fade the page out
     first, then navigate after the animation.
  ======================================== */
  var pageTransitionLinks = document.querySelectorAll(
    'a[href="app.html"]'
  );

  pageTransitionLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      var targetHref = this.getAttribute('href');

      /* Fade out the entire page */
      document.body.style.transition = 'opacity 0.4s ease';
      document.body.style.opacity = '0';

      /* After fade completes, navigate */
      setTimeout(function() {
        window.location.href = targetHref;
      }, 400);
    });
  });

  /* ========================================
     13. KEYBOARD ACCESSIBILITY
     
     WHY: Some users navigate using keyboard
     only (Tab key + Enter). We need FAQ items
     to work with keyboard, not just mouse.
     
     HOW: FAQ questions are already <button>
     elements so they're keyboard focusable
     by default. We just add Enter/Space
     support explicitly for safety.
  ======================================== */
  var faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(function(question) {
    question.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  /* ========================================
     14. SCROLL INDICATOR HIDE
     
     WHY: The "Scroll to explore" indicator
     at the bottom of the hero should disappear
     once the user starts scrolling. It's only
     needed when they first arrive.
     
     HOW: After scrolling past 100px, we
     fade it out by setting opacity to 0.
  ======================================== */
  var scrollIndicator = document.querySelector('.scroll-indicator');

  function handleScrollIndicator() {
    if (!scrollIndicator) return;

    if (window.scrollY > 100) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.pointerEvents = 'auto';
    }
  }

  window.addEventListener('scroll', handleScrollIndicator);

  /* ========================================
     15. PREVENT SCROLL DURING LOADING
     
     WHY: While the loading screen is visible,
     we don't want users scrolling the page
     behind it. Once loading finishes, we
     re-enable scroll.
     
     HOW: We set overflow:hidden on body
     during loading, then remove it after.
  ======================================== */
  document.body.style.overflow = 'hidden';

  setTimeout(function() {
    document.body.style.overflow = '';
  }, 2600);

  /* ========================================
     16. HERO CALC MOCKUP HOVER EFFECT
     
     WHY: The calculator mockup in the hero
     should react subtly when the user hovers
     over it. This makes it feel interactive
     and alive even though it's just a preview.
     
     HOW: We add a slight tilt/scale effect
     on hover using CSS transform.
  ======================================== */
  var calcMockup = document.querySelector('.calc-mockup');

  if (calcMockup) {
    calcMockup.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
      this.style.transform = 'scale(1.02) translateY(-4px)';
      this.style.boxShadow = '0 0 0 1px rgba(30,30,30,1), 0 24px 80px rgba(0,0,0,0.7), 0 0 100px rgba(0,255,136,0.1)';
    });

    calcMockup.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1) translateY(0)';
      this.style.boxShadow = '';
    });
  }

  /* ========================================
     17. CURRENT YEAR IN FOOTER
     
     WHY: Instead of hardcoding "2025" in the
     footer, we can auto-update it. But since
     we hardcoded it in HTML, this is a backup
     that ensures accuracy.
  ======================================== */
  var footerYear = document.querySelector('.footer-bottom p');
  if (footerYear) {
    var currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace(
      '2025',
      currentYear
    );
  }

  /* ========================================
     18. CONSOLE EASTER EGG
     
     WHY: Developers who open the browser
     console will see a fun branded message.
     It's a small touch that shows attention
     to detail.
  ======================================== */
  console.log(
    '%c⚡ Elite Calculator',
    'color: #00FF88; font-size: 24px; font-weight: bold; font-family: monospace;'
  );
  console.log(
    '%cThe calculator that thinks with you.',
    'color: #A0A0A0; font-size: 12px; font-family: monospace;'
  );
  console.log(
    '%cBuilt with 💚 — Open Source & Free Forever',
    'color: #555555; font-size: 11px; font-family: monospace;'
  );

/* ========================================
   CLOSE THE DOMContentLoaded WRAPPER
   
   This closing bracket matches the opening
   document.addEventListener at the very top
   of Chunk 1. Every piece of code lives
   inside this wrapper.
======================================== */
});
  });
