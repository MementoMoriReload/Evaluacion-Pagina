document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const mensajeFeedback = document.getElementById('mensajeFeedback');

    // Array con la base de datos de usuarios registrados en el sistema
    const usuariosSistema = [
        { rut: "223162485", nombre: "Juan Pérez", email: "juan.perez@accesoseguro.cl", pass: "Jperez2026*" },
        { rut: "719676767", nombre: "María Gómez", email: "maria.gomez@accesoseguro.cl", pass: "Mgomez2026*" },
        { rut: "267824045", nombre: "Carlos Silva", email: "carlos.silva@accesoseguro.cl", pass: "Csilva2026*" },
        { rut: "172520432", nombre: "Ana Torres", email: "ana.torres@accesoseguro.cl", pass: "Atorres2026*" },
        { rut: "176520200", nombre: "Pedro Morales", email: "pedro.morales@accesoseguro.cl", pass: "Pmorales2026*" },
        { rut: "210302021", nombre: "Fernandito Silva", email: "fernando.silva@accesoseguro.cl", pass: "Fsilva2026*" },
        { rut: "220302020", nombre: "Anthony Miles", email: "anthony.miles@accesoseguro.cl", pass: "Amiles2026*" },
        { rut: "281654929", nombre: "Hernan Hernan", email: "hernan.hernan@accesoseguro.cl", pass: "Hhernan2026*" },
        { rut: "216202023", nombre: "Pancho Floo", email: "pancho.floo@accesoseguro.cl", pass: "Pfloo2026*" }
    ];

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const usuarioIngresado = usernameInput.value.trim().toLowerCase();
        const contrasenaIngresada = passwordInput.value.trim();

        ocultarMensaje();

        if (!usuarioIngresado || !contrasenaIngresada) {
            mostrarMensaje("Por favor, completa todos los campos.", "error");
            return;
        }

        // 1. Acceso de administrador por defecto
        if (usuarioIngresado === "admin" && contrasenaIngresada === "1234") {
            mostrarMensaje("¡Bienvenido, Administrador! Redirigiendo...", "exito");
            setTimeout(() => {
                window.location.href = "/inicio/inicio.html";
            }, 1500);
            return;
        }

        // 2. Buscamos si existe coincidencia en la lista por RUT, Correo o Nombre
        const usuarioEncontrado = usuariosSistema.find(user => 
            (user.rut.toLowerCase() === usuarioIngresado || 
             user.email.toLowerCase() === usuarioIngresado || 
             user.nombre.toLowerCase() === usuarioIngresado) && 
            user.pass === contrasenaIngresada
        );

        if (usuarioEncontrado) {
            mostrarMensaje(`¡Bienvenido/a, ${usuarioEncontrado.nombre}! Redirigiendo...`, "exito");
            
            // Guardamos sesión simulada en el navegador
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));

            setTimeout(() => {
                window.location.href = "/inicio/inicio.html";
            }, 1500);
        } else {
            mostrarMensaje("RUT/Usuario o contraseña incorrectos.", "error");
        }
    });

    function mostrarMensaje(texto, tipo) {
        if (!mensajeFeedback) return;
        mensajeFeedback.textContent = texto;
        mensajeFeedback.className = `mensaje-feedback ${tipo}`;
        mensajeFeedback.style.display = 'block';
    }

    function ocultarMensaje() {
        if (!mensajeFeedback) return;
        mensajeFeedback.textContent = '';
        mensajeFeedback.className = 'mensaje-feedback';
        mensajeFeedback.style.display = 'none';
    }
});
