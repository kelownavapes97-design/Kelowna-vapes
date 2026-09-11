document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('is-open');
      mainNav.classList.toggle('is-open');
    });
  }

  // Age Gate Verification
  const ageGate = document.getElementById('age-gate');
  const ageEnter = document.getElementById('age-enter');
  const ageLeave = document.getElementById('age-leave');

  if (localStorage.getItem('age_verified') === 'true') {
    if (ageGate) ageGate.style.display = 'none';
  }

  if (ageEnter) {
    ageEnter.addEventListener('click', () => {
      localStorage.setItem('age_verified', 'true');
      if (ageGate) ageGate.style.display = 'none';
    });
  }

  if (ageLeave) {
    ageLeave.addEventListener('click', () => {
      window.location.href = 'https://www.google.com';
    });
  }

  // Shop Category Filter (for shop.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterBtns.length > 0 && productCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        productCards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
