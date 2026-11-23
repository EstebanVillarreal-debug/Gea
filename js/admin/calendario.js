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