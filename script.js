/* ================================================================
   ALEX RIVERA — PORTFOLIO
   script.js

   Handles:
     1. Custom cursor tracking
     2. Nav scroll state + mobile toggle
     3. Smooth scroll for anchor links
     4. Scroll-reveal (IntersectionObserver)
     5. Skill bar animation on scroll
     6. Contact form submission (demo)
     7. Active nav link highlight
================================================================ */


/* ================================================================
   1. CUSTOM CURSOR
   Moves a small dot + ring to follow the mouse.
   On hovering links/buttons, the ring expands.
================================================================ */

const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

/* Ring follows mouse with a slight lag (eased in CSS transition) */
let ringX = 0, ringY = 0;
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  /* Dot moves instantly */
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

/* Animate ring with requestAnimationFrame for smooth lag */
function animateCursor() {
  /* Lerp (linear interpolate) toward mouse position */
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  requestAnimationFrame(animateCursor);
}
animateCursor();

/* Expand ring when hovering interactive elements */
const interactiveEls = document.querySelectorAll('a, button, input, textarea, .project-card, .tool-pill');

interactiveEls.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* Hide cursor when leaving the window */
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '0.6';
});


/* ================================================================
   2. NAVIGATION — SCROLL STATE + MOBILE TOGGLE
================================================================ */

const mainNav   = document.getElementById('mainNav');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

/* Add .scrolled class when user scrolls down — triggers glass effect */
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
}, { passive: true });

/* Toggle mobile menu */
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMobile.classList.toggle('open');
});

/* Close mobile nav (called by onclick in HTML) */
function closeMobileNav() {
  navToggle.classList.remove('open');
  navMobile.classList.remove('open');
}


/* ================================================================
   3. SMOOTH SCROLL FOR ANCHOR LINKS
   Intercepts clicks on all #hash links and scrolls smoothly.
   CSS scroll-behavior: smooth handles most cases, but this
   gives better cross-browser support and easing control.
================================================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return; /* skip bare # links */

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const navHeight = mainNav.offsetHeight;
    const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


/* ================================================================
   4. SCROLL REVEAL
   Uses IntersectionObserver to add .visible to elements with
   the .reveal class when they enter the viewport.
   The CSS transitions handle the actual animation.
================================================================ */

/* Add .reveal class to all the elements we want to animate in */
const revealTargets = [
  ...document.querySelectorAll('.project-card'),
  ...document.querySelectorAll('.project-featured'),
  ...document.querySelectorAll('.skill-group'),
  ...document.querySelectorAll('.stat'),
  ...document.querySelectorAll('.about-bio'),
  ...document.querySelectorAll('.about-quote'),
  ...document.querySelectorAll('.contact-link'),
  ...document.querySelectorAll('.tool-pill'),
];

revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); /* stop watching after reveal */
    }
  });
}, {
  threshold: 0.12,     /* trigger when 12% of the element is visible */
  rootMargin: '0px 0px -40px 0px' /* slight offset from bottom */
});

revealTargets.forEach(el => revealObserver.observe(el));


/* ================================================================
   5. SKILL BAR ANIMATION ON SCROLL
   The .sg-fill bars have a CSS animation (bar-fill) which is
   triggered by adding the .animate class when they scroll into view.
   Without this, bars would animate before the user sees them.
================================================================ */

const skillBars = document.querySelectorAll('.sg-fill');

/* Initially pause the animation */
skillBars.forEach(bar => {
  bar.style.animationPlayState = 'paused';
});

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));


/* ================================================================
   6. CONTACT FORM
   Demo form — shows a success message on submit.
   In production, replace with a fetch() call to your backend
   or a service like Formspree / EmailJS.
================================================================ */

function handleFormSubmit(event) {
  event.preventDefault(); /* prevent page reload */

  const form      = event.target;
  const submitBtn = document.getElementById('submitBtn');
  const success   = document.getElementById('formSuccess');

  /* Simulate sending (loading state) */
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled    = true;

  setTimeout(() => {
    /* Reset button and show success message */
    submitBtn.textContent = 'Sent! ✓';
    success.classList.add('show');
    form.reset();

    /* Re-enable after 4 seconds */
    setTimeout(() => {
      submitBtn.textContent = 'Send Message →';
      submitBtn.disabled    = false;
      success.classList.remove('show');
    }, 4000);

  }, 1200); /* simulated 1.2s delay */
}


/* ================================================================
   7. ACTIVE NAV LINK HIGHLIGHT
   Uses IntersectionObserver to track which section is visible
   and highlights the corresponding nav link.
================================================================ */

const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      /* Remove active from all links */
      navLinks.forEach(link => link.removeAttribute('style'));

      /* Highlight the matching link */
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.style.color = 'var(--amber)';
      }
    }
  });
}, {
  threshold: 0.4 /* section must be 40% visible to count as active */
});

sections.forEach(section => sectionObserver.observe(section));
