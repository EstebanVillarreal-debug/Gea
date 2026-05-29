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

    // pantalla es el nombre de la seccion que queremos mostrar.
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
    // Aqui usamos push para que la flecha atras vuelva del login al landing.
    guardarRuta("login");
}

function abrirLanding(modo = "push") {
    sessionStorage.removeItem("usuarioActivo");
    mostrarPantalla("landing");
    guardarRuta("landing", modo);
}

function cerrarSesion() {
    abrirLanding("replace");
}

function abrirHome(tipoUsuario, modo = "replace") {
    sessionStorage.setItem("usuarioActivo", tipoUsuario);
    mostrarPantalla(tipoUsuario);
    // Al iniciar sesion usamos replace para que atras no regrese al login.
    guardarRuta(tipoUsuario, modo);
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

btnEntrar.addEventListener("click", () => {
    const correo = inputCorreo.value;
    const contrasena = inputContrasena.value;

    // && es para el "y" y para la "o" es ||
    if (correo === "1" && contrasena === "1") {
        abrirHome("admin");
    } else if (correo === "2" && contrasena === "2") {
        abrirHome("docente");
    } else {
        erorcontrasena.style.display = "block";
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
