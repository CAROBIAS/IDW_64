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


document.addEventListener("DOMContentLoaded", () => {
  const medicos = JSON.parse(localStorage.getItem('medicos')) || [];

  const contenedor = document.getElementById('tarjetas-container');
  contenedor.innerHTML = ''; // Limpiar contenido por si hay algo

  medicos.filter(m => m.activo).forEach(medico => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'col-12 col-md-6 col-lg-4 p-3 mt-4';
    tarjeta.innerHTML = `
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${medico.imagen}" alt="${medico.nombre} ${medico.apellido}" class="img-fluid rounded-pill">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${medico.nombre} ${medico.apellido}</h5>
                        <p class="card-text">${medico.especialidad}</p>
                        <p class="card-text"><small class="text-body-secondary">${medico.matricula}</small></p>
                    </div>
                </div>
            </div>
        `;
    contenedor.appendChild(tarjeta);
  });
});