document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegistro');
    const contenedorLista = document.getElementById('listUsuarios');
    const btnEnviar = form.querySelector('.btn-enviar');
    const msjNotificacion = document.getElementById('msjNotificacion');

    let usuarios = [];
    let indiceEdicion = null;

    function mostrarNotificacion(texto, tipo = 'exito') {
        if (!msjNotificacion) return;

        msjNotificacion.textContent = texto;
        msjNotificacion.className = tipo === 'eliminar' ? 'msj-eliminar' : 'msj-exito';
        msjNotificacion.style.display = 'block';

        setTimeout(() => {
            msjNotificacion.style.display = 'none';
        }, 3000);
    }

    function limpiarErrores() {
        document.getElementById('error-tipoUsuario').textContent = '';
        document.getElementById('error-run').textContent = '';
        document.getElementById('error-nombre').textContent = '';
        document.getElementById('error-apellido').textContent = '';
        document.getElementById('error-fechaNac').textContent = '';
        document.getElementById('error-telefono').textContent = '';
        document.getElementById('error-email').textContent = '';
    }

    function validarFormulario() {
        limpiarErrores();
        let esValido = true;

        const tipoUsuario = document.getElementById('tipoUsuario').value;
        const run = document.getElementById('run').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const fechaNac = document.getElementById('fechaNac').value;
        const telefono = document.getElementById('telefono').value.trim();
        const email = document.getElementById('email').value.trim();

        if (tipoUsuario === '') {
            document.getElementById('error-tipoUsuario').textContent = 'Debe seleccionar un tipo de usuario.';
            esValido = false;
        }

        if (run === '') {
            document.getElementById('error-run').textContent = 'El RUT es obligatorio.';
            esValido = false;
        } else if (run.length !== 9) {
            document.getElementById('error-run').textContent = 'El RUT debe tener solo 9 números.';
            esValido = false;
        }

        if (nombre === '') {
            document.getElementById('error-nombre').textContent = 'El nombre es obligatorio.';
            esValido = false;
        }

        if (apellido === '') {
            document.getElementById('error-apellido').textContent = 'El apellido es obligatorio.';
            esValido = false;
        }

        if (fechaNac === '') {
            document.getElementById('error-fechaNac').textContent = 'La fecha es obligatoria.';
            esValido = false;
        }

        if (telefono === '') {
            document.getElementById('error-telefono').textContent = 'El teléfono es obligatorio.';
            esValido = false;
        } else if (isNaN(telefono)) {
            document.getElementById('error-telefono').textContent = 'Ingrese solo números.';
            esValido = false;
        } else if (telefono.length !== 8) {
            document.getElementById('error-telefono').textContent = 'Debe tener 8 dígitos.';
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

        const usuario = {
            tipoUsuario: document.getElementById('tipoUsuario').value,
            run: document.getElementById('run').value.trim(),
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            fechaNac: document.getElementById('fechaNac').value,
            telefono: document.getElementById('telefono').value.trim(),
            email: document.getElementById('email').value.trim()
        };

        if (indiceEdicion === null) {
            usuarios.push(usuario);
            mostrarNotificacion('¡Usuario registrado con éxito!', 'exito');
        } else {
            usuarios[indiceEdicion] = usuario;
            indiceEdicion = null;
            btnEnviar.textContent = 'Crear Cuenta';
            mostrarNotificacion('¡Usuario editado con éxito!', 'exito');
        }

        form.reset();
        limpiarErrores();
        renderizarUsuarios();
    });

    function renderizarUsuarios() {
        contenedorLista.innerHTML = '';

        if (usuarios.length === 0) {
            contenedorLista.innerHTML = '<p class="sin-registros">No hay usuarios registrados.</p>';
            return;
        }

        usuarios.forEach((user, index) => {
            const tarjetaItem = document.createElement('div');
            tarjetaItem.className = 'item-usuarios';

            tarjetaItem.innerHTML = `
                <div class="info-usuario">
                    <h4>${user.nombre} ${user.apellido}</h4>
                    <p><strong>Tipo:</strong> ${user.tipoUsuario}</p>
                    <p><strong>RUT:</strong> ${user.run}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Teléfono:</strong> +569 ${user.telefono}</p>
                    <p><strong>F. Nacimiento:</strong> ${user.fechaNac}</p>
                </div>
                <div class="acciones-usuario">
                    <button type="button" class="btn-editar" onclick="editarUsuario(${index})">Editar</button>
                    <button type="button" class="btn-eliminar" onclick="eliminarUsuario(${index})">Eliminar</button>
                </div>
            `;

            contenedorLista.appendChild(tarjetaItem);
        });
    }

    window.editarUsuario = function(index) {
        limpiarErrores();
        const u = usuarios[index];
        document.getElementById('tipoUsuario').value = u.tipoUsuario;
        document.getElementById('run').value = u.run;
        document.getElementById('nombre').value = u.nombre;
        document.getElementById('apellido').value = u.apellido;
        document.getElementById('fechaNac').value = u.fechaNac;
        document.getElementById('telefono').value = u.telefono;
        document.getElementById('email').value = u.email;

        indiceEdicion = index;
        btnEnviar.textContent = 'Guardar Cambios';
    };

    window.eliminarUsuario = function(index) {
        usuarios.splice(index, 1);

        if (indiceEdicion === index) {
            form.reset();
            limpiarErrores();
            indiceEdicion = null;
            btnEnviar.textContent = 'Crear Cuenta';
        }

        renderizarUsuarios();
        mostrarNotificacion('¡Usuario eliminado con éxito!', 'eliminar');
    };
});