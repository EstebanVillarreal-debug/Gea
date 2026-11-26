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
    const inputFechaInicio = document.getElementById('eventoFechaInicio');
    const inputFechaFin = document.getElementById('eventoFechaFin');

    const CLAVE = 'gea_eventos_v2';
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Configuración visual por tipo de evento (tabla calendario)
    const TIPOS = {
        academico: { nombre: 'Académico', borde: 'border-l-azu', badge: 'bg-azu/10 text-azu', punto: 'bg-azu' },
        festivo: { nombre: 'Festivo', borde: 'border-l-orro', badge: 'bg-orro/10 text-orro', punto: 'bg-orro' },
        reunion: { nombre: 'Reunión', borde: 'border-l-aguama', badge: 'bg-aguama/10 text-aguama', punto: 'bg-aguama' },
        evaluacion: { nombre: 'Evaluación', borde: 'border-l-[#e73525]', badge: 'bg-[#e73525]/10 text-[#e73525]', punto: 'bg-[#e73525]' }
    };

    const pad = (n) => String(n).padStart(2, '0');
    const iso = (a, m, d) => `${a}-${pad(m + 1)}-${pad(d)}`;
    const soloDia = (ts) => ts.slice(0, 10);
    const soloHora = (ts) => ts.slice(11, 16);
    const aFecha = (s) => { const [a, m, d] = soloDia(s).split('-').map(Number); return new Date(a, m - 1, d); };
    const largo = (s) => {
        const t = aFecha(s).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        return t.charAt(0).toUpperCase() + t.slice(1);
    };
    const corto = (s) => aFecha(s).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    const hora12 = (h) => {
        const [hh, mm] = h.split(':').map(Number);
        return `${hh % 12 || 12}:${pad(mm)} ${hh >= 12 ? 'p. m.' : 'a. m.'}`;
    };
    const rangoTexto = (ev, conFecha) => {
        const dIni = soloDia(ev.fecha_inicio);
        const dFin = soloDia(ev.fecha_fin);
        const hIni = hora12(soloHora(ev.fecha_inicio));
        const hFin = hora12(soloHora(ev.fecha_fin));
        if (dIni === dFin) return `${conFecha ? corto(dIni) + ' · ' : ''}${hIni} – ${hFin}`;
        return `${corto(dIni)} ${hIni} – ${corto(dFin)} ${hFin}`;
    };
    const el = (tag, clases, texto) => {
        const e = document.createElement(tag);
        if (clases) e.className = clases;
        if (texto !== undefined) e.textContent = texto;
        return e;
    };

    // Almacenamiento local
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
            {
                id_evento: 1,
                titulo: 'Reunión de docentes',
                descripcion: 'Revisión de planeación académica del periodo.',
                fecha_inicio: `${enDias(1)}T07:00`,
                fecha_fin: `${enDias(1)}T09:00`,
                tipo: 'reunion',
                lugar: 'Sala de profesores',
                invitados: 'Docentes y coordinación'
            },
            {
                id_evento: 2,
                titulo: 'Evaluación de matemáticas',
                descripcion: 'Prueba acumulativa del primer corte.',
                fecha_inicio: `${enDias(3)}T09:30`,
                fecha_fin: `${enDias(3)}T11:30`,
                tipo: 'evaluacion',
                lugar: 'Aulas 801 y 802',
                invitados: 'Grado 8'
            },
            {
                id_evento: 3,
                titulo: 'Semana cultural institucional',
                descripcion: 'Actividades académicas, artísticas y deportivas por jornadas.',
                fecha_inicio: `${enDias(6)}T07:00`,
                fecha_fin: `${enDias(8)}T13:00`,
                tipo: 'academico',
                lugar: 'Patio central y aulas',
                invitados: 'Toda la comunidad educativa'
            }
        ];
        guardar();
    }

    let vista = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    let sel = hoyIso;

    const sincronizarFechasForm = () => {
        inputFechaInicio.value = sel;
        inputFechaFin.value = sel;
        inputFechaFin.min = sel;
    };

    // Eventos activos en un día específico (incluye eventos de varios días)
    const eventosDelDia = (diaIso) => eventos.filter((e) => soloDia(e.fecha_inicio) <= diaIso && diaIso <= soloDia(e.fecha_fin));

    // Calendario mensual
    const dibujarCalendario = () => {
        const a = vista.getFullYear();
        const m = vista.getMonth();
        tituloMes.textContent = `${meses[m]} ${a}`;
        grid.replaceChildren();

        const huecos = (new Date(a, m, 1).getDay() + 6) % 7; // la semana empieza el lunes
        const total = new Date(a, m + 1, 0).getDate();

        for (let i = 0; i < huecos; i++) grid.appendChild(el('span'));

        for (let d = 1; d <= total; d++) {
            const f = iso(a, m, d);
            const delDia = eventosDelDia(f);
            let clases = 'relative grid aspect-square min-h-[42px] place-items-center rounded-xl text-[14px] font-medium transition ';
            if (f === sel) clases += 'bg-gradient-to-br from-aguama to-azu text-white shadow-[0_6px_14px_-6px_rgba(31,111,178,.6)]';
            else if (f === hoyIso) clases += 'font-bold text-azu ring-1 ring-azu/50 hover:bg-hue';
            else clases += 'text-azuoscuro hover:bg-hue';

            const b = el('button', clases, String(d));
            b.type = 'button';
            b.dataset.fecha = f;

            if (delDia.length) {
                const puntos = el('span', 'absolute bottom-1.5 flex gap-0.5');
                delDia.slice(0, 3).forEach((ev) => {
                    const colorPunto = f === sel ? 'bg-white' : (TIPOS[ev.tipo]?.punto || 'bg-azu');
                    puntos.appendChild(el('span', 'size-1 rounded-full ' + colorPunto));
                });
                b.appendChild(puntos);
            }
            grid.appendChild(b);
        }
    };

    // Tarjeta de evento
    const tarjeta = (e, conFecha) => {
        const estilo = TIPOS[e.tipo] || TIPOS.academico;
        const t = el('article', `rounded-[14px] border border-borde border-l-4 ${estilo.borde} bg-hue/60 p-4` + (conFecha ? ' cursor-pointer transition hover:bg-hue' : ''));
        t.dataset.fecha = soloDia(e.fecha_inicio);

        const cab = el('div', 'flex items-start justify-between gap-3');
        const info = el('div', 'min-w-0');
        const filaMeta = el('div', 'flex flex-wrap items-center gap-2');
        filaMeta.append(
            el('span', `rounded-full px-2 py-0.5 text-[11px] font-semibold ${estilo.badge}`, estilo.nombre),
            el('p', 'text-[12px] font-semibold text-sua', rangoTexto(e, conFecha))
        );
        info.append(
            filaMeta,
            el('h3', 'mt-1 font-display text-[15.5px] font-bold leading-snug text-azuoscuro', e.titulo)
        );

        const borrar = el('button', 'grid size-8 shrink-0 place-items-center rounded-full text-sua transition hover:bg-white hover:text-[#e53935]');
        borrar.type = 'button';
        borrar.dataset.borrar = e.id_evento;
        borrar.setAttribute('aria-label', 'Eliminar evento');
        borrar.innerHTML = '<i class="fa-regular fa-trash-can text-[13px]"></i>';

        cab.append(info, borrar);
        t.appendChild(cab);

        [
            ['fa-solid fa-location-dot', e.lugar],
            ['fa-solid fa-users', e.invitados],
            ['fa-solid fa-align-left', e.descripcion]
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
                .filter((e) => [e.titulo, TIPOS[e.tipo]?.nombre || '', e.lugar, e.invitados, e.descripcion].join(' ').toLowerCase().includes(q))
                .sort((x, y) => x.fecha_inicio.localeCompare(y.fecha_inicio));
            etiquetaLista.textContent = 'Resultados de la búsqueda';
            tituloDia.textContent = `“${buscar.value.trim()}”`;
        } else {
            items = eventosDelDia(sel)
                .sort((x, y) => x.fecha_inicio.localeCompare(y.fecha_inicio));
            etiquetaLista.textContent = 'Eventos del día';
            tituloDia.textContent = largo(sel);
        }

        contador.textContent = items.length + (items.length === 1 ? ' evento' : ' eventos');
        sinEventos.classList.toggle('hidden', items.length > 0);
        sinEventos.textContent = buscando
            ? 'No se encontraron eventos.'
            : 'No hay eventos para este día. Agrega uno con el formulario.';

        lista.replaceChildren(...items.map((e) => tarjeta(e, buscando)));
    };

    const render = () => {
        dibujarCalendario();
        dibujarLista();
        fechaForm.textContent = largo(sel);
        sincronizarFechasForm();
    };

    // Interacción
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

    inputFechaInicio.addEventListener('change', () => {
        inputFechaFin.min = inputFechaInicio.value;
        if (!inputFechaFin.value || inputFechaFin.value < inputFechaInicio.value) {
            inputFechaFin.value = inputFechaInicio.value;
        }
    });

    buscar.addEventListener('input', dibujarLista);

    lista.addEventListener('click', (ev) => {
        const borrar = ev.target.closest('[data-borrar]');
        if (borrar) {
            eventos = eventos.filter((e) => String(e.id_evento) !== borrar.dataset.borrar);
            guardar();
            render();
            mostrarAviso('Evento eliminado.', 'info');
            return;
        }
        // En los resultados de búsqueda, tocar un evento lleva a su día de inicio
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

        const fIni = v('eventoFechaInicio');
        const hIni = v('eventoHoraInicio');
        const fFin = v('eventoFechaFin');
        const hFin = v('eventoHoraFin');
        const fecha_inicio = `${fIni}T${hIni}`;
        const fecha_fin = `${fFin}T${hFin}`;

        if (fecha_fin <= fecha_inicio) {
            mostrarAviso('La fecha y hora de fin deben ser posteriores al inicio.', 'error');
            (fFin < fIni ? inputFechaFin : document.getElementById('eventoHoraFin')).focus();
            return;
        }

        eventos.push({
            id_evento: Date.now(),
            titulo: v('eventoTitulo'),
            descripcion: v('eventoDescripcion'),
            fecha_inicio,
            fecha_fin,
            tipo: v('eventoTipo'),
            lugar: v('eventoLugar'),
            invitados: v('eventoInvitados')
        });
        guardar();
        form.reset();
        const [a, m] = fIni.split('-').map(Number);
        sel = fIni;
        vista = new Date(a, m - 1, 1);
        buscar.value = '';
        render();
        mostrarAviso('Evento agregado.', 'ok');
    });

    render();
})();
