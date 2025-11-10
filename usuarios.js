// Obtener usuarios desde la API
async function obtenerUsuarios() {
    try {
        const response = await fetch("https://dummyjson.com/users");
        if (!response.ok) throw new Error("Error al cargar usuarios");

        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error(error);
        return [];
    }
}

let usuarios = [];
let tablaUsuarios;

// Inicializar DataTable cuando carga la página
$(document).ready(async function () {
    usuarios = await obtenerUsuarios();
    cargarTablaUsuarios();
});

function cargarTablaUsuarios() {
    if (tablaUsuarios) {
        tablaUsuarios.destroy();
    }

    tablaUsuarios = $("#usuariosTable").DataTable({
        data: usuarios,
        columns: [
            {
                data: null,
                render: row => `${row.firstName} ${row.lastName}`
            },
            { data: 'age' },
            { data: 'username' },            
            { data: 'address.country' },
            { data: 'role' },
            {
                data: null,
                orderable: false,
                render: row => `
                    <button class="btn btn-sm btn-info" onclick="verUsuario(${row.id})" title="Ver">
                        <i class="bx bx-show"></i>
                    </button>
                `
            }
        ],
        responsive: true,
        pageLength: 10,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
        }
    });
}


function verUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;

    const html = `
        <div class="row">
            <div class="col-md-4 text-center mb-3">
                <img src="${usuario.image}" class="img-fluid rounded-circle" style="max-width:150px;">
                <h5 class="mt-2">${usuario.firstName} ${usuario.lastName}</h5>
                <p class="text-muted">@${usuario.username}</p>
            </div>

            <div class="col-md-8">
                <p><strong>Edad:</strong> ${usuario.age}</p>
                <p><strong>Género:</strong> ${usuario.gender}</p>
                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Teléfono:</strong> ${usuario.phone}</p>
                <p><strong>Fecha de nacimiento:</strong> ${usuario.birthDate}</p>

                <hr>

                <h5>Acceso</h5>
                <p><strong>Username:</strong> ${usuario.username}</p>

                <p>
                    <strong>Password:</strong> 
                    <span id="passwordHidden">******</span>
                    <span id="passwordReal" style="display:none;">${usuario.password}</span>
                    <button id="togglePassBtn" class="btn btn-sm btn-outline-secondary ms-2">
                        <i class="bx bx-show"></i>
                    </button>
                </p>

                <p><strong>Rol:</strong> ${usuario.role ?? "admin"}</p>

                <hr>

                <h5>Dirección</h5>
                <p>${usuario.address.address}, ${usuario.address.city}, ${usuario.address.state} (${usuario.address.country})</p>

                <hr>

                <h5>Trabajo</h5>
                <p><strong>Empresa:</strong> ${usuario.company.name}</p>
                <p><strong>Cargo:</strong> ${usuario.company.title}</p>
                <p><strong>Departamento:</strong> ${usuario.company.department}</p>

                <hr>

                <h5>Banco</h5>
                <p><strong>Banco:</strong> ${usuario.bank.cardType}</p>
                <p><strong>Número:</strong> ${usuario.bank.cardNumber}</p>
                <p><strong>Expira:</strong> ${usuario.bank.cardExpire}</p>
            </div>
        </div>
    `;

    document.getElementById("viewUsuarioBody").innerHTML = html;

    // ---- OJITO PARA MOSTRAR/OCULTAR PASSWORD ----
    setTimeout(() => {
        const btn = document.getElementById("togglePassBtn");
        const hidden = document.getElementById("passwordHidden");
        const real = document.getElementById("passwordReal");

        if (btn) {
            btn.addEventListener("click", () => {
                const isHidden = real.style.display === "none";
                real.style.display = isHidden ? "inline" : "none";
                hidden.style.display = isHidden ? "none" : "inline";
                btn.innerHTML = isHidden 
                    ? '<i class="bx bx-hide"></i>' 
                    : '<i class="bx bx-show"></i>';
            });
        }
    }, 100);

    new bootstrap.Modal(document.getElementById("viewUsuarioModal")).show();
}
