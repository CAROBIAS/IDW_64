document.addEventListener("DOMContentLoaded", () => {
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");

  if (!tipoUsuario || tipoUsuario !== "admin") {
    alert("Acceso denegado. Solo administradores pueden entrar.");
    window.location.href = "index.html";
  } else {
    document.body.style.display = "block";
  }
});



// Inicializar turnos desde localStorage o por defecto
function inicializarTurnos() {
    const turnosGuardados = localStorage.getItem('turnos');

    if (turnosGuardados) {
        // si ya ahy turnos guardados, los carga
        return JSON.parse(turnosGuardados);
    } else {
        // si no, crea datos iniciales         
        const turnosIniciales = [
            { id: 1, id_medico: 1, fecha: "2025-11-10", hora: "09:00", disponible: true },
            { id: 2, id_medico: 2, fecha: "2025-11-10", hora: "10:00", disponible: true },
            { id: 3, id_medico: 3, fecha: "2025-11-11", hora: "11:30", disponible: false }
        ];

        // guardar los datos iniciales en localStorage
        guardarTurnos(turnosIniciales);
        return turnosIniciales;
    }
}

// Guardar turnos en localStorage
function guardarTurnos(turnosArray) {
    localStorage.setItem('turnos', JSON.stringify(turnosArray));
}

// Cargar turnos desde localStorage
function cargarTurnos() {
    const turnosGuardados = localStorage.getItem('turnos');
    return turnosGuardados ? JSON.parse(turnosGuardados) : [];
}

let turnos = inicializarTurnos();
let tableTurnos;
let showInactive = false;

// Inicializar DataTable
$(document).ready(function() {
    loadTableTurnos();
});

function loadTableTurnos() {
    if (tableTurnos) {
        tableTurnos.destroy();
    }
    // Recargar turnos desde localStorage antes de mostrar
    turnos = cargarTurnos();
        
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];

    // Preparar datos para DataTable (mostrando nombre+apellido en lugar de id_medico)
    const turnos_medicos = turnos.map(turno => {
        const medico = medicos.find(m => m.id === parseInt(turno.id_medico));
        const nuevoTurno = { ...turno };
        if (medico) {
            nuevoTurno.id_medico = `${medico.nombre} ${medico.apellido}`;
        } else {
            // Si no lo encontró, deja un texto por defecto
            nuevoTurno.id_medico = "Médico no encontrado";
        }
        return nuevoTurno;
        });
    
    const data_turnos = showInactive ? turnos_medicos : turnos_medicos.filter(t => t.disponible);

    tableTurnos = $('#turnosTable').DataTable({
        data: data_turnos,
        columns: [            
            { data: 'id_medico' },
            { data: 'fecha' },
            { data: 'hora' },
            { 
                data: 'disponible',
                render: function(data) {
                    return data ? '<span class="status-badge status-active">Disponible</span>' 
                    : '<span class="status-badge status-inactive">No disponible</span>';
                }
            },
            {
                data: null,
                orderable: false,
                className: 'table-actions',
                render: function(data) {
                    return `
                        <button class="btn btn-sm btn-info btn-action" onclick="verTurno(${data.id})" title="Ver">
                            <i class="bx bx-show"></i>
                        </button>
                        <button class="btn btn-sm btn-warning btn-action" onclick="editarTurno(${data.id})" title="Editar">
                            <i class="bx bx-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-action" onclick="eliminarTurno(${data.id})" title="Eliminar">
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

function toggleInactive() {
    showInactive = document.getElementById('showInactiveToggle').checked;
    loadTableTurnos();
}

// Abrir modal para crear
function openCreateTurnoModal() {
    document.getElementById('modalTitle').textContent = 'Agregar Turno';
    document.getElementById('turnoForm').reset();
    document.getElementById('id_medico').value = '';
    document.getElementById('disponible').checked = true;
}

// Ver turno en modal 
function verTurno(id) {
    turnos = cargarTurnos();
    const turno = turnos.find(t => t.id === id);
    if (!turno) return;

    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    const medico = medicos.find(m => Number(m.id) === Number(turno.id_medico));

    const content = `
        <div class="row">
            <div class="col-12">
                <p><strong>ID:</strong> ${turno.id}</p>
                <p><strong>Médico:</strong> ${medico ? medico.nombre + ' ' + medico.apellido : 'Desconocido'}</p>
                <p><strong>Fecha:</strong> ${turno.fecha}</p>
                <p><strong>Hora:</strong> ${turno.hora}</p>
                <p><strong>Disponible:</strong> ${turno.disponible ? 'Sí' : 'No'}</p>
            </div>
        </div>
    `;

    document.getElementById('viewModalBody').innerHTML = content;
    new bootstrap.Modal(document.getElementById('viewModal')).show();
}

// Editar turno (carga valores en el formulario y cambia comportamiento del botón)
function editarTurno(id) {
    turnos = cargarTurnos();
    const turno = turnos.find(t => t.id === id);
    if (!turno) return;
   
    document.getElementById('modalTitle').textContent = 'Editar Turno';
    document.getElementById('turnoId').value = turno.id;
    document.getElementById('id_medico').value = turno.id_medico;
    document.getElementById('fecha').value = turno.fecha;
    document.getElementById('hora').value = turno.hora;
    document.getElementById('disponible').checked = turno.disponible;
    
    

    // abrir modal
    new bootstrap.Modal(document.getElementById('turnoModal')).show();
}

function guardarTurno(){
    const form = document.getElementById('turnoForm');
    if (!form.checkValidity()){
        form.reportValidity();
        return;
    }

    turnos = cargarTurnos();
    
    const id = document.getElementById('turnoId').value;
    const turnoData = {
        id_medico: document.getElementById('id_medico').value,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        disponible: document.getElementById('disponible').checked
    };

    if (id) {
        const index = turnos.findIndex(t => t.id === parseInt(id));
        turnos[index] = { ...turnos[index], ...turnoData };
    }else{
        const newId = turnos.length > 0 ? Math.max(...turnos.map(t => t.id)) + 1: 1;
        turnos.push({id: newId, ...turnoData});
    }

    guardarTurnos(turnos);

    bootstrap.Modal.getInstance(document.getElementById('turnoModal')).hide();
    loadTableTurnos();

    alert(id ? 'Turno actualizado exitosamente' : 'Turno creado exitosamente');
}

// Eliminar turno
function eliminarTurno(id) {
    turnos = cargarTurnos();
    const turno = turnos.find(t => t.id === id);
    if (!turno) return;

    if (confirm(`¿Está seguro que desea eliminar el turno ID ${turno.id}?`)) {
        const index = turnos.findIndex(t => t.id === id);
        turnos[index].disponible = false;

        guardarTurnos(turnos);

        loadTableTurnos();

        alert('Turno eliminado exitosamente');
    }
}
