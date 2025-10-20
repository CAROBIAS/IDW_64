function login() {
  const usuarioIngresado = document.getElementById("usuario").value;
  const passIngresado = document.getElementById("password").value;

  const usuarioValido = USUARIOS.find(u => 
    u.usuario === usuarioIngresado && u.pass === passIngresado
  );

  if (usuarioValido) {
    sessionStorage.setItem("usuarioActual", usuarioValido.usuario);
    sessionStorage.setItem("tipoUsuario", usuarioValido.tipo);
    alert("Inicio de sesión exitoso");

    if (usuarioValido.tipo === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html"; 
    }

  } else {
    alert("Usuario o contraseña incorrectos");
  }
}



function verificarSesion() {
  const usuarioActivo = sessionStorage.getItem("usuarioActual");
  const tipo = sessionStorage.getItem("tipoUsuario");

  if (usuarioActivo !== "admin" || tipo !== "admin") {
    alert("Acceso denegado. Solo los administradores pueden ingresar.");
    window.location.href = "index.html";
  }
}


function logout() {
  sessionStorage.removeItem("usuarioActual");
  sessionStorage.removeItem("tipoUsuario");
  alert("Sesión cerrada");
  window.location.href = "index.html";
}