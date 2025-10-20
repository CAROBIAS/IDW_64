const track = document.querySelector('.carousel-track');
const imgs = Array.from(track.children);

// Clonamos las imágenes y las agregamos al final
imgs.forEach(img => {
  const clone = img.cloneNode(true);
  track.appendChild(clone);
});

let position = 0;
function moveCarousel() {
  position -= 1; // velocidad (px por frame)
  if (Math.abs(position) >= track.scrollWidth / 2) {
    position = 0; // reset al llegar a la mitad
  }
  track.style.transform = `translateX(${position}px)`;
  requestAnimationFrame(moveCarousel);
}

moveCarousel();

const form = document.getElementById('contact-form');

    form.addEventListener('submit', function(e) {
        // Evita que se envíe realmente el formulario
        e.preventDefault();

        // Si todos los campos requeridos están completos
        if (form.checkValidity()) {
            // Mostrar popup
            alert('¡Mensaje enviado!');

            // Redirigir a index.html
            window.location.href = 'index.html';
        } else {
            // Si algo falta, deja que el navegador muestre la alerta de required
            form.reportValidity();
        }
    });

    