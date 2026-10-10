const API_URL = "http://localhost:3000/api"; // esto es lo que necesita el fetch para que pueda entrar al server

const formulario = document.getElementById("loginForm");
const correo = document.getElementById("correo");
const password = document.getElementById("password");
const alerta = document.getElementById("alerta");
const mensaje = document.getElementById("mensaje");
const landing = document.querySelector(".landing");
const footer = document.querySelector(".footer-gea");
const contenedorLogin = document.querySelector(".container");
const paginaGea = document.querySelector(".pagina_gea");
const paginaDocentes = document.querySelector(".pagina-docentes");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let temporizadorAlerta = null;

// cambiar entre paginas
function mostrarLogin() {
    landing.style.display = "none";
    footer.style.display = "none";
    paginaGea.classList.remove("pagina_display_block");
    contenedorLogin.style.display = "flex";
}

function mostrarInicio() {
    contenedorLogin.style.display = "none";
    paginaGea.classList.remove("pagina_display_block");
    landing.style.display = "flex";
    footer.style.display = "block";
    ocultarAlerta();
}

function mostrarPanel() {
    landing.style.display = "none";
    footer.style.display = "none";
    contenedorLogin.style.display = "none";
    paginaGea.classList.add("pagina_display_block");

    // Si existe el usuario, se muestra su nombre en la bienvenida
    const usuarioGuardado = sessionStorage.getItem("usuario");
    if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        const bienvenida = document.querySelector(".bienvenida span");
        if (bienvenida) {
            bienvenida.textContent = `Bienvenido ${usuario.nombre} ${usuario.apellido}`;
        }
    }
}

function mostrarDocentes() {
    paginaGea.classList.remove("pagina_display_block");
    paginaDocentes.classList.add("visible");
    mostrarOpcionesDocentes();
}

function volverAlPanel() {
    paginaDocentes.classList.remove("visible");
    paginaGea.classList.add("pagina_display_block");
}

document.querySelector(".btn-ingresar").addEventListener("click", mostrarLogin);
document.getElementById("abrir-docentes").addEventListener("click", function (evento) {
    evento.preventDefault();
    mostrarDocentes();
});
document.querySelector(".volver-panel").addEventListener("click", volverAlPanel);
document.querySelector(".login a:last-child").addEventListener("click", function (evento) {
    evento.preventDefault();
    mostrarInicio();
});

// login base de datos 
formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const correoIngresado = correo.value.trim(); // el trim se lea bien los datos (quita los espacios al principio y al final, no quita entremedias)
    const passwordIngresada = password.value.trim();

    ocultarAlerta();

    // error si no tiene nada
    if (correoIngresado === "") {
        correo.classList.add("error");
        mostrarAlerta("Por favor ingresa tu correo");
        return;
    }

    if (!emailRegex.test(correoIngresado)) {
        correo.classList.add("error");
        mostrarAlerta("El correo no tiene un formato válido");
        return;
    }

    if (passwordIngresada === "") {
        password.classList.add("error");
        mostrarAlerta("Por favor ingresa tu contraseña");
        return;
    }

    // si hay algo buscado en la base de datos
    try {
        const respuesta = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                correo: correoIngresado,
                contrasena: passwordIngresada //  Quita la 'ñ' 
            })
        });

        const resultado = await respuesta.json(); // el awit Pausa la función actual hasta que la operación termine

        if (resultado.exito) { // .exito es para mirar si es valida
            sessionStorage.setItem("usuario", JSON.stringify(resultado.usuario)); //Guarda datos en el sessionStorage del navegador.
            mostrarPanel();
        } else {
            correo.classList.add("error"); //si no sale error
            password.classList.add("error");
            mostrarAlerta(resultado.error || "Correo o contraseña incorrectos");
        }
    } catch (error) { //Captura cualquier excepción o fallo que haya ocurrido en el bloque try
        mostrarAlerta("No fue posible conectar con el servidor");
        console.error(error); // Imprime los detalles técnicos del error directamente en la consola
    }
});

function mostrarAlerta(texto) {
    clearTimeout(temporizadorAlerta);
    alerta.style.display = "flex";
    mensaje.textContent = texto;
    temporizadorAlerta = setTimeout(ocultarAlerta, 4000);
}

function ocultarAlerta() {
    alerta.style.display = "none";
    correo.classList.remove("error");
    password.classList.remove("error");
}

// docentes
const inicioDocentes = document.querySelector(".inicio-docentes");
const detalleDocentes = document.querySelector(".detalle-docentes");
const botonDocentes = document.querySelector(".abrir-lista-docentes");
const pestanasDocentes = document.querySelectorAll(".pestana-docente");
const vistasDocentes = document.querySelectorAll(".vista-docentes");
const buscadorDocentes = document.getElementById("buscar-docente");
const listaDocentes = document.querySelector(".lista-docentes");
const sinResultados = document.querySelector(".sin-resultados");
const formularioDocente = document.getElementById("formAgregarDocente");
const botonAceptarDocente = document.getElementById("btnAceptar");

let docenteSeleccionadoId = null;

function mostrarDetalleDocentes() {
    if (inicioDocentes) inicioDocentes.hidden = true; // el hidden es para ocultar o mostrar un elemento visualmente en la página web.
    if (detalleDocentes) detalleDocentes.hidden = false;
}

function mostrarOpcionesDocentes() {
    if (detalleDocentes) detalleDocentes.hidden = true;
    if (inicioDocentes) inicioDocentes.hidden = false;
}

if (botonDocentes) {
    botonDocentes.addEventListener("click", function () {
        mostrarDetalleDocentes();
        cargarDocentes();
    });
}

// Cambiar entre pestañas (Lista / Agregar / Rango)
pestanasDocentes.forEach(function (pestana) {
    pestana.addEventListener("click", function () {
        const vistaElegida = pestana.dataset.vistaDocente;

        pestanasDocentes.forEach(b => b.classList.remove("activa"));
        pestana.classList.add("activa");

        vistasDocentes.forEach(function (vista) {
            vista.hidden = vista.dataset.vista !== vistaElegida;
        });

        if (vistaElegida === "lista") cargarDocentes();
        else if (vistaElegida === "rango") cargarDocentesRango();
    });
});

// mostrar docentes
async function cargarDocentes() {
    const listaDocentes = document.querySelector(".vista-lista .lista-docentes");
    if (!listaDocentes) return;

    try {
        const respuesta = await fetch(`${API_URL}/docentes`); //fetch envvia peticiones del htttp
        const resultado = await respuesta.json();
        if (!resultado.exito) return;

        listaDocentes.innerHTML = "";

        resultado.docentes.forEach(function (doc) { 
            const excusas = doc.lista_excusas ? doc.lista_excusas.split('||') : []; // para que funcione el apartado de excusas y salga en lsitaddo, el ssigno es una condicion que verifica una propiedad
            // el += suma, acumula y guarda los datos en la pantalla para que por cada doc (Docente) haga esto
            listaDocentes.innerHTML += `
            <article class="tarjeta-docente"
                    data-nombre="${doc.nombre} ${doc.apellido}"
                    data-grado="${doc.grado_encargado ?? ''}"
                    data-materia="${doc.materia ?? ''}"
                    data-rango="${doc.rango ?? ''}">
                <div>
                    <p>
                        <b>Nombre:</b> ${doc.nombre}<br>
                        <b>Apellido:</b> ${doc.apellido}<br>
                        <b>Materia:</b> ${doc.materia ?? "Sin materia"}<br>
                        <b>Grado encargado:</b> ${(doc.grado_encargado && doc.grado_encargado !== 0 && doc.grado_encargado !=="0") ? doc.grado_encargado : "Sin grado encargado"}<br>
                        <b>Contacto:</b> ${doc.contacto ?? "Sin contacto"}<br>
                        <b>Rango:</b> ${doc.rango ?? "Sin rango"}<br>
                        <b>N° de reportes:</b> ${doc.num_reportes ?? 0}
                    </p>
                    <div class="excusas-docente">
                        <h4>Excusas</h4>
                        <ul>
                            ${excusas.length ? excusas.map(e => `<li>${e}</li>`).join('') : '<li>Sin excusas por mostrar...</li>'}
                        </ul>
                    </div>
                </div>
                <div class="foto-docente"><i class="fa-solid fa-user-tie"></i></div>
            </article>`;
        });

        panelLista.aplicar();
    } catch (error) {
        console.error("Error cargando docentes:", error);
    }
}

// "Cambiar Rango" sin excusas ni reportes
async function cargarDocentesRango() {
    const contenedorRango = document.querySelector(".lista-docentes-rango");
    if (!contenedorRango) return;

    try {
        const respuesta = await fetch(`${API_URL}/docentes`);
        const resultado = await respuesta.json();
        if (!resultado.exito) return;

        contenedorRango.innerHTML = "";

        resultado.docentes.forEach(function (doc) {
            contenedorRango.innerHTML += `
            <article class="tarjeta-docente tarjeta-cambiar-rango"
                    data-id="${doc.id_docente}"
                    data-nombre="${doc.nombre} ${doc.apellido}"
                    data-grado="${doc.grado_encargado ?? ''}"
                    data-materia="${doc.materia ?? ''}"
                    data-rango="${doc.rango ?? 'docente'}">
                <div>
                    <p>
                        <b>Nombre:</b> ${doc.nombre}<br>
                        <b>Apellido:</b> ${doc.apellido}<br>
                        <b>Materia:</b> ${doc.materia ?? "Sin materia"}<br>
                        <b>Grado encargado:</b> ${(doc.grado_encargado && doc.grado_encargado !== 0 && doc.grado_encargado !=="0") ? doc.grado_encargado : "Sin grado encargado"}<br>
                        <b>Rango:</b> ${doc.rango ?? "docente"}
                    </p>
                </div>
                <div class="foto-docente"><i class="fa-solid fa-user-gear"></i></div>
            </article>`;
        });

        panelRango.aplicar();
    } catch (error) {
        console.error("Error al cargar docentes para rango:", error);
    }
}

// buscador y filtro
// ========== BUSCADOR / FILTRO (idéntico en las dos pestañas) ==========
function normalizar(texto) {
    return (texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // quita tildes/acentos
}

function crearControladorDocentes({ scope, inputId, sinResultadosSelector }) {
    const input = document.getElementById(inputId);
    if (!input) return { aplicar() {}, setCriterio() {} };

    let criterio = "todos";
    let valorExacto = "";

    function aplicar() {
        const texto = normalizar(input.value.trim());
        const tarjetas = document.querySelectorAll(`${scope} .tarjeta-docente`);
        const sinResultados = document.querySelector(sinResultadosSelector);
        let encontrados = 0;

        tarjetas.forEach(function (tarjeta) {
            const grado = normalizar(tarjeta.dataset.grado);
            const materia = normalizar(tarjeta.dataset.materia);
            const rango = normalizar(tarjeta.dataset.rango);
            const completo = normalizar(tarjeta.textContent);

            let coincideCategoria = true;
            if (valorExacto) {
                const valor = normalizar(valorExacto);
                if (criterio === "grado") coincideCategoria = grado === valor;
                else if (criterio === "materia") coincideCategoria = materia === valor;
                else if (criterio === "rango") coincideCategoria = rango === valor;
            }

            let coincideTexto = true;
            if (texto) coincideTexto = completo.includes(texto);

            const coincide = coincideCategoria && coincideTexto;
            tarjeta.style.display = coincide ? "" : "none";
            if (coincide) encontrados++;
        });

        if (sinResultados) sinResultados.hidden = encontrados !== 0;
    }

    input.addEventListener("input", aplicar);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); aplicar(); } });

    return {
        aplicar,
        setCriterio(c, valor = "") { criterio = c; valorExacto = valor; aplicar(); }
    };
}

const panelLista = crearControladorDocentes({
    scope: ".vista-lista",
    inputId: "buscar-docente",
    sinResultadosSelector: ".vista-lista .sin-resultados"
});

const panelRango = crearControladorDocentes({
    scope: ".lista-docentes-rango",
    inputId: "buscar-rango",
    sinResultadosSelector: "[data-vista='rango'] .sin-resultados"
});

function cerrarSubmenusFiltros() {
    document.querySelectorAll(".submenu-grados, .submenu-materias, .submenu-rangos")
        .forEach(submenu => submenu.classList.remove("visible"));
    document.querySelectorAll(".opcion-grado, .opcion-materia, .opcion-rango")
        .forEach(boton => boton.setAttribute("aria-expanded", "false"));
}

function cerrarTodosLosMenus() {
    document.querySelectorAll(".menu-filtros").forEach(m => m.classList.remove("visible"));
    cerrarSubmenusFiltros();
}

function marcarSeleccionUnica(boton, grupoSelector) {
    document.querySelectorAll(grupoSelector).forEach(b => b.classList.remove("seleccionada"));
    boton.classList.add("seleccionada");
}

// click del panel de filtros
document.addEventListener("click", function (e) {
    // Abrir y cerrar el menú principal
    const botonFiltro = e.target.closest(".boton-filtro");
    if (botonFiltro) {
        e.stopPropagation();
        const menu = botonFiltro.nextElementSibling;
        const abierto = menu.classList.contains("visible");
        cerrarTodosLosMenus();
        if (!abierto) menu.classList.add("visible");
        return;
    }

    // Abrir y cerrar un submenú
    const disparadorSubmenu = e.target.closest(".opcion-grado, .opcion-materia, .opcion-rango");
    if (disparadorSubmenu) {
        e.stopPropagation();
        const submenu = disparadorSubmenu.nextElementSibling;
        const abierto = submenu.classList.contains("visible");
        cerrarSubmenusFiltros();
        if (!abierto) {
            submenu.classList.add("visible");
            disparadorSubmenu.setAttribute("aria-expanded", "true");
        }
        return;
    }

    // Elegir un valor exacto dentro de un submenú
    const valorGrado = e.target.closest(".opcion-grado-aula");
    const valorMateria = e.target.closest(".opcion-materia-docente");
    const valorRango = e.target.closest(".opcion-rango-docente");
    if (valorGrado || valorMateria || valorRango) {
        const boton = valorGrado || valorMateria || valorRango;
        const panel = boton.closest(".vista-lista") ? panelLista : panelRango;

        if (valorGrado) {
            marcarSeleccionUnica(boton, ".opcion-grado-aula");
            panel.setCriterio("grado", boton.dataset.grado);
        } else if (valorMateria) {
            marcarSeleccionUnica(boton, ".opcion-materia-docente");
            panel.setCriterio("materia", boton.dataset.materia);
        } else {
            marcarSeleccionUnica(boton, ".opcion-rango-docente");
            panel.setCriterio("rango", boton.dataset.rango);
        }
        cerrarTodosLosMenus();
        return;
    }

    // "Todos"
    const opcionPlana = e.target.closest(".opcion-filtro:not(.opcion-grado):not(.opcion-materia):not(.opcion-rango)");
    if (opcionPlana) {
        const menu = opcionPlana.closest(".menu-filtros");
        menu.querySelectorAll(".opcion-filtro").forEach(b => b.classList.remove("seleccionado"));
        opcionPlana.classList.add("seleccionado");

        const panel = opcionPlana.closest(".vista-lista") ? panelLista : panelRango;

        document.querySelectorAll(".opcion-grado-aula, .opcion-materia-docente, .opcion-rango-docente")
            .forEach(b => b.classList.remove("seleccionada"));
        panel.setCriterio("todos");

        cerrarTodosLosMenus();
        return;
    }

    // Clic fuera de cualquier panel de filtro
    if (!e.target.closest(".filtro-docentes")) {
        cerrarTodosLosMenus();
    }
});

// agregar docente (boton aceptar)
if (botonAceptarDocente) {
    botonAceptarDocente.addEventListener("click", async function (e) {
        e.preventDefault();

        const elemNombre = document.getElementById("nombre");
        const elemApellido = document.getElementById("apellido");
        const elemMateria = document.getElementById("materia");
        const elemGrado = document.getElementById("grado_encargado");
        const elemContacto = document.getElementById("contacto");
        const elemRango = document.getElementById("rango");
        const elemCorreo = document.getElementById("correo-docente") || document.getElementById("correo");
        const elemContrasena = document.getElementById("contrasena");

        const contrasenaInput = elemContrasena ? elemContrasena.value.trim() : "";

        if (!elemNombre?.value.trim() || !elemApellido?.value.trim() || !elemCorreo?.value.trim() || !contrasenaInput) {
            alert("Por favor completa los campos obligatorios (Nombre, Apellido, Correo y Contraseña).");
            return;
        }

        const datos = {
            nombre: elemNombre.value.trim(),
            apellido: elemApellido.value.trim(),
            materia: elemMateria ? elemMateria.value.trim() : "",
            grado_encargado: elemGrado ? elemGrado.value.trim() : "",
            contacto: elemContacto ? elemContacto.value.trim() : "",
            rango: elemRango ? elemRango.value : "",
            correo: elemCorreo.value.trim(),
            contrasena: contrasenaInput
        };

        try {
            const respuesta = await fetch(`${API_URL}/docentes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            const resultado = await respuesta.json();

            if (resultado.exito) {
                alert("Docente agregado correctamente");
                if (formularioDocente) formularioDocente.reset();
                const tabLista = document.querySelector('[data-vista-docente="lista"]');
                if (tabLista) tabLista.click();
            } else {
                alert(resultado.error || "Error al agregar docente");
            }
        } catch (error) {
            alert("No fue posible conectar con el servidor para agregar el docente.");
            console.error(error);
        }
    });
}

// abrir y cerrar modal
document.addEventListener("click", function (e) {
    if (e.target.closest("#btnCancelarRango")) {
        const modal = document.getElementById("modalRango");
        if (modal) modal.hidden = true;
        docenteSeleccionadoId = null;
        return;
    }

    const tarjeta = e.target.closest(".tarjeta-cambiar-rango");
    if (tarjeta) {
        docenteSeleccionadoId = tarjeta.dataset.id;
        const nombreDocente = tarjeta.dataset.nombre;
        const rangoActual = tarjeta.dataset.rango;

        const nombreModal = document.getElementById("nombreDocenteModal");
        const selectModal = document.getElementById("selectNuevoRango");
        const modal = document.getElementById("modalRango");

        if (nombreModal) nombreModal.innerText = nombreDocente;
        if (selectModal) selectModal.value = rangoActual;
        if (modal) modal.hidden = false;
        return;
    }
});

// Botón Guardar del Modal (Petición PUT al servidor)
const btnGuardarRango = document.getElementById("btnGuardarRango");
if (btnGuardarRango) {
    btnGuardarRango.addEventListener("click", async function () {
        if (!docenteSeleccionadoId) return;

        const nuevoRango = document.getElementById("selectNuevoRango").value;

        try {
            const respuesta = await fetch(`${API_URL}/docentes/${docenteSeleccionadoId}/rango`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rango: nuevoRango })
            });

            const resultado = await respuesta.json();

            if (resultado.exito) {
                alert("Rango actualizado correctamente.");
                const modal = document.getElementById("modalRango");
                if (modal) modal.hidden = true;
                cargarDocentesRango();
            } else {
                alert(resultado.error || "Error al actualizar el rango.");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
}

// carrusel
const contenedorCarrusel = document.getElementById("carrusel");

if (contenedorCarrusel) {
    const pistaCarrusel = contenedorCarrusel.querySelector(".carrusel-via");
    const diapositivas = contenedorCarrusel.querySelectorAll(".carrusel-mover");
    let indiceActual = 0;

    if (pistaCarrusel && diapositivas.length > 1) {
        setInterval(function () {
            indiceActual = (indiceActual + 1) % diapositivas.length; // el % divvide la operaccion, el length es para ver cuántos elementos tiene un arreglo
            pistaCarrusel.style.transform = `translateX(-${indiceActual * 100}%)`;
        }, 10000);
    }
}