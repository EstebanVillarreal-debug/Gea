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

        // ambos llenos: aquí va tu validación real
        mostrarAviso('Correo o contraseña incorrectos.', 'error');
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
