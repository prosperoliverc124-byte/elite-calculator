document.addEventListener('DOMContentLoaded', function() {

  /* ICONS */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* LOADING SCREEN */
  var loadingScreen = document.getElementById('loading-screen');
  document.body.style.overflow = 'hidden';

  setTimeout(function() {
    if (loadingScreen) {
      loadingScreen.style.transition = 'opacity 0.6s ease';
      loadingScreen.style.opacity = '0';

      setTimeout(function() {
        loadingScreen.style.display = 'none';
        document.body.style.overflow = '';
      }, 600);
    } else {
      document.body.style.overflow = '';
    }
  }, 2500);

  /* NAVBAR SCROLL GLASS EFFECT */
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

  /* HAMBURGER MENU */
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

  /* SCROLL PROGRESS BAR */
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

  /* SMOOTH SCROLL */
  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href && href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var navHeight = navbar ? navbar.offsetHeight : 0;
          var targetTop = target.offsetTop - navHeight - 20;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      }
    });
  });

  /* SCROLL REVEAL */
  var revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (revealElements.length > 0) {
    var revealObserver = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  }

  /* ANIMATED NUMBER COUNTER */
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
    });  /* FAQ ACCORDION */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function(item) {
    var question = item.querySelector('.faq-question');

    if (question) {
      question.addEventListener('click', function() {
        var isActive = item.classList.contains('active');

        faqItems.forEach(function(otherItem) {
          var otherAnswer = otherItem.querySelector('.faq-answer');
          otherItem.classList.remove('active');
          if (otherAnswer) {
            otherAnswer.classList.remove('open');
          }
          var otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) {
            otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

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

  /* BUTTON RIPPLE EFFECT */
  var rippleButtons = document.querySelectorAll('.btn-primary');

  rippleButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      var rect = button.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      button.appendChild(ripple);
      setTimeout(function() {
        ripple.remove();
      }, 600);
    });
  });

  /* ACTIVE NAV HIGHLIGHT */
  var sections = document.querySelectorAll('section[id]');
  var navLinksAll = document.querySelectorAll('.nav-link');

  function highlightActiveNav() {
    var scrollPos = window.scrollY + 150;

    sections.forEach(function(section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinksAll.forEach(function(link) {
          link.style.color = '';
          link.style.background = '';
        });

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

  /* PAGE TRANSITION TO APP */
  var pageTransitionLinks = document.querySelectorAll(
    'a[href="app.html"]'
  );

  pageTransitionLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var targetHref = this.getAttribute('href');
      document.body.style.transition = 'opacity 0.4s ease';
      document.body.style.opacity = '0';
      setTimeout(function() {
        window.location.href = targetHref;
      }, 400);
    });
  });

  /* SCROLL INDICATOR HIDE */
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

  /* CALC MOCKUP HOVER */
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

  /* AUTO YEAR */
  var footerYear = document.querySelector('.footer-bottom p');
  if (footerYear) {
    var currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace(
      '2025',
      currentYear
    );
  }

  /* CONSOLE EASTER EGG */
  console.log(
    '%c⚡ Elite Calculator',
    'color: #00FF88; font-size: 24px; font-weight: bold;'
  );
  console.log(
    '%cThe calculator that thinks with you.',
    'color: #A0A0A0; font-size: 12px;'
  );

});
  }
