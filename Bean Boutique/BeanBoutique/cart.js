var DELIVERY_THRESHOLD = 150;
var DELIVERY_COST = 15.00;
var DISCOUNT_STORAGE_KEY = 'bb_discount';
var PROMO_CODES = {
  IMU2026: 0.20,
  FATIMA2005: 0.15,
  BEANBOUTIQUE26: 0.10
};

var discountRate = 0;
var discountCode = '';
var cartItemsList = document.getElementById('cartItemsList');
var cartEmpty = document.getElementById('cartEmpty');
var cartLayout = document.getElementById('cartLayout');
var promoInput = document.getElementById('promoInput');
var promoApply = document.getElementById('promoApply');
var promoMsg = document.getElementById('promoMsg');
var checkoutBtn = document.getElementById('checkoutBtn');

function formatLYD(amount) {
  return amount.toFixed(2) + ' LYD';
}

function saveDiscountState() {
  if (discountRate > 0 && discountCode) {
    localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify({
      code: discountCode,
      rate: discountRate
    }));
  } else {
    localStorage.removeItem(DISCOUNT_STORAGE_KEY);
  }
}

function loadDiscountState() {
  try {
    var stored = JSON.parse(localStorage.getItem(DISCOUNT_STORAGE_KEY));
    if (stored && PROMO_CODES[stored.code] === stored.rate) {
      discountCode = stored.code;
      discountRate = stored.rate;
    }
  } catch (e) {
    discountCode = '';
    discountRate = 0;
  }
}

function resetDiscountState(clearMessage) {
  discountRate = 0;
  discountCode = '';
  localStorage.removeItem(DISCOUNT_STORAGE_KEY);

  if (clearMessage) {
    promoMsg.textContent = '';
    promoMsg.style.color = '';
  }
}

function renderCart() {
  var cart = window.bbCart.getCart();
  cartItemsList.innerHTML = '';

  if (cart.length === 0) {
    resetDiscountState(true);
    cartLayout.style.display = 'none';
    cartEmpty.style.display = 'block';
    updateSummary([]);
    return;
  }

  cartLayout.style.display = '';
  cartEmpty.style.display = 'none';

  cart.forEach(function(item) {
    var el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML =
      '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy" />' +
      '<div class="cart-item-info">' +
        '<h4>' + item.name + '</h4>' +
        '<p>' + formatLYD(item.price) + ' each</p>' +
        '<div class="qty-control">' +
          '<button class="qty-btn" data-id="' + item.id + '" data-action="decrease" aria-label="Decrease quantity">−</button>' +
          '<span class="qty-display" aria-label="Quantity: ' + item.qty + '">' + item.qty + '</span>' +
          '<button class="qty-btn" data-id="' + item.id + '" data-action="increase" aria-label="Increase quantity">+</button>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;">' +
        '<span class="cart-item-price">' + formatLYD(item.price * item.qty) + '</span>' +
        '<button class="remove-btn" data-id="' + item.id + '" aria-label="Remove ' + item.name + ' from cart">✕</button>' +
      '</div>';
    cartItemsList.appendChild(el);
  });

  updateSummary(cart);
}

function updateSummary(cart) {
  var subtotal = cart.reduce(function(sum, item) {
    return sum + item.price * item.qty;
  }, 0);
  var delivery = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_COST;
  var discountAmt = subtotal * discountRate;
  var total = subtotal + delivery - discountAmt;

  document.getElementById('summarySubtotal').textContent = formatLYD(subtotal);
  document.getElementById('summaryDelivery').textContent =
    delivery === 0 ? 'FREE' : formatLYD(delivery);
  document.getElementById('summaryDiscount').textContent =
    discountAmt > 0 ? '−' + formatLYD(discountAmt) : 'None';
  document.getElementById('summaryTotal').textContent = formatLYD(total);
}

if (
  cartItemsList &&
  cartEmpty &&
  cartLayout &&
  promoInput &&
  promoApply &&
  promoMsg &&
  checkoutBtn
) {
  cartItemsList.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-action], .remove-btn');
    if (!btn) return;

    var id = btn.dataset.id;
    var cart = window.bbCart.getCart();
    var idx = cart.findIndex(function(item) {
      return item.id === id;
    });
    if (idx === -1) return;

    if (btn.classList.contains('remove-btn')) {
      cart.splice(idx, 1);
    } else if (btn.dataset.action === 'increase') {
      cart[idx].qty += 1;
    } else if (btn.dataset.action === 'decrease') {
      cart[idx].qty -= 1;
      if (cart[idx].qty < 1) cart.splice(idx, 1);
    }

    window.bbCart.saveCart(cart);
    renderCart();
  });

  promoApply.addEventListener('click', function() {
    var rawCode = promoInput.value.trim();
    var code = rawCode.toUpperCase();

    if (PROMO_CODES[code]) {
      discountCode = code;
      discountRate = PROMO_CODES[code];
      saveDiscountState();
      promoMsg.textContent = 'Code applied: ' + Math.round(discountRate * 100) + '% off.';
      promoMsg.style.color = '#2ecc71';
    } else {
      resetDiscountState(false);
      promoMsg.textContent = 'Invalid code. Try IMU2026, FATIMA2005, or BeanBoutique26.';
      promoMsg.style.color = '#ff8c69';
    }

    renderCart();
  });

  checkoutBtn.addEventListener('click', function() {
    window.showToast('Your order has been placed successfully.');
  });

  loadDiscountState();
  renderCart();
}
