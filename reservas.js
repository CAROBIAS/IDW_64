document.addEventListener("DOMContentLoaded", () => {
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");

  if (!tipoUsuario || tipoUsuario !== "admin") {
    alert("Acceso denegado. Solo administradores pueden entrar.");
    window.location.href = "index.html";
  } else {
    document.body.style.display = "block";
  }
});


// Inicializar reservas desde localStorage o por defecto
function inicializarReservas() {
    const reservasGuardadas = localStorage.getItem('reservas');

    if (reservasGuardadas) {
        return JSON.parse(reservasGuardadas);
    } else {
        // NOTA: algunos campos quedan en blanco (completar luego)
        const reservasIniciales = [
            { id: 1, dni: "40123123", nombreCompleto: "Juan Pérez", id_turno: 1, id_especialidad: "Cardiología", id_obraSocial: "OSDE", valor: "" /* completar luego */ },
            { id: 2, dni: "38987654", nombreCompleto: "María López", id_turno: 2, id_especialidad: "", id_obraSocial: "", valor: "" /* completar luego */ },
            { id: 3, dni: "41222444", nombreCompleto: "Pedro González", id_turno: 3, id_especialidad: "Pediatría", id_obraSocial: "IOMA", valor: "" /* completar luego */ }
        ];

        guardarReservas(reservasIniciales);
        return reservasIniciales;
    }
}

// Guardar reservas en localStorage
function guardarReservas(reservasArray) {
    localStorage.setItem('reservas', JSON.stringify(reservasArray));
}

// Cargar reservas desde localStorage
function cargarReservas() {
    const r = localStorage.getItem('reservas');
    return r ? JSON.parse(r) : [];
}

let reservas = inicializarReservas();
let tableReservas;

// Inicializar DataTable
$(document).ready(function() {
    loadTableReservas();
});

function loadTableReservas() {
    if (tableReservas) {
        tableReservas.destroy();
        $('#tablaReservas').empty().html(`
            <thead>
                <tr>
                    <th>ID</th>
                    <th>DNI</th>
                    <th>Nombre Completo</th>
                    <th>Turno</th>
                    <th>Especialidad</th>
                    <th>Obra Social</th>
                    <th>Valor</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        `);
    }

    reservas = cargarReservas();
    const turnos = (typeof cargarTurnos === "function") ? cargarTurnos() : [];
    const medicos = (typeof cargarMedicos === "function") ? cargarMedicos() : [];

    // Preparar datos para DataTable: reemplazar id_turno por info legible (médico + fecha hora)
    const data = reservas.map(r => {
        const turno = turnos.find(t => t.id === r.id_turno);
        let turnoLabel = 'N/A';
        if (turno) {
            const medico = medicos.find(m => m.id === turno.id_medico);
            const medicoLabel = medico ? `${medico.nombre} ${medico.apellido}` : 'Desconocido';
            turnoLabel = `${turno.id} — ${medicoLabel} (${turno.fecha} ${turno.hora})`;
        }
        return {
            id: r.id,
            dni: r.dni,
            nombreCompleto: r.nombreCompleto,
            turnoLabel,
            id_especialidad: r.id_especialidad || '', // completar luego si falta
            id_obraSocial: r.id_obraSocial || '', // completar luego si falta
            valor: (r.valor === "" || r.valor === undefined) ? '' : `$${r.valor}`,
            raw: r
        };
    });

    tableReservas = $('#tablaReservas').DataTable({
        data: data,
        columns: [
            { data: 'id' },
            { data: 'dni' },
            { data: 'nombreCompleto' },
            { data: 'turnoLabel' },
            { data: 'id_especialidad' },
            { data: 'id_obraSocial' },
            { data: 'valor' },
            {
                data: 'raw',
                orderable: false,
                className: 'table-actions',
                render: function(d) {
                    return `
                        <button class="btn btn-sm btn-info btn-action" onclick="verReserva(${d.id})" title="Ver">
                            <i class="bx bx-show"></i>
                        </button>
                        <button class="btn btn-sm btn-warning btn-action" onclick="editarReserva(${d.id})" title="Editar">
                            <i class="bx bx-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-action" onclick="eliminarReserva(${d.id})" title="Eliminar">
                            <i class="bx bx-trash"></i>
                        </button>
                    `;
                }
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        responsive: true,
        pageLength: 10,
        autoWidth: false
    });
}

// Abrir modal para crear reserva
function openCreateReservaModal() {
    document.getElementById('formReserva').reset();
    document.getElementById('btnAgregar').textContent = 'Agregar Reserva';
    document.getElementById('btnAgregar').onclick = agregarReserva;
    // si querés podés cargar selects con turnos/obras sociales acá
    rellenarSelectTurnos();
}

// Opcional: rellenar select de turnos en el formulario (si lo convertís a <select>)
function rellenarSelectTurnos() {
    // Si en tu HTML cambias el campo id_turno a <select id="id_turno">, podés usar esto.
    const el = document.getElementById('id_turno');
    if (!el || el.tagName !== 'SELECT') return;
    el.innerHTML = '<option value="">Seleccione...</option>';
    const turnosList = (typeof cargarTurnos === "function") ? cargarTurnos() : [];
    const medicos = (typeof cargarMedicos === "function") ? cargarMedicos() : [];
    turnosList.forEach(t => {
        const medico = medicos.find(m => m.id === t.id_medico);
        const text = medico ? `${t.id} - ${medico.nombre} ${medico.apellido} (${t.fecha} ${t.hora})` : `${t.id} - ${t.fecha} ${t.hora}`;
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = text;
        el.appendChild(opt);
    });
}

// Ver reserva en modal
function verReserva(id) {
    reservas = cargarReservas();
    const r = reservas.find(x => x.id === id);
    if (!r) return;

    const turnos = (typeof cargarTurnos === "function") ? cargarTurnos() : [];
    const medicos = (typeof cargarMedicos === "function") ? cargarMedicos() : [];
    const turno = turnos.find(t => t.id === r.id_turno);
    const medico = turno ? medicos.find(m => m.id === turno.id_medico) : null;
    const turnoLabel = turno ? `${turno.id} — ${medico ? medico.nombre + ' ' + medico.apellido : 'Desconocido'} (${turno.fecha} ${turno.hora})` : 'N/A';

    const content = `
        <div class="row">
            <div class="col-12">
                <p><strong>ID:</strong> ${r.id}</p>
                <p><strong>DNI:</strong> ${r.dni}</p>
                <p><strong>Paciente:</strong> ${r.nombreCompleto}</p>
                <p><strong>Turno:</strong> ${turnoLabel}</p>
                <p><strong>Especialidad:</strong> ${r.id_especialidad || 'Completar luego'}</p>
                <p><strong>Obra Social:</strong> ${r.id_obraSocial || 'Completar luego'}</p>
                <p><strong>Valor:</strong> ${r.valor ? `$${r.valor}` : 'Completar luego'}</p>
            </div>
        </div>
    `;

    document.getElementById('viewModalBody').innerHTML = content;
    new bootstrap.Modal(document.getElementById('viewModal')).show();
}

// Editar reserva
function editarReserva(id) {
    reservas = cargarReservas();
    const r = reservas.find(x => x.id === id);
    if (!r) return;

    // si tenés select para turnos, rellenalo
    rellenarSelectTurnos();

    document.getElementById('dni').value = r.dni;
    document.getElementById('nombreCompleto').value = r.nombreCompleto;
    // si id_turno es input number en tu HTML:
    const idTurnoEl = document.getElementById('id_turno');
    if (idTurnoEl) idTurnoEl.value = r.id_turno || '';

    document.getElementById('id_especialidad').value = r.id_especialidad || '';
    document.getElementById('id_obraSocial').value = r.id_obraSocial || '';
    document.getElementById('valor').value = r.valor || '';

    document.getElementById('btnAgregar').textContent = 'Guardar Cambios';
    document.getElementById('btnAgregar').onclick = function() {
        r.dni = document.getElementById('dni').value;
        r.nombreCompleto = document.getElementById('nombreCompleto').value;
        r.id_turno = parseInt(document.getElementById('id_turno').value);
        r.id_especialidad = document.getElementById('id_especialidad').value;
        r.id_obraSocial = document.getElementById('id_obraSocial').value;
        r.valor = document.getElementById('valor').value;

        guardarReservas(reservas);
        // cerrar modal si existe
        const modalEl = document.getElementById('reservaModal');
        if (bootstrap.Modal.getInstance(modalEl)) bootstrap.Modal.getInstance(modalEl).hide();

        loadTableReservas();
        alert('Reserva actualizada exitosamente');

        document.getElementById('btnAgregar').textContent = 'Agregar Reserva';
        document.getElementById('btnAgregar').onclick = agregarReserva;
        document.getElementById('formReserva').reset();
    };

    new bootstrap.Modal(document.getElementById('reservaModal')).show();
}

// Agregar reserva
function agregarReserva() {
    const form = document.getElementById('formReserva');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    reservas = cargarReservas();
    const newId = reservas.length > 0 ? Math.max(...reservas.map(r => r.id)) + 1 : 1;

    const nueva = {
        id: newId,
        dni: document.getElementById('dni').value,
        nombreCompleto: document.getElementById('nombreCompleto').value,
        id_turno: parseInt(document.getElementById('id_turno').value),
        id_especialidad: document.getElementById('id_especialidad').value || '', // completar luego
        id_obraSocial: document.getElementById('id_obraSocial').value || '', // completar luego
        valor: document.getElementById('valor').value || '' // completar luego (calcular según médico y obra social)
    };

    reservas.push(nueva);
    guardarReservas(reservas);

    // cerrar modal si esta abierto
    const modalEl = document.getElementById('reservaModal');
    if (bootstrap.Modal.getInstance(modalEl)) bootstrap.Modal.getInstance(modalEl).hide();

    loadTableReservas();
    document.getElementById('formReserva').reset();
    alert('Reserva creada exitosamente');
}

// Eliminar reserva
function eliminarReserva(id) {
    reservas = cargarReservas();
    const r = reservas.find(x => x.id === id);
    if (!r) return;

    if (confirm(`¿Desea eliminar la reserva ID ${r.id} para ${r.nombreCompleto}?`)) {
        reservas = reservas.filter(x => x.id !== id);
        guardarReservas(reservas);
        loadTableReservas();
        alert('Reserva eliminada exitosamente');
    }
}
