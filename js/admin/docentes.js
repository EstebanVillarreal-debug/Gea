

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