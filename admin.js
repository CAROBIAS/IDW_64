document.addEventListener("DOMContentLoaded", () => {
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");

  if (!tipoUsuario || tipoUsuario !== "admin") {
    alert("Acceso denegado. Solo administradores pueden entrar.");
    window.location.href = "index.html";
  } else {
    document.body.style.display = "block";
  }
});

// Inicializar medicos desde localStorage o por defecto
function inicializarMedicos() {
    const medicosGuardados = localStorage.getItem('medicos');
    
    if (medicosGuardados) {
        // Si ya hay medicos guardados, cargarlos
        return JSON.parse(medicosGuardados);
    } else {
        // Si no crear datos iniciales
        const medicosIniciales = [
            {
                id: 1,
                nombre: "Juan",
                apellido: "Pérez",
                especialidad: "Cardiología",
                matricula: "MD1001",
                telefono: "+54 11 4567-8901",
                email: "jperez@clinica.com",
                imagen: "https://ui-avatars.com/api/?name=Juan+Perez&background=random",
                biografia: "Especialista en cardiología con 15 años de experiencia.",
                activo: true
            },
            {
                id: 2,
                nombre: "María",
                apellido: "González",
                especialidad: "Pediatría",
                matricula: "MD1002",
                telefono: "+54 11 4567-8902",
                email: "mgonzalez@clinica.com",
                imagen: "https://ui-avatars.com/api/?name=Maria+Gonzalez&background=random",
                biografia: "Pediatra especializada en neonatología.",
                activo: true
            },
            {
                id: 3,
                nombre: "Carlos",
                apellido: "Rodríguez",
                especialidad: "Neurología",
                matricula: "MD1003",
                telefono: "+54 11 4567-8903",
                email: "crodriguez@clinica.com",
                imagen: "https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=random",
                biografia: "Neurólogo con especialización en epilepsia.",
                activo: true
            },
            {
                id: 4,
                nombre: "Ana",
                apellido: "Martínez",
                especialidad: "Ginecología",
                matricula: "MD1004",
                telefono: "+54 11 4567-8904",
                email: "amartinez@clinica.com",
                imagen: "https://ui-avatars.com/api/?name=Ana+Martinez&background=random",
                biografia: "Ginecóloga especializada en obstetricia.",
                activo: false
            },
            {
                id: 5,
                nombre: "Luis",
                apellido: "Fernández",
                especialidad: "Traumatología",
                matricula: "MD1005",
                telefono: "+54 11 4567-8905",
                email: "lfernandez@clinica.com",
                imagen: "https://ui-avatars.com/api/?name=Luis+Fernandez&background=random",
                biografia: "Traumatólogo especializado en cirugía deportiva.",
                activo: true
            }
        ];
        
        // Guardar los datos iniciales en localStorage
        guardarMedicos(medicosIniciales);
        return medicosIniciales;
    }
}

// Guardar medicos en localStorage
function guardarMedicos(medicosArray) {
    localStorage.setItem('medicos', JSON.stringify(medicosArray));
}

// Cargar medicos desde localStorage
function cargarMedicos() {
    const medicosGuardados = localStorage.getItem('medicos');
    return medicosGuardados ? JSON.parse(medicosGuardados) : [];
}

let medicos = inicializarMedicos();
let table;
let showInactive = false;

// Datatable

// Inicializar DataTable
$(document).ready(function() {
    loadTable();
});

function loadTable() {
    if (table) {
        table.destroy();
    }

    // Recargar medicos desde localStorage antes de mostrar
    medicos = cargarMedicos();
    const data = showInactive ? medicos : medicos.filter(m => m.activo);

    table = $('#medicosTable').DataTable({
        data: data,
        columns: [
            { data: 'nombre' },
            { data: 'apellido' },
            { data: 'especialidad' },
            { data: 'matricula' },
            { data: 'telefono' },
            { data: 'email' },
            { 
                data: 'activo',
                render: function(data) {
                    return data 
                        ? '<span class="status-badge status-active">Activo</span>'
                        : '<span class="status-badge status-inactive">Inactivo</span>';
                }
            },
            {
                data: null,
                orderable: false,
                className: 'table-actions',
                render: function(data) {
                    return `
                        <button class="btn btn-sm btn-info btn-action" onclick="verMedico(${data.id})" title="Ver">
                            <i class="bx bx-show"></i>
                        </button>
                        <button class="btn btn-sm btn-warning btn-action" onclick="editarMedico(${data.id})" title="Editar">
                            <i class="bx bx-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-action" onclick="eliminarMedico(${data.id})" title="Eliminar">
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
        pageLength: 10
    });
}

// Interfaz

function toggleInactive() {
    showInactive = document.getElementById('showInactiveToggle').checked;
    loadTable();
}

function openCreateModal() {
    document.getElementById('modalTitle').textContent = 'Nuevo Médico';
    document.getElementById('medicoForm').reset();
    document.getElementById('medicoId').value = '';
    document.getElementById('activo').checked = true;
}

function verMedico(id) {
    // Recargar desde localStorage para tener datos actualizados
    medicos = cargarMedicos();
    const medico = medicos.find(m => m.id === id);
    if (!medico) return;

    const content = `
        <div class="row">
            <div class="col-md-4 text-center mb-3">
                <img src="${medico.imagen}" alt="${medico.nombre}" class="img-fluid rounded-circle" style="max-width: 200px;">
            </div>
            <div class="col-md-8">
                <h4>${medico.nombre} ${medico.apellido}</h4>
                <p><strong>Especialidad:</strong> ${medico.especialidad}</p>
                <p><strong>Matrícula:</strong> ${medico.matricula}</p>
                <p><strong>Teléfono:</strong> ${medico.telefono}</p>
                <p><strong>Email:</strong> ${medico.email}</p>
                <p><strong>Estado:</strong> ${medico.activo ? '<span class="status-badge status-active">Activo</span>' : '<span class="status-badge status-inactive">Inactivo</span>'}</p>
                <hr>
                <p><strong>Biografía:</strong></p>
                <p>${medico.biografia || 'No especificada'}</p>
            </div>
        </div>
    `;

    document.getElementById('viewModalBody').innerHTML = content;
    new bootstrap.Modal(document.getElementById('viewModal')).show();
}

function editarMedico(id) {
    // Recargar desde localStorage para tener datos actualizados
    medicos = cargarMedicos();
    const medico = medicos.find(m => m.id === id);
    if (!medico) return;

    document.getElementById('modalTitle').textContent = 'Editar Médico';
    document.getElementById('medicoId').value = medico.id;
    document.getElementById('nombre').value = medico.nombre;
    document.getElementById('apellido').value = medico.apellido;
    document.getElementById('especialidad').value = medico.especialidad;
    document.getElementById('matricula').value = medico.matricula;
    document.getElementById('telefono').value = medico.telefono;
    document.getElementById('email').value = medico.email;
    document.getElementById('imagen').value = medico.imagen;
    document.getElementById('biografia').value = medico.biografia || '';
    document.getElementById('activo').checked = medico.activo;

    new bootstrap.Modal(document.getElementById('medicoModal')).show();
}

function guardarMedico() {
    const form = document.getElementById('medicoForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Recargar desde localStorage para tener datos actualizados
    medicos = cargarMedicos();

    const id = document.getElementById('medicoId').value;
    const medicoData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        especialidad: document.getElementById('especialidad').value,
        matricula: document.getElementById('matricula').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        imagen: document.getElementById('imagen').value || `https://ui-avatars.com/api/?name=${document.getElementById('nombre').value}+${document.getElementById('apellido').value}&background=random`,
        biografia: document.getElementById('biografia').value,
        activo: document.getElementById('activo').checked
    };

    if (id) {
        // Editar existente
        const index = medicos.findIndex(m => m.id === parseInt(id));
        medicos[index] = { ...medicos[index], ...medicoData };
    } else {
        // Crear nuevo, generar id unico
        const newId = medicos.length > 0 ? Math.max(...medicos.map(m => m.id)) + 1 : 1;
        medicos.push({ id: newId, ...medicoData });
    }

    // Guardar en localStorage
    guardarMedicos(medicos);

    bootstrap.Modal.getInstance(document.getElementById('medicoModal')).hide();
    loadTable();
    
    alert(id ? 'Médico actualizado exitosamente' : 'Médico creado exitosamente');
}

function eliminarMedico(id) {
    // Recargar desde localStorage para tener datos actualizados
    medicos = cargarMedicos();
    const medico = medicos.find(m => m.id === id);
    if (!medico) return;

    if (confirm(`¿Está seguro de desactivar a ${medico.nombre} ${medico.apellido}?`)) {
        const index = medicos.findIndex(m => m.id === id);
        medicos[index].activo = false;
        
        // Guardar en localStorage
        guardarMedicos(medicos);
        
        loadTable();
        alert('Médico desactivado exitosamente');
    }
}
