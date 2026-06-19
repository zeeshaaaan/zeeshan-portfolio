/* ============================================================ 
   Zeeshan Ali — Portfolio interactions 
   ============================================================ */ 
(function () { 
  'use strict'; 
 
  /* ---- Navbar: shrink on scroll + progress bar ---- */ 
  const nav = document.getElementById('nav'); 
  const progress = document.querySelector('.scroll-progress'); 
 
  function onScroll() { 
    const y = window.scrollY; 
    nav.classList.toggle('scrolled', y > 30); 
    const h = document.documentElement.scrollHeight - window.innerHeight; 
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%'; 
  } 
  window.addEventListener('scroll', onScroll, { passive: true }); 
  onScroll(); 
 
  /* ---- Theme toggle (light / dark) ---- */ 
  var themeToggle = document.getElementById('themeToggle'); 
  if (themeToggle) { 
    themeToggle.addEventListener('click', function () { 
      var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 
'dark'; 
      var next = current === 'light' ? 'dark' : 'light'; 
      document.documentElement.setAttribute('data-theme', next); 
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ } 
    }); 
  } 
 
  /* ---- Mobile menu ---- */ 
  const burger = document.getElementById('burger'); 
  const menu = document.getElementById('mobileMenu'); 
  function closeMenu() { 
    burger.classList.remove('open'); 
    menu.classList.remove('open'); 
    burger.setAttribute('aria-expanded', 'false'); 
  } 
  burger.addEventListener('click', function () { 
    const open = burger.classList.toggle('open'); 
    menu.classList.toggle('open', open); 
    burger.setAttribute('aria-expanded', String(open)); 
  }); 
  menu.querySelectorAll('a').forEach(function (a) { 
    a.addEventListener('click', closeMenu); 
  }); 
 
  /* ---- Reveal on scroll ---- */ 
  const revealEls = document.querySelectorAll('.reveal'); 
  if ('IntersectionObserver' in window) { 
    const io = new IntersectionObserver(function (entries) { 
      entries.forEach(function (e) { 
        if (e.isIntersecting) { 
          e.target.classList.add('in'); 
          io.unobserve(e.target); 
        } 
      }); 
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }); 
    revealEls.forEach(function (el, i) { 
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms'; 
      io.observe(el); 
    }); 
  } else { 
    revealEls.forEach(function (el) { el.classList.add('in'); }); 
  } 
 
  /* ---- Animated stat counters ---- */ 
  const counters = document.querySelectorAll('.stat__num'); 
  let counted = false; 
  function runCounters() { 
    if (counted) return; 
    const hero = document.querySelector('.hero__stats'); 
    if (!hero) return; 
    counted = true; 
    counters.forEach(function (el) { 
      const target = parseInt(el.dataset.count, 10) || 0; 
      const dur = 1200; 
      const start = performance.now(); 
      function tick(now) { 
        const p = Math.min((now - start) / dur, 1); 
        const eased = 1 - Math.pow(1 - p, 3); 
        el.textContent = Math.round(eased * target); 
        if (p < 1) requestAnimationFrame(tick); 
      } 
      requestAnimationFrame(tick); 
    }); 
  } 
  // trigger counters shortly after load (hero is in view) 
  window.addEventListener('load', function () { setTimeout(runCounters, 500); }); 
 
  /* ---- Cursor glow (desktop, pointer:fine only) ---- */ 
  const glow = document.querySelector('.cursor-glow'); 
  if (window.matchMedia('(pointer:fine)').matches && glow) { 
    let raf = null, x = 0, y = 0; 
    window.addEventListener('mousemove', function (e) { 
      x = e.clientX; y = e.clientY; 
      glow.style.opacity = '1'; 
      if (!raf) { 
        raf = requestAnimationFrame(function () { 
          glow.style.left = x + 'px'; 
          glow.style.top = y + 'px'; 
          raf = null; 
        }); 
      } 
    }); 
    document.addEventListener('mouseleave', function () { glow.style.opacity = '0'; }); 
  } 
 
  /* ---- Active nav link highlight ---- */ 
  const sections = document.querySelectorAll('section[id]'); 
  const navLinks = document.querySelectorAll('.nav__links a'); 
  if ('IntersectionObserver' in window && navLinks.length) { 
    const spy = new IntersectionObserver(function (entries) { 
      entries.forEach(function (e) { 
        if (e.isIntersecting) { 
          const id = e.target.getAttribute('id'); 
          navLinks.forEach(function (l) { 
            l.style.color = l.getAttribute('href') === '#' + id ? 'var(--text)' : ''; 
          }); 
        } 
      }); 
    }, { threshold: 0.5 }); 
    sections.forEach(function (s) { spy.observe(s); }); 
  } 
 
  /* ---- Case study accordions ---- */ 
  var caseHeads = document.querySelectorAll('.case__head'); 
  caseHeads.forEach(function (head) { 
    head.addEventListener('click', function () { 
      var card = head.closest('.case'); 
      var isOpen = card.classList.toggle('open'); 
      head.setAttribute('aria-expanded', String(isOpen)); 
    }); 
  }); 
 
  /* ---- Contact form (Web3Forms, AJAX) ---- */ 
  var cform = document.getElementById('contactForm'); 
  if (cform) { 
    var cstatus = document.getElementById('cfStatus'); 
    var csubmit = document.getElementById('cfSubmit'); 
 
    function setStatus(msg, kind) { 
      cstatus.textContent = msg; 
      cstatus.className = 'cform__status' + (kind ? ' is-' + kind : ''); 
    } 
 
    cform.addEventListener('submit', function (e) { 
      e.preventDefault(); 
      if (!cform.checkValidity()) { cform.reportValidity(); return; } 
 
      var key = cform.querySelector('[name="access_key"]').value; 
      if (!key || key === 'YOUR_WEB3FORMS_ACCESS_KEY') { 
        setStatus('⚠ Form not configured yet — add your free Web3Forms access key.', 'error'); 
        return; 
      } 
 
      var data = Object.fromEntries(new FormData(cform).entries()); 
      cform.classList.add('cform--sending'); 
      csubmit.disabled = true; 
      setStatus('Sending…', ''); 
 
      fetch('https://api.web3forms.com/submit', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, 
        body: JSON.stringify(data) 
      }) 
        .then(function (r) { return r.json(); }) 
        .then(function (res) { 
          if (res.success) { 
            setStatus('✓ Thanks! Your message has been sent — I\'ll get back to you soon.', 
'success'); 
            cform.reset(); 
          } else { 
            setStatus('✗ ' + (res.message || 'Something went wrong. Please email me directly.'), 
'error'); 
          } 
        }) 
        .catch(function () { 
          setStatus('✗ Network error. Please email me directly at zeeshan2211997@gmail.com', 
'error'); 
        }) 
        .finally(function () { 
          cform.classList.remove('cform--sending'); 
          csubmit.disabled = false; 
        }); 
    }); 
  } 
 
  /* ---- Document title flip when tab hidden ---- */ 
  const realTitle = document.title; 
  document.addEventListener('visibilitychange', function () { 
    document.title = document.hidden ? '          Come back — Zeeshan Ali' : realTitle; 
  }); 
})();