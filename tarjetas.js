document.addEventListener("DOMContentLoaded", () => {
    const medicos = JSON.parse(localStorage.getItem('centroMedico_medicos')) || [];
    const especialidades = JSON.parse(localStorage.getItem('centroMedico_especialidades')) || [];
    const obras_sociales = JSON.parse(localStorage.getItem('centroMedico_obrasSociales')) || [];
    


    const contenedor = document.getElementById('tarjetas-container');
    contenedor.innerHTML = ''; // Limpiar contenido por si hay algo
 
    medicos.filter(m => m.activo).forEach((medico, index) => {
        // Buscar el nombre de la especialidad por ID
        const especialidad = especialidades.find(e => e.id === medico.especialidad);
        const nombreEspecialidad = especialidad ? especialidad.nombre : 'Sin especialidad';
        
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
                        <p class="card-text">${nombreEspecialidad}</p>
                        <p class="card-text"><small class="text-body-secondary">${medico.matricula}</small></p>
                        <button class="btn btn-primary btn-detalle" data-medico-id="${index}">DETALLE</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
 
    // Crear el modal una sola vez
    crearModal();
 
    // Agregar event listeners a los botones de detalle
    document.querySelectorAll('.btn-detalle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const medicoId = e.target.getAttribute('data-medico-id');
            const medico = medicos.filter(m => m.activo)[medicoId];
            mostrarModal(medico, especialidades, obras_sociales);
        });
    });
});

function crearModal() {
    // Verificar si el modal ya existe
    if (document.getElementById('modalMedico')) return;

    const modalHTML = `
        <div class="modal fade" id="modalMedico" tabindex="-1" aria-labelledby="modalMedicoLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalMedicoLabel">Detalles del Médico</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="modalMedicoBody">
                        <!-- Contenido dinámico -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" id="btnTurnos">Turnos</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Event listener para el botón Turnos
    document.getElementById('btnTurnos').addEventListener('click', () => {
        console.log('Abrir sistema de turnos');
        // window.location.href = 'turnos.html';
    });
}

function mostrarModal(medico, especialidades, obras_sociales) {
    // Buscar el nombre de la especialidad
    const especialidad = especialidades.find(e => Number(e.id) === Number(medico.especialidades[0]));
    const nombreEspecialidad = especialidad ? especialidad.nombre : 'Sin especialidad';
    
    // Imagen por defecto si no existe
    const imagenMedico = medico.imagen || 'https://via.placeholder.com/150?text=Sin+Imagen';
    
    // Buscar las obras sociales del médico - CAMBIO AQUÍ: obrasSociales en lugar de obras_sociales
    let obrasSocialesInfo = '';
    if (medico.obrasSociales && medico.obrasSociales.length > 0) {
        obrasSocialesInfo = '<div class="mt-3"><strong>Obras Sociales:</strong><div class="row mt-2">';
        
        medico.obrasSociales.forEach(osId => {
            const obraSocial = obras_sociales.find(os => os.id == osId);
            
            if (obraSocial) {
                const imagenOS = obraSocial.imagen || 'https://via.placeholder.com/40?text=OS';
                obrasSocialesInfo += `
                    <div class="col-md-6 mb-2">
                        <div class="d-flex align-items-center border rounded p-2">
                            <img src="${imagenOS}" alt="${obraSocial.nombre}" class="me-2" style="width: 40px; height: 40px; object-fit: contain;">
                            <div>
                                <div><strong>${obraSocial.nombre}</strong></div>
                                <small class="text-success">Descuento: ${obraSocial.porcentaje}%</small>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        obrasSocialesInfo += '</div></div>';
    } else {
        obrasSocialesInfo = '<p class="mt-3"><strong>Obras Sociales:</strong> No acepta obras sociales</p>';
    }
    
    const modalBody = document.getElementById('modalMedicoBody');
    modalBody.innerHTML = `
        <div class="text-center mb-3">
            <img src="${imagenMedico}" alt="${medico.nombre} ${medico.apellido}" class="img-fluid rounded-pill" style="max-width: 150px;">
        </div>
        <h5 class="text-center">${medico.nombre} ${medico.apellido}</h5>
        <hr>
        <p><strong>Especialidad:</strong> ${nombreEspecialidad}</p>
        <p><strong>Matrícula:</strong> ${medico.matricula}</p>        
        ${medico.biografia ? `<p><strong>Biografía:</strong><br>${medico.biografia}</p>` : ''}
        ${obrasSocialesInfo}
    `;

    const modal = new bootstrap.Modal(document.getElementById('modalMedico'));
    modal.show();
}