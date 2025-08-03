// public/js/scripts.js
document.addEventListener('DOMContentLoaded', function() {
  // ----- ELEMENTS -----
  const hamburgerButton = document.querySelector('.hamburger-menu');
  const navMenu = document.getElementById('main-nav');

  // ---- UTILITY: show message (dengan aksesibilitas) ----
  function showMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'status');
    messageDiv.setAttribute('aria-live', 'polite');

    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 5px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease-out forwards;
      background: ${type === 'success' ? '#48bb78' : '#f56565'};
    `;

    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
  }

  // ---- HAMBURGER / NAV TOGGLE ----
  if (hamburgerButton && navMenu) {
    // aksesibilitas
    hamburgerButton.setAttribute('aria-expanded', 'false');
    hamburgerButton.setAttribute('aria-controls', 'main-nav');
    hamburgerButton.setAttribute('aria-label', 'Toggle Navigation');

    // backdrop untuk UX
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    document.body.appendChild(backdrop);

    // helper buka/tutup
    function openMenu() {
      navMenu.classList.add('active');
      hamburgerButton.classList.add('active');
      hamburgerButton.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('visible');
      // fokus ke link pertama
      const firstLink = navMenu.querySelector('a');
      if (firstLink) firstLink.focus();
      trapFocus(navMenu);
    }
    function closeMenu() {
      navMenu.classList.remove('active');
      hamburgerButton.classList.remove('active');
      hamburgerButton.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('visible');
    }

    // toggle dengan debounce ringan agar tidak spam
    let toggling = false;
    hamburgerButton.addEventListener('click', function() {
      if (toggling) return;
      toggling = true;
      setTimeout(() => (toggling = false), 300);

      const isOpen = navMenu.classList.contains('active');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // tutup saat klik link di mobile
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });

    // tutup saat klik di luar
    document.addEventListener('click', function(e) {
      const isInside = navMenu.contains(e.target) || hamburgerButton.contains(e.target);
      if (!isInside && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    // tutup dengan Esc
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
        hamburgerButton.focus();
      }
    });

    // tutup otomatis jika resize ke desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    // fokus trap untuk aksesibilitas
    function trapFocus(container) {
      const focusableSelectors = 'a, button, input, [tabindex]:not([tabindex="-1"])';
      const elements = Array.from(container.querySelectorAll(focusableSelectors)).filter(el => !el.disabled);
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements[elements.length - 1];

      function handleKey(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }

      container.addEventListener('keydown', handleKey);
    }

    // backdrop click closes
    backdrop.addEventListener('click', closeMenu);
  } else {
    console.warn('Hamburger atau navigation tidak ditemukan');
  }

  // ----- SMOOTH SCROLL UNTUK ANCHOR INTERNAL -----
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.hash !== '') {
        const targetElement = document.querySelector(this.hash);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ----- CONTACT FORM -----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const submitBtn = this.querySelector('.submit-btn');
      const originalText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      try {
        const response = await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
          })
        });

        const result = await response.json();
        if (result.success) {
          showMessage('success', result.message);
          this.reset();
        } else {
          showMessage('error', result.message);
        }
      } catch (error) {
        showMessage('error', 'Sorry, there was an error sending your message. Please try again.');
      } finally {
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  }

  // ----- FADE-IN ON SCROLL -----
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in', 'animated');
      }
    });
  }, observerOptions);
  document.querySelectorAll('section').forEach(section => observer.observe(section));

  // ----- INNOVATION SLIDER -----
  let slideIndex = 0;
  const sliderWrapper = document.getElementById('innovationsSlider');
  if (sliderWrapper) {
    const slideItems = sliderWrapper.querySelectorAll('.slide-item');
    const totalSlides = slideItems.length;
    // asumsi parent berperan sebagai container yang digeser
    const slidesContainer = slideItems[0]?.parentElement;
    const nextBtn = document.getElementById('nextBtn');

    if (nextBtn && slidesContainer) {
      nextBtn.addEventListener('click', () => {
        slideIndex = (slideIndex + 1) % totalSlides;
        slidesContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
      });
    } else {
      console.warn("Slider navigation (nextBtn) atau container tidak lengkap. Slider mungkin tidak berfungsi."); 
    }
  } else {
    console.warn("Element with ID 'innovationsSlider' not found. Slider functionality skipped.");
  }
});
