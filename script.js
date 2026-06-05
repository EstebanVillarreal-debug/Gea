const btnIngresar = document.querySelector(".btn-ingresar");
const landing = document.querySelector(".landing");
const login = document.querySelector(".login");
const btnEntrar = document.querySelector(".entrar");
const inputCorreo = document.querySelector(".correo");
const inputContrasena = document.querySelector(".contrasena");
const erorcontrasena = document.querySelector(".erorcontrasena");
const homeadmin = document.querySelector(".homeadmin");
const homedocentes = document.querySelector(".homedocentes");
const btnvolverprincipio = document.querySelector(".volver");
const botonesCerrarSesion = document.querySelectorAll(".cerrar-sesion");
const nombresUsuario = document.querySelectorAll("#usuario");
const fechasHome = document.querySelectorAll(".Fecha");
let tiempoErrorContrasena;

// Datos de Google Sheets.
const GOOGLE_SHEETS = {
    // apiKey es la clave de Google para poder usar la API de Sheets.
    apiKey: "AIzaSyD00mm2r7FbmgRvuwgJN3nHRDmDLQQI_1U",
    // spreadsheetId es el ID en la URL en Google Sheet.
    spreadsheetId: "15I3IJYemczP1JbtShsoXbyWH6dQjovrC1tkc1LhPHJY",
    // range indica de que pestaña y columnas se van a leer los usuarios.
    // En este caso lee desde A hasta D dentro de la pestana Usuarios.
    // Actualizado: como tu pestana actual se llama Hoja 1, este es el rango correcto.
    range: "'Hoja 1'!A:D"
};

// RUTAS guarda el nombre que va despues del # en la URL.
// Asi el navegador puede diferenciar inicio, login y home aunque todo este en el mismo HTML.
const RUTAS = {
    landing: "#inicio",
    login: "#login",
    admin: "#admin",
    docente: "#docente"
};

function ocultarPantallas() {
    landing.style.display = "none";
    login.style.display = "none";
    homeadmin.style.display = "none";
    homedocentes.style.display = "none";
}

function mostrarPantalla(pantalla) {
    ocultarPantallas();
    erorcontrasena.style.display = "none";

    // pantalla es el nombre de la seccion que voy a mostrar.
    // Por ejemplo: "login", "admin", "docente" o "landing".
    if (pantalla === "login") {
        login.style.display = "block";
    } else if (pantalla === "admin") {
        homeadmin.style.display = "block";
    } else if (pantalla === "docente") {
        homedocentes.style.display = "block";
    } else {
        landing.style.display = "grid";
    }
}

function guardarRuta(pantalla, modo= "push") {
    const ruta = RUTAS[pantalla] || RUTAS.landing;
    const estado = { pantalla };

    // modo decide como se guarda la ruta en el historial del navegador.
    // push agrega una nueva ruta; replace cambia la ruta actual.
    if (modo === "replace") {
        history.replaceState(estado, "", ruta);
    } else {
        history.pushState(estado, "", ruta);
    }
}

function abrirLogin() {
    mostrarPantalla("login");
    // Aqui ponemos push para que la flecha atras vuelva del login al landing.
    guardarRuta("login");
}

function abrirLanding(modo = "push") {
    sessionStorage.removeItem("usuarioActivo");
    sessionStorage.removeItem("nombreUsuario");
    mostrarPantalla("landing");
    guardarRuta("landing", modo);
}

function cerrarSesion() {
    abrirLanding("replace");
}

function actualizarFechaHora() {
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    fechasHome.forEach((fechaHtml) => {
        fechaHtml.textContent = `Fecha: ${fechaHora}`;
    });
}

function mostrarErrorContrasena() {
    clearTimeout(tiempoErrorContrasena);
    erorcontrasena.style.display = "block";

    tiempoErrorContrasena = setTimeout(() => {
        erorcontrasena.style.display = "none";
    }, 5000);
}

function abrirHome(tipoUsuario, modo = "replace") {
    sessionStorage.setItem("usuarioActivo", tipoUsuario);
    mostrarPantalla(tipoUsuario);
    nombresUsuario.forEach((usuarioHtml) => {
        usuarioHtml.textContent = sessionStorage.getItem("nombreUsuario") || "";
    });
    // Al iniciar sesion usamos replace para que atras no regrese al login.
    guardarRuta(tipoUsuario, modo);
}

async function cargarUsuariosDesdeSheet() {
    const { apiKey, spreadsheetId, range } = GOOGLE_SHEETS;

    // Si aun estan los textos de ejemplo, paramos para evitar una consulta mala.
    if (apiKey.includes("PEGA_AQUI") || spreadsheetId.includes("PEGA_AQUI")) {
        throw new Error("Faltan los datos de Google Sheets en script.js");
    }

    // encodeURIComponent prepara el rango para que pueda viajar bien dentro de la URL.
    const rango = encodeURIComponent(range);
    // Esta URL es la que consulta la API de Google Sheets y trae los valores de la hoja.
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${rango}?key=${apiKey}`;
    const respuesta = await fetch(url);

    // respuesta.ok solo es true cuando Google responde correctamente.
    // Si la API key, el ID o los permisos estan mal, normalmente entra aqui.
    if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los usuarios desde Google Sheets");
    }

    // Convertimos la respuesta de Google a un objeto de JavaScript.
    const datos = await respuesta.json();
    // datos.values trae las filas de la hoja; si viene vacio usamos [] para que no falle.
    const filas = datos.values || [];

    // slice(1) salta la primera fila porque ahi van los titulos de las columnas.
    // Luego convertimos cada fila en un usuario facil de comparar en el login.
    return filas.slice(1).map((fila) => ({
        // fila[0] es la columna A: Correo.
        correo: (fila[0] || "").trim(),
        // fila[1] es la columna B: Contrasena.
        contrasena: (fila[1] || "").trim(),
        // fila[2] es la columna C: Rol. Debe decir admin o docente.
        rol: (fila[2] || "").trim().toLowerCase(),
        // fila[3] es la columna D: Usuario.
        nombre: (fila[3] || "").trim()
    }));
}

async function validarUsuario(correo, contrasena) {
    // Primero traemos todos los usuarios registrados en Google Sheets.
    const usuarios = await cargarUsuariosDesdeSheet();

    // find busca el primer usuario que tenga el mismo correo y contrasena.
    // Tambien revisa que el rol sea uno que la pagina sabe abrir: admin o docente.
    return usuarios.find((usuario) => (
        usuario.correo === correo &&
        usuario.contrasena === contrasena &&
        (usuario.rol === "admin" || usuario.rol === "docente")
    ));
}

function rutaInicial() {
    const usuarioActivo = sessionStorage.getItem("usuarioActivo");

    if (usuarioActivo === "admin" || usuarioActivo === "docente") {
        abrirHome(usuarioActivo, "replace");
        return;
    }

    if (location.hash === RUTAS.login) {
        mostrarPantalla("login");
        guardarRuta("login", "replace");
        return;
    }

    abrirLanding("replace");
}

btnIngresar.addEventListener("click", abrirLogin);

btnEntrar.addEventListener("click", async () => {
    // trim quita espacios al inicio y al final para evitar errores por escribir un espacio.
    const correo = inputCorreo.value.trim();
    const contrasena = inputContrasena.value.trim();

    try {
        // Aqui se consulta Google Sheets y se revisa si existe ese usuario.
        const usuario = await validarUsuario(correo, contrasena);

        if (usuario) {
            // Guardamos el nombre por si luego queremos mostrarlo en el home.
            sessionStorage.setItem("nombreUsuario", usuario.nombre);
            // usuario.rol decide si abre la pantalla de admin o la de docente.
            abrirHome(usuario.rol);
        } else {
            // Si no encontro ningun usuario, mostramos el mensaje de error.
            mostrarErrorContrasena();
        }
    } catch (error) {
        // Si falla la conexion con Google Sheets, dejamos el error en consola para revisarlo.
        console.error(error);
        mostrarErrorContrasena();
    }
});

btnvolverprincipio.addEventListener("click", () => {
    abrirLanding();
});

botonesCerrarSesion.forEach((boton) => {
    boton.addEventListener("click", cerrarSesion);
});

document.addEventListener("keydown", (enter) => {
    if (enter.key === "Enter" && login.style.display === "block") {
        btnEntrar.click();
    }
});

window.addEventListener("popstate", (evento) => {
    const usuarioActivo = sessionStorage.getItem("usuarioActivo");

    // popstate se activa cuando se usa atras o adelante en el navegador.
    // Si ya hay sesion, dejamos al usuario dentro de su home.
    if (usuarioActivo === "admin" || usuarioActivo === "docente") {
        abrirHome(usuarioActivo);
        return;
    }

    mostrarPantalla(evento.state?.pantalla || "landing");
});

rutaInicial();
actualizarFechaHora();
setInterval(actualizarFechaHora, 1000);
