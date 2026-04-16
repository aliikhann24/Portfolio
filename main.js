/* ==============================
   MAIN.JS — Enhanced Portfolio
============================== */

// ── Scroll-triggered reveal animations ──────────────────────────
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  const elements = document.querySelectorAll(
    '.reveal-left, .reveal-right, .reveal-up, .animate-left, .animate-right'
  );
  elements.forEach(el => observer.observe(el));
}

// ── Skill bars (trigger on scroll) ──────────────────────────────
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.bar-fill');
        const width = entry.target.dataset.width;
        if (fill) fill.style.width = width + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(b => observer.observe(b));
}

// ── Circle skills ────────────────────────────────────────────────
function initCircleSkills() {
  const circles = document.querySelectorAll('.circle-box');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const box     = entry.target;
        const percent = parseInt(box.dataset.percent);
        const prog    = box.querySelector('.progress');
        const numEl   = box.querySelector('.number');
        const r       = 50;
        const circ    = 2 * Math.PI * r;

        prog.style.strokeDasharray  = circ;
        prog.style.strokeDashoffset = circ - (percent / 100) * circ;

        let count = 0;
        const interval = setInterval(() => {
          if (count >= percent) { clearInterval(interval); return; }
          count++;
          numEl.textContent = count + '%';
        }, 18);

        observer.unobserve(box);
      }
    });
  }, { threshold: 0.4 });

  circles.forEach(c => observer.observe(c));
}

// ── Typing effect ────────────────────────────────────────────────
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const words = [
    'a Frontend Developer',
    'a Software Engineer',
    'passionate about Code'
  ];

  let wIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const word = words[wIdx];
    el.textContent = deleting
      ? word.substring(0, cIdx - 1)
      : word.substring(0, cIdx + 1);

    deleting ? cIdx-- : cIdx++;

    if (!deleting && cIdx === word.length) {
      setTimeout(() => { deleting = true; }, 1400);
    } else if (deleting && cIdx === 0) {
      deleting = false;
      wIdx = (wIdx + 1) % words.length;
    }

    setTimeout(type, deleting ? 45 : 90);
  }

  type();
}

// ── Navbar: scroll shrink + active link ─────────────────────────
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    let current = sections[0].getAttribute('id'); // default to first section
sections.forEach(sec => {
  if (window.scrollY >= sec.offsetTop - 140) {
    current = sec.getAttribute('id');
  }
});

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });
}

// ── Hamburger menu ───────────────────────────────────────────────
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
}

// ── Project modal ────────────────────────────────────────────────
function initModal() {
  const modal    = document.getElementById('projectModal');
  const closeBtn = document.querySelector('.close-btn');
  const cards    = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      document.getElementById('modalTitle').textContent       = card.dataset.title || '';
      document.getElementById('modalDescription').textContent = card.dataset.description || '';
      document.getElementById('modalTech').textContent        = card.dataset.tech || '';
      document.getElementById('liveDemo').href                = card.dataset.demo || '#';
      document.getElementById('githubLink').href              = card.dataset.github || '#';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// ── Contact form (EmailJS) ────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.contact-btn');
    const original = btn.innerHTML;

    btn.innerHTML = 'Sending... ⏳';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    const templateParams = {
      from_name:  document.getElementById('fullName').value,
      from_email: document.getElementById('email').value,
      mobile:     document.getElementById('mobile').value || 'Not provided',
      subject:    document.getElementById('subject').value || 'No subject',
      message:    document.getElementById('message').value,
    };

    emailjs.send('service_7ujn5ya', 'template_9dqr1ff', templateParams)
      .then(() => {
        btn.innerHTML = 'Message Sent! ✓';
        btn.style.background = '#00d4aa';
        btn.style.opacity = '1';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        btn.innerHTML = 'Failed — Try Again ✗';
        btn.style.background = '#ff4444';
        btn.style.opacity = '1';
        btn.disabled = false;
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
        }, 4000);
      });
  });
}

// ── Boot ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initRevealAnimations();
  initSkillBars();
  initCircleSkills();
  initTyping();
  initNavbar();
  initHamburger();
  initModal();
  initContactForm();
});
