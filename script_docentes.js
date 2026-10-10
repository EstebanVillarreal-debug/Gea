const fecha = document.getElementById("fecha");

if (fecha) {
    const fechaActual = new Intl.DateTimeFormat("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date());

    fecha.textContent = `Fecha: ${fechaActual}`;
}

const inicioHome = document.querySelector(".pagina-docentes-home");
const paginaDocentes = document.querySelector(".pagina-docentes");
const botonAbrirDocentes = document.getElementById("abrir-docentes");
const botonVolverHome = document.querySelector(".volver-home");
const botonVolverOpciones = document.querySelector(".volver-opciones-docentes");
const inicioDocentes = document.querySelector(".inicio-docentes");
const detalleDocentes = document.querySelector(".detalle-docentes");
const botonListaDocentes = document.querySelector(".abrir-lista-docentes");

function mostrarOpcionesDocentes() {
    detalleDocentes.hidden = true;
    inicioDocentes.hidden = false;
}

function mostrarDetalleDocentes() {
    inicioDocentes.hidden = true;
    detalleDocentes.hidden = false;
}

if (botonAbrirDocentes) {
    botonAbrirDocentes.addEventListener("click", (evento) => {
        evento.preventDefault();
        inicioHome.hidden = true;
        paginaDocentes.hidden = false;
        mostrarOpcionesDocentes();
    });
}

if (botonVolverHome) {
    botonVolverHome.addEventListener("click", () => {
        paginaDocentes.hidden = true;
        inicioHome.hidden = false;
    });
}

if (botonVolverOpciones) {
    botonVolverOpciones.addEventListener("click", mostrarOpcionesDocentes);
}

if (botonListaDocentes) {
    botonListaDocentes.addEventListener("click", mostrarDetalleDocentes);
}

const modalEditar = document.getElementById("modal-editar");
const modalExcusa = document.getElementById("modal-excusa");
const botonEditar = document.querySelector(".abrir-editar");
const botonExcusa = document.querySelector(".abrir-excusa");
const formularioEditar = document.getElementById("form-editar");
const formularioExcusa = document.getElementById("form-excusa");
const listaExcusas = document.getElementById("lista-excusas");
const totalExcusas = document.getElementById("total-excusas");
const botonesCerrarModal = document.querySelectorAll(".cerrar-modal");

if (botonEditar)
    botonEditar.addEventListener("click", () => modalEditar.showModal());
if (botonExcusa)
    botonExcusa.addEventListener("click", () => modalExcusa.showModal());
botonesCerrarModal.forEach((boton) => {
    boton.addEventListener("click", () => {
        boton.closest("dialog")?.close();
    });
});

if (formularioEditar) {
    formularioEditar.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const datos = new FormData(formularioEditar);
        datos.forEach((valor, campo) => {
            const destino = document.querySelector(`[data-dato="${campo}"]`);
            if (destino) destino.textContent = valor;
        });
        modalEditar.close();
    });
}

if (formularioExcusa) {
    formularioExcusa.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const datos = new FormData(formularioExcusa);
        const excusa = document.createElement("li");
        excusa.textContent = `${datos.get("fecha")}: ${datos.get("motivo")}`;
        listaExcusas.append(excusa);
        totalExcusas.textContent = String(listaExcusas.children.length);
        formularioExcusa.reset();
        modalExcusa.close();
    });
}
