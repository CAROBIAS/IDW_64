// function login() {
//   const usuarioIngresado = document.getElementById("usuario").value;
//   const passIngresado = document.getElementById("password").value;

//   const usuarioValido = USUARIOS.find(u => 
//     u.usuario === usuarioIngresado && u.pass === passIngresado
//   );

//   if (usuarioValido) {
//     sessionStorage.setItem("usuarioActual", usuarioValido.usuario);
//     sessionStorage.setItem("tipoUsuario", usuarioValido.tipo);
//     alert("Inicio de sesión exitoso");

//     if (usuarioValido.tipo === "admin") {
//       window.location.href = "admin.html";
//     } else {
//       window.location.href = "index.html"; 
//     }

//   } else {
//     alert("Usuario o contraseña incorrectos");
//   }
// }



// function verificarSesion() {
//   const usuarioActivo = sessionStorage.getItem("usuarioActual");
//   const tipo = sessionStorage.getItem("tipoUsuario");

//   if (usuarioActivo !== "admin" || tipo !== "admin") {
//     alert("Acceso denegado. Solo los administradores pueden ingresar.");
//     window.location.href = "index.html";
//   }
// }


// function logout() {
//   sessionStorage.removeItem("usuarioActual");
//   sessionStorage.removeItem("tipoUsuario");
//   alert("Sesión cerrada");
//   window.location.href = "index.html";
// }

// Cargar usuarios desde la API
async function obtenerUsuariosAPI() {
  try {
    const res = await fetch("https://dummyjson.com/users");
    const data = await res.json();
    return data.users || [];
  } catch (error) {
    console.error("Error cargando usuarios desde API:", error);
    return [];
  }
}


// FUNCIÓN PRINCIPAL DE LOGIN
async function login() {
  const usuarioIngresado = document.getElementById("usuario").value.trim();
  const passIngresado = document.getElementById("password").value.trim();

  // --- A) BUSCAR EN USUARIOS LOCALES (config.js)
  const usuarioLocal = USUARIOS.find(
    u => u.usuario === usuarioIngresado && u.pass === passIngresado
  );

  if (usuarioLocal) {
    sessionStorage.setItem("usuarioActual", usuarioLocal.usuario);
    sessionStorage.setItem("tipoUsuario", usuarioLocal.tipo);
    alert("Inicio de sesión exitoso (usuario local)");
    window.location.href = usuarioLocal.tipo === "admin" ? "admin.html" : "index.html";
    return;
  }

  // --- B) BUSCAR EN USUARIOS DE LA API
  const usuariosAPI = await obtenerUsuariosAPI();

  const usuarioAPI = usuariosAPI.find(
    u => u.username === usuarioIngresado && u.password === passIngresado
  );

  if (usuarioAPI) {
    // La API usa "role"
    const rol = usuarioAPI.role ?? "user";

    sessionStorage.setItem("usuarioActual", usuarioAPI.username);
    sessionStorage.setItem("tipoUsuario", rol);

    alert("Inicio de sesión exitoso (usuario API)");
    window.location.href = rol === "admin" ? "admin.html" : "index.html";
    return;
  }

  // --- C) SI NO SE ENCONTRÓ EN NINGÚN LADO
  alert("Usuario o contraseña incorrectos");
}



// VERIFICAR SI EL USUARIO PUEDE ENTRAR A ADMIN
function verificarSesion() {
  const tipo = sessionStorage.getItem("tipoUsuario");

  if (tipo !== "admin") {
    alert("Acceso denegado. Solo administradores pueden ingresar.");
    window.location.href = "index.html";
  }
}



// CERRAR SESIÓN
function logout() {
  sessionStorage.removeItem("usuarioActual");
  sessionStorage.removeItem("tipoUsuario");
  alert("Sesión cerrada");
  window.location.href = "index.html";
}
