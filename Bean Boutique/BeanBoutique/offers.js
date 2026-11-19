var saleEndDate = new Date('2026-05-31T23:59:59');
var countdownTimer;
var countdownWrap = document.querySelector('.countdown-wrap');

function updateCountdown() {
  if (!countdownWrap) return;

  var now = new Date();
  var diff = saleEndDate - now;

  if (diff <= 0) {
    countdownWrap.innerHTML =
      '<p style="color:var(--gold);font-weight:700;">Sale has ended</p>';
    clearInterval(countdownTimer);
    return;
  }

  var days = Math.floor(diff / (1000 * 60 * 60 * 24));
  var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  var mins = Math.floor((diff / (1000 * 60)) % 60);
  var secs = Math.floor((diff / 1000) % 60);

  document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
  document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
}

if (countdownWrap) {
  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
}
