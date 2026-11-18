(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'gift-chinedu-theme';
  const root = document.documentElement;


  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch (_) {
      
    }
    return systemDarkQuery.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    if (themeToggleBtn && themeIcon) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('aria-pressed', String(isDark));
      themeToggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
      );
      themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }


  applyTheme(getInitialTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const currentTheme =
        root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch (_) {
      }
    });
  }

  
  if (typeof systemDarkQuery.addEventListener === 'function') {
    systemDarkQuery.addEventListener('change', function (event) {
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (!saved) {
          applyTheme(event.matches ? 'dark' : 'light');
        }
      } catch (_) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    });
  }

  

  const menuToggleBtn = document.getElementById('menu-toggle');
  const menuIcon = document.getElementById('menu-icon');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function setMenuOpen(isOpen) {
    if (!menuToggleBtn || !mobileDrawer || !menuIcon) return;
    menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
    menuToggleBtn.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
    mobileDrawer.hidden = !isOpen;
    menuIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  }

  if (menuToggleBtn && mobileDrawer) {
    menuToggleBtn.addEventListener('click', function () {
      const isCurrentlyOpen =
        menuToggleBtn.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!isCurrentlyOpen);
    });

    mobileNavLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });


    document.addEventListener('click', function (event) {
      const isOpen = menuToggleBtn.getAttribute('aria-expanded') === 'true';
      if (!isOpen) return;
      const target = event.target;
      if (
        target instanceof Node &&
        !mobileDrawer.contains(target) &&
        !menuToggleBtn.contains(target)
      ) {
        setMenuOpen(false);
      }
    });


    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    });
  }


  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  function setActiveNavLink(sectionId) {
    allNavLinks.forEach(function (link) {
      const isMatch = link.getAttribute('data-section') === sectionId;
      link.classList.toggle('active', isMatch);
    });
  }

  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveNavLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }


  const revealElements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }


  const placeholderLinks = document.querySelectorAll(
    'a[href="#"], [data-placeholder-link="true"]'
  );

  placeholderLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
    });
  });
})();