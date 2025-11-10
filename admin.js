document.addEventListener("DOMContentLoaded", () => {
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");

  if (!tipoUsuario || tipoUsuario !== "admin") {
    alert("Acceso denegado. Solo administradores pueden entrar.");
    window.location.href = "index.html";
  } else {
    document.body.style.display = "block";
  }
});

