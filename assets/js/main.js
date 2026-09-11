document.addEventListener('DOMContentLoaded', () => {
  // Age Gate Handler
  const ageGate = document.getElementById('age-gate');
  const ageEnter = document.getElementById('age-enter');
  const ageLeave = document.getElementById('age-leave');

  const ageVerified = localStorage.getItem('kv_age_verified');

  if (!ageVerified && ageGate) {
    ageGate.removeAttribute('hidden');
  }

  if (ageEnter) {
    ageEnter.addEventListener('click', () => {
      localStorage.setItem('kv_age_verified', 'true');
      if (ageGate) ageGate.setAttribute('hidden', 'true');
    });
  }

  if (ageLeave) {
    ageLeave.addEventListener('click', () => {
      window.location.href = 'https://www.google.com';
    });
  }

  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }

  // Cart Drawer Control
  const cartDrawer = document.getElementById('cart-drawer');
  const scrim = document.getElementById('scrim');
  const cartClose = document.getElementById('cart-close');
  const openCartTriggers = document.querySelectorAll('[data-open-cart]');

  function openCart() {
    if (cartDrawer && scrim) {
      cartDrawer.classList.add('open');
      scrim.classList.add('active');
      cartDrawer.removeAttribute('aria-hidden');
    }
  }

  function closeCart() {
    if (cartDrawer && scrim) {
      cartDrawer.classList.remove('open');
      scrim.classList.remove('active');
      cartDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  openCartTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  });

  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (scrim) scrim.addEventListener('click', closeCart);

  // Initial cart badge check for non-shop pages
  const cartCount = document.querySelector('[data-cart-count]');
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem('kv_cart')) || [];
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = count;
  }
});
