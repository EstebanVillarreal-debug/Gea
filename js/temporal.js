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

//NUEVO SCRIPT TEMPORAL

// landing
const btnIngresar = document.querySelector('.btn-ingresar');
if (btnIngresar) {
    btnIngresar.addEventListener('click', () => {
        location.href = 'login.html';
    });
}

// login
const btnVolver = document.getElementById('volver');
if (btnVolver) {
    btnVolver.addEventListener('click', (e) => {
        e.preventDefault();
        location.href = 'index.html';
    });
}

//ir a docentes
const tarjetaDocentes = document.getElementById('abrir-docentes');
if (tarjetaDocentes) {
    tarjetaDocentes.addEventListener('click', (e) => {
        e.preventDefault();
        location.href = 'modulo-docentes.html';
    });
}

//ir a home - principal
const iconohome = document.getElementById('abrir-principal');
if (iconohome) {
    iconohome.addEventListener('click', (e) => {
        e.preventDefault();
        location.href = 'principal.html';
    });
}

//ir a principal - not found...
const found = document.getElementById('volverPrincipal');
if (found) {
    found.addEventListener('click', (e) => {
        e.preventDefault();
        location.href = '/admin/principal.html';
    });
}

//ir a not found - principal
const modulo = document.getElementById('notfound');
if (modulo) {
    modulo.addEventListener('click', (e) => {
        e.preventDefault();
        location.href = '/notfound.html';
    });
}

//ver contraseña
const verp = document.getElementById('verpassword');
const pass = document.getElementById('password');
if (verp && pass) {
    verp.addEventListener('click', () => {
        const oculto = pass.type === 'password';
        pass.type = oculto ? 'text' : 'password';
        verp.innerHTML = oculto
            ? '<i class="fa-regular fa-eye-slash"></i>'
            : '<i class="fa-regular fa-eye"></i>';
    });
}

//botón "Ingresar" 
const formLogin = document.getElementById('loginForm');
if (formLogin) {
    formLogin.setAttribute('novalidate', '');

    const inputCorreo = document.getElementById('correo');
    const inputClave = document.getElementById('password');

    const marcarError = (input) => {
        const caja = input.parentElement;
        caja.style.borderColor = '#f3a9a9';
        caja.style.backgroundColor = '#fdf1f1';
    };

    const limpiarError = (input) => {
        const caja = input.parentElement;
        caja.style.borderColor = '';
        caja.style.backgroundColor = '';
    };

    [inputCorreo, inputClave].forEach((input) => {
        input.addEventListener('input', () => limpiarError(input));
    });

    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        limpiarError(inputCorreo);
        limpiarError(inputClave);

        const faltaCorreo = inputCorreo.value.trim() === '';
        const faltaClave = inputClave.value === '';

        if (faltaCorreo) marcarError(inputCorreo);
        if (faltaClave) marcarError(inputClave);

        if (faltaCorreo || faltaClave) {
            (faltaCorreo ? inputCorreo : inputClave).focus();
            return;
        }

        // ---- NUEVO: usuario de prueba ----
        const USUARIO = { correo: 'admin@gea.com', clave: 'gea1234' };

        const correo = inputCorreo.value.trim().toLowerCase();
        const clave = inputClave.value;

        if (correo === USUARIO.correo && clave === USUARIO.clave) {
            sessionStorage.setItem('gea_sesion', 'activa');
            mostrarAviso('¡Bienvenido a GEA!', 'ok');
            setTimeout(() => { location.href = 'admin/principal.html'; }, 600);
        } else {
            marcarError(inputCorreo);
            marcarError(inputClave);
            mostrarAviso('Correo o contraseña incorrectos.', 'error');
        }
    });
}

//enlace "¿Olvidaste tu contraseña?"
const btnOlvido = document.getElementById('olvido');
if (btnOlvido) {
    btnOlvido.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarAviso('Comunícate con tu colegio para recuperar tu contraseña.', 'info');
    });
}

//error flotante
function mostrarAviso(texto, tipo = 'error') {
    document.getElementById('avisoGea')?.remove();

    const iconos = {
        error: 'fa-triangle-exclamation text-[#e53935]',
        ok: 'fa-circle-check text-aguama',
        info: 'fa-circle-info text-[#7ab8c4]'
    };

    const aviso = document.createElement('div');
    aviso.id = 'avisoGea';
    aviso.setAttribute('role', 'alert');
    aviso.className = 'fixed bottom-[30px] left-1/2 z-[1000] flex w-[min(90vw,360px)] -translate-x-1/2 items-center gap-3 rounded-lg bg-[#25252d] px-5 py-3 text-[.9rem] font-medium text-white shadow-[0_4px_15px_rgba(0,0,0,.25)]';
    aviso.innerHTML = `<i class="fa-solid ${iconos[tipo] || iconos.error} text-xl"></i><span class="flex-1 text-left"></span>`;
    aviso.querySelector('span').textContent = texto;
    document.body.appendChild(aviso);

    clearTimeout(mostrarAviso.temporizador);
    mostrarAviso.temporizador = setTimeout(() => aviso.remove(), 3200);
}

// principal: fecha, pestañas y buscador 
const spanFecha = document.getElementById('fecha');
if (spanFecha) spanFecha.textContent = 'Fecha: ' + new Date().toLocaleDateString('es-CO');

const pestanas = document.querySelectorAll('[data-tab]');
const noticias = document.querySelectorAll('.noticia');
const cajaBuscar = document.getElementById('buscar');
const sinNoticias = document.getElementById('sinNoticias');

if (pestanas.length && noticias.length) {
    let tipoActual = 'general';

    const filtrar = () => {
        const texto = cajaBuscar.value.trim().toLowerCase();
        let visibles = 0;

        noticias.forEach((n) => {
            const coincideTipo = tipoActual === 'general' || n.dataset.tipo === tipoActual;
            const coincideTexto = n.textContent.toLowerCase().includes(texto);
            const mostrar = coincideTipo && coincideTexto;
            n.classList.toggle('hidden', !mostrar);
            if (mostrar) visibles++;
        });

        sinNoticias.classList.toggle('hidden', visibles > 0);
    };

    pestanas.forEach((p) => {
        p.addEventListener('click', () => {
            tipoActual = p.dataset.tab;
            pestanas.forEach((x) => x.classList.toggle('activa', x === p));
            filtrar();
        });
    });

    cajaBuscar.addEventListener('input', filtrar);
}

// módulo docentes 
(() => {
    const tabs = document.querySelectorAll('[data-vista-docente]');
    if (!tabs.length) return;

    const vistas = document.querySelectorAll('[data-vista]');
    const barra = document.getElementById('barraDocentes');
    const buscar = document.getElementById('buscar-docente');
    const btnFiltros = document.getElementById('abrir-filtro-docentes');
    const menu = document.getElementById('menu-filtros-docentes');
    const flecha = document.getElementById('flechaFiltro');
    const sinDocentes = document.getElementById('sinDocentes');
    const tarjetas = document.querySelectorAll('.tarjeta-docente');
    const chips = document.querySelectorAll('.chip');
    const seleccion = { grado: null, materia: null, rango: null };

    /* filtrar por búsqueda + chips */
    const filtrar = () => {
        const texto = buscar.value.trim().toLowerCase();

        tarjetas.forEach((t) => {
            const ok =
                (!seleccion.grado || t.dataset.grado.split(' ').includes(seleccion.grado)) &&
                (!seleccion.materia || t.dataset.materia === seleccion.materia) &&
                (!seleccion.rango || t.dataset.rango === seleccion.rango) &&
                t.textContent.toLowerCase().includes(texto);
            t.classList.toggle('hidden', !ok);
        });

        const vista = document.querySelector('[data-vista]:not([hidden])');
        const visibles = vista ? vista.querySelectorAll('.tarjeta-docente:not(.hidden)').length : 1;
        sinDocentes.hidden = !vista || vista.dataset.vista === 'agregar' || visibles > 0;
    };

    buscar.addEventListener('input', filtrar);

    /* pestañas */
    tabs.forEach((t) => {
        t.addEventListener('click', () => {
            const destino = t.dataset.vistaDocente;
            tabs.forEach((x) => x.classList.toggle('activa', x === t));
            vistas.forEach((v) => { v.hidden = v.dataset.vista !== destino; });
            barra.hidden = destino === 'agregar';
            abrirMenu(false);
            filtrar();
        });
    });

    /* panel de filtros */
    const abrirMenu = (abrir) => {
        menu.hidden = !abrir;
        btnFiltros.setAttribute('aria-expanded', String(abrir));
        flecha.classList.toggle('rotate-180', abrir);
    };

    btnFiltros.addEventListener('click', (e) => { e.stopPropagation(); abrirMenu(menu.hidden); });
    menu.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => abrirMenu(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') abrirMenu(false); });

    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            const clave = chip.dataset.grado ? 'grado' : chip.dataset.materia ? 'materia' : 'rango';
            const valor = chip.dataset[clave];

            // elegir el mismo chip otra vez lo desmarca
            seleccion[clave] = seleccion[clave] === valor ? null : valor;
            chips.forEach((c) => {
                if (c.dataset[clave] !== undefined) c.classList.toggle('seleccionado', c.dataset[clave] === seleccion[clave]);
            });
            filtrar();
        });
    });

    menu.querySelector('[data-filtro="todos"]').addEventListener('click', () => {
        seleccion.grado = seleccion.materia = seleccion.rango = null;
        chips.forEach((c) => c.classList.remove('seleccionado'));
        filtrar();
    });

    /* agregar docente (falso)  */
    document.getElementById('btnAceptar').addEventListener('click', () => {
        const form = document.getElementById('formAgregarDocente');
        if (!form.reportValidity()) return;
        mostrarAviso('Docente agregado.', 'ok');
        form.reset();
    });

    /* modal cambiar rango */
    const modal = document.getElementById('modalRango');
    const nombreModal = document.getElementById('nombreDocenteModal');
    const selectRango = document.getElementById('selectNuevoRango');
    let tarjetaActual = null;

    const estilos = {
        Docente: ['bg-aguama/10', 'text-aguama'],
        Administrativo: ['bg-azu/10', 'text-azu']
    };

    document.querySelector('.lista-docentes-rango').addEventListener('click', (e) => {
        const t = e.target.closest('.tarjeta-cambiar-rango');
        if (!t) return;
        tarjetaActual = t;
        nombreModal.textContent = t.dataset.nombre;
        selectRango.value = t.dataset.rango;
        modal.hidden = false;
    });

    const cerrarModal = () => { modal.hidden = true; tarjetaActual = null; };

    document.getElementById('btnCancelarRango').addEventListener('click', cerrarModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) cerrarModal(); });

    document.getElementById('btnGuardarRango').addEventListener('click', () => {
        if (!tarjetaActual) return;
        const nuevo = selectRango.value;
        const etiqueta = tarjetaActual.querySelector('.rango-texto');

        tarjetaActual.dataset.rango = nuevo;
        etiqueta.textContent = nuevo;
        etiqueta.classList.remove(...estilos.Docente, ...estilos.Administrativo);
        etiqueta.classList.add(...estilos[nuevo]);

        mostrarAviso('Rango actualizado.', 'ok');
        cerrarModal();
    });
})();