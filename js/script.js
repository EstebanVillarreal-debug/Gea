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

const elementoFecha = document.getElementById("fecha");
if (elementoFecha) {
    const fechaHoy = new Intl.DateTimeFormat("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(new Date());
    elementoFecha.textContent = `Fecha: ${fechaHoy}`;
}
let temporizadorAlerta = null;

// cambiar entre paginas
function mostrarLogin() {
    landing.style.display = "none";
    footer.style.display = "none";
    paginaGea.hidden = true;
    paginaGea.classList.add("hidden");
    paginaGea.classList.remove("flex");
    contenedorLogin.hidden = false;
    contenedorLogin.classList.remove("hidden");
    contenedorLogin.classList.add("flex");
}

function mostrarInicio() {
    contenedorLogin.hidden = true;
    contenedorLogin.classList.add("hidden");
    contenedorLogin.classList.remove("flex");
    paginaGea.hidden = true;
    paginaGea.classList.add("hidden");
    paginaGea.classList.remove("flex");
    landing.style.display = "flex";
    footer.style.display = "block";
    ocultarAlerta();
}

function mostrarPanel() {
    landing.style.display = "none";
    footer.style.display = "none";
    contenedorLogin.hidden = true;
    contenedorLogin.classList.add("hidden");
    contenedorLogin.classList.remove("flex");
    paginaGea.hidden = false;
    paginaGea.classList.remove("hidden");
    paginaGea.classList.add("flex");

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
    paginaGea.hidden = true;
    paginaGea.classList.add("hidden");
    paginaGea.classList.remove("flex");
    paginaDocentes.hidden = false;
    paginaDocentes.classList.remove("hidden");
    paginaDocentes.classList.add("flex", "visible");
    mostrarDetalleDocentes();
    cargarDocentes();
}

function volverAlPanel() {
    paginaDocentes.hidden = true;
    paginaDocentes.classList.add("hidden");
    paginaDocentes.classList.remove("flex", "visible");
    paginaGea.hidden = false;
    paginaGea.classList.remove("hidden");
    paginaGea.classList.add("flex");
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
    if (inicioDocentes) { inicioDocentes.hidden = true; inicioDocentes.classList.add("hidden"); } // el hidden es para ocultar o mostrar un elemento visualmente en la página web.
    if (detalleDocentes) { detalleDocentes.hidden = false; detalleDocentes.classList.remove("hidden"); detalleDocentes.classList.add("flex"); }
}

function mostrarOpcionesDocentes() {
    if (detalleDocentes) { detalleDocentes.hidden = true; detalleDocentes.classList.add("hidden"); detalleDocentes.classList.remove("flex"); }
    if (inicioDocentes) { inicioDocentes.hidden = false; inicioDocentes.classList.remove("hidden"); inicioDocentes.classList.add("flex"); }
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
            vista.classList.toggle("hidden", vista.hidden);
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
            <article class="tarjeta-docente grid min-h-[205px] grid-cols-[1fr_64px] gap-[14px] rounded-2xl border border-[#e1e9f0] bg-white px-[18px] pb-4 pt-[18px] text-[13px] leading-[1.5] text-[#16232f] shadow-[0_6px_18px_rgba(22,50,79,.08)] transition hover:-translate-y-[3px] hover:shadow-[0_14px_26px_rgba(22,50,79,.14)] [&_p]:mb-2 [&_p]:text-[#55677a] [&_b]:font-bold [&_b]:text-[#16324f] [&_ul]:ml-4 [&_ul]:mt-[6px] [&_ul]:text-[#55677a]"
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
                    <div class="excusas-docente mt-[10px] border-t border-[#e1e9f0] pt-2 [&_h4]:mb-[6px] [&_h4]:inline-block [&_h4]:border-b-2 [&_h4]:border-[#16324f] [&_h4]:pb-0.5 [&_h4]:text-[13px] [&_h4]:font-bold [&_h4]:text-[#16324f] [&_ul]:mt-0 [&_ul]:pl-4 [&_ul]:text-xs [&_ul]:leading-normal [&_ul]:text-[#55677a]"
                        <h4>Excusas</h4>
                        <ul>
                            ${excusas.length ? excusas.map(e => `<li>${e}</li>`).join('') : '<li>Sin excusas por mostrar...</li>'}
                        </ul>
                    </div>
                </div>
                <div class="foto-docente grid size-14 place-items-center self-start rounded-full bg-[#1f6fb2] text-white [&_i]:text-2xl"><i class="fa-solid fa-user-tie"></i></div>
                <button class="boton-eliminar-docente col-span-full inline-flex items-center justify-self-start gap-[7px] rounded-lg border border-[#c94b59] bg-white px-[11px] py-[7px] text-xs font-semibold text-[#a52d3b] hover:bg-[#fff1f2] disabled:cursor-wait disabled:opacity-60" type="button" data-id="${doc.id_docente}">
                    <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                    <span>Eliminar cuenta</span>
                </button>
            </article>`;
        });

        panelLista.aplicar();
    } catch (error) {
        console.error("Error cargando docentes:", error);
    }
}

// eliminar cuenta desde su tarjeta
document.addEventListener("click", async function (evento) {
    const boton = evento.target.closest(".boton-eliminar-docente");
    if (!boton) return;

    evento.preventDefault();
    evento.stopPropagation();

    const idDocente = boton.dataset.id;
    const usuarioActual = JSON.parse(sessionStorage.getItem("usuario") || "null");

    if (usuarioActual && String(usuarioActual.id_docente) === String(idDocente)) {
        alert("No puedes eliminar la cuenta con la sesión activa. Cierra sesión y pide a otro administrador que la elimine.");
        return;
    }

    const confirmar = confirm(
        "¿Eliminar esta cuenta? También se borrarán sus excusas y reportes. Esta acción no se puede deshacer."
    );
    if (!confirmar) return;

    boton.disabled = true;
    try {
        const respuesta = await fetch(`${API_URL}/docentes/${idDocente}`, { method: "DELETE" });
        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.exito) {
            alert(resultado.error || "No se pudo eliminar la cuenta.");
            boton.disabled = false;
            return;
        }

        await cargarDocentes();
    } catch (error) {
        console.error("Error eliminando cuenta:", error);
        alert("No fue posible conectar con el servidor para eliminar la cuenta.");
        boton.disabled = false;
    }
});

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
            <article class="tarjeta-docente tarjeta-cambiar-rango grid min-h-[205px] grid-cols-[1fr_64px] gap-[14px] rounded-2xl border border-[#e1e9f0] bg-white px-[18px] pb-[18px] pt-[18px] text-left text-[13px] leading-[1.5] text-[#16232f] shadow-[0_6px_18px_rgba(22,50,79,.08)] transition hover:-translate-y-[3px] hover:shadow-[0_14px_26px_rgba(22,50,79,.14)] [&_p]:mb-2 [&_p]:text-[#55677a] [&_b]:font-bold [&_b]:text-[#16324f]"
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
                <div class="foto-docente grid size-14 place-items-center self-start rounded-full bg-[#1f6fb2] text-white [&_i]:text-2xl"><i class="fa-solid fa-user-gear"></i></div>
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
