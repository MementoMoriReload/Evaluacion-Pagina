document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRecuperar');
    const msjNotificacion = document.getElementById('msjNotificacion');
    const btnEnviar = document.getElementById('btnEnviar');

    function mostrarNotificacion(texto) {
        if (!msjNotificacion) return;

        msjNotificacion.textContent = texto;
        msjNotificacion.className = 'msj-exito';
        msjNotificacion.style.display = 'block';
    }

    function limpiarErrores() {
        document.getElementById('error-run').textContent = '';
        document.getElementById('error-email').textContent = '';
    }

    function validarFormulario() {
        limpiarErrores();
        let esValido = true;

        const run = document.getElementById('run').value.trim();
        const email = document.getElementById('email').value.trim();

        if (run === '') {
            document.getElementById('error-run').textContent = 'El RUT es obligatorio.';
            esValido = false;
        } else if (run.length !== 9) {
            document.getElementById('error-run').textContent = 'El RUT debe tener solo 9 caracteres.';
            esValido = false;
        }

        if (email === '') {
            document.getElementById('error-email').textContent = 'El email es obligatorio.';
            esValido = false;
        } else if (!email.includes('@')) {
            document.getElementById('error-email').textContent = 'El email debe incluir "@".';
            esValido = false;
        }

        return esValido;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validarFormulario()) return;

        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';

        setTimeout(() => {
            mostrarNotificacion('¡Código enviado! Revisa tu correo institucional.');
            form.reset();
            limpiarErrores();
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Enviar Código de Verificación';

            setTimeout(() => {
                window.location.href = '/inicioSesion/login.html';
            }, 1500);
        }, 1000);
    });
});