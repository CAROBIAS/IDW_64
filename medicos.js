let medicos = [];
let table;
let showInactive = false;

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  // Limpiar médicos de especialidades y obras sociales inactivas
  DataManager.limpiarMedicosInactivos();

  cargarDatos();
  initDataTable();
  cargarObrasSociales();
  document.body.style.display = "block";
});

// Cargar datos desde DataManager
function cargarDatos() {
  medicos = DataManager.getMedicos();
}

// Guardar datos en DataManager
function guardarDatos() {
  DataManager.saveMedicos(medicos);
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
  const esp = especialidades.find((e) => e.id === id);
  return esp ? esp.nombre : "N/A";
}

// Obtener nombres de especialidades (array)
function getNombresEspecialidades(ids) {
  if (!ids || ids.length === 0) return "Sin especialidad";
  return ids.map((id) => getNombreEspecialidad(id)).join(", ");
}

// Obtener obras sociales desde DataManager (solo activas)
function getObrasSociales() {
  const todas = DataManager.getObrasSociales();
  return todas.filter((os) => os.activo === true || os.activo === undefined);
}

// Obtener nombre de obra social
function getNombreObraSocial(id) {
  const obrasSociales = DataManager.getObrasSociales();
  const os = obrasSociales.find((o) => o.id === id);
  return os ? os.nombre : "N/A";
}

// Obtener imagen de obra social
function getImagenObraSocial(id) {
  const obrasSociales = DataManager.getObrasSociales();
  const os = obrasSociales.find((o) => o.id === id);
  if (!os) return null;
  return (
    os.imagen ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      os.nombre
    )}&background=random&size=80`
  );
}

// Inicializar DataTable
function initDataTable() {
  table = $("#medicosTable").DataTable({
    data: getFilteredMedicos(),
    columns: [
      { data: "apellido" },
      { data: "nombre" },
      {
        data: "especialidades",
        render: function (data) {
          return getNombresEspecialidades(data);
        },
      },
      {
        data: "valorConsulta",
        render: function (data) {
          return "$" + parseFloat(data).toFixed(2);
        },
      },
      {
        data: "activo",
        render: function (data) {
          return data
            ? '<span class="badge bg-success">Activo</span>'
            : '<span class="badge bg-secondary">Inactivo</span>';
        },
      },
      {
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
                        <button class="btn btn-sm btn-info" onclick="viewMedico(${row.id})" title="Ver">
                            <i class="bx bx-show"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="editMedico(${row.id})" title="Editar">
                            <i class="bx bx-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteMedico(${row.id})" title="Eliminar">
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

// Obtener médicos filtrados
function getFilteredMedicos() {
  return medicos.filter((m) => showInactive || m.activo);
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
  table.rows.add(getFilteredMedicos());
  table.draw();
}

// Cargar opciones de obras sociales con imágenes
function cargarObrasSociales() {
  const container = document.getElementById("obrasSocialesCheckboxes");
  container.innerHTML = "";
  const obrasSociales = getObrasSociales();

  if (obrasSociales.length === 0) {
    container.innerHTML =
      '<p class="text-muted">No hay obras sociales disponibles</p>';
    return;
  }

  obrasSociales.forEach((os) => {
    const imagenSrc =
      os.imagen ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        os.nombre
      )}&background=random&size=80`;

    const div = document.createElement("div");
    div.className = "obra-social-item";
    div.onclick = function () {
      const checkbox = this.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      this.classList.toggle("selected", checkbox.checked);
    };

    div.innerHTML = `
            <input class="form-check-input obra-social-check" type="checkbox" value="${os.id}" id="os_${os.id}">
            <img src="${imagenSrc}" alt="${os.nombre}" class="obra-social-img">
            <span class="obra-social-name">${os.nombre}</span>
        `;
    container.appendChild(div);
  });
}



function cargarEspecialidades() {
  const select = document.getElementById("especialidadesSelect");
  select.innerHTML = ""; // limpiar

  const especialidades = getEspecialidades();

  // Opción vacía por defecto
  const opcionVacia = document.createElement("option");
  opcionVacia.value = "";
  opcionVacia.textContent = "-- Seleccionar especialidad --";
  select.appendChild(opcionVacia);

  if (especialidades.length === 0) {
    // opcional: si no hay datos, deshabilitar el select
    select.disabled = true;
    return;
  }

  select.disabled = false;

  especialidades.forEach((esp) => {
    const option = document.createElement("option");
    option.value = esp.id;
    option.textContent = esp.nombre;
    select.appendChild(option);
  });
}

// Toggle entre URL y archivo
function toggleImageInput() {
  const tipoUrl = document.getElementById("tipoUrl").checked;
  document.getElementById("urlInput").style.display = tipoUrl
    ? "block"
    : "none";
  document.getElementById("archivoInput").style.display = tipoUrl
    ? "none"
    : "block";
  document.getElementById("imagePreview").style.display = "none";
}

// Vista previa de imagen
function previewImage(input) {
  const preview = document.getElementById("imagePreview");
  const previewImg = document.getElementById("previewImg");

  if (input.files && input.files[0]) {
    const file = input.files[0];

    if (file.size > 2 * 1024 * 1024) {
      alert("El archivo es muy grande. Máximo 2MB permitido.");
      input.value = "";
      preview.style.display = "none";
      return;
    }

    if (!file.type.match("image.*")) {
      alert("Por favor selecciona una imagen válida.");
      input.value = "";
      preview.style.display = "none";
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = "none";
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
    console.error("Error al convertir URL a Base64:", error);
    return null;
  }
}

// Abrir modal de creación
function openCreateModal() {
  document.getElementById("modalTitle").textContent = "Nuevo Médico";
  document.getElementById("medicoForm").reset();
  document.getElementById("medicoId").value = "";
  document.getElementById("activo").checked = true;
  document.getElementById("tipoUrl").checked = true;
  toggleImageInput();

  cargarEspecialidades();
  cargarObrasSociales();

  // Limpiar selecciones
  document
    .querySelectorAll(".especialidad-check")
    .forEach((cb) => (cb.checked = false));
  document
    .querySelectorAll(".obra-social-item")
    .forEach((item) => item.classList.remove("selected"));
  document
    .querySelectorAll(".obra-social-check")
    .forEach((cb) => (cb.checked = false));
}

// Ver médico
function viewMedico(id) {
  const medico = medicos.find((m) => m.id === id);
  if (!medico) return;

  // Filtrar y renderizar solo especialidades activas
  let especialidadesActivas = [];
  if (medico.especialidades && medico.especialidades.length > 0) {
    const todasEspecialidades = DataManager.getEspecialidades();
    especialidadesActivas = medico.especialidades.filter((espId) => {
      const esp = todasEspecialidades.find((e) => e.id === espId);
      return esp && (esp.activo === true || esp.activo === undefined);
    });
  }

  const especialidadesTexto =
    especialidadesActivas.length > 0
      ? getNombresEspecialidades(especialidadesActivas)
      : '<span class="text-muted">Sin especialidades activas</span>';

  // Renderizar obras sociales con imágenes (solo activas)
  let obrasSocialesHtml = '<div class="obras-sociales-view-grid">';
  if (medico.obrasSociales && medico.obrasSociales.length > 0) {
    const todasObrasSociales = DataManager.getObrasSociales();
    const obrasSocialesActivas = medico.obrasSociales.filter((osId) => {
      const os = todasObrasSociales.find((o) => o.id === osId);
      return os && (os.activo === true || os.activo === undefined);
    });

    if (obrasSocialesActivas.length > 0) {
      obrasSocialesActivas.forEach((osId) => {
        const imagenSrc = getImagenObraSocial(osId);
        const nombre = getNombreObraSocial(osId);
        if (imagenSrc) {
          obrasSocialesHtml += `
                        <div class="obra-social-view-item">
                            <img src="${imagenSrc}" alt="${nombre}" class="obra-social-view-img">
                            <span class="obra-social-name">${nombre}</span>
                        </div>
                    `;
        }
      });
    } else {
      obrasSocialesHtml +=
        '<p class="text-muted">Sin obras sociales activas</p>';
    }
  } else {
    obrasSocialesHtml += '<p class="text-muted">Sin obras sociales</p>';
  }
  obrasSocialesHtml += "</div>";

  const content = `
        <div class="row">
            <div class="col-md-3 text-center mb-3">
                ${
                  medico.fotografia
                    ? `
                    <img src="${medico.fotografia}" alt="Foto del médico" class="img-fluid rounded-circle" style="width: 150px; height: 150px; object-fit: cover; border: 2px solid #ddd;">
                `
                    : `
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(
                      medico.nombre + " " + medico.apellido
                    )}&background=random&size=150" alt="Avatar" class="img-fluid rounded-circle" style="width: 150px; height: 150px;">
                `
                }
            </div>
            <div class="col-md-9">
                <h4>${medico.nombre} ${medico.apellido}</h4>
                <p><strong>ID:</strong> ${medico.id}</p>
                <p><strong>Matrícula:</strong> ${medico.matricula}</p>
                <p><strong>Especialidades:</strong> ${especialidadesTexto}</p>
                <p><strong>Valor Consulta:</strong> $${parseFloat(
                  medico.valorConsulta
                ).toFixed(2)}</p>
                <p><strong>Teléfono:</strong> ${medico.telefono}</p>
                <p><strong>Email:</strong> ${medico.email}</p>
                <p><strong>Estado:</strong> ${
                  medico.activo
                    ? '<span class="badge bg-success">Activo</span>'
                    : '<span class="badge bg-secondary">Inactivo</span>'
                }</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <p><strong>Descripción:</strong></p>
                <p>${medico.descripcion || "Sin descripción"}</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <p><strong>Obras Sociales:</strong></p>
                ${obrasSocialesHtml}
            </div>
        </div>
    `;

  document.getElementById("viewModalBody").innerHTML = content;
  new bootstrap.Modal(document.getElementById("viewModal")).show();
}

// Editar médico
function editMedico(id) {
  const medico = medicos.find((m) => m.id === id);
  if (!medico) return;

  document.getElementById("modalTitle").textContent = "Editar Médico";
  document.getElementById("medicoId").value = medico.id;
  document.getElementById("matricula").value = medico.matricula;
  document.getElementById("apellido").value = medico.apellido;
  document.getElementById("nombre").value = medico.nombre;
  document.getElementById("descripcion").value = medico.descripcion;
  document.getElementById("valorConsulta").value = medico.valorConsulta;
  document.getElementById("telefono").value = medico.telefono;
  document.getElementById("email").value = medico.email;
  document.getElementById("activo").checked = medico.activo;

  cargarEspecialidades();
  cargarObrasSociales();

  //  Seleccionar especialidad en SELECT + checkboxes
  setTimeout(() => {
    const select = document.getElementById("especialidadesSelect");
    if (!select) return;

    let valor = "";

    if (
      Array.isArray(medico.especialidades) &&
      medico.especialidades.length > 0
    ) {
      valor = medico.especialidades[0];
      select.value = valor;
    } else {
      select.value = "";
    }

    //  También marcar el checkbox correspondiente (para guardar)
    document.querySelectorAll(".especialidad-check").forEach((cb) => {
      cb.checked = parseInt(cb.value) === valor;
    });
  }, 60);

  //  Cargar obras sociales seleccionadas
  setTimeout(() => {
    document.querySelectorAll(".obra-social-check").forEach((cb) => {
      const isSelected =
        medico.obrasSociales &&
        medico.obrasSociales.includes(parseInt(cb.value));

      cb.checked = isSelected;

      const item = cb.closest(".obra-social-item");
      if (item) item.classList.toggle("selected", isSelected);
    });
  }, 100);

  //  Cargar imagen (base64 o URL → convertida)
  (async () => {
    const preview = document.getElementById("previewImg");
    const cont = document.getElementById("imagePreview");

    if (!medico.fotografia) {
      cont.style.display = "none";
      return;
    }

    if (medico.fotografia.startsWith("data:image")) {
      preview.src = medico.fotografia;
      cont.style.display = "block";
      return;
    }

    try {
      const base64 = await urlToBase64(medico.fotografia);
      if (base64) {
        preview.src = base64;
        cont.style.display = "block";
      } else {
        cont.style.display = "none";
      }
    } catch {
      cont.style.display = "none";
    }
  })();

  document.getElementById("tipoUrl").checked = true;
  toggleImageInput();

  new bootstrap.Modal(document.getElementById("medicoModal")).show();
}

// Guardar médico
async function guardarMedico() {
  const form = document.getElementById("medicoForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const select = document.getElementById("especialidadesSelect");
  const especialidadesSeleccionadas = select.value
    ? [parseInt(select.value)]
    : [];

  const id = document.getElementById("medicoId").value;
  const activo = document.getElementById("activo").checked;

  if (activo && especialidadesSeleccionadas.length === 0) {
    if (
      confirm(
        'No ha seleccionado especialidades. ¿Desea asignar "Medicina General" por defecto?'
      )
    ) {
      especialidadesSeleccionadas.push(4);
    } else {
      alert(
        "Debe seleccionar al menos una especialidad para activar al médico."
      );
      return;
    }
  }

  const checkboxes = document.querySelectorAll(".obra-social-check:checked");
  const obrasSocialesSeleccionadas = Array.from(checkboxes).map((cb) =>
    parseInt(cb.value)
  );

  // Procesar imagen
  // Procesar imagen
  let fotografiaBase64 = "";
  const tipoUrl = document.getElementById("tipoUrl").checked;
  const idEdit = document.getElementById("medicoId").value;

  // Obtener base64 previa si estamos editando
  let fotografiaPrev = "";
  if (idEdit) {
    const medPrev = medicos.find((m) => m.id === parseInt(idEdit));
    fotografiaPrev = medPrev ? medPrev.fotografia : "";
  }

  // Si viene URL
  if (tipoUrl) {
    const url = document.getElementById("imagenUrl").value.trim();

    if (url) {
      fotografiaBase64 = await urlToBase64(url);
      if (!fotografiaBase64) {
        alert("No se pudo convertir la imagen de la URL.");
        return;
      }
    } else {
      // No se ingresó URL → mantener la anterior
      fotografiaBase64 = fotografiaPrev || "";
    }

    // Si viene archivo local
  } else {
    const archivo = document.getElementById("imagenArchivo").files[0];

    if (archivo) {
      fotografiaBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(archivo);
      });
    } else {
      // No eligió archivo → mantener base64 anterior
      fotografiaBase64 = fotografiaPrev || "";
    }
  }

  const estaraActivo = especialidadesSeleccionadas.length > 0 ? activo : false;

  const medicoData = {
    matricula: parseInt(document.getElementById("matricula").value),
    apellido: document.getElementById("apellido").value,
    nombre: document.getElementById("nombre").value,
    especialidades: especialidadesSeleccionadas,
    descripcion: document.getElementById("descripcion").value,
    valorConsulta: parseFloat(document.getElementById("valorConsulta").value),
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value,
    activo: estaraActivo,
    obrasSociales: obrasSocialesSeleccionadas,
    fotografia: fotografiaBase64,
  };

  if (id) {
    const index = medicos.findIndex((m) => m.id === parseInt(id));
    if (index !== -1) {
      medicos[index] = { ...medicos[index], ...medicoData };
    }
  } else {
    const newId =
      medicos.length > 0 ? Math.max(...medicos.map((m) => m.id)) + 1 : 1;
    medicos.push({ id: newId, ...medicoData });
  }

  guardarDatos();
  actualizarTabla();
  bootstrap.Modal.getInstance(document.getElementById("medicoModal")).hide();

  alert(
    "Médico guardado correctamente" +
      (estaraActivo !== activo
        ? " (Desactivado por falta de especialidades)"
        : "")
  );
}

// Eliminar médico (baja lógica)
function deleteMedico(id) {
  const medico = medicos.find((m) => m.id === id);
  if (!medico) return;

  if (
    !confirm(
      `¿Está seguro de desactivar a ${medico.nombre} ${medico.apellido}?`
    )
  )
    return;

  const index = medicos.findIndex((m) => m.id === id);
  if (index !== -1) {
    medicos[index].activo = false;
    guardarDatos();
    actualizarTabla();
    alert("Médico desactivado correctamente");
  }
}
