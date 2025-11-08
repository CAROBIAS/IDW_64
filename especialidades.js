let especialidades = [];
let table;
let showInactive = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    initDataTable();
    document.body.style.display = 'block';
});

// Cargar datos desde DataManager
function cargarDatos() {
    especialidades = DataManager.getEspecialidades();
    
    // Agregar campo activo si no existe
    especialidades = especialidades.map(e => ({
        ...e,
        activo: e.activo !== undefined ? e.activo : true
    }));
    
    // Guardar actualización
    DataManager.saveEspecialidades(especialidades);
}

// Guardar datos en DataManager
function guardarDatos() {
    DataManager.saveEspecialidades(especialidades);
}

// Obtener especialidades filtradas
function getFilteredEspecialidades() {
    return especialidades.filter(e => showInactive || e.activo);
}

// Toggle mostrar inactivos
function toggleInactive() {
    showInactive = document.getElementById('showInactiveToggle').checked;
    actualizarTabla();
}

// Inicializar DataTable
function initDataTable() {
    table = $('#especialidadesTable').DataTable({
        data: getFilteredEspecialidades(),
        columns: [
            { data: 'id' },
            { data: 'nombre' },
            {
                data: 'activo',
                render: function(data) {
                    return data 
                        ? '<span class="badge bg-success">Activa</span>'
                        : '<span class="badge bg-secondary">Inactiva</span>';
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info" onclick="viewEspecialidad(${row.id})" title="Ver">
                            <i class="bx bx-show"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="editEspecialidad(${row.id})" title="Editar">
                            <i class="bx bx-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEspecialidad(${row.id})" title="Eliminar">
                            <i class="bx bx-trash"></i>
                        </button>
                    `;
                }
            }
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        responsive: true,
        order: [[0, 'asc']]
    });
}

// Actualizar tabla
function actualizarTabla() {
    cargarDatos();
    table.clear();
    table.rows.add(getFilteredEspecialidades());
    table.draw();
}

// Abrir modal de creación
function openCreateModal() {
    document.getElementById('modalTitle').textContent = 'Nueva Especialidad';
    document.getElementById('especialidadForm').reset();
    document.getElementById('especialidadId').value = '';
    document.getElementById('activo').checked = true;
}

// Ver especialidad
function viewEspecialidad(id) {
    const especialidad = especialidades.find(e => e.id === id);
    if (!especialidad) return;
    
    const content = `
        <div class="mb-3">
            <p><strong>ID:</strong> ${especialidad.id}</p>
            <p><strong>Nombre:</strong> ${especialidad.nombre}</p>
            <p><strong>Estado:</strong> ${especialidad.activo ? '<span class="badge bg-success">Activa</span>' : '<span class="badge bg-secondary">Inactiva</span>'}</p>
        </div>
    `;
    
    document.getElementById('viewModalBody').innerHTML = content;
    new bootstrap.Modal(document.getElementById('viewModal')).show();
}

// Editar especialidad
function editEspecialidad(id) {
    const especialidad = especialidades.find(e => e.id === id);
    if (!especialidad) return;
    
    document.getElementById('modalTitle').textContent = 'Editar Especialidad';
    document.getElementById('especialidadId').value = especialidad.id;
    document.getElementById('nombre').value = especialidad.nombre;
    document.getElementById('activo').checked = especialidad.activo !== undefined ? especialidad.activo : true;
    
    new bootstrap.Modal(document.getElementById('especialidadModal')).show();
}

// Guardar especialidad
function guardarEspecialidad() {
    const form = document.getElementById('especialidadForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const id = document.getElementById('especialidadId').value;
    const estadoAnterior = id ? especialidades.find(e => e.id === parseInt(id))?.activo : true;
    const especialidadData = {
        nombre: document.getElementById('nombre').value,
        activo: document.getElementById('activo').checked
    };
    
    if (id) {
        // Editar
        const index = especialidades.findIndex(e => e.id === parseInt(id));
        if (index !== -1) {
            especialidades[index] = { ...especialidades[index], ...especialidadData };
            
            // Si se desactivó la especialidad, actualizar médicos
            if (estadoAnterior && !especialidadData.activo) {
                DataManager.deleteEspecialidad(parseInt(id));
            }
        }
    } else {
        // Crear
        const newId = especialidades.length > 0 ? Math.max(...especialidades.map(e => e.id)) + 1 : 1;
        especialidades.push({ id: newId, ...especialidadData });
    }
    
    // Guardar en localStorage
    guardarDatos();
    
    // Actualizar tabla
    actualizarTabla();
    
    // Cerrar modal
    bootstrap.Modal.getInstance(document.getElementById('especialidadModal')).hide();
    
    alert('Especialidad guardada correctamente');
}

// Eliminar especialidad (baja lógica)
function deleteEspecialidad(id) {
    const especialidad = especialidades.find(e => e.id === id);
    if (!especialidad) return;

    // Verificar si hay médicos usando esta especialidad
    const medicos = DataManager.getMedicos();
    const medicosConEspecialidad = medicos.filter(m => 
        m.especialidades && m.especialidades.includes(id)
    );
    
    if (medicosConEspecialidad.length > 0) {
        const mensaje = `Esta especialidad está siendo utilizada por ${medicosConEspecialidad.length} médico(s).\n\n` +
                       `Al desactivarla, se removerá de estos médicos y si quedan sin especialidades serán dados de baja.\n\n¿Desea continuar?`;
        if (!confirm(mensaje)) return;
    } else {
        if (!confirm(`¿Está seguro de desactivar "${especialidad.nombre}"?`)) return;
    }
    
    // Dar de baja (baja lógica)
    const index = especialidades.findIndex(e => e.id === id);
    if (index !== -1) {
        especialidades[index].activo = false;
        
        // Guardar especialidades
        guardarDatos();
        
        // Usar el método de DataManager que actualiza automáticamente los médicos
        DataManager.deleteEspecialidad(id);
        
        // Limpiar médicos para refrescar cambios
        DataManager.limpiarMedicosInactivos();
        
        // Actualizar tabla
        actualizarTabla();
        
        alert('Especialidad desactivada correctamente');
    }
}