let reservas = [];
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
  reservas = DataManager.getReservas();
  console.log(reservas);
  return reservas; 
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

// Obtener medicos desde DataManager (solo activos)
function getMedicos() {
  const todas = DataManager.getMedicos();
  return todas.filter((m) => m.activo === true || m.activo === undefined);
}

// Obtener nombre del medico
function getNombreMedico(id) {
  if (!id) return "Desconocido";
  const medicos = DataManager.getMedicos();
  const med = medicos.find((m) => m.id === Number(id));
  return med ? `${med.nombre} ${med.apellido}` : "N/A";
}

// Obtener turnos desde DataManager
function getTurnos() {
  const todas = DataManager.getTurnos();
  return todas;
}

// Obtener datos del turno
function getTurnoData(id) {
  if (!id) return "Desconocido";
  const turnos = DataManager.getTurnos();
  const turno = turnos.find((t) => t.id === Number(id));
  return turno ? `${turno.fecha} ${turno.hora}` : "N/A"; 
}

function getNombreObraSocial(id) {
  if (!id) return "Sin obra social";
  const obrasSociales = DataManager.getObrasSociales();
  const obraSocial = obrasSociales.find((os) => os.id === Number(id));
  return obraSocial ? `${obraSocial.nombre}` : "N/A";
}

// Inicializar DataTable
function initDataTable() {
  const datos = cargarDatos();
  console.log('Datos para DataTable:', datos);
  console.log('Cantidad de registros:', datos.length);
  if (datos.length > 0) {
    console.log('Primer registro:', datos[0]);
  }
  
  table = $("#reservasTable").DataTable({
    data: datos,
    columns: [
      { data: "nombre" },
      {
        data: "turnoId",
        render: function (data) {
          return getTurnoData(data);
        },
      },
      {
        data: "medicoId",
        render: function (data) {
          return getNombreMedico(data);
        },
      },
      {
        data: "especialidadId",
        render: function (data) {
          return getNombreEspecialidad(data);
        },
      },
      { data: "valorFinal" },
      {
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
            <button class="btn btn-sm btn-info" onclick="verReserva(${row.id})" title="Ver">
              <i class="bx bx-show"></i>
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

// Actualizar tabla
function actualizarTabla() {
  const datos = cargarDatos(); 
  table.clear();
  table.rows.add(datos);
  table.draw();
}

// Ver reserva en modal
function verReserva(id) {
  cargarDatos();
  const reserva = reservas.find((r) => Number(r.id) === Number(id));
  if (!reserva) return;

  const medicos = getMedicos();
  const medico = medicos.find((m) => Number(m.id) === Number(reserva.medicoId));

  const especialidades = getEspecialidades();
  const especialidad = especialidades.find(
    (e) => Number(e.id) === Number(reserva.especialidadId)
  );

  const turnoData = getTurnoData(reserva.turnoId); 
  const obraSocial = getNombreObraSocial(reserva.obraSocialId); 

  console.log(reserva, medico, especialidad, turnoData, obraSocial);

  const content = `
    <div class="row">
      <div class="col-12">
        <p><strong>ID:</strong> ${reserva.id}</p>
        <p><strong>Paciente:</strong> ${reserva.nombre}</p>
        <p><strong>DNI Paciente:</strong> ${reserva.dni}</p>
        <p><strong>Médico:</strong> ${medico ? medico.nombre + " " + medico.apellido : "Desconocido"}</p>
        <p><strong>Especialidad:</strong> ${especialidad ? especialidad.nombre : "Desconocido"}</p>
        <p><strong>Fecha y Hora:</strong> ${turnoData}</p>
        <p><strong>Obra Social:</strong> ${obraSocial}</p>                
        <p><strong>Valor Final:</strong> $${Number(reserva.valorFinal).toFixed(2)}</p>
      </div>
    </div>
  `;

  document.getElementById("viewModalBody").innerHTML = content;
  new bootstrap.Modal(document.getElementById("viewModal")).show();
}

// Toggle para mostrar inactivos
function toggleInactive() {
  showInactive = document.getElementById("showInactiveToggle").checked;
  actualizarTabla();
}

// let reservas = [];
// let table;
// let showInactive = false;

// // Inicialización
// document.addEventListener("DOMContentLoaded", function () {
//   cargarDatos();
//   initDataTable();
//   document.body.style.display = "block";
// });

// // Cargar datos desde DataManager
// function cargarDatos() {
//   reservas = DataManager.getReservas();
//   console.log(reservas)
// }

// // Obtener especialidades desde DataManager (solo activas)
// function getEspecialidades() {
//   const todas = DataManager.getEspecialidades();
//   return todas.filter((e) => e.activo === true || e.activo === undefined);
// }

// // Obtener nombre de especialidad
// function getNombreEspecialidad(id) {
//   if (!id) return "Sin especialidad";
//   const especialidades = DataManager.getEspecialidades();
//   const esp = especialidades.find((e) => e.id === Number(id));
//   return esp ? esp.nombre : "N/A";
// }

// // Obtener medicos desde DataManager (solo activos)
// function getMedicos() {
//   const todas = DataManager.getMedicos();
//   return todas.filter((m) => m.activo === true || m.activo === undefined);
// }

// // Obtener nombre del medico
// function getNombreMedico(id) {
//   if (!id) return "Desconosido";
//   const medicos = DataManager.getMedicos();
//   const med = medicos.find((m) => m.id === Number(id));
//   return med ? `${med.nombre} ${med.apellido}` : "N/A";
// }

// // Obtener turnos desde DataManager (solo activos)
// function getTurnos() {
//   const todas = DataManager.getTurnos();
//   return todas;
// }

// // Obtener datos del turno
// function getTurnoData(id) {
//   if (!id) return "Desconosido";
//   const turnos = DataManager.getTurnos();
//   const turno = turnos.find((t) => t.id === Number(id));
//   return turno ? `${turno.fehca} ${turno.hora}` : "N/A";
// }

// function getNombreObraSocial(id) {
//     if (!id) return "Desconosida";
//     const obrasSociales = DataManager.getObrasSociales();
//     const obraSocial = obrasSociales.find((os) => os.id === Number(id))
//     return obraSocial ? `${obraSocial.nombre}` : "N/A";
// }

// // Inicializar DataTable
// function initDataTable() {
//   table = $("#reservasTable").DataTable({
//     data: cargarDatos(),
//     columns: [
//       {data: "nombre"},
//       {
//         data: "turnoId",
//         render: function (data) {
//           return getTurnoData(data);
//         },
//       },
//       { data: "medicoId",
//         render: function (data) {
//             return getNombreMedico(data);
//         },
//        },
//       { data: "especialidadId",
//         render: function (data) {
//             return getNombreEspecialidad(data);
//         },
//        },
//        {data: "valorFinal"},   
//       {
//         data: null,
//         orderable: false,
//         render: function (data, type, row) {
//           return `
//                         <button class="btn btn-sm btn-info" onclick="verTurno(${row.id})" title="Ver">
//                             <i class="bx bx-show"></i>
//                         </button>                        
//                     `;
//         },
//       },
//     ],
//     language: {
//       url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json",
//     },
//     responsive: true,
//     pageLength: 10,
//     order: [[0, "asc"]],
//   });
// }


// // Actualizar tabla
// function actualizarTabla() {
//   cargarDatos();
//   table.clear();
//   table.rows.add(cargarDatos());
//   table.draw();
// }

// // Ver turno en modal 
// function verReserva(id) {
//     cargarDatos()    
//     const reserva = reservas.find(r => Number(r.id) === Number(id));
//     if (!reserva) return;

//     const medicos = getMedicos();
//     const medico = medicos.find(m => Number(m.id) === Number(reserva.medicoId));

//     const especialidades = getEspecialidades()
//     const especialidad = especialidades.find(e => Number(e.id) === Number(reserva.especialidadId))

//     const turnoData = getTurnoData(id)
//     const obraSocial = getNombreObraSocial(id)

//     console.log(reserva, medico, especialidad, turnoData, obraSocial)
    
    

//     const content = `
//         <div class="row">
//             <div class="col-12">
//                 <p><strong>ID:</strong> ${reserva.id}</p>
//                 <p><strong>Pasiente:</strong> ${reserva.nombre}</p>
//                 <p><strong>DNI Pasiente:</strong> ${reserva.dni}</p>
//                 <p><strong>Médico:</strong> ${medico ? medico.nombre + ' ' + medico.apellido : 'Desconocido'}</p>
//                 <p><strong>Espacialidad:</strong> ${especialidad ? especialidad.nombre : 'Desconocido'}</p>
//                 <p><strong>Fecha y Hora:</strong> ${turnoData}</p>
//                 <p><strong>Obra Social:</strong> ${obraSocial}</p>                
//                 <p><strong>Valor Final:</strong> ${reserva.valorFinal}</p>
//             </div>
//         </div>
//     `;

//     document.getElementById('viewModalBody').innerHTML = content;
//     new bootstrap.Modal(document.getElementById('viewModal')).show();
// }