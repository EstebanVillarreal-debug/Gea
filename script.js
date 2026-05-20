const btnIngresar = document.querySelector(".btn-ingresar");
const landing = document.querySelector(".landing");
const login = document.querySelector(".login");
const btnEntrar = document.querySelector(".entrar");
const inputCorreo = document.querySelector(".correo");
const inputContrasena = document.querySelector(".contrasena");
const erorcontrasena = document.querySelector(".erorcontrasena");
const homeadmin = document.querySelector(".homeadmin");
const homedocentes = document.querySelector(".homedocentes")

btnIngresar.addEventListener("click", () => {
    landing.style.display = "none";
    login.style.display = "block";
});

btnEntrar.addEventListener("click", () => {

    let correo = (inputCorreo.value);
    let contraseña = (inputContrasena.value);

    // && es para el "y" y para la "o" es ||
    if (correo === "1" && contraseña === "1") {
        login.style.display = "none";
        homeadmin.style.display = "block";
        
    } else if (correo === "2" && contraseña === "2") {
        login.style.display = "none";
        homedocentes.style.display = "block";
    }else {
        erorcontrasena.style.display = "block"
    }
});

document.addEventListener("keydown", (enter) => {
    if (enter.key === "Enter") {
        btnEntrar.click();
    }
});
