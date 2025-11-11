let turnos = [];
let table;
let showInactive = false;

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  cargarDatos();
  initDataTable();
  document.body.style.display = "block";
});

// Cargar datos desde DataManager
function cargarDatos() {
  turnos = DataManager.getTurnos();
}

// Guardar datos en DataManager
function guardarDatos() {
  DataManager.saveTurnos(turnos);
}

// Obtener especialidades desde DataManager (solo activas)
function getEspecialidades() {
  const todas = DataManager.getEspecialidades();
  return todas.filter((e) => e.activo === true || e.activo === undefined);
}

// Obtener nombre de especialidad
function getNombreEspecialidad(id) {
  if (!id) return "Sin especialidad";
  const especialidades = DataManager.getEspecialidades();
  const esp = especialidades.find((e) => e.id === Number(id));
  return esp ? esp.nombre : "N/A";
}

// Obtener nombres de especialidades (array)
function getNombresEspecialidades(ids) {
  if (!ids || ids.length === 0) return "Sin especialidad";
  return ids.map((id) => getNombreEspecialidad(id)).join(", ");
}

// Obtener medicos desde DataManager (solo activos)
function getMedicos() {
  const todas = DataManager.getMedicos();
  return todas.filter((m) => m.activo === true || m.activo === undefined);
}

// Obtener nombre del medico
function getNombreMedico(id) {
  if (!id) return "Desconosido";
  const medicos = DataManager.getMedicos();
  const med = medicos.find((m) => m.id === Number(id));
  return med ? `${med.nombre} ${med.apellido}` : "N/A";
}

// Obtener especialidad del medico
function getEspecialidadMedico(id) {
  if (!id) return "Sin especialidad";
  const medicos = DataManager.getMedicos();
  const med = medicos.find((m) => m.id === Number(id));
  return med ? med.especialidades[0] : "N/A";
}

// Obtener nombres de los medicos (array)
function getNombresMedicos(ids) {
  if (!ids || ids.length === 0) return "Desconosico";
  return ids.map((id) => getNombreMedico(id)).join(", ");
}

// Inicializar DataTable
function initDataTable() {
  table = $("#turnosTable").DataTable({
    data: getFilteredTurnos(),
    columns: [
      {
        data: "id_medico",
        render: function (data) {
          return getNombreMedico(data);
        },
      },
      {
        data: "id_medico",
        render: function (data) {
          return getNombreEspecialidad(getEspecialidadMedico(data));
        },
      },
      { data: "fecha" },
      { data: "hora" },

      {
        data: "disponible",
        render: function (data) {
          return data
            ? '<span class="badge bg-success">Disponible</span>'
            : '<span class="badge bg-secondary">No disponible</span>';
        },
      },
      {
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
                        <button class="btn btn-sm btn-info" onclick="verTurno(${row.id})" title="Ver">
                            <i class="bx bx-show"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="editarTurno(${row.id})" title="Editar">
                            <i class="bx bx-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarTurno(${row.id})" title="Eliminar">
                            <i class="bx bx-trash"></i>
                        </button>
                    `;
        },
      },
    ],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json",
    },
    responsive: true,
    pageLength: 10,
    order: [[0, "asc"]],
  });
}

// Obtener turnos filtrados
function getFilteredTurnos() {
  return turnos.filter((t) => showInactive || t.disponible);
}

// Toggle mostrar inactivos
function toggleInactive() {
  showInactive = document.getElementById("showInactiveToggle").checked;
  actualizarTabla();
}

// Actualizar tabla
function actualizarTabla() {
  cargarDatos();
  table.clear();
  table.rows.add(getFilteredTurnos());
  table.draw();
}

// Abrir modal para crear
function openCreateTurnoModal() {
  document.getElementById('modalTitle').textContent = 'Agregar Turno';
  document.getElementById('turnoForm').reset();
  document.getElementById('turnoId').value = '';
  document.getElementById('disponible').checked = true;

  // Cargar especialidades
  const especialidades = getEspecialidades();
  const selectEspecialidad = document.getElementById('especialidad');
  console.log(especialidades)

  selectEspecialidad.innerHTML = '<option value="">-- Seleccione una especialidad --</option>';

  for (let esp of especialidades) {
    const option = document.createElement('option');
    option.value = esp.id;
    option.textContent = esp.nombre;
    selectEspecialidad.appendChild(option);
  }

  // Dejar el combo de médicos vacío hasta que se seleccione una especialidad
  document.getElementById('id_medico').innerHTML = '<option value="">-- Primero seleccione una especialidad --</option>';
}

// Ver turno en modal 
function verTurno(id) {
  cargarDatos()
  const turno = turnos.find(t => Number(t.id) === Number(id));
  if (!turno) return;

  const medicos = getMedicos();
  const medico = medicos.find(m => Number(m.id) === Number(turno.id_medico));

  const especialidades = getEspecialidades()
  const especialidad = especialidades.find(e => Number(e.id) === Number(medico.especialidades[0]))

  const content = `
        <div class="row">
            <div class="col-12">
                <p><strong>ID:</strong> ${turno.id}</p>
                <p><strong>Médico:</strong> ${medico ? medico.nombre + ' ' + medico.apellido : 'Desconocido'}</p>
                <p><strong>Espacialidad:</strong> ${especialidad ? especialidad.nombre : 'Desconocido'}</p>
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
  cargarDatos();
  const turno = turnos.find(t => t.id === id);
  if (!turno) return;

  document.getElementById('modalTitle').textContent = 'Editar Turno';
  document.getElementById('turnoId').value = turno.id;
  document.getElementById('fecha').value = turno.fecha;
  document.getElementById('hora').value = turno.hora;
  document.getElementById('disponible').checked = turno.disponible;

  // Cargar especialidades
  const especialidades = getEspecialidades();
  const selectEspecialidad = document.getElementById('especialidad');

  selectEspecialidad.innerHTML = '<option value="">-- Seleccione una especialidad --</option>';

  for (let esp of especialidades) {
    const option = document.createElement('option');
    option.value = esp.id;
    option.textContent = esp.nombre;
    selectEspecialidad.appendChild(option);
  }

  // Encontrar el médico actual del turno
  const medicos = getMedicos();
  const medicoActual = medicos.find(m => m.id === Number(turno.id_medico));

  if (medicoActual) {
    // Pre-seleccionar la especialidad del médico actual
    const especialidadId = medicoActual.especialidades[0];
    document.getElementById('especialidad').value = especialidadId;

    // Cargar médicos de esa especialidad
    const selectMedico = document.getElementById('id_medico');
    selectMedico.innerHTML = '<option value="">-- Seleccione un médico --</option>';

    for (let medico of medicos) {
      if (medico.especialidades && medico.especialidades.includes(Number(especialidadId))) {
        const option = document.createElement('option');
        option.value = medico.id;
        option.textContent = `${medico.nombre} ${medico.apellido}`;
        selectMedico.appendChild(option);
      }
    }

    // Pre-seleccionar el médico actual
    selectMedico.value = turno.id_medico;
  }

  // Abrir modal
  new bootstrap.Modal(document.getElementById('turnoModal')).show();
}

// Event listener para cuando cambie la especialidad
document.getElementById('especialidad').addEventListener('change', function () {
  const especialidadId = this.value;
  const selectMedico = document.getElementById('id_medico');

  if (especialidadId) {
    const medicos = getMedicos();
    selectMedico.innerHTML = '<option value="">-- Seleccione un médico --</option>';

    for (let medico of medicos) {
      if (medico.especialidades && medico.especialidades.includes(Number(especialidadId))) {
        const option = document.createElement('option');
        option.value = medico.id;
        option.textContent = `${medico.nombre} ${medico.apellido}`;
        selectMedico.appendChild(option);
      }
    }
  } else {
    selectMedico.innerHTML = '<option value="">-- Primero seleccione una especialidad --</option>';
  }
});

function guardarTurno() {
  const form = document.getElementById('turnoForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  cargarDatos();

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
  } else {
    const newId = turnos.length > 0 ? Math.max(...turnos.map(t => t.id)) + 1 : 1;
    turnos.push({ id: newId, ...turnoData });
  }

  guardarDatos();

  bootstrap.Modal.getInstance(document.getElementById('turnoModal')).hide();
  actualizarTabla();

  alert(id ? 'Turno actualizado exitosamente' : 'Turno creado exitosamente');
}

// Eliminar turno
function eliminarTurno(id) {
  cargarDatos();
  const turno = turnos.find(t => t.id === id);
  if (!turno) return;

  if (confirm(`¿Está seguro que desea eliminar el turno ID ${turno.id}?`)) {
    const index = turnos.findIndex(t => t.id === id);
    turnos[index].disponible = false;

    guardarDatos();

    actualizarTabla();

    alert('Turno eliminado exitosamente');
  }
}
