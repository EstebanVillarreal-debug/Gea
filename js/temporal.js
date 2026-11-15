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

	// módulo calendario 
(() => {
    const grid = document.getElementById('diasCalendario');
    if (!grid) return;

    const tituloMes = document.getElementById('tituloMes');
    const tituloDia = document.getElementById('tituloDia');
    const etiquetaLista = document.getElementById('etiquetaLista');
    const contador = document.getElementById('contadorEventos');
    const lista = document.getElementById('listaEventos');
    const sinEventos = document.getElementById('sinEventos');
    const fechaForm = document.getElementById('fechaForm');
    const buscar = document.getElementById('buscar-evento');
    const form = document.getElementById('formEvento');

    const CLAVE = 'gea_eventos';
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const pad = (n) => String(n).padStart(2, '0');
    const iso = (a, m, d) => `${a}-${pad(m + 1)}-${pad(d)}`;
    const aFecha = (s) => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
    const largo = (s) => {
        const t = aFecha(s).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        return t.charAt(0).toUpperCase() + t.slice(1);
    };
    const corto = (s) => aFecha(s).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    const hora12 = (h) => {
        const [hh, mm] = h.split(':').map(Number);
        return `${hh % 12 || 12}:${pad(mm)} ${hh >= 12 ? 'p. m.' : 'a. m.'}`;
    };
    const el = (tag, clases, texto) => {
        const e = document.createElement(tag);
        if (clases) e.className = clases;
        if (texto !== undefined) e.textContent = texto;
        return e;
    };

    //almacenamiento 
    const leer = () => {
        try { const t = localStorage.getItem(CLAVE); return t === null ? null : JSON.parse(t); }
        catch { return null; }
    };
    const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(eventos)); } catch { /* sin almacenamiento */ } };

    const hoy = new Date();
    const hoyIso = iso(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const enDias = (n) => {
        const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + n);
        return iso(d.getFullYear(), d.getMonth(), d.getDate());
    };

    let eventos = leer();
    if (!eventos) {
        eventos = [
            { id: 1, fecha: enDias(1), nombre: 'Reunión de docentes', hora: '07:00', lugar: 'Sala de profesores', invitados: 'Docentes y coordinación', excusas: '' },
            { id: 2, fecha: enDias(3), nombre: 'Evaluación de matemáticas', hora: '09:30', lugar: 'Aulas 801 y 802', invitados: 'Grado 8', excusas: 'Presentar excusa médica con 24 h de plazo' },
            { id: 3, fecha: enDias(7), nombre: 'Entrega de informes', hora: '12:00', lugar: 'Coordinación académica', invitados: 'Todos los docentes', excusas: '' }
        ];
        guardar();
    }

    let vista = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    let sel = hoyIso;

    // calendario 
    const dibujarCalendario = () => {
        const a = vista.getFullYear();
        const m = vista.getMonth();
        tituloMes.textContent = `${meses[m]} ${a}`;
        grid.replaceChildren();

        const huecos = (new Date(a, m, 1).getDay() + 6) % 7; // la semana empieza el lunes
        const total = new Date(a, m + 1, 0).getDate();
        const conteo = {};
        eventos.forEach((e) => { conteo[e.fecha] = (conteo[e.fecha] || 0) + 1; });

        for (let i = 0; i < huecos; i++) grid.appendChild(el('span'));

        for (let d = 1; d <= total; d++) {
            const f = iso(a, m, d);
            let clases = 'relative grid aspect-square min-h-[42px] place-items-center rounded-xl text-[14px] font-medium transition ';
            if (f === sel) clases += 'bg-gradient-to-br from-aguama to-azu text-white shadow-[0_6px_14px_-6px_rgba(31,111,178,.6)]';
            else if (f === hoyIso) clases += 'font-bold text-azu ring-1 ring-azu/50 hover:bg-hue';
            else clases += 'text-azuoscuro hover:bg-hue';

            const b = el('button', clases, String(d));
            b.type = 'button';
            b.dataset.fecha = f;

            if (conteo[f]) {
                const puntos = el('span', 'absolute bottom-1.5 flex gap-0.5');
                for (let i = 0; i < Math.min(conteo[f], 3); i++) {
                    puntos.appendChild(el('span', 'size-1 rounded-full ' + (f === sel ? 'bg-white' : 'bg-orro')));
                }
                b.appendChild(puntos);
            }
            grid.appendChild(b);
        }
    };

    //lista de eventos 
    const tarjeta = (e, conFecha) => {
        const t = el('article', 'rounded-[14px] border border-borde border-l-4 border-l-orro bg-hue/60 p-4' + (conFecha ? ' cursor-pointer transition hover:bg-hue' : ''));
        t.dataset.fecha = e.fecha;

        const cab = el('div', 'flex items-start justify-between gap-3');
        const info = el('div', 'min-w-0');
        info.append(
            el('p', 'text-[12px] font-semibold text-orro', (conFecha ? corto(e.fecha) + ' · ' : '') + hora12(e.hora)),
            el('h3', 'font-display text-[15.5px] font-bold leading-snug text-azuoscuro', e.nombre)
        );

        const borrar = el('button', 'grid size-8 shrink-0 place-items-center rounded-full text-sua transition hover:bg-white hover:text-[#e53935]');
        borrar.type = 'button';
        borrar.dataset.borrar = e.id;
        borrar.setAttribute('aria-label', 'Eliminar evento');
        borrar.innerHTML = '<i class="fa-regular fa-trash-can text-[13px]"></i>';

        cab.append(info, borrar);
        t.appendChild(cab);

        [
            ['fa-solid fa-location-dot', e.lugar],
            ['fa-solid fa-users', e.invitados],
            ['fa-solid fa-comment-dots', e.excusas ? 'Excusas: ' + e.excusas : '']
        ].forEach(([icono, texto]) => {
            if (!texto) return;
            const linea = el('p', 'mt-1.5 flex items-start gap-2.5 text-[13.5px] text-sua');
            linea.append(el('i', icono + ' mt-0.5 w-4 shrink-0 text-center text-aguama'), el('span', 'min-w-0 break-words', texto));
            t.appendChild(linea);
        });
        return t;
    };

    const dibujarLista = () => {
        const q = buscar.value.trim().toLowerCase();
        const buscando = q !== '';
        let items;

        if (buscando) {
            items = eventos
                .filter((e) => [e.nombre, e.lugar, e.invitados, e.excusas].join(' ').toLowerCase().includes(q))
                .sort((x, y) => (x.fecha + x.hora).localeCompare(y.fecha + y.hora));
            etiquetaLista.textContent = 'Resultados de la búsqueda';
            tituloDia.textContent = `“${buscar.value.trim()}”`;
        } else {
            items = eventos
                .filter((e) => e.fecha === sel)
                .sort((x, y) => x.hora.localeCompare(y.hora));
            etiquetaLista.textContent = 'Eventos del día';
            tituloDia.textContent = largo(sel);
        }

        contador.textContent = items.length + (items.length === 1 ? ' evento' : ' eventos');
        sinEventos.hidden = items.length > 0;
        sinEventos.textContent = buscando
            ? 'No se encontraron eventos.'
            : 'No hay eventos para este día. Agrega uno con el formulario.';

        lista.replaceChildren(...items.map((e) => tarjeta(e, buscando)));
    };

    const render = () => {
        dibujarCalendario();
        dibujarLista();
        fechaForm.textContent = largo(sel);
    };

    //interacción
    grid.addEventListener('click', (ev) => {
        const b = ev.target.closest('button[data-fecha]');
        if (!b) return;
        sel = b.dataset.fecha;
        buscar.value = '';
        render();
    });

    document.getElementById('mesAnterior').addEventListener('click', () => { vista.setMonth(vista.getMonth() - 1); dibujarCalendario(); });
    document.getElementById('mesSiguiente').addEventListener('click', () => { vista.setMonth(vista.getMonth() + 1); dibujarCalendario(); });
    document.getElementById('btnHoy').addEventListener('click', () => {
        vista = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        sel = hoyIso;
        buscar.value = '';
        render();
    });

    buscar.addEventListener('input', dibujarLista);

    lista.addEventListener('click', (ev) => {
        const borrar = ev.target.closest('[data-borrar]');
        if (borrar) {
            eventos = eventos.filter((e) => String(e.id) !== borrar.dataset.borrar);
            guardar();
            render();
            mostrarAviso('Evento eliminado.', 'info');
            return;
        }
        // en los resultados de búsqueda, tocar un evento lleva a su día
        const t = ev.target.closest('article');
        if (t && buscar.value.trim()) {
            const [a, m] = t.dataset.fecha.split('-').map(Number);
            sel = t.dataset.fecha;
            vista = new Date(a, m - 1, 1);
            buscar.value = '';
            render();
        }
    });

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const v = (id) => document.getElementById(id).value.trim();
        eventos.push({
            id: Date.now(),
            fecha: sel,
            nombre: v('eventoNombre'),
            hora: v('eventoHora'),
            lugar: v('eventoLugar'),
            invitados: v('eventoInvitados'),
            excusas: v('eventoExcusas')
        });
        guardar();
        form.reset();
        buscar.value = '';
        render();
        mostrarAviso('Evento agregado.', 'ok');
    });

    render();
})();

//reportes 
(() => {
    if (!document.getElementById('moduloReportes')) return;

    const $ = (id) => document.getElementById(id);
    const mostrar = (e, si) => e.classList.toggle('hidden', !si);
    const pad = (n) => String(n).padStart(2, '0');
    const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const aFecha = (s) => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
    const fechaCorta = (s) => aFecha(s).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const el = (tag, clases, texto) => {
        const e = document.createElement(tag);
        if (clases) e.className = clases;
        if (texto !== undefined) e.textContent = texto;
        return e;
    };

    const hoyIso = iso(new Date());
    const GRADOS = ['601', '602', '603', '701', '702', '703', '801', '802', '803', '901', '902', '903', '1001', '1002', '1003', '1101', '1102', '1103'];
    const MATERIAS = ['Español', 'Matemáticas', 'Sociales', 'Ciencias Naturales', 'Inglés', 'Física', 'Química', 'Tecnología', 'Educación Física', 'Artes', 'Filosofía'];
    const HORAS = ['6:30 – 7:30', '7:30 – 8:30', '8:30 – 9:30', '10:00 – 11:00', '11:00 – 12:00', '12:00 – 1:00'];
    const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];

    // almacenamiento
    const K_EST = 'gea_estudiantes';
    const K_ASI = 'gea_asistencias';
    const leer = (k, def) => { try { const t = localStorage.getItem(k); return t === null ? def : JSON.parse(t); } catch { return def; } };
    const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };

    let estudiantes = leer(K_EST, null);
    if (!estudiantes) {
        // datos de ejemplo
        estudiantes = [
            { id: 1, nombre: 'Valentina', apellido: 'Castillo', grado: '1002', contacto: '300 111 2233', ingreso: '2021-02-04', acudiente: 'Andrea Castillo', contactoAcudiente: '300 222 3344', foto: '', reportes: [
                { id: 11, fecha: '2026-03-10', profesor: 'Hector Toledo', texto: 'Se reportó distracción constante en clases.' },
                { id: 12, fecha: '2026-03-12', profesor: 'Hector Toledo', texto: 'Presentó retrasos repetidos a primera hora.' }] },
            { id: 2, nombre: 'Sofía', apellido: 'Rojas', grado: '702', contacto: '300 333 4455', ingreso: '2024-01-15', acudiente: 'Mauricio Rojas', contactoAcudiente: '300 444 5566', foto: '', reportes: [] },
            { id: 3, nombre: 'Juan', apellido: 'Martínez', grado: '603', contacto: 'Sin número', ingreso: '2025-02-14', acudiente: 'Ana Martínez', contactoAcudiente: '300 555 6677', foto: '', reportes: [
                { id: 31, fecha: '2026-03-05', profesor: 'Laura Gómez', texto: 'Faltó al respeto en clase y realizó llamado de atención.' },
                { id: 32, fecha: '2026-03-14', profesor: 'Carlos Ruiz', texto: 'No entregó el trabajo asignado en dos oportunidades.' }] },
            { id: 4, nombre: 'Camila', apellido: 'López', grado: '1002', contacto: '300 666 7788', ingreso: '2019-02-01', acudiente: 'María López', contactoAcudiente: '300 777 8899', foto: '', reportes: [
                { id: 41, fecha: '2026-03-17', profesor: 'Carlos Ruiz', texto: 'Se incorporó a una pelea en el salón.' }] }
        ];
        guardar(K_EST, estudiantes);
    }
    let asist = leer(K_ASI, {});

    // faltas: casillas sin marcar, en días que ya pasaron, de hojas guardadas
    const faltasDe = (id) => {
        let n = 0;
        Object.entries(asist).forEach(([clave, hoja]) => {
            const dias = hoja[id];
            if (!dias) return;
            const lunes = aFecha(clave.split('|')[0]);
            dias.forEach((presente, i) => {
                const f = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + i);
                if (!presente && iso(f) <= hoyIso) n++;
            });
        });
        return n;
    };

    const avatar = (e, tam) => {
        const c = el('div', `grid ${tam} shrink-0 place-items-center overflow-hidden rounded-full bg-hue text-[28px] text-sua ring-2 ring-borde`);
        if (e.foto) {
            const i = el('img', 'h-full w-full object-cover');
            i.src = e.foto;
            i.alt = 'Foto de ' + e.nombre;
            c.appendChild(i);
        } else {
            c.innerHTML = '<i class="fa-solid fa-user"></i>';
        }
        return c;
    };

    const opciones = (sel, valores, placeholder) => {
        sel.replaceChildren();
        if (placeholder !== undefined) { const o = el('option', '', placeholder); o.value = ''; sel.appendChild(o); }
        valores.forEach((v) => { const o = el('option', '', v); o.value = v; sel.appendChild(o); });
    };

    // PESTAÑAS
    const tabs = document.querySelectorAll('[data-tab-est]');
    const vistasEst = document.querySelectorAll('[data-vista-est]');

    function irTab(n) {
        tabs.forEach((t) => t.classList.toggle('activa', t.dataset.tabEst === n));
        vistasEst.forEach((v) => mostrar(v, v.dataset.vistaEst === n));
        abrirFiltros(false);
        if (n === 'principal') dibujarEstudiantes();
        if (n === 'reporte') prepararReporte();
        if (n === 'asistencia') dibujarAsistencia();
    }
    tabs.forEach((t) => t.addEventListener('click', () => irTab(t.dataset.tabEst)));

    // ESTUDIANTES: filtros
    const filtro = { grado: null, orden: null, profesor: null, fecha: '' };
    const CHIP = 'rounded-lg border border-borde bg-hue px-2.5 py-1.5 text-[13px] font-semibold text-azuoscuro transition hover:border-azu hover:text-azu [&.seleccionado]:border-transparent [&.seleccionado]:bg-gradient-to-br [&.seleccionado]:from-aguama [&.seleccionado]:to-azu [&.seleccionado]:text-white [&.seleccionado]:hover:text-white';

    const crearChips = (cont, pares) => {
        cont.replaceChildren(...pares.map(([valor, etiqueta]) => {
            const b = el('button', CHIP, etiqueta);
            b.type = 'button';
            b.dataset.valor = valor;
            return b;
        }));
    };
    const marcarChips = () => {
        document.querySelectorAll('#panelFiltros [data-valor]').forEach((c) => {
            c.classList.toggle('seleccionado', filtro[c.parentElement.dataset.clave] === c.dataset.valor);
        });
    };

    crearChips($('chipsGrado'), GRADOS.map((g) => [g, g]));
    crearChips($('chipsOrden'), [['mayor', 'Mayor a menor'], ['menor', 'Menor a mayor'], ['reciente', 'Más recientes'], ['antiguo', 'Más antiguos']]);

    const panel = $('panelFiltros');
    function abrirFiltros(si) {
        panel.hidden = !si;
        $('btnFiltros').setAttribute('aria-expanded', String(si));
        $('flechaFiltros').classList.toggle('rotate-180', si);
    }
    $('btnFiltros').addEventListener('click', (e) => { e.stopPropagation(); abrirFiltros(panel.hidden); });
    panel.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => abrirFiltros(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') abrirFiltros(false); });

    panel.addEventListener('click', (e) => {
        const chip = e.target.closest('[data-valor]');
        if (!chip) return;
        const clave = chip.parentElement.dataset.clave;
        filtro[clave] = filtro[clave] === chip.dataset.valor ? null : chip.dataset.valor; // pulsar otra vez lo quita
        marcarChips();
        dibujarEstudiantes();
    });
    $('filtroFecha').addEventListener('change', (e) => { filtro.fecha = e.target.value; dibujarEstudiantes(); });
    $('limpiarFiltros').addEventListener('click', () => {
        filtro.grado = filtro.orden = filtro.profesor = null;
        filtro.fecha = '';
        $('filtroFecha').value = '';
        marcarChips();
        dibujarEstudiantes();
    });
    $('buscarEstudiante').addEventListener('input', () => dibujarEstudiantes());

    // ESTUDIANTES: lista
    const dato = (rotulo, valor) => {
        const p = el('p', 'text-[13.5px] leading-snug text-sua');
        p.append(el('span', 'font-semibold text-azuoscuro', rotulo + ': '), valor);
        return p;
    };

    const tarjetaEstudiante = (e) => {
        const t = el('article', 'flex flex-col rounded-[18px] border border-borde border-t-4 border-t-orro bg-white p-5 shadow-[0_6px_18px_rgba(22,50,79,0.08)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_24px_rgba(22,50,79,0.12)]');

        const fila = el('div', 'flex items-start justify-between gap-4');
        const datos = el('div', 'min-w-0 space-y-1');
        datos.append(
            dato('Nombre', e.nombre), dato('Apellido', e.apellido), dato('Grado', e.grado),
            dato('Contacto', e.contacto || '—'), dato('Fecha de ingreso', fechaCorta(e.ingreso)),
            dato('Acudiente', e.acudiente), dato('Contacto acudiente', e.contactoAcudiente || '—'),
            dato('N° de faltas', String(faltasDe(e.id))), dato('N° de reportes', String(e.reportes.length))
        );
        fila.append(datos, avatar(e, 'size-[84px]'));
        t.appendChild(fila);

        const hist = el('div', 'mt-4 border-t border-borde pt-3');
        hist.appendChild(el('p', 'font-display text-[13px] font-bold text-azuoscuro', 'Historial'));
        if (!e.reportes.length) {
            hist.appendChild(el('p', 'mt-1 text-[13px] text-sua', 'Sin reportes hasta la fecha.'));
        } else {
            const ul = el('ul', 'mt-1 max-h-[120px] space-y-1.5 overflow-y-auto pr-1');
            [...e.reportes].sort((a, b) => b.fecha.localeCompare(a.fecha)).forEach((r) => {
                const li = el('li', 'text-[13px] leading-snug text-sua');
                li.append(el('span', 'font-semibold text-orro', fechaCorta(r.fecha) + ' · ' + r.profesor + ': '), r.texto);
                ul.appendChild(li);
            });
            hist.appendChild(ul);
        }
        t.appendChild(hist);
        return t;
    };

    function dibujarEstudiantes() {
        const q = $('buscarEstudiante').value.trim().toLowerCase();

        const profesores = [...new Set(estudiantes.flatMap((e) => e.reportes.map((r) => r.profesor)))].sort((a, b) => a.localeCompare(b, 'es'));
        crearChips($('chipsProfesor'), profesores.map((p) => [p, p]));
        marcarChips();

        const ultima = (e) => e.reportes.reduce((m, r) => (r.fecha > m ? r.fecha : m), '');
        const items = estudiantes.filter((e) =>
            (!filtro.grado || e.grado === filtro.grado) &&
            (!filtro.profesor || e.reportes.some((r) => r.profesor === filtro.profesor)) &&
            (!filtro.fecha || e.reportes.some((r) => r.fecha === filtro.fecha)) &&
            (!q || `${e.nombre} ${e.apellido} ${e.grado} ${e.acudiente}`.toLowerCase().includes(q))
        );

        if (filtro.orden === 'mayor') items.sort((a, b) => b.reportes.length - a.reportes.length);
        else if (filtro.orden === 'menor') items.sort((a, b) => a.reportes.length - b.reportes.length);
        else if (filtro.orden === 'reciente') items.sort((a, b) => ultima(b).localeCompare(ultima(a)));
        else if (filtro.orden === 'antiguo') items.sort((a, b) => (ultima(a) || '9999').localeCompare(ultima(b) || '9999'));

        $('listaEstudiantes').replaceChildren(...items.map(tarjetaEstudiante));
        mostrar($('sinEstudiantes'), items.length === 0);
    }

    // AGREGAR ESTUDIANTE
    opciones($('estGrado'), GRADOS, 'Selecciona');
    $('estIngreso').value = hoyIso;

    let fotoNueva = '';
    const pintarPreview = () => {
        const c = $('fotoPreview');
        c.replaceChildren();
        if (fotoNueva) {
            const i = el('img', 'h-full w-full object-cover');
            i.src = fotoNueva;
            i.alt = 'Foto del estudiante';
            c.appendChild(i);
        } else {
            c.innerHTML = '<i class="fa-solid fa-user"></i>';
        }
    };
    pintarPreview();

    const procesarFoto = (archivo) => {
        if (!archivo) return;
        if (!archivo.type.startsWith('image/')) { mostrarAviso('Elige un archivo de imagen.', 'error'); return; }
        const lector = new FileReader();
        lector.onload = () => {
            const img = new Image();
            img.onload = () => {
                const lado = Math.min(img.width, img.height);
                const c = document.createElement('canvas');
                c.width = c.height = 200;
                c.getContext('2d').drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, 200, 200);
                fotoNueva = c.toDataURL('image/jpeg', 0.8);
                pintarPreview();
            };
            img.src = lector.result;
        };
        lector.readAsDataURL(archivo);
    };
    ['fotoCamara', 'fotoGaleria'].forEach((id) => {
        $(id).addEventListener('change', (e) => { procesarFoto(e.target.files[0]); e.target.value = ''; });
    });

    $('formEstudiante').addEventListener('submit', (ev) => {
        ev.preventDefault();
        const v = (id) => $(id).value.trim();
        estudiantes.push({
            id: Date.now(), nombre: v('estNombre'), apellido: v('estApellido'), grado: $('estGrado').value,
            contacto: v('estContacto'), ingreso: $('estIngreso').value, acudiente: v('estAcudiente'),
            contactoAcudiente: v('estContactoAcudiente'), foto: fotoNueva, reportes: []
        });
        if (guardar(K_EST, estudiantes)) mostrarAviso('Estudiante agregado.', 'ok');
        else mostrarAviso('Estudiante agregado, pero no se pudo guardar en este navegador.', 'info');

        ev.target.reset();
        $('estIngreso').value = hoyIso;
        fotoNueva = '';
        pintarPreview();
        irTab('principal');
    });

    //AGREGAR REPORTE
    function pintarResumen() {
        const caja = $('repResumen');
        const e = estudiantes.find((x) => String(x.id) === $('repEstudiante').value);
        mostrar(caja, !!e);
        caja.classList.toggle('flex', !!e);
        if (!e) return;

        const datos = el('div', 'min-w-0 flex-1 space-y-1');
        datos.append(
            dato('Nombre', `${e.nombre} ${e.apellido}`), dato('Grado', e.grado), dato('Contacto', e.contacto || '—'),
            dato('Fecha de ingreso', fechaCorta(e.ingreso)), dato('Acudiente', e.acudiente),
            dato('Contacto acudiente', e.contactoAcudiente || '—'),
            dato('N° de faltas', String(faltasDe(e.id))), dato('N° de reportes', String(e.reportes.length))
        );
        caja.replaceChildren(datos, avatar(e, 'size-[84px]'));
    }

    function prepararReporte() {
        const sel = $('repEstudiante');
        const actual = sel.value;
        sel.replaceChildren();
        const vacio = el('option', '', estudiantes.length ? 'Selecciona un estudiante' : 'Aún no hay estudiantes');
        vacio.value = '';
        sel.appendChild(vacio);
        [...estudiantes].sort((a, b) => a.apellido.localeCompare(b.apellido, 'es')).forEach((e) => {
            const o = el('option', '', `${e.apellido} ${e.nombre} · ${e.grado}`);
            o.value = e.id;
            sel.appendChild(o);
        });
        sel.value = actual;
        if (!$('repFecha').value) $('repFecha').value = hoyIso;
        pintarResumen();
    }
    $('repEstudiante').addEventListener('change', pintarResumen);

    $('formReporte').addEventListener('submit', (ev) => {
        ev.preventDefault();
        const e = estudiantes.find((x) => String(x.id) === $('repEstudiante').value);
        if (!e) { mostrarAviso('Selecciona un estudiante.', 'error'); return; }

        e.reportes.push({ id: Date.now(), fecha: $('repFecha').value, profesor: $('repProfesor').value.trim(), texto: $('repTexto').value.trim() });
        guardar(K_EST, estudiantes);
        $('repTexto').value = '';
        pintarResumen();
        mostrarAviso('Reporte agregado.', 'ok');
    });

    // ASISTENCIA
    opciones($('asisGrado'), GRADOS, 'Selecciona');
    opciones($('asisMateria'), MATERIAS, 'Selecciona');
    opciones($('asisHora'), HORAS, 'Selecciona');
    $('asisFecha').value = hoyIso;

    let claveActual = '';

    function dibujarAsistencia() {
        const g = $('asisGrado').value;
        const m = $('asisMateria').value;
        const h = $('asisHora').value;
        const f = aFecha($('asisFecha').value || hoyIso);

        const lunes = new Date(f.getFullYear(), f.getMonth(), f.getDate() - ((f.getDay() + 6) % 7));
        const dias = [0, 1, 2, 3, 4].map((i) => new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + i));
        const larga = (d, conAnio) => d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', ...(conAnio ? { year: 'numeric' } : {}) });
        $('semanaTexto').querySelector('span').textContent = `Semana del ${larga(dias[0])} al ${larga(dias[4], true)}`;

        const listo = g && m && h;
        mostrar($('asisAviso'), !listo);
        mostrar($('asisTablaCaja'), !!listo);
        if (!listo) return;

        claveActual = `${iso(lunes)}|${g}|${m}|${h}`;
        const hoja = asist[claveActual] || {};
        const q = $('asisBuscar').value.trim().toLowerCase();
        const alumnos = estudiantes
            .filter((e) => e.grado === g && `${e.nombre} ${e.apellido}`.toLowerCase().includes(q))
            .sort((a, b) => a.apellido.localeCompare(b.apellido, 'es'));

        mostrar($('asisVacio'), alumnos.length === 0);

        const tabla = el('table', 'w-full min-w-[620px] border-separate border-spacing-0 text-left');
        const cab = el('tr');
        cab.appendChild(el('th', 'px-3 py-3 font-display text-[12.5px] font-bold uppercase tracking-wider text-azuoscuro', 'Nombre'));
        dias.forEach((d, i) => {
            cab.appendChild(el('th',
                'px-2 py-3 text-center font-display text-[12.5px] font-bold uppercase ' + (iso(d) === hoyIso ? 'text-aguama' : 'text-azuoscuro'),
                `${DIAS[i]} ${d.getDate()}`));
        });
        const thead = el('thead');
        thead.appendChild(cab);

        const tbody = el('tbody');
        alumnos.forEach((e) => {
            const tr = el('tr', 'transition hover:bg-hue/60');
            tr.appendChild(el('td', 'border-t border-borde px-3 py-2.5 text-[14px] font-medium text-azuoscuro', `${e.apellido} ${e.nombre}`));
            dias.forEach((_, i) => {
                const td = el('td', 'border-t border-borde px-2 py-2.5 text-center');
                const c = el('input', 'size-5 cursor-pointer accent-aguama');
                c.type = 'checkbox';
                c.dataset.est = e.id;
                c.dataset.dia = i;
                c.checked = !!(hoja[e.id] && hoja[e.id][i]);
                c.setAttribute('aria-label', `${e.nombre} ${e.apellido}, ${DIAS[i]}`);
                td.appendChild(c);
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        tabla.append(thead, tbody);
        $('asisTabla').replaceChildren(tabla);
    }

    ['asisGrado', 'asisMateria', 'asisHora', 'asisFecha'].forEach((id) => $(id).addEventListener('change', dibujarAsistencia));
    $('asisBuscar').addEventListener('input', dibujarAsistencia);

    $('asisTabla').addEventListener('change', (ev) => {
        const c = ev.target.closest('input[type="checkbox"]');
        if (!c) return;
        const grado = claveActual.split('|')[1];
        const hoja = asist[claveActual] || (asist[claveActual] = {});
        estudiantes.filter((e) => e.grado === grado).forEach((e) => {
            if (!hoja[e.id]) hoja[e.id] = [false, false, false, false, false];
        });
        hoja[c.dataset.est][Number(c.dataset.dia)] = c.checked;
        guardar(K_ASI, asist);
    });

    irTab('principal');
})();
