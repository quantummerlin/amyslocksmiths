/* ============================================
   Amy's Locksmiths — main.js
   ============================================ */

// ── Sticky Header ─────────────────────────────
const header = document.querySelector('.site-header');
function updateHeader() {
  if (!header) return;
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// ── Mobile Menu ───────────────────────────────
const hamburger  = document.querySelector('.hamburger');
const mobileNav  = document.querySelector('.mobile-nav');
const mobileClose = document.querySelector('.mobile-nav-close');

function openMenu() {
  hamburger?.classList.add('active');
  mobileNav?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  hamburger?.classList.remove('active');
  mobileNav?.classList.remove('open');
  document.body.style.overflow = '';
}
hamburger?.addEventListener('click', () => {
  mobileNav?.classList.contains('open') ? closeMenu() : openMenu();
});
mobileClose?.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));

// ── FAQ Accordion ─────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Open first FAQ by default if present
const firstFaq = document.querySelector('.faq-item');
if (firstFaq) firstFaq.classList.add('open');

// ── Scroll Fade-In ────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => io.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

// ── Stat Counters ─────────────────────────────
function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10) || 0;
  const suffix   = el.dataset.suffix || '';
  const duration = 1600;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterEls = document.querySelectorAll('[data-count]');
if ('IntersectionObserver' in window && counterEls.length) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        cio.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => cio.observe(el));
}

// ── Booking Form ──────────────────────────────
const bookingForm = document.getElementById('bookingForm');
bookingForm?.addEventListener('submit', e => {
  e.preventDefault();
  const data     = Object.fromEntries(new FormData(bookingForm));
  const phoneNum = (data.phone || '').replace(/\D/g, '');

  if (!data.name?.trim()) {
    showMsg(bookingForm, 'Please enter your name.', 'error');
    return;
  }
  if (phoneNum.length < 10) {
    showMsg(bookingForm, 'Please enter a valid Australian phone number.', 'error');
    return;
  }

  const btn = bookingForm.querySelector('[type="submit"]');
  if (btn) {
    btn.textContent = '✓ Request Sent — We\'ll Call You Soon!';
    btn.disabled    = true;
    btn.style.background = '#16a34a';
    btn.style.borderColor = '#16a34a';
  }
  document.querySelector('.form-msg')?.remove();
  const el = document.createElement('p');
  el.className   = 'form-msg';
  el.style.cssText = 'color:#166534;font-size:.875rem;margin-top:12px;padding:12px;background:#dcfce7;border-radius:8px;text-align:center;';
  el.innerHTML = '&#10003; Thanks! We\'ve received your request and will call you shortly.<br><strong>For urgent jobs, please call <a href="tel:0415676888" style="color:#166534">0415 676 888</a> directly.</strong>';
  bookingForm.insertAdjacentElement('afterend', el);
});

function showMsg(form, msg, type) {
  document.querySelector('.form-msg')?.remove();
  const el = document.createElement('p');
  el.className   = 'form-msg';
  const isErr    = type === 'error';
  el.style.cssText = `color:${isErr ? '#dc2626' : '#166534'};font-size:.875rem;margin-top:10px;padding:10px 14px;background:${isErr ? '#fee2e2' : '#dcfce7'};border-radius:8px;`;
  el.textContent = msg;
  form.appendChild(el);
}

// ── Smooth scroll for anchor links ────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
