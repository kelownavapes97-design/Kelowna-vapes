document.addEventListener('DOMContentLoaded', () => {
  // 1. Age Gate Handler with Smooth Fade Transition
  const ageGate = document.getElementById('age-gate');
  const ageEnter = document.getElementById('age-enter');
  const ageLeave = document.getElementById('age-leave');

  const ageVerified = localStorage.getItem('kv_age_verified');

  if (ageGate) {
    if (ageVerified === 'true') {
      ageGate.style.display = 'none';
    } else {
      ageGate.style.display = 'flex';
    }
  }

  if (ageEnter) {
    ageEnter.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('kv_age_verified', 'true');
      
      if (ageGate) {
        ageGate.classList.add('fade-out');
        setTimeout(() => {
          ageGate.style.display = 'none';
        }, 400);
      }
    });
  }

  if (ageLeave) {
    ageLeave.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'https://www.google.com';
    });
  }

  // 2. Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }

  // 3. Cart & Pickup Order System
  const cartDrawer = document.getElementById('cart-drawer');
  const scrim = document.getElementById('scrim');
  const cartClose = document.getElementById('cart-close');
  const openCartTriggers = document.querySelectorAll('[data-open-cart]');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalAmount = document.getElementById('cart-total-amount');
  const cartCountBadges = document.querySelectorAll('[data-cart-count]');
  const checkoutBtn = document.getElementById('checkout-btn');

  let cart = JSON.parse(localStorage.getItem('kv_cart')) || [];

  function saveAndRenderCart() {
    localStorage.setItem('kv_cart', JSON.stringify(cart));
    
    // Update badge numbers with small pulse effect
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.transform = 'scale(1.3)';
      setTimeout(() => badge.style.transform = 'scale(1)', 200);
    });

    // Update cart drawer items
    if (cartItemsContainer) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: var(--muted); margin: 20px 0; text-align: center;">Your pickup cart is currently empty.</p>';
      } else {
        cartItemsContainer.innerHTML = cart.map(item => `
          <div class="cart-item">
            <div class="cart-item-info">
              <h4>${item.title}</h4>
              <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <button style="background:none; border:none; color:var(--primary); cursor:pointer; font-weight:600; font-size:13px;" onclick="removeFromCart('${item.id}')">Remove</button>
          </div>
        `).join('');
      }
    }

    // Update total price calculation
    if (cartTotalAmount) {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cartTotalAmount.textContent = `$${total.toFixed(2)}`;
    }
  }

  window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveAndRenderCart();
  };

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

  // Add to cart click event listener
  document.querySelectorAll('[data-add-to-cart]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const title = button.dataset.title;
      const price = parseFloat(button.dataset.price);

      const existingItem = cart.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id, title, price, quantity: 1 });
      }

      saveAndRenderCart();
      openCart();
    });
  });

  // Email Checkout Generation
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your pickup cart is empty.');
        return;
      }
      const itemDetails = cart.map(i => `- ${i.title} (Qty: ${i.quantity}) — $${(i.price * i.quantity).toFixed(2)}`).join('\n');
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const subject = encodeURIComponent('In-Store Pickup Request — Kelowna Vapes');
      const body = encodeURIComponent(`Hello Kelowna Vapes,\n\nI would like to request an in-store pickup order:\n\n${itemDetails}\n\nTotal: $${total.toFixed(2)}\n\nPlease confirm product availability and pickup location.`);
      
      window.location.href = `mailto:info@kelownavapes.co?subject=${subject}&body=${body}`;
    });
  }

  // Initial load sync
  saveAndRenderCart();
});
