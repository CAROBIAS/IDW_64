const KEYS = {
  MEDICOS: "centroMedico_medicos",
  ESPECIALIDADES: "centroMedico_especialidades",
  OBRAS_SOCIALES: "centroMedico_obrasSociales",
  TURNOS: "centroMedico_turnos",
  RESERVAS: "centroMedico_reservas",
};

// IDs hardcodeados (luego serán dinámicos)
const ID_MEDICO = 1;
const ID_ESPECIALIDAD = 1;

let modalTurnoInstance;
let modalConfirmacionInstance;

// Inicializar modales de Bootstrap
document.addEventListener("DOMContentLoaded", function () {
  modalTurnoInstance = new bootstrap.Modal(
    document.getElementById("modalTurno")
  );
  modalConfirmacionInstance = new bootstrap.Modal(
    document.getElementById("modalConfirmacion")
  );
});

function obtenerDatos(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function guardarDatos(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function abrirModalTurno() {
  console.log("Abriendo modal de turno...");

  const medicos = obtenerDatos(KEYS.MEDICOS);
  const especialidades = obtenerDatos(KEYS.ESPECIALIDADES);
  const turnos = obtenerDatos(KEYS.TURNOS);
  const obrasSociales = obtenerDatos(KEYS.OBRAS_SOCIALES);

  console.log("Médicos:", medicos);
  console.log("Turnos:", turnos);
  console.log("Buscando médico con ID:", ID_MEDICO);

  const medico = medicos.find((m) => m.id === ID_MEDICO);
  const especialidad = especialidades.find((e) => e.id === ID_ESPECIALIDAD);

  console.log("Médico encontrado:", medico);
  console.log("Especialidad encontrada:", especialidad);

  if (!medico || !especialidad) {
    alert("No se encontró la información del médico o especialidad");
    return;
  }

  // Mostrar información del médico con nombre y apellido
  document.getElementById("infoMedico").innerHTML = `
        <p class="mb-1"><strong>Médico:</strong> ${medico.nombre} ${
    medico.apellido
  }</p>
        <p class="mb-1"><strong>Especialidad:</strong> ${
          especialidad.nombre
        }</p>
        <p class="mb-0"><strong>Valor Consulta:</strong> $${medico.valorConsulta.toFixed(
          2
        )}</p>
    `;

  // Cargar turnos disponibles - Filtrar por medicoId y disponibilidad
  const turnosDisponibles = turnos.filter((t) => {
    console.log(
      `Turno ID: ${t.id}, id_medico: ${t.id_medico}, disponible: ${t.disponible}`
    );
    return Number(t.id_medico) === ID_MEDICO && t.disponible === true;
  });

  console.log("Turnos disponibles encontrados:", turnosDisponibles);

  const selectTurno = document.getElementById("selectTurno");
  selectTurno.innerHTML = '<option value="">-- Seleccione un turno --</option>';

  if (turnosDisponibles.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No hay turnos disponibles";
    option.disabled = true;
    selectTurno.appendChild(option);
  } else {
    turnosDisponibles.forEach((turno) => {
      const option = document.createElement("option");
      option.value = turno.id;
      option.textContent = `${turno.fecha} - ${turno.hora}`;
      selectTurno.appendChild(option);
    });
  }

  // Cargar obras sociales del médico
  const selectObraSocial = document.getElementById("selectObraSocial");
  selectObraSocial.innerHTML =
    '<option value="">-- Sin obra social --</option>';

  if (medico.obrasSociales && medico.obrasSociales.length > 0) {
    medico.obrasSociales.forEach((osId) => {
      const obraSocial = obrasSociales.find((os) => os.id === osId);
      if (obraSocial) {
        const option = document.createElement("option");
        option.value = obraSocial.id;
        option.textContent = obraSocial.nombre;
        selectObraSocial.appendChild(option);
      }
    });
  }

  modalTurnoInstance.show();
}

function cerrarModalTurno() {
  modalTurnoInstance.hide();
  document.getElementById("formTurno").reset();
}

function cerrarModalConfirmacion() {
  modalConfirmacionInstance.hide();
}

function confirmarTurno() {
  const turnoId = parseInt(document.getElementById("selectTurno").value);
  const obraSocialId = document.getElementById("selectObraSocial").value;

  if (!turnoId) {
    alert("Debe seleccionar un turno");
    return;
  }

  const medicos = obtenerDatos(KEYS.MEDICOS);
  const especialidades = obtenerDatos(KEYS.ESPECIALIDADES);
  const turnos = obtenerDatos(KEYS.TURNOS);
  const obrasSociales = obtenerDatos(KEYS.OBRAS_SOCIALES);
  const reservas = obtenerDatos(KEYS.RESERVAS);

  const medico = medicos.find((m) => m.id === ID_MEDICO);
  const especialidad = especialidades.find((e) => e.id === ID_ESPECIALIDAD);
  const turno = turnos.find((t) => t.id === turnoId);

  let valorFinal = medico.valorConsulta;
  let descuento = 0;
  let obraSocialNombre = "Sin obra social";
  let porcentajeDescuento = 0;

  if (obraSocialId) {
    const obraSocial = obrasSociales.find(
      (os) => os.id === parseInt(obraSocialId)
    );
    if (obraSocial) {
      porcentajeDescuento = obraSocial.porcentaje;
      descuento = (medico.valorConsulta * porcentajeDescuento) / 100;
      valorFinal = medico.valorConsulta - descuento;
      obraSocialNombre = obraSocial.nombre;
    }
  }

  // Marcar turno como no disponible
  const turnoIndex = turnos.findIndex(t => Number(t.id) === turnoId);
  turnos[turnoIndex].disponible = false;
  guardarDatos(KEYS.TURNOS, turnos);

  // Crear reserva
  const nuevaReserva = {
    id: reservas.length > 0 ? Math.max(...reservas.map((r) => r.id)) + 1 : 1,
    turnoId: turnoId,
    medicoId: ID_MEDICO,
    especialidadId: ID_ESPECIALIDAD,
    obraSocialId: obraSocialId ? parseInt(obraSocialId) : null,
    valorFinal: valorFinal,
    fecha: new Date().toISOString(),
  };

  reservas.push(nuevaReserva);
  guardarDatos(KEYS.RESERVAS, reservas);

  // Mostrar confirmación
  let detalleHTML = `
        <div class="mb-3">
            <p class="mb-2"><strong>Médico:</strong> ${medico.nombre} ${medico.apellido}</p>
            <p class="mb-2"><strong>Especialidad:</strong> ${especialidad.nombre}</p>
            <p class="mb-2"><strong>Fecha:</strong> ${turno.fecha}</p>
            <p class="mb-2"><strong>Hora:</strong> ${turno.hora}</p>
            <p class="mb-2"><strong>Obra Social:</strong> ${obraSocialNombre}</p>
    `;

  if (descuento > 0) {
    detalleHTML += `<p class="mb-2"><strong>Descuento:</strong> $${descuento.toFixed(
      2
    )} (${porcentajeDescuento}%)</p>`;
  }

  detalleHTML += `
        </div>
        <div class="alert alert-success text-center">
            <p class="mb-1">Valor Final</p>
            <h2 class="mb-0">$${valorFinal.toFixed(2)}</h2>
        </div>
    `;

  document.getElementById("detalleReserva").innerHTML = detalleHTML;

  cerrarModalTurno();
  modalConfirmacionInstance.show();
}
