/* ============================================================
   Kelowna Vapes — shared site behaviour
   Age gate, mobile nav, and a client-side cart.
   NOTE: this cart is a UI/UX placeholder. Taking real payments
   online for age-restricted vape products requires a proper
   payment processor plus an ID/age-verification service
   integrated at checkout — that backend work isn't included
   here. "Checkout" currently submits an order request by email.
   ============================================================ */

// ---------- Product catalog (placeholders — swap in real products) ----------
const PRODUCTS = [
  { id: "p1", name: "STILTH x GEEKBAR", price: 49.99, category: "Disposables", desc: "80000-puff disposable, mesh coil for a smoother pull. Multiple flavours in stock." },
  { id: "p2", name: "ELFBAR 80K", price: 49.99, category: "Disposables", desc: "Cool menthol-forward disposable, long-lasting battery." },
  { id: "p3", name: "ELFBAR 20K", price: 39.99, category: "Disposables", desc: "Beginner-friendly pod device, adjustable airflow, USB-C charging." },
  { id: "p4", name: "AERIX", price: 44.99, category: "Disposables", desc: "Regulated box mod for sub-ohm builds, dual 18650 battery bay." },
  { id: "p5", name: "ALLO 65K", price: 49.99, category: "Disposables", desc: "Local-favourite peach blend, 30ml bottle, multiple nic strengths." },
  { id: "p6", name: "ALLO 25K", price: 29.99, category: "Disposables", desc: "Crisp menthol, 30ml bottle, multiple nic strengths." },
  { id: "p7", name: "Firebrand Tobacco E-Liquid 30ml", price: 19.99, category: "E-Liquids", desc: "Classic tobacco profile, 30ml bottle, multiple nic strengths." },
  { id: "p8", name: "Replacement Coils (3-pack)", price: 14.99, category: "Accessories", desc: "Fits most standard pod and sub-ohm devices." },
  { id: "p9", name: "18650 Battery (2-pack)", price: 17.99, category: "Accessories", desc: "High-drain rechargeable batteries with case." },
  { id: "p10", name: "USB-C Charging Cable", price: 9.99, category: "Accessories", desc: "Reinforced braided cable, fast charging." },
  { id: "p11", name: "Silicone Device Sleeve", price: 8.99, category: "Accessories", desc: "Protective sleeve, fits most pod devices." },
  { id: "p12", name: "Glass Drip Tip", price: 6.99, category: "Accessories", desc: "Universal 510 fit, heat-resistant glass." }
];

const CART_KEY = "kelownaVapesCart";
const AGE_KEY = "kelownaVapesAgeVerified";

// ---------- Age gate ----------
function initAgeGate() {
  const gate = document.getElementById("age-gate");
  if (!gate) return;

  if (localStorage.getItem(AGE_KEY) === "yes") {
    gate.hidden = true;
    return;
  }

  gate.hidden = false;

  const enter = document.getElementById("age-enter");
  const leave = document.getElementById("age-leave");

  enter.addEventListener("click", () => {
    localStorage.setItem(AGE_KEY, "yes");
    gate.hidden = true;
  });

  leave.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });
}

// ---------- Mobile nav ----------
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

// ---------- Cart ----------
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  openCart();
}

function removeFromCart(productId) {
  const cart = getCart().filter((i) => i.id !== productId);
  saveCart(cart);
  renderCart();
}

function updateCartCount() {
  const count = getCart().reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count;
  });
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total-amount");
  if (!list) return;

  const cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    if (totalEl) totalEl.textContent = "$0.00";
    return;
  }

  let total = 0;
  list.innerHTML = cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) return "";
      const lineTotal = product.price * item.qty;
      total += lineTotal;
      return `
        <div class="cart-item">
          <div>
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-meta">Qty ${item.qty} · $${product.price.toFixed(2)} each</div>
            <button class="cart-remove" data-remove="${product.id}">Remove</button>
          </div>
          <div>$${lineTotal.toFixed(2)}</div>
        </div>
      `;
    })
    .join("");

  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  list.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.remove));
  });
}

function openCart() {
  document.getElementById("cart-drawer")?.classList.add("open");
  document.getElementById("scrim")?.classList.add("open");
  renderCart();
}

function closeCart() {
  document.getElementById("cart-drawer")?.classList.remove("open");
  document.getElementById("scrim")?.classList.remove("open");
}

function initCart() {
  updateCartCount();
  document.querySelectorAll("[data-open-cart]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    })
  );
  document.getElementById("cart-close")?.addEventListener("click", closeCart);
  document.getElementById("scrim")?.addEventListener("click", closeCart);

  document.getElementById("checkout-btn")?.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) return;
    const lines = cart.map((item) => {
      const p = PRODUCTS.find((p) => p.id === item.id);
      return `${item.qty} x ${p.name} — $${(p.price * item.qty).toFixed(2)}`;
    });
    const body = encodeURIComponent(
      `Order request from kelownavapes.ca:\n\n${lines.join("\n")}\n\nI understand this order will be confirmed and age-verified in store or by staff before payment.`
    );
    window.location.href = `mailto:orders@kelownavapes.ca?subject=Order Request&body=${body}`;
  });
}

// ---------- Product grid (shop page) ----------
function initShop() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  function render(filter) {
    const items = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
    grid.innerHTML = items
      .map(
        (p) => `
        <article class="product-card" data-cat="${p.category}">
          <span class="product-cat">${p.category}</span>
          <h3>${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-row">
            <span class="product-price">$${p.price.toFixed(2)}</span>
            <button class="add-btn" data-add="${p.id}">Add to cart</button>
          </div>
        </article>
      `
      )
      .join("");

    grid.querySelectorAll("[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => addToCart(btn.dataset.add));
    });
  }

  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.filter);
    });
  });

  const params = new URLSearchParams(window.location.search);
  const initial = params.get("category") || "All";
  filterBtns.forEach((b) => b.classList.toggle("active", b.dataset.filter === initial));
  render(initial);
}

document.addEventListener("DOMContentLoaded", () => {
  initAgeGate();
  initNav();
  initCart();
  initShop();
});
