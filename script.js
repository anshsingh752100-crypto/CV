/* ============================================================
   CV PORTFOLIO — script.js
   Handles: navbar scroll, mobile menu, typewriter, fade-in
   animations, skill bars, form, active nav links, back-to-top.
   ============================================================ */

/* ── Wait for the DOM to be fully loaded ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. NAVBAR — scroll state & active link highlighting
     ============================================================ */
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  /**
   * On scroll: add "scrolled" class to navbar for border/shadow,
   * and show/hide the back-to-top button.
   */
  function onScroll() {
    const scrollY = window.scrollY;

    /* Navbar shadow */
    navbar.classList.toggle('scrolled', scrollY > 20);

    /* Back-to-top visibility */
    backToTopBtn.classList.toggle('show', scrollY > 400);

    /* Active nav link — highlight the section currently in view */
    let current = '';
    document.querySelectorAll('section[id]').forEach(sec => {
      const top = sec.offsetTop - 100;
      if (scrollY >= top) current = sec.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on page load


  /* ============================================================
     2. MOBILE NAVIGATION — hamburger toggle
     ============================================================ */
  const navToggle   = document.getElementById('navToggle');
  const navLinksList = document.getElementById('navLinks');

  /** Toggle the mobile menu open/closed */
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksList.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /** Close menu when any nav link is clicked */
  navLinksList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksList.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ============================================================
     3. TYPEWRITER EFFECT — cycling role titles in the hero
     ============================================================ */
  const roles = [
    'Senior Software Engineer',
    'Full-Stack Developer',
    'Open-Source Contributor',
    'UI/UX Enthusiast',
    'Cloud Architect',
  ];

  const typewriterEl = document.getElementById('typewriter');
  let   roleIndex    = 0;   // which role we're on
  let   charIndex    = 0;   // which character within the role
  let   isDeleting   = false;

  function typeWriter() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      /* Remove one character */
      typewriterEl.textContent = currentRole.slice(0, charIndex - 1);
      charIndex--;
    } else {
      /* Add one character */
      typewriterEl.textContent = currentRole.slice(0, charIndex + 1);
      charIndex++;
    }

    /* Typing speed: faster when deleting */
    let delay = isDeleting ? 60 : 110;

    if (!isDeleting && charIndex === currentRole.length) {
      /* Pause at the end of the word before deleting */
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      /* Move to the next role */
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      delay      = 400;
    }

    setTimeout(typeWriter, delay);
  }

  typeWriter(); // kick off


  /* ============================================================
     4. SCROLL-TRIGGERED FADE-IN ANIMATION
        Uses IntersectionObserver for performance
     ============================================================ */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          /* Trigger skill bars once they become visible */
          if (entry.target.classList.contains('proficiency')) {
            animateBars();
          }

          /* Unobserve once animated (one-shot) */
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }   /* trigger when 15% of element is in view */
  );

  /* Observe every element marked with the fade-up class */
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));


  /* ============================================================
     5. SKILL BARS — animated width on scroll-into-view
     ============================================================ */
  function animateBars() {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      const targetWidth = bar.getAttribute('data-width');
      /* Setting width triggers the CSS transition defined in style.css */
      bar.style.width = targetWidth + '%';
    });
  }


  /* ============================================================
     6. CONTACT FORM — client-side validation & submission mock
     ============================================================ */
  const sendBtn  = document.getElementById('sendBtn');
  const formNote = document.getElementById('formNote');

  sendBtn.addEventListener('click', () => {
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    /* Basic validation */
    if (!name || !email || !message) {
      showNote('Please fill in all fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showNote('Please enter a valid email address.', 'error');
      return;
    }

    /* Simulate sending (replace with real fetch/API call) */
    sendBtn.disabled    = true;
    sendBtn.textContent = 'Sending…';

    setTimeout(() => {
      showNote('Message sent! I\'ll get back to you soon. 🎉', 'success');
      /* Reset form */
      document.getElementById('name').value    = '';
      document.getElementById('email').value   = '';
      document.getElementById('message').value = '';
      sendBtn.disabled    = false;
      sendBtn.innerHTML   = '<i class="ph ph-paper-plane-tilt"></i> Send Message';
    }, 1400);
  });

  /** Display a status note below the form */
  function showNote(msg, type) {
    formNote.textContent  = msg;
    formNote.className    = 'form-note ' + type;
    /* Auto-hide after 5 seconds */
    setTimeout(() => {
      formNote.textContent = '';
      formNote.className   = 'form-note';
    }, 5000);
  }

  /** Simple email format check */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* ============================================================
     7. BACK TO TOP BUTTON
     ============================================================ */
  const backToTopBtn = document.getElementById('backToTop');

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ============================================================
     8. SMOOTH SCROLL — for browsers that don't support
        the CSS scroll-behavior property natively
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; // skip empty hrefs

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top
                      + window.scrollY
                      - (parseInt(getComputedStyle(document.documentElement)
                          .getPropertyValue('--nav-h')) || 68)
                      - 16;

      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });

}); /* end DOMContentLoaded */
