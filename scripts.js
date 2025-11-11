const form = document.getElementById('contact-form');

if (form) {
  form.addEventListener('submit', function (e) {

    e.preventDefault();


    if (form.checkValidity()) {

      alert('¡Mensaje enviado!');


      window.location.href = 'index.html';
    } else {

      form.reportValidity();
    }
  });
}

