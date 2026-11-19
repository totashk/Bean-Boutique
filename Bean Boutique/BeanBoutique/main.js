var navToggle = document.querySelector('.nav-toggle');
var navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function() {
    navLinks.classList.toggle('open');
  });
}

var currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(function(link) {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

var PRICE_MAP = {
  'eth-yirg': 45.00,
  'col-huila': 40.00,
  'house-esp': 38.00,
  'guat-ant': 48.00,
  'ken-aa': 52.00,
  'decaf-blend': 42.00,
  'v60-ceramic': 30.00,
  'chemex-6': 55.00,
  'aeropress': 60.00,
  'comandante': 50.00,
  'stagg-ekg': 210.00,
  'acaia-pearl': 50.00,
  'v60-bundle': 39.99,
  'triple-pack': 29.99,
  'aeropress-bundle': 41.00,
  'sub-starter': 18.00,
  'sub-regular': 32.00,
  'sub-connoisseur': 55.00
};

function getCart() {
  try {
    var rawCart = JSON.parse(localStorage.getItem('bb_cart')) || [];
    return rawCart.map(function(item) {
      if (Object.prototype.hasOwnProperty.call(PRICE_MAP, item.id)) {
        item.price = PRICE_MAP[item.id];
      }
      return item;
    });
  } catch(e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('bb_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(item) {
  var cart = getCart();
  var nextItem = Object.assign({}, item);

  if (Object.prototype.hasOwnProperty.call(PRICE_MAP, nextItem.id)) {
    nextItem.price = PRICE_MAP[nextItem.id];
  }

  var found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === nextItem.id) {
      cart[i].qty += 1;
      found = true;
      break;
    }
  }
  if (!found) {
    nextItem.qty = 1;
    cart.push(nextItem);
  }
  saveCart(cart);
  showToast(nextItem.name + ' added to cart');
}

function updateCartBadge() {
  var cart = getCart();
  var total = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

window.bbCart = { getCart: getCart, saveCart: saveCart, addToCart: addToCart, updateCartBadge: updateCartBadge };

function showToast(message) {
  var toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function() {
    toast.classList.remove('show');
  }, 2800);
}
window.showToast = showToast;

function initSlideshow(container) {
  var slides = container.querySelectorAll('.slide');
  var dots   = container.querySelectorAll('.dot');
  if (!slides.length) return;

  var current = 0;
  var timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() { timer = setInterval(next, 4500); }
  function stopAuto()  { clearInterval(timer); }

  var nextBtn = container.querySelector('.slide-next');
  var prevBtn = container.querySelector('.slide-prev');
  if (nextBtn) nextBtn.addEventListener('click', function() { stopAuto(); next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', function() { stopAuto(); prev(); startAuto(); });

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { stopAuto(); goTo(i); startAuto(); });
  });

  startAuto();
}

document.querySelectorAll('.slideshow').forEach(initSlideshow);

updateCartBadge();
