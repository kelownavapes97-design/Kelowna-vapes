document.addEventListener('DOMContentLoaded', () => {
  // --- Age Gate Logic ---
  const ageGate = document.getElementById('age-gate');
  const ageEnter = document.getElementById('age-enter');
  const ageLeave = document.getElementById('age-leave');

  const isVerified = localStorage.getItem('kv_age_verified');

  if (!isVerified && ageGate) {
    ageGate.removeAttribute('hidden');
  }

  if (ageEnter) {
    ageEnter.addEventListener('click', () => {
      localStorage.setItem('kv_age_verified', 'true');
      if (ageGate) ageGate.setAttribute('hidden', '');
    });
  }

  if (ageLeave) {
    ageLeave.addEventListener('click', () => {
      window.location.href = 'https://www.google.com';
    });
  }

  // --- Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }

  // --- Cart Drawer Controls ---
  const cartLink = document.querySelector('[data-open-cart]');
  const cartDrawer = document.getElementById('cart-drawer');
  const scrim = document.getElementById('scrim');
  const cartClose = document.getElementById('cart-close');

  function openCart(e) {
    if (e) e.preventDefault();
    if (cartDrawer && scrim) {
      cartDrawer.classList.add('open');
      scrim.classList.add('active');
      cartDrawer.setAttribute('aria-hidden', 'false');
    }
  }

  function closeCart() {
    if (cartDrawer && scrim) {
      cartDrawer.classList.remove('open');
      scrim.classList.remove('active');
      cartDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  if (cartLink) cartLink.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (scrim) scrim.addEventListener('click', closeCart);

  // --- Example Cart Count Handler ---
  let cart = JSON.parse(localStorage.getItem('kv_cart')) || [];
  const cartCountEl = document.querySelector('[data-cart-count]');

  function updateCartCount() {
    if (cartCountEl) {
      const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      cartCountEl.textContent = count;
    }
  }

  updateCartCount();
});
