const KEYS = {
    MEDICOS: "centroMedico_medicos",
    ESPECIALIDADES: "centroMedico_especialidades",
    OBRAS_SOCIALES: "centroMedico_obrasSociales",
    TURNOS: "centroMedico_turnos",
    RESERVAS: "centroMedico_reservas",
};

let medicoSeleccionado = null;
let modalTurnoInstance;
let modalConfirmacionInstance;

document.addEventListener("DOMContentLoaded", () => {
    const medicos = JSON.parse(localStorage.getItem(KEYS.MEDICOS)) || [];
    const especialidades = JSON.parse(localStorage.getItem(KEYS.ESPECIALIDADES)) || [];
    const obras_sociales = JSON.parse(localStorage.getItem(KEYS.OBRAS_SOCIALES)) || [];

    const contenedor = document.getElementById('tarjetas-container');
    contenedor.innerHTML = '';

    medicos.filter(m => m.activo).forEach((medico, index) => {
        const especialidad = especialidades.find(e => e.id === medico.especialidades[0]);
        const nombreEspecialidad = especialidad ? especialidad.nombre : 'Sin especialidad';

        const tarjeta = document.createElement('article');
        tarjeta.className = 'col-12 col-md-6 col-lg-4 p-3 mt-4';
        tarjeta.innerHTML = `
            <div class="row g-0 border border-2 border-secondary rounded-4 p-2"> 
                <div class="col-md-4">
                    <img src="${medico.fotografia}" alt="${medico.nombre} ${medico.apellido}" class="img-fluid rounded-pill">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${medico.nombre} ${medico.apellido}</h5>
                        <p class="card-text">${nombreEspecialidad}</p>
                        <p class="card-text"><small class="text-body-secondary">MD ${medico.matricula}</small></p>
                        <button class="btn btn-primary btn-sm btn-detalle" data-medico-id="${medico.id}">TURNOS</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });

    crearModales();

    document.querySelectorAll('.btn-detalle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const medicoId = parseInt(e.target.getAttribute('data-medico-id'));
            const medico = medicos.find(m => m.id === medicoId);
            mostrarModal(medico, especialidades, obras_sociales);
        });
    });

    // Inicializar modales de Bootstrap
    modalTurnoInstance = new bootstrap.Modal(document.getElementById('modalTurno'));
    modalConfirmacionInstance = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
});

function crearModales() {
    if (document.getElementById('modalMedico')) return;

    const modalesHTML = `
        <!-- Modal Detalle Médico -->
        <div class="modal fade" id="modalMedico" tabindex="-1" aria-labelledby="modalMedicoLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalMedicoLabel">Detalles del Médico</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="modalMedicoBody"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" id="btnTurnos">Turnos</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Pedir Turno -->
        <div class="modal fade" id="modalTurno" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Pedir Turno</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info" id="infoMedico"></div>
                        <form id="formTurno">
                            <div class="mb-3">
                                <label for="inputDni" class="form-label">DNI:</label>
                                <input type="text" id="inputDni" class="form-control" placeholder="Ingrese su DNI" required>
                            </div>
                            <div class="mb-3">
                                <label for="inputNombre" class="form-label">Nombre Completo:</label>
                                <input type="text" id="inputNombre" class="form-control" placeholder="Ingrese su nombre completo" required>
                            </div>
                            <div class="mb-3">
                                <label for="selectTurno" class="form-label">Seleccionar Turno:</label>
                                <select id="selectTurno" class="form-select" required>
                                    <option value="">-- Seleccione un turno --</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="selectObraSocial" class="form-label">Obra Social (opcional):</label>
                                <select id="selectObraSocial" class="form-select">
                                    <option value="">-- Sin obra social --</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="cerrarModalTurno()">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="confirmarTurno()">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Confirmación -->
        <div class="modal fade" id="modalConfirmacion" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">Confirmación de Reserva</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="detalleReserva"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" onclick="cerrarModalConfirmacion()">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalesHTML);

    // Event listener para el botón Turnos
    document.getElementById('btnTurnos').addEventListener('click', () => {
        abrirModalTurno();
    });
}

function mostrarModal(medico, especialidades, obras_sociales) {
    medicoSeleccionado = medico; // Guardar el médico seleccionado

    const especialidad = especialidades.find(e => Number(e.id) === Number(medico.especialidades[0]));
    const nombreEspecialidad = especialidad ? especialidad.nombre : 'Sin especialidad';

    const imagenMedico = medico.fotografia || 'https://via.placeholder.com/150?text=Sin+Imagen';

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

function abrirModalTurno() {
    if (!medicoSeleccionado) {
        alert('No se ha seleccionado ningún médico');
        return;
    }

    const especialidades = JSON.parse(localStorage.getItem(KEYS.ESPECIALIDADES)) || [];
    const turnos = JSON.parse(localStorage.getItem(KEYS.TURNOS)) || [];
    const obrasSociales = JSON.parse(localStorage.getItem(KEYS.OBRAS_SOCIALES)) || [];

    const especialidad = especialidades.find(e => Number(e.id) === Number(medicoSeleccionado.especialidades[0]));

    if (!especialidad) {
        alert('No se encontró la información de la especialidad');
        return;
    }

    // Mostrar información del médico
    document.getElementById('infoMedico').innerHTML = `
        <p class="mb-1"><strong>Médico:</strong> ${medicoSeleccionado.nombre} ${medicoSeleccionado.apellido}</p>
        <p class="mb-1"><strong>Especialidad:</strong> ${especialidad.nombre}</p>
        <p class="mb-0"><strong>Valor Consulta:</strong> $${medicoSeleccionado.valorConsulta.toFixed(2)}</p>
    `;

    // Cargar turnos disponibles
    const turnosDisponibles = turnos.filter(t => {
        return Number(t.id_medico) === medicoSeleccionado.id && t.disponible === true;
    });

    const selectTurno = document.getElementById('selectTurno');
    selectTurno.innerHTML = '<option value="">-- Seleccione un turno --</option>';

    if (turnosDisponibles.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "No hay turnos disponibles";
        option.disabled = true;
        selectTurno.appendChild(option);
    } else {
        turnosDisponibles.forEach(turno => {
            const option = document.createElement('option');
            option.value = turno.id;
            option.textContent = `${turno.fecha} - ${turno.hora}`;
            selectTurno.appendChild(option);
        });
    }

    // Cargar obras sociales del médico
    const selectObraSocial = document.getElementById('selectObraSocial');
    selectObraSocial.innerHTML = '<option value="">-- Sin obra social --</option>';

    if (medicoSeleccionado.obrasSociales && medicoSeleccionado.obrasSociales.length > 0) {
        medicoSeleccionado.obrasSociales.forEach(osId => {
            const obraSocial = obrasSociales.find(os => os.id === osId);
            if (obraSocial) {
                const option = document.createElement('option');
                option.value = obraSocial.id;
                option.textContent = obraSocial.nombre;
                selectObraSocial.appendChild(option);
            }
        });
    }

    // Cerrar modal de detalles y abrir modal de turnos
    bootstrap.Modal.getInstance(document.getElementById('modalMedico')).hide();
    modalTurnoInstance.show();
}

function cerrarModalTurno() {
    modalTurnoInstance.hide();
    document.getElementById('formTurno').reset();
}

function cerrarModalConfirmacion() {
    modalConfirmacionInstance.hide();
}

function confirmarTurno() {
    const dni = document.getElementById('inputDni').value.trim();
    const nombre = document.getElementById('inputNombre').value.trim();
    const turnoId = parseInt(document.getElementById('selectTurno').value);
    const obraSocialId = document.getElementById('selectObraSocial').value;

    // Validaciones
    if (!dni) {
        alert('Debe ingresar su DNI');
        return;
    }

    if (!nombre) {
        alert('Debe ingresar su nombre completo');
        return;
    }

    if (!turnoId) {
        alert('Debe seleccionar un turno');
        return;
    }

    const especialidades = JSON.parse(localStorage.getItem(KEYS.ESPECIALIDADES)) || [];
    const turnos = JSON.parse(localStorage.getItem(KEYS.TURNOS)) || [];
    const obrasSociales = JSON.parse(localStorage.getItem(KEYS.OBRAS_SOCIALES)) || [];
    const reservas = JSON.parse(localStorage.getItem(KEYS.RESERVAS)) || [];

    const especialidad = especialidades.find(e => Number(e.id) === Number(medicoSeleccionado.especialidades[0]));
    const turno = turnos.find(t => Number(t.id) === turnoId);

    let valorFinal = medicoSeleccionado.valorConsulta;
    let descuento = 0;
    let obraSocialNombre = 'Sin obra social';
    let porcentajeDescuento = 0;

    if (obraSocialId) {
        const obraSocial = obrasSociales.find(os => os.id === parseInt(obraSocialId));
        if (obraSocial) {
            porcentajeDescuento = obraSocial.porcentaje;
            descuento = (medicoSeleccionado.valorConsulta * porcentajeDescuento) / 100;
            valorFinal = medicoSeleccionado.valorConsulta - descuento;
            obraSocialNombre = obraSocial.nombre;
        }
    }

    // Marcar turno como no disponible
    const turnoIndex = turnos.findIndex(t => Number(t.id) === turnoId);
    turnos[turnoIndex].disponible = false;
    localStorage.setItem(KEYS.TURNOS, JSON.stringify(turnos));

    // Crear reserva con el orden especificado
    const nuevaReserva = {
        id: reservas.length > 0 ? Math.max(...reservas.map(r => r.id)) + 1 : 1,
        dni: dni,
        nombre: nombre,
        turnoId: turnoId,
        especialidadId: especialidad.id,
        medicoId: medicoSeleccionado.id,
        obraSocialId: obraSocialId ? parseInt(obraSocialId) : null,
        valorFinal: valorFinal
    };

    reservas.push(nuevaReserva);
    localStorage.setItem(KEYS.RESERVAS, JSON.stringify(reservas));

    // Mostrar confirmación
    let detalleHTML = `
        <div class="mb-3">
            <p class="mb-2"><strong>DNI:</strong> ${dni}</p>
            <p class="mb-2"><strong>Paciente:</strong> ${nombre}</p>
            <p class="mb-2"><strong>Médico:</strong> ${medicoSeleccionado.nombre} ${medicoSeleccionado.apellido}</p>
            <p class="mb-2"><strong>Especialidad:</strong> ${especialidad.nombre}</p>
            <p class="mb-2"><strong>Fecha:</strong> ${turno.fecha}</p>
            <p class="mb-2"><strong>Hora:</strong> ${turno.hora}</p>
            <p class="mb-2"><strong>Obra Social:</strong> ${obraSocialNombre}</p>
    `;

    if (descuento > 0) {
        detalleHTML += `<p class="mb-2"><strong>Descuento:</strong> $${descuento.toFixed(2)} (${porcentajeDescuento}%)</p>`;
    }

    detalleHTML += `
        </div>
        <div class="alert alert-success text-center">
            <p class="mb-1">Valor Final</p>
            <h2 class="mb-0">$${valorFinal.toFixed(2)}</h2>
        </div>
    `;

    document.getElementById('detalleReserva').innerHTML = detalleHTML;

    cerrarModalTurno();
    modalConfirmacionInstance.show();
}
