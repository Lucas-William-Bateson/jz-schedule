// Small, framework-free enhancements: theme toggle, search filter, scrollspy
(function () {
  const root = document.documentElement;

  // THEME TOGGLE -----------------------------------------------------------
  const THEME_KEY = 'jz-theme';
  const btn = document.getElementById('themeToggle');

  function setTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      btn && btn.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      btn && btn.setAttribute('aria-pressed', 'false');
    }
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  }

  const initialTheme = getInitialTheme();
  setTheme(initialTheme);

  btn && btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(next);
  });

  // SEARCH FILTER ----------------------------------------------------------
  const search = document.getElementById('search');
  const sessions = Array.from(document.querySelectorAll('.session'));

  function textOf(el, sel) {
    const n = el.querySelector(sel);
    return (n ? n.textContent : '') || '';
  }

  function filter(value) {
    const q = value.trim().toLowerCase();
    sessions.forEach((card) => {
      if (!q) {
        card.style.display = '';
        return;
      }
      const hay = [
        textOf(card, '.title'),
        textOf(card, '.speakers'),
        textOf(card, '.tags'),
        textOf(card, '.time'),
        textOf(card, '.meta')
      ].join(' ').toLowerCase();
      card.style.display = hay.includes(q) ? '' : 'none';
    });
  }

  search && search.addEventListener('input', (e) => filter(e.target.value));

  // SCROLLSPY FOR DAY NAV --------------------------------------------------
  const dayLinks = Array.from(document.querySelectorAll('.day-link'));
  const days = Array.from(document.querySelectorAll('section.day'));

  function setActive(id) {
    dayLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    days.forEach((d) => observer.observe(d));
  } else {
    window.addEventListener('scroll', () => {
      let current = days[0];
      const y = window.scrollY + window.innerHeight * 0.4;
      for (const d of days) {
        const r = d.getBoundingClientRect();
        const top = r.top + window.scrollY;
        if (top <= y) current = d; else break;
      }
      if (current) setActive(current.id);
    }, { passive: true });
  }
})();

