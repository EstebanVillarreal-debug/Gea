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