
document.addEventListener("DOMContentLoaded", () => {
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");
  const menu = document.getElementById("menuPrincipal");

  if (tipoUsuario === "admin") {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.innerHTML = `<a class="nav-link fw-semibold" href="admin.html">ADMINISTRACIÓN</a>`;
    menu.appendChild(li);
  }
  if (tipoUsuario === "admin") {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.innerHTML = `<a class="nav-link fw-semibold" href="turnos.html">TURNOS</a>`;
    menu.appendChild(li);
  }
  if (tipoUsuario === "admin") {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.innerHTML = `<a class="nav-link fw-semibold" href="reservas.html">RESERVAS</a>`;
    menu.appendChild(li);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginContainer = document.getElementById("loginContainer");
  const usuario = sessionStorage.getItem("usuarioActual");
  const tipoUsuario = sessionStorage.getItem("tipoUsuario");

  if (!loginContainer) return;

  if (usuario && tipoUsuario) {
    loginContainer.innerHTML = `
      <div class="dropdown mt-2 mt-lg-0">
        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
          <img src="https://ui-avatars.com/api/?name=${usuario}&background=0d6efd&color=fff" alt="User" class="user-avatar me-2">
          <span class="d-inline">${usuario}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-lg-end">
          <li><a class="dropdown-item" href="#"><i class="bx bx-user me-2"></i>Mi Perfil</a></li>
          <li><a class="dropdown-item" href="#"><i class="bx bx-cog me-2"></i>Configuración</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logoutBtn"><i class="bx bx-log-out me-2"></i>Cerrar Sesión</a></li>
        </ul>
      </div>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      sessionStorage.clear();
      window.location.href = "index.html";
    });
  }
});
