const btnregistro = document.getElementById('btn-registro');

function toggleEdificio(headerElement) {
    const contenido = headerElement.nextElementSibling;
    contenido.style.display = (contenido.style.display === "none") ? "block" : "none";
}

const datosEdificios = {
    "ED001": [
        { nombre: "Juan Pérez", rut: "2231624", estado: "Dentro", hora: "08:30" },
        { nombre: "María Gómez", rut: "7196767", estado: "Fuera", hora: "12:15" },
        { nombre: "Carlos Silva", rut: "267824045", estado: "Dentro", hora: "09:05" }
    ],
    "ED002": [
        { nombre: "Ana Torres", rut: "1725204", estado: "Dentro", hora: "10:00" },
        { nombre: "Pedro Morales", rut: "1765202", estado: "Fuera", hora: "11:40" }
    ],
    "ED003": [
        { nombre: "Fernandito Silva", rut: "21030202", estado: "Dentro", hora: "10:00" },
        { nombre: "Anthony Miles", rut: "22030202", estado: "Fuera", hora: "11:40" }
    ],
    "ED004": [
        { nombre: "Hernan Hernan", rut: "28165492", estado: "Dentro", hora: "13:00" },
        { nombre: "Pancho Floo", rut: "21620202", estado: "Fuera", hora: "13:50" }
    ]
};

function cargarDatosIniciales() {
    for (const idEdificio in datosEdificios) {
        const listaPersonas = datosEdificios[idEdificio];
        const tbody = document.getElementById(`tbody-${idEdificio}`);
        if (!tbody) continue;

        if (listaPersonas.length > 0) {
            tbody.innerHTML = '';
        }

        listaPersonas.forEach(p => {
            const tr = document.createElement('tr');
            tr.setAttribute('nombre', p.nombre.toLowerCase());

            const tdNombre = document.createElement('td');
            tdNombre.textContent = p.nombre;

            const tdRut = document.createElement('td');
            tdRut.textContent = p.rut;

            const tdEstado = document.createElement('td');
            const strongEstado = document.createElement('strong');
            const esDentro = p.estado === 'Dentro';
            strongEstado.className = `status ${esDentro ? 'dentro' : 'fuera'}`;
            strongEstado.textContent = p.estado;
            tdEstado.appendChild(strongEstado);

            const tdHora = document.createElement('td');
            tdHora.textContent = p.hora;

            tr.appendChild(tdNombre);
            tr.appendChild(tdRut);
            tr.appendChild(tdEstado);
            tr.appendChild(tdHora);

            tbody.appendChild(tr);
        });

        actualizarContador(idEdificio);
    }
}

btnregistro.addEventListener('click', function () {
    const idEdificio = document.getElementById('selectEdificio').value;
    const inputNombre = document.getElementById('nombre');
    const inputRut = document.getElementById('rut');
    const nombreInput = inputNombre.value.trim();
    const rutInput = inputRut.value.trim();
    const errorNombre = document.getElementById('errorNombre');
    const errorRUT = document.getElementById('errorRUT');
    const errorEdificio = document.getElementById('errorEdificio');

    let esValido = true;

    if (nombreInput === '') {
        document.getElementById('errorNombre').textContent = 'Tienes que agregar un nombre.';
        esValido = false;
    } else {
        errorNombre.textContent = '';
    }


    if (rutInput === '') {
        document.getElementById('errorRUT').textContent = 'Tienes que agregar un RUT.';
        esValido = false;
    } else if (rutInput.length !== 9) {
        document.getElementById('errorRUT').textContent = 'El RUT debe tener 9 digitos.';
        esValido = false;
    } else {
        errorRUT.textContent = '';
    }


    if (idEdificio === '') {
        document.getElementById('errorEdificio').textContent = 'Tienes que escoger un edificio';
        esValido = false;
    } else {
        errorEdificio.textContent = '';

    }

    const radioSeleccionado = document.querySelector('input[name="tipo_registro"]:checked');
    if (!radioSeleccionado) {
        alert('Por favor, selecciona un tipo de movimiento.');
        return;
    }

    if (!esValido) {
        return;
    }

    const valorRadio = radioSeleccionado.value;
    const esEntrada = ['Entrada', 'Adentro', 'Dentro'].includes(valorRadio);
    const nuevoEstado = esEntrada ? 'Dentro' : 'Fuera';

    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const tbody = document.getElementById(`tbody-${idEdificio}`);
    if (!tbody) return;

    const filaVacia = tbody.querySelector('.fila-vacia');
    if (filaVacia) {
        tbody.removeChild(filaVacia);
    }

    let filaPersona = tbody.querySelector(`tr[nombre="${nombreInput.toLowerCase()}"]`);

    if (filaPersona) {
        filaPersona.cells[1].textContent = rutInput;

        const tdEstado = filaPersona.cells[2].querySelector('strong');
        if (tdEstado) {
            tdEstado.className = `status ${esEntrada ? 'dentro' : 'fuera'}`;
            tdEstado.textContent = nuevoEstado;
        }

        filaPersona.cells[3].textContent = horaFormateada;
    } else {
        const tr = document.createElement('tr');
        tr.setAttribute('nombre', nombreInput.toLowerCase());

        const tdNombre = document.createElement('td');
        tdNombre.textContent = nombreInput;

        const tdRut = document.createElement('td');
        tdRut.textContent = rutInput;

        const tdEstado = document.createElement('td');
        const strongEstado = document.createElement('strong');
        strongEstado.className = `status ${esEntrada ? 'dentro' : 'fuera'}`;
        strongEstado.textContent = nuevoEstado;
        tdEstado.appendChild(strongEstado);

        const tdHora = document.createElement('td');
        tdHora.textContent = horaFormateada;

        tr.appendChild(tdNombre);
        tr.appendChild(tdRut);
        tr.appendChild(tdEstado);
        tr.appendChild(tdHora);

        tbody.appendChild(tr);
    }

    inputNombre.value = '';
    inputRut.value = '';
    actualizarContador(idEdificio);
});

function actualizarContador(idEdificio) {
    const tbody = document.getElementById(`tbody-${idEdificio}`);
    if (!tbody) return;

    const estadosDentro = Array.from(tbody.querySelectorAll('.status.dentro'));
    const badge = document.getElementById(`contador-${idEdificio}`);

    if (badge) {
        badge.textContent = `${estadosDentro.length} dentro`;
    }
}

cargarDatosIniciales();