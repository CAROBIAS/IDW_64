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


if (form) {
  form.addEventListener('submit', function(e) {
   
    e.preventDefault();

    
    if (form.checkValidity()) {
    
      alert('¡Mensaje enviado!');

      
      window.location.href = 'index.html';
    } else {
      
      form.reportValidity();
    }
  });
}


