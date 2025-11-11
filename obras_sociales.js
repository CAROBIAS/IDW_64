let obrasSociales = [];
let table;
let showInactive = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    cargarDatos();
    initDataTable();
    document.body.style.display = 'block';
});

// Cargar datos desde DataManager
function cargarDatos() {
    obrasSociales = DataManager.getObrasSociales();
}

// Guardar datos en DataManager
function guardarDatos() {
    DataManager.saveObrasSociales(obrasSociales);
}

// Obtener obras sociales filtradas
function getFilteredObrasSociales() {
    return obrasSociales.filter(os => showInactive || os.activo);
}

// Toggle mostrar inactivos
function toggleInactive() {
    showInactive = document.getElementById('showInactiveToggle').checked;
    actualizarTabla();
}

// Inicializar DataTable
function initDataTable() {
    table = $('#obrasSocialesTable').DataTable({
        data: getFilteredObrasSociales(),
        columns: [
            { data: 'nombre' },
            {
                data: 'porcentaje',
                render: function (data) {
                    return data ? parseFloat(data).toFixed(2) + '%' : '0%';
                }
            },
            {
                data: 'activo',
                render: function (data) {
                    return data
                        ? '<span class="badge bg-success">Activa</span>'
                        : '<span class="badge bg-secondary">Inactiva</span>';
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info" onclick="viewObraSocial(${row.id})" title="Ver">
                            <i class="bx bx-show"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="editObraSocial(${row.id})" title="Editar">
                            <i class="bx bx-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteObraSocial(${row.id})" title="Eliminar">
                            <i class="bx bx-trash"></i>
                        </button>
                    `;
                }
            }
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        autoWidth: false,
        responsive: true,
        order: [[0, 'asc']]
    });
}

// Actualizar tabla
function actualizarTabla() {
    cargarDatos();
    table.clear();
    table.rows.add(getFilteredObrasSociales());
    table.draw();
}

// Toggle entre URL y archivo
function toggleImageInput() {
    const tipoUrl = document.getElementById('tipoUrl').checked;
    document.getElementById('urlInput').style.display = tipoUrl ? 'block' : 'none';
    document.getElementById('archivoInput').style.display = tipoUrl ? 'none' : 'block';
    document.getElementById('imagePreview').style.display = 'none';
}

// Vista previa de imagen
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');

    if (input.files && input.files[0]) {
        const file = input.files[0];

        // Validar tamaño (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('El archivo es muy grande. Máximo 2MB permitido.');
            input.value = '';
            preview.style.display = 'none';
            return;
        }

        // Validar tipo
        if (!file.type.match('image.*')) {
            alert('Por favor selecciona una imagen válida.');
            input.value = '';
            preview.style.display = 'none';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
}

// Convertir URL a Base64
async function urlToBase64(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error al convertir URL a Base64:', error);
        return null;
    }
}

// Abrir modal de creación
function openCreateModal() {
    document.getElementById('modalTitle').textContent = 'Nueva Obra Social';
    document.getElementById('obraSocialForm').reset();
    document.getElementById('obraSocialId').value = '';
    document.getElementById('activo').checked = true;
    document.getElementById('tipoUrl').checked = true;
    toggleImageInput();
}

// Ver obra social
function viewObraSocial(id) {
    const obraSocial = obrasSociales.find(os => os.id === id);
    if (!obraSocial) return;

    const imagenSrc = obraSocial.imagen || `https://ui-avatars.com/api/?name=${encodeURIComponent(obraSocial.nombre)}&background=random&size=200`;

    const content = `
        <div class="row">
            <div class="col-md-4 text-center mb-3">
                <img src="${imagenSrc}" alt="${obraSocial.nombre}" class="img-fluid rounded" style="max-width: 200px; border: 1px solid #ddd;">
            </div>
            <div class="col-md-8">
                <p><strong>ID:</strong> ${obraSocial.id}</p>
                <p><strong>Nombre:</strong> ${obraSocial.nombre}</p>
                <p><strong>Porcentaje de Descuento:</strong> ${parseFloat(obraSocial.porcentaje || 0).toFixed(2)}%</p>
                <p><strong>Estado:</strong> ${obraSocial.activo ? '<span class="badge bg-success">Activa</span>' : '<span class="badge bg-secondary">Inactiva</span>'}</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <p><strong>Descripción:</strong></p>
                <p>${obraSocial.descripcion}</p>
            </div>
        </div>
    `;

    document.getElementById('viewModalBody').innerHTML = content;
    new bootstrap.Modal(document.getElementById('viewModal')).show();
}

// Editar obra social
function editObraSocial(id) {
    const obraSocial = obrasSociales.find(os => os.id === id);
    if (!obraSocial) return;

    document.getElementById('modalTitle').textContent = 'Editar Obra Social';
    document.getElementById('obraSocialId').value = obraSocial.id;
    document.getElementById('nombre').value = obraSocial.nombre;
    document.getElementById('descripcion').value = obraSocial.descripcion;
    document.getElementById('porcentaje').value = obraSocial.porcentaje || 0;
    document.getElementById('activo').checked = obraSocial.activo;

    // Cargar imagen si existe
    if (obraSocial.imagen) {
        document.getElementById('previewImg').src = obraSocial.imagen;
        document.getElementById('imagePreview').style.display = 'block';
    } else {
        document.getElementById('imagePreview').style.display = 'none';
    }

    // Reset tipo de imagen a URL
    document.getElementById('tipoUrl').checked = true;
    toggleImageInput();

    new bootstrap.Modal(document.getElementById('obraSocialModal')).show();
}

// Guardar obra social
async function guardarObraSocial() {
    const form = document.getElementById('obraSocialForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Procesar imagen
    let imagenBase64 = '';
    const tipoUrl = document.getElementById('tipoUrl').checked;

    if (tipoUrl) {
        const url = document.getElementById('imagenUrl').value;
        if (url) {
            imagenBase64 = await urlToBase64(url);
            if (!imagenBase64) {
                alert('No se pudo cargar la imagen desde la URL. Verifica que la URL sea correcta y accesible.');
                return;
            }
        }
    } else {
        const archivo = document.getElementById('imagenArchivo').files[0];
        if (archivo) {
            imagenBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(archivo);
            });
        }
    }

    const id = document.getElementById('obraSocialId').value;
    const estadoAnterior = id ? obrasSociales.find(os => os.id === parseInt(id))?.activo : true;
    const obraSocialData = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        porcentaje: parseFloat(document.getElementById('porcentaje').value) || 0,
        imagen: imagenBase64,
        activo: document.getElementById('activo').checked
    };

    if (id) {
        // Editar
        const index = obrasSociales.findIndex(os => os.id === parseInt(id));
        if (index !== -1) {
            obrasSociales[index] = { ...obrasSociales[index], ...obraSocialData };

            // Si se desactivó la obra social, actualizar médicos
            if (estadoAnterior && !obraSocialData.activo) {
                DataManager.deleteObraSocial(parseInt(id));
            }
        }
    } else {
        // Crear
        const newId = obrasSociales.length > 0 ? Math.max(...obrasSociales.map(os => os.id)) + 1 : 1;
        obrasSociales.push({ id: newId, ...obraSocialData });
    }

    // Guardar en localStorage
    guardarDatos();

    // Actualizar tabla
    actualizarTabla();

    // Cerrar modal
    bootstrap.Modal.getInstance(document.getElementById('obraSocialModal')).hide();

    alert('Obra social guardada correctamente');
}

// Eliminar obra social (baja lógica)
function deleteObraSocial(id) {
    const obraSocial = obrasSociales.find(os => os.id === id);
    if (!obraSocial) return;

    // Verificar si hay médicos usando esta obra social
    const medicos = DataManager.getMedicos();
    const medicosConObraSocial = medicos.filter(m =>
        m.obrasSociales && m.obrasSociales.includes(id)
    );

    if (medicosConObraSocial.length > 0) {
        const mensaje = `Esta obra social está siendo utilizada por ${medicosConObraSocial.length} médico(s).\n\n` +
            `¿Desea desactivarla de todos modos?`;
        if (!confirm(mensaje)) return;
    } else {
        if (!confirm(`¿Está seguro de desactivar "${obraSocial.nombre}"?`)) return;
    }

    // Dar de baja (baja lógica)
    const index = obrasSociales.findIndex(os => os.id === id);
    if (index !== -1) {
        obrasSociales[index].activo = false;
        guardarDatos();
        actualizarTabla();
        alert('Obra social desactivada correctamente');
    }
}