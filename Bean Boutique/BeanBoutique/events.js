var regForm = document.getElementById('regForm');

if (regForm) {
  regForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var firstName = document.getElementById('firstName').value.trim();
    var lastName = document.getElementById('lastName').value.trim();
    var email = document.getElementById('email').value.trim();
    var event = document.getElementById('eventSelect').value;
    var successMsg = document.getElementById('formSuccess');

    document.querySelectorAll('.form-error').forEach(function(el) {
      el.textContent = '';
    });
    if (successMsg) {
      successMsg.style.display = 'none';
    }

    var valid = true;

    if (!firstName) {
      document.getElementById('errFirstName').textContent = 'Please enter your first name.';
      valid = false;
    }

    if (!lastName) {
      document.getElementById('errLastName').textContent = 'Please enter your last name.';
      valid = false;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      document.getElementById('errEmail').textContent = 'Please enter your email address.';
      valid = false;
    } else if (!emailRegex.test(email)) {
      document.getElementById('errEmail').textContent = 'That doesn\'t look like a valid email.';
      valid = false;
    }

    if (!event) {
      document.getElementById('errEvent').textContent = 'Please select which event you\'d like to attend.';
      valid = false;
    }

    if (valid) {
      var notes = document.getElementById('notes').value;
      var subject = encodeURIComponent('Event Registration: ' + event);
      var body = encodeURIComponent(
        'First Name: ' + firstName +
        '\nLast Name: ' + lastName +
        '\nEmail: ' + email +
        '\nEvent: ' + event +
        '\nNotes: ' + notes
      );

      window.location.href = 'mailto:bean-boutique@info.com?subject=' + subject + '&body=' + body;
      if (successMsg) {
        successMsg.style.display = 'block';
      }
      this.reset();
    }
  });
}
