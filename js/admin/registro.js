// módulo registro 
(() => {
    if (!document.getElementById('moduloRegistro')) return;

    const $ = (id) => document.getElementById(id);
    const pad = (n) => String(n).padStart(2, '0');
    const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const aFecha = (s) => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
    const fechaCorta = (s) => aFecha(s).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const hora = (f) => new Date(f).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
    const mayus = (t) => t.charAt(0).toUpperCase() + t.slice(1);
    const el = (tag, clases, texto) => {
        const e = document.createElement(tag);
        if (clases) e.className = clases;
        if (texto !== undefined) e.textContent = texto;
        return e;
    };

    const hoyIso = iso(new Date());
    const GRADOS = ['601', '602', '603', '701', '702', '703', '801', '802', '803', '901', '902', '903', '1001', '1002', '1003', '1101', '1102', '1103'];

    // datos
    const ESTUDIANTES = [
        { id: 1, nombre: 'Mateo', apellido: 'Ramírez', grado: '801', codigo: '98171433920' },
        { id: 2, nombre: 'Diego', apellido: 'Villalobos', grado: '903', codigo: '33291068410' },
        { id: 3, nombre: 'Sofía', apellido: 'Londoño', grado: '701', codigo: '70451120893' },
        { id: 4, nombre: 'Camilo', apellido: 'Pérez', grado: '1003', codigo: '10290552731' },
        { id: 5, nombre: 'Mariana', apellido: 'Rico', grado: '602', codigo: '90031447820' },
        { id: 6, nombre: 'Julieta', apellido: 'Molina', grado: '803', codigo: '88094277219' },
        { id: 7, nombre: 'Nicolás', apellido: 'Duarte', grado: '902', codigo: '42901665218' },
        { id: 8, nombre: 'Valentina', apellido: 'Castillo', grado: '1002', codigo: '31220984457' }
    ];

    const K_REG = 'gea_registros';
    const leer = () => { try { const t = localStorage.getItem(K_REG); return t === null ? null : JSON.parse(t); } catch { return null; } };
    const guardar = (v) => { try { localStorage.setItem(K_REG, JSON.stringify(v)); } catch { /* sin almacenamiento */ } };

    let registros = leer();
    if (!registros) {
        // movimientos de ejemplo, relativos a hoy: [id_estudiante, tipo, días atrás, hora, minuto]
        const dia = (n, h, m) => { const d = new Date(); d.setDate(d.getDate() - n); return `${iso(d)}T${pad(h)}:${pad(m)}`; };
        const SEMILLA = [
            [1, 'ENTRADA', 0, 12, 48], [1, 'SALIDA', 0, 13, 35],
            [2, 'ENTRADA', 0, 12, 26], [2, 'SALIDA', 0, 13, 25],
            [3, 'SALIDA', 0, 9, 50],
            [4, 'ENTRADA', 0, 7, 10], [4, 'SALIDA', 0, 10, 5], [4, 'ENTRADA', 0, 10, 40],
            [5, 'SALIDA', 0, 11, 15],
            [6, 'ENTRADA', 1, 7, 5], [6, 'SALIDA', 1, 12, 30],
            [7, 'SALIDA', 1, 9, 20], [7, 'ENTRADA', 1, 10, 10],
            [8, 'ENTRADA', 2, 7, 15], [8, 'SALIDA', 2, 11, 45],
            [1, 'ENTRADA', 3, 7, 8], [1, 'SALIDA', 3, 13, 0],
            [3, 'ENTRADA', 4, 7, 20], [3, 'SALIDA', 4, 10, 30], [3, 'ENTRADA', 4, 11, 5],
            [5, 'ENTRADA', 8, 7, 12], [5, 'SALIDA', 8, 12, 50],
            [2, 'ENTRADA', 12, 7, 0], [2, 'SALIDA', 12, 9, 40],
            [4, 'ENTRADA', 18, 7, 25], [4, 'SALIDA', 18, 13, 5]
        ];
        registros = SEMILLA.map(([id_estudiante, tipo_movimiento, n, h, m], i) => ({
            id_registro_escaneo: i + 1, id_estudiante, tipo_movimiento, fecha_hora: dia(n, h, m)
        }));
        guardar(registros);
    }

    // estado de la vista 
    const vista = { periodo: 'dia', grado: null, estado: null };
    $('fechaRef').value = hoyIso;

    const rango = () => {
        const ref = aFecha($('fechaRef').value || hoyIso);
        if (vista.periodo === 'dia') return [iso(ref), iso(ref)];
        if (vista.periodo === 'semana') {
            const lunes = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - ((ref.getDay() + 6) % 7));
            const domingo = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + 6);
            return [iso(lunes), iso(domingo)];
        }
        return [iso(new Date(ref.getFullYear(), ref.getMonth(), 1)), iso(new Date(ref.getFullYear(), ref.getMonth() + 1, 0))];
    };

    const etiquetaRango = (desde, hasta) => {
        if (vista.periodo === 'dia') {
            return mayus(aFecha(desde).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
        }
        if (vista.periodo === 'semana') {
            const a = aFecha(desde).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
            const b = aFecha(hasta).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
            return `Semana del ${a} al ${b}`;
        }
        return mayus(aFecha(desde).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }));
    };

    // estado de cada tarjeta
    const ESTADOS = {
        dentro: { texto: 'Dentro del colegio', borde: 'border-t-aguama', badge: 'bg-aguama/10 text-aguama', icono: 'fa-school' },
        fuera: { texto: 'No ha vuelto', borde: 'border-t-orro', badge: 'bg-orro/10 text-orro', icono: 'fa-arrow-right-from-bracket' },
        salio: { texto: 'Salió', borde: 'border-t-azu', badge: 'bg-azu/10 text-azu', icono: 'fa-check' },
        sinSalida: { texto: 'Sin salida registrada', borde: 'border-t-orro', badge: 'bg-orro/10 text-orro', icono: 'fa-triangle-exclamation' }
    };
    const estadoDe = (g) => {
        const esHoy = g.fecha === hoyIso;
        if (g.ultima === 'ENTRADA') return esHoy ? ESTADOS.dentro : ESTADOS.sinSalida;
        return esHoy ? ESTADOS.fuera : ESTADOS.salio;
    };

    // tarjetas 
    const dato = (rotulo, valor) => {
        const p = el('p', 'text-[13.5px] leading-snug text-sua');
        p.append(el('span', 'font-semibold text-azuoscuro', rotulo + ': '), valor);
        return p;
    };

    const tarjeta = (g) => {
        const est = estadoDe(g);
        const t = el('article', `flex flex-col rounded-[18px] border border-borde border-t-4 ${est.borde} bg-white p-5 shadow-[0_6px_18px_rgba(22,50,79,0.08)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_24px_rgba(22,50,79,0.12)]`);

        const fila = el('div', 'flex items-start justify-between gap-4');
        const datos = el('div', 'min-w-0 space-y-1');
        datos.append(
            dato('Nombre', g.est.nombre), dato('Apellido', g.est.apellido), dato('Grado', g.est.grado),
            dato('Código', g.est.codigo), dato('Fecha', fechaCorta(g.fecha))
        );
        const avatar = el('div', 'grid size-[84px] shrink-0 place-items-center overflow-hidden rounded-full bg-hue text-[28px] text-sua ring-2 ring-borde');
        avatar.innerHTML = '<i class="fa-solid fa-user"></i>';
        fila.append(datos, avatar);
        t.appendChild(fila);

        const pie = el('div', 'mt-4 border-t border-borde pt-3');
        const cab = el('div', 'flex flex-wrap items-center justify-between gap-2');
        cab.appendChild(el('p', 'font-display text-[13px] font-bold text-azuoscuro', 'Movimientos'));
        const badge = el('span', `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${est.badge}`);
        badge.innerHTML = `<i class="fa-solid ${est.icono} text-[10px]"></i>`;
        badge.append(est.texto);
        cab.appendChild(badge);
        pie.appendChild(cab);

        const movs = el('div', 'mt-2 flex flex-wrap gap-2');
        g.movs.forEach((m) => {
            const entrada = m.tipo_movimiento === 'ENTRADA';
            const chip = el('span', 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ' +
                (entrada ? 'bg-aguama/10 text-aguama' : 'bg-orro/10 text-orro'));
            chip.innerHTML = `<i class="fa-solid ${entrada ? 'fa-arrow-right-to-bracket' : 'fa-arrow-right-from-bracket'} text-[10px]"></i>`;
            chip.append(`${entrada ? 'Entrada' : 'Salida'} ${hora(m.fecha_hora)}`);
            movs.appendChild(chip);
        });
        pie.appendChild(movs);
        t.appendChild(pie);
        return t;
    };

    // filtros 
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
        document.querySelectorAll('#panelFiltrosReg [data-valor]').forEach((c) => {
            c.classList.toggle('seleccionado', vista[c.parentElement.dataset.clave] === c.dataset.valor);
        });
    };
    crearChips($('chipsGradoReg'), GRADOS.map((g) => [g, g]));
    crearChips($('chipsEstadoReg'), [['dentro', 'Entrada (dentro)'], ['fuera', 'Salida (fuera)']]);

    const panel = $('panelFiltrosReg');
    const abrirPanel = (si) => {
        panel.hidden = !si;
        $('btnFiltrosReg').setAttribute('aria-expanded', String(si));
        $('flechaFiltrosReg').classList.toggle('rotate-180', si);
    };
    $('btnFiltrosReg').addEventListener('click', (e) => { e.stopPropagation(); abrirPanel(panel.hidden); });
    panel.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => abrirPanel(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') abrirPanel(false); });

    panel.addEventListener('click', (e) => {
        const chip = e.target.closest('[data-valor]');
        if (!chip) return;
        const clave = chip.parentElement.dataset.clave;
        vista[clave] = vista[clave] === chip.dataset.valor ? null : chip.dataset.valor; // pulsar otra vez lo quita
        marcarChips();
        dibujar();
    });
    $('limpiarFiltrosReg').addEventListener('click', () => {
        vista.grado = vista.estado = null;
        marcarChips();
        dibujar();
    });

    // ibujar 
    function dibujar() {
        const [desde, hasta] = rango();
        $('rangoTexto').querySelector('span').textContent = etiquetaRango(desde, hasta);
        const q = $('buscarRegistro').value.trim().toLowerCase();

        // un grupo 
        const grupos = {};
        registros.forEach((r) => {
            const f = r.fecha_hora.slice(0, 10);
            if (f < desde || f > hasta) return;
            const k = `${r.id_estudiante}|${f}`;
            (grupos[k] = grupos[k] || { id: r.id_estudiante, fecha: f, movs: [] }).movs.push(r);
        });

        const items = Object.values(grupos)
            .map((g) => {
                g.movs.sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora));
                g.ultima = g.movs[g.movs.length - 1].tipo_movimiento;
                g.est = ESTUDIANTES.find((e) => e.id === g.id);
                return g;
            })
            .filter((g) => g.est
                && (!vista.grado || g.est.grado === vista.grado)
                && (!vista.estado || (vista.estado === 'dentro' ? g.ultima === 'ENTRADA' : g.ultima === 'SALIDA'))
                && (!q || `${g.est.nombre} ${g.est.apellido} ${g.est.codigo} ${g.est.grado}`.toLowerCase().includes(q)))
            .sort((a, b) => b.movs[b.movs.length - 1].fecha_hora.localeCompare(a.movs[a.movs.length - 1].fecha_hora));

        $('statEscaneos').textContent = items.reduce((n, g) => n + g.movs.length, 0);
        $('statEstudiantes').textContent = new Set(items.map((g) => g.id)).size;
        $('statFuera').textContent = items.filter((g) => g.fecha === hoyIso && g.ultima === 'SALIDA').length;
        $('contadorLista').textContent = items.length + (items.length === 1 ? ' registro' : ' registros');

        $('listaRegistros').replaceChildren(...items.map(tarjeta));
        $('sinRegistros').classList.toggle('hidden', items.length > 0);
    }

    document.querySelectorAll('[data-periodo]').forEach((b) => {
        b.addEventListener('click', () => {
            vista.periodo = b.dataset.periodo;
            document.querySelectorAll('[data-periodo]').forEach((x) => x.classList.toggle('activa', x === b));
            dibujar();
        });
    });
    $('fechaRef').addEventListener('change', dibujar);
    $('buscarRegistro').addEventListener('input', dibujar);

    dibujar();
})();