// Demo data
const CURRENT_PRODUCT = {
  name: 'Pizza margherita',
  description: 'Pizza classica con pomodoro, mozzarella, basilico e olio d\'oliva.',
  price: 6,
  ingredients: ['Pomodoro', 'Mozzarella', 'Basilico'],
  rating: 3.5,
  imagePlaceholder: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#d4a574"/><circle cx="50" cy="50" r="35" fill="#e74c3c" opacity="0.6"/><circle cx="30" cy="40" r="8" fill="#fff"/><circle cx="55" cy="45" r="8" fill="#fff"/><circle cx="70" cy="38" r="8" fill="#fff"/></svg>')
};

const FAQS = [
  { q: 'Quali sono gli allergeni?', a: 'Questo piatto contiene glutine (farina) e lattosio (mozzarella).' },
  { q: 'Come è preparata la pizza?', a: 'La pizza viene impastata a mano, lasciata lievitare 24 ore e cotta in forno a legna a 450°C.' },
  { q: 'Posso richiedere modifiche agli ingredienti?', a: 'Sì, puoi richiedere aggiunte o sostituzioni. Chiedi al personale per le opzioni disponibili.' },
  { q: 'È adatta per vegetariani?', a: 'Sì, la Pizza Margherita è 100% vegetariana.' }
];

// State
let cart = [];
let favourites = [];
let lastNonArView = 'cart';
const body = document.body;

// View switching
function setView(view) {
  body.setAttribute('data-view', view);
  if (view !== 'ar-product') lastNonArView = view;
}

document.getElementById('nav-home').addEventListener('click', () => setView('ar-product'));
document.getElementById('nav-fav').addEventListener('click', () => {
  setView('favourites');
  renderFavourites();
});
document.getElementById('nav-cart').addEventListener('click', () => {
  setView('cart');
  renderCart();
});

// Menu expand/collapse - chevron reveals the 3 action buttons
const menuBtn = document.getElementById('menu-btn');
const menuContainer = document.getElementById('ar-menu-container');

menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  menuContainer.classList.toggle('expanded');
  menuBtn.classList.toggle('expanded');
});

document.addEventListener('click', (e) => {
  if (!menuContainer.contains(e.target)) {
    menuContainer.classList.remove('expanded');
    menuBtn.classList.remove('expanded');
  }
});

// Go back button - navigates to previous page
document.getElementById('back-btn').addEventListener('click', () => {
  const view = body.getAttribute('data-view');
  if (view === 'ar-product') {
    setView(lastNonArView);
    if (lastNonArView === 'cart') renderCart();
    else renderFavourites();
  } else {
    setView('ar-product');
  }
});

// AI Chat
const aiBtn = document.getElementById('ai-btn');
const aiOverlay = document.getElementById('ai-chat-overlay');
const aiClose = document.getElementById('ai-chat-close');
const aiFaqs = document.getElementById('ai-chat-faqs');
const aiAnswer = document.getElementById('ai-chat-answer');

aiBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  aiOverlay.classList.add('visible');
  renderFaqs();
  aiAnswer.classList.remove('visible');
  aiAnswer.textContent = '';
  menuContainer.classList.remove('expanded');
  menuBtn.classList.remove('expanded');
});

aiClose.addEventListener('click', () => aiOverlay.classList.remove('visible'));
aiOverlay.addEventListener('click', (e) => {
  if (e.target === aiOverlay) aiOverlay.classList.remove('visible');
});

function renderFaqs() {
  aiFaqs.innerHTML = FAQS.map(faq =>
    `<button class="ai-chat-faq" data-answer="${faq.a.replace(/"/g, '&quot;')}">${faq.q}</button>`
  ).join('');
  aiFaqs.querySelectorAll('.ai-chat-faq').forEach(btn => {
    btn.addEventListener('click', () => {
      aiAnswer.textContent = btn.dataset.answer;
      aiAnswer.classList.add('visible');
    });
  });
}

// Add to cart
document.getElementById('add-cart-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  cart.push({ ...CURRENT_PRODUCT, iconClass: cart.length % 2 ? 'pink' : 'yellow' });
  showToast('Aggiunto al carrello!');
  menuContainer.classList.remove('expanded');
  menuBtn.classList.remove('expanded');
});

// Add to favourite
document.getElementById('add-fav-btn').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!favourites.find(f => f.name === CURRENT_PRODUCT.name)) {
    favourites.push({ ...CURRENT_PRODUCT });
    showToast('Aggiunto ai preferiti!');
  }
  menuContainer.classList.remove('expanded');
  menuBtn.classList.remove('expanded');
});

// Toast feedback
function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:12px 24px;border-radius:8px;z-index:999;font-size:14px;opacity:0.95;';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// Cart page - demo data (matches screenshot: Totale €35)
const CART_DEMO = [
  { name: 'Pizza margherita', description: 'Pizza classica con pomodoro, mozzarella, basilico e olio d\'oliva.', price: 6, imagePlaceholder: CURRENT_PRODUCT.imagePlaceholder, iconClass: 'yellow' },
  { name: 'Nome Piatto', description: 'Insalata mista con pollo grigliato, bacon croccante, avocado, pomodori, uovo, blue cheese e salsa ranch.', price: 13, imagePlaceholder: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#81c784"/><ellipse cx="50" cy="55" rx="25" ry="15" fill="#558b2f"/></svg>'), iconClass: 'pink' },
  { name: 'Bevanda', description: 'Acqua naturale 50cl.', price: 16, imagePlaceholder: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="#90caf9"/></svg>'), iconClass: 'yellow' }
];

const CART_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';

function renderCart() {
  const items = cart.length ? cart : CART_DEMO;
  const total = items.reduce((s, i) => s + i.price, 0);
  document.getElementById('cart-items').innerHTML = items.map((item, i) => `
    <div class="cart-card">
      <img class="cart-card-image" src="${item.imagePlaceholder || CURRENT_PRODUCT.imagePlaceholder}" alt="">
      <div class="cart-card-body">
        <p class="cart-card-name">${item.name}</p>
        <p class="cart-card-desc">${item.description}</p>
        <p class="cart-card-price">€${item.price.toFixed(2)}</p>
      </div>
      <div class="cart-card-icon ${item.iconClass || (i % 2 ? 'pink' : 'yellow')}">${CART_ICON_SVG}</div>
    </div>
  `).join('');
  document.getElementById('cart-total').textContent = `Totale: €${total.toFixed(2)}`;
}

// Favourites page - demo data
const FAV_DEMO = [
  { name: 'Pizza margherita', ingredients: ['Pomodoro', 'Mozzarella', 'Basilico'], rating: 3.5, imagePlaceholder: CURRENT_PRODUCT.imagePlaceholder },
  { name: 'Cobb salad', ingredients: ['Insalata mista', 'Salsa ranch', 'Pomodori', 'Avocado'], rating: 4.5, imagePlaceholder: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#81c784"/></svg>') },
  { name: 'Tiramisù', ingredients: ['Savoiardi', 'Mascarpone', 'Uova'], rating: 5, imagePlaceholder: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#8d6e63"/></svg>') }
];

const CART_PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/><line x1="15" y1="9" x2="15" y2="11"/><line x1="13" y1="10" x2="17" y2="10"/></svg>';

function renderFavourites() {
  const items = favourites.length ? favourites : FAV_DEMO;
  document.getElementById('favourites-list').innerHTML = items.map(item => {
    const fullStars = Math.floor(item.rating || 0);
    const hasHalf = (item.rating || 0) % 1 >= 0.5;
    const stars = Array(fullStars).fill('<span class="fav-card-star"></span>').join('') +
      (hasHalf ? '<span class="fav-card-star half"></span>' : '') +
      Array(5 - fullStars - (hasHalf ? 1 : 0)).fill('<span class="fav-card-star" style="background:#ddd"></span>').join('');
    return `
      <div class="fav-card">
        <div class="fav-card-green">
          <div class="fav-card-header">
            <img class="fav-card-image" src="${item.imagePlaceholder || CURRENT_PRODUCT.imagePlaceholder}" alt="">
            <p class="fav-card-name">${item.name}</p>
          </div>
          <p class="fav-card-ingredients-label">Ingredienti:</p>
          <ul class="fav-card-ingredients">${(item.ingredients || []).map(i => `<li>${i}</li>`).join('')}</ul>
          <div class="fav-card-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div>
          <p class="fav-card-rating-label">Rating piatto</p>
          <div class="fav-card-stars">${stars}</div>
        </div>
        <div class="fav-card-orange">${CART_PLUS_SVG}</div>
      </div>
    `;
  }).join('');
}
