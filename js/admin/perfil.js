// perfil
(() => {
    const CLAVE = 'gea_perfil';
    const leer = () => { try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch { return {}; } };
    const guardar = (p) => { try { localStorage.setItem(CLAVE, JSON.stringify(p)); return true; } catch { return false; } };

    // nombre y foto guardados
    const aplicar = () => {
        const p = leer();
        if (p.nombre) document.querySelectorAll('[data-perfil-nombre]').forEach((e) => { e.textContent = p.nombre; });
        if (p.foto) document.querySelectorAll('[data-perfil-foto]').forEach((i) => { i.src = p.foto; });
    };
    aplicar();

    if (!document.getElementById('perfilNombre')) return; // lo de abajo solo corre en Perfil

    const $ = (id) => document.getElementById(id);

    // ventanas
    const cerrar = (m) => m.classList.add('hidden');
    document.querySelectorAll('[data-abrir]').forEach((b) => {
        b.addEventListener('click', () => {
            const m = $(b.dataset.abrir);
            m.classList.remove('hidden');
            if (m.id === 'modalNombre') {
                const campo = $('inputNombre');
                campo.value = leer().nombre || $('perfilNombre').textContent.trim();
                campo.focus();
                campo.select();
            }
        });
    });
    document.querySelectorAll('[data-cerrar]').forEach((b) => b.addEventListener('click', () => cerrar(b.closest('[data-modal]'))));
    document.querySelectorAll('[data-modal]').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m) cerrar(m); }));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') document.querySelectorAll('[data-modal]').forEach((m) => cerrar(m));
    });

    // cambiar nombre 
    $('formNombre').addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = $('inputNombre').value.trim().replace(/\s+/g, ' ');
        if (nombre.length < 2) { mostrarAviso('Escribe un nombre de al menos 2 letras.', 'error'); return; }

        const p = leer();
        p.nombre = nombre;
        guardar(p);
        aplicar();
        cerrar($('modalNombre'));
        mostrarAviso('Nombre actualizado.', 'ok');
    });

    // cambiar foto
    const ponerFoto = (src) => document.querySelectorAll('[data-perfil-foto]').forEach((i) => { i.src = src; });

    const procesarFoto = (archivo) => {
        if (!archivo) return;
        if (!archivo.type.startsWith('image/')) { mostrarAviso('Elige un archivo de imagen.', 'error'); return; }

        const lector = new FileReader();
        lector.onload = () => {
            const img = new Image();
            img.onload = () => {
                // recorte cuadrado a 200 px para que pese poco
                const lado = Math.min(img.width, img.height);
                const c = document.createElement('canvas');
                c.width = c.height = 200;
                c.getContext('2d').drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, 200, 200);
                const dataUrl = c.toDataURL('image/jpeg', 0.85);

                const p = leer();
                p.foto = dataUrl;
                ponerFoto(dataUrl);
                cerrar($('modalFoto'));
                if (guardar(p)) mostrarAviso('Foto actualizada.', 'ok');
                else mostrarAviso('Foto cambiada, pero no se pudo guardar en este navegador.', 'info');
            };
            img.src = lector.result;
        };
        lector.readAsDataURL(archivo);
    };

    ['fotoGaleria'].forEach((id) => {
        $(id).addEventListener('change', (e) => { procesarFoto(e.target.files[0]); e.target.value = ''; });
    });

    $('quitarFoto').addEventListener('click', () => {
        const p = leer();
        delete p.foto;
        guardar(p);
        ponerFoto('../img/usuario.png');
        cerrar($('modalFoto'));
        mostrarAviso('Se restauró la foto por defecto.', 'info');
    });

    // cerrar sesión 
    $('cerrar').addEventListener('click', () => { try { sessionStorage.removeItem('gea_sesion'); } catch { /* nada */ } });
})();
