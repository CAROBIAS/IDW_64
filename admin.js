document.addEventListener("DOMContentLoaded", () => {
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");

  if (!tipoUsuario || tipoUsuario !== "admin") {
    document.body.innerHTML = "";
    alert("Acceso denegado. Solo administradores pueden entrar.");
    window.location.href = "index.html";
  } else {
    document.body.style.display = "block";
    document.documentElement.style.display = "block";
  }
});

