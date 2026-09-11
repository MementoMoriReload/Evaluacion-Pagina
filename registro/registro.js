const btnregistro = document.getElementById('btn-registro');

function toggleEdificio(headerElement) {
    const contenido = headerElement.nextElementSibling;
    contenido.style.display = (contenido.style.display === "none") ? "block" : "none";
}

const datosEdificios = {
    "ED001": [
        { nombre: "Juan Pérez", estado: "Dentro", hora: "08:30 AM" },
        { nombre: "María Gómez", estado: "Fuera", hora: "12:15 PM" },
        { nombre: "Carlos Silva", estado: "Dentro", hora: "09:05 AM" }
    ],
    "ED002": [
        { nombre: "Ana Torres", estado: "Dentro", hora: "10:00" },
        { nombre: "Pedro Morales", estado: "Fuera", hora: "11:40" }
    ],
    "ED003": [
        { nombre: "Fernandito Silva", estado: "Dentro", hora: "10:00 AM" },
        { nombre: "Anthony Miles", estado: "Fuera", hora: "11:40 AM" }
    ],
    "ED004": [
        { nombre: "Hernan Hernan", estado: "Dentro", hora: "1:00 PM" },
        { nombre: "Pancho Floo", estado: "Fuera", hora: "13:50 PM" }
    ]
};

btnregistro.addEventListener('click', function () {
    const idEdificio = document.getElementById('selectEdificio').value;
    const nombreInput = document.getElementById('nombre').value.trim();
    const errorNombre = document.getElementById('errorNombre');

    if (nombreInput == '') {
        errorNombre.textContent = 'Tienes que agregar un nombre';
        return
    }

    const radioSeleccionado = document.querySelector('input[name="tipo_registro"]:checked');
    const nuevoEstado = radioSeleccionado.value;

    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const tbody = document.getElementById(`tbody-${idEdificio}`);

    const filaVacia = tbody.querySelector('.fila-vacia');
    if (filaVacia) {
        tbody.removeChild(filaVacia);
    }

    let filaPersona = Array.from(tbody.querySelectorAll('tr')).find(tr =>
        tr.getAttribute('data-nombre') === nombreInput.toLowerCase()
    );

    if (filaPersona) {
        const tdEstado = filaPersona.children[1].querySelector('strong');
        tdEstado.className = `status ${nuevoEstado === 'Dentro' ? 'dentro' : 'fuera'}`;
        tdEstado.textContent = nuevoEstado;

        filaPersona.children[2].textContent = horaFormateada;

    } else {
        const tr = document.createElement('tr');
        tr.setAttribute('data-nombre', nombreInput.toLowerCase());

        const tdNombre = document.createElement('td');
        tdNombre.textContent = nombreInput;

        const tdEstado = document.createElement('td');
        const strongEstado = document.createElement('strong');
        strongEstado.className = `status ${nuevoEstado === 'Dentro' ? 'dentro' : 'fuera'}`;
        strongEstado.textContent = nuevoEstado;
        tdEstado.appendChild(strongEstado);

        const tdHora = document.createElement('td');
        tdHora.textContent = horaFormateada;

        tr.appendChild(tdNombre);
        tr.appendChild(tdEstado);
        tr.appendChild(tdHora);

        tbody.appendChild(tr);
    }

    document.getElementById('inputNombre').value = '';
    actualizarContador(idEdificio);
})

function actualizarContador(idEdificio) {
    const tbody = document.getElementById(`tbody-${idEdificio}`);
    const estadosDentro = Array.from(tbody.querySelectorAll('.status.dentro'));
    const badge = document.getElementById(`contador-${idEdificio}`);

    badge.textContent = `${estadosDentro.length} dentro`;
}