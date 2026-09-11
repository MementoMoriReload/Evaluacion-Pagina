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

btnregistro.addEventListener('click', function() {
    const idEdificio = document.getElementById('selectEdificio').value;
    const nombreInput = document.getElementById('nombre').value.trim();

    if (nombreInput === ' ') {
        errorNombre.textContent = 'Tienes que agregar un nombre';
    }
    const radioSeleccionado = document.querySelector('input[name="tipoMovimiento"]:checked');

})