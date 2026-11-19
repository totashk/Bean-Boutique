var modalOverlay = document.getElementById('modalOverlay');
var modalClose = document.getElementById('modalClose');
var modalSkip = document.getElementById('modalSkip');
var modalSubmit = document.getElementById('modalSubmit');
var modalEmail = document.getElementById('modalEmail');
var modalMsg = document.getElementById('modalMsg');

if (modalOverlay && modalClose && modalSkip && modalSubmit && modalEmail && modalMsg) {
  if (!sessionStorage.getItem('bb_modal_seen')) {
    setTimeout(function() {
      modalOverlay.classList.remove('hidden');
    }, 2200);
  }

  function closeModal() {
    modalOverlay.classList.add('hidden');
    sessionStorage.setItem('bb_modal_seen', '1');
  }

  modalClose.addEventListener('click', closeModal);
  modalSkip.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  modalSubmit.addEventListener('click', function() {
    var email = modalEmail.value.trim();
    var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      modalMsg.textContent = 'Please enter a valid email address.';
      modalMsg.style.color = '#ff8c69';
      return;
    }

    modalMsg.textContent = 'Your 10% code is: BeanBoutique26';
    modalMsg.style.color = '#2ecc71';
    setTimeout(closeModal, 3000);
  });
}
