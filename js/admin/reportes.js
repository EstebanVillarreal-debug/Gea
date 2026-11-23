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
