
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');


loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const usuario = usernameInput.value.trim();
    const contrasena = passwordInput.value.trim();


    if (usuario === "admin" && contrasena === "1234") {
        alert("¡Bienvenido, " + usuario + "! Inicio de sesión exitoso.");
    } else {
        alert("Usuario o contraseña incorrectos. Intenta con usuario: admin y clave: 1234");
    }
});