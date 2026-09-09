/* ==========================================================================
   ESTADO Y PERSISTENCIA - ACCESOSEGURO CONTROL DE ASISTENCIA
   ========================================================================== */

const REGIONES_COMUNAS = [
    { region: "Región Metropolitana de Santiago", comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto"] },
    { region: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Concón"] }
];

const INITIAL_PRODUCTS = [
    { codigo: "EQ001", nombre: "Torniquete Biométrico Doble T-100", precio: 1250000, stock: 8, stockCritico: 2, categoria: "Torniquetes y Barreras", descripcion: "Torniquete de paso corporal con validación de huella digital y código QR.", imagen: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=500&q=80" },
    { codigo: "EQ002", nombre: "Lector Facial Dinámico Face Pass", precio: 450000, stock: 3, stockCritico: 5, categoria: "Control Biométrico", descripcion: "Terminal de reconocimiento facial sin contacto con medición térmica.", imagen: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=500&q=80" },
    { codigo: "EQ003", nombre: "Licencia Software Asistencia Cloud 100", precio: 180000, stock: 50, stockCritico: 10, categoria: "Software y Licencias", descripcion: "Suscripción anual para gestión de asistencia centralizada en tiempo real.", imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80" }
];

const INITIAL_USERS = [
    { run: "19011022K", nombre: "Administrador", apellidos: "General", correo: "admin@duoc.cl", rol: "Administrador", region: "Región Metropolitana de Santiago", comuna: "Providencia", direccion: "Av. Providencia 1234" },
    { run: "156667778", nombre: "Juan", apellidos: "Pérez (Guardia)", correo: "guardia@duoc.cl", rol: "Cliente", region: "Región Metropolitana de Santiago", comuna: "Santiago", direccion: "Alameda 50" }
];

const INITIAL_ATTENDANCE_LOGS = [
    { fechaHora: "2026-03-08 08:15", edificio: "Torre Central (ED001)", run: "19011022K", tipo: "REG001 - Ingreso", estado: "Confirmado" },
    { fechaHora: "2026-03-08 08:30", edificio: "Edificio Los Condes (ED002)", run: "156667778", tipo: "REG001 - Ingreso", estado: "Confirmado" }
];

function initLocalStorage() {
    if (!localStorage.getItem("products")) localStorage.setItem("products", JSON.stringify(INITIAL_PRODUCTS));
    if (!localStorage.getItem("users")) localStorage.setItem("users", JSON.stringify(INITIAL_USERS));
    if (!localStorage.getItem("cart")) localStorage.setItem("cart", JSON.stringify([]));
    if (!localStorage.getItem("attendanceLogs")) localStorage.setItem("attendanceLogs", JSON.stringify(INITIAL_ATTENDANCE_LOGS));
    if (!localStorage.getItem("currentUserRole")) localStorage.setItem("currentUserRole", "Administrador");
}

/* ==========================================================================
   NAVEGACIÓN SPA Y NAVEGABILIDAD
   ========================================================================== */

function navigateTo(viewId) {
    document.querySelectorAll('.view-page').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }

    if (viewId === 'view-home') renderHomeProducts();
    if (viewId === 'view-productos') renderCatalogProducts();
    if (viewId === 'view-carrito') renderCart();
    if (viewId === 'view-admin') {
        applyRoleRestrictions();
        renderAdminTables();
    }
}

/* ==========================================================================
   VALIDACIONES EXACTAS DE REQUERIMIENTO
   ========================================================================== */

function isValidRUN(run) {
    const cleanRUN = run.trim().toUpperCase();
    const runRegex = /^[0-9]{6,8}[0-9K]$/;
    return runRegex.test(cleanRUN) && cleanRUN.length >= 7 && cleanRUN.length <= 9;
}

function isValidEmailDomain(email) {
    const lower = email.trim().toLowerCase();
    return lower.endsWith('@duoc.cl') || lower.endsWith('@profesor.duoc.cl') || lower.endsWith('@gmail.com');
}

function updateComunasDropdown(regionSelectId, comunaSelectId) {
    const regVal = document.getElementById(regionSelectId).value;
    const comSelect = document.getElementById(comunaSelectId);
    comSelect.innerHTML = '<option value="">-- Seleccione Comuna --</option>';

    if (!regVal) { comSelect.disabled = true; return; }

    const regData = REGIONES_COMUNAS.find(r => r.region === regVal);
    if (regData) {
        regData.comunas.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c; opt.textContent = c;
            comSelect.appendChild(opt);
        });
        comSelect.disabled = false;
    }
}

function populateRegionsDropdowns() {
    ['reg-region', 'usr-region'].forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            select.innerHTML = '<option value="">-- Seleccione Región --</option>';
            REGIONES_COMUNAS.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r.region; opt.textContent = r.region;
                select.appendChild(opt);
            });
        }
    });
}

/* ==========================================================================
   REGISTRO DIGITAL DE ASISTENCIA Y ACCESOS (CASO ACCESOSEGURO)
   ========================================================================== */

function handleAttendanceSubmit(e) {
    e.preventDefault();
    const errDiv = document.getElementById('marc-error-msg');
    errDiv.style.display = 'none';

    const edificio = document.getElementById('marc-edificio').value;
    const run = document.getElementById('marc-run').value.trim();
    const tipo = document.getElementById('marc-tipo').value;

    if (!isValidRUN(run)) {
        showError(errDiv, 'El RUN ingresado no cumple con el formato requerido (7-9 caracteres sin puntos ni guión).');
        return;
    }

    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    logs.unshift({
        fechaHora: now,
        edificio: edificio,
        run: run.toUpperCase(),
        tipo: tipo,
        estado: "Confirmado"
    });

    localStorage.setItem('attendanceLogs', JSON.stringify(logs));
    alert('¡Marca de asistencia/acceso registrada con éxito!');
    e.target.reset();
}

/* ==========================================================================
   CARRITO / SOLICITUD DE EQUIPAMIENTO
   ========================================================================== */

function getCart() { return JSON.parse(localStorage.getItem('cart')) || []; }

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    const totalCount = cart.reduce((sum, item) => sum + item.cantidad, 0);
    document.getElementById('cart-count').textContent = totalCount;
}

function addToCartByCode(code, qty = 1) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const prod = products.find(p => p.codigo === code);
    if (!prod) return;

    let cart = getCart();
    const idx = cart.findIndex(i => i.codigo === code);
    if (idx > -1) {
        cart[idx].cantidad += qty;
    } else {
        cart.push({ codigo: prod.codigo, nombre: prod.nombre, precio: prod.precio, imagen: prod.imagen, cantidad: qty });
    }
    saveCart(cart);
    alert(`"${prod.nombre}" añadido al requerimiento.`);
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>No hay artículos seleccionados en la solicitud.</p>';
        document.getElementById('cart-total-amount').textContent = '$0';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div style="flex:1;">
                <h4>${item.nombre}</h4>
                <p>Precio: $${item.precio.toLocaleString('es-CL')}</p>
            </div>
            <div>
                <span>Cant: ${item.cantidad}</span>
            </div>
            <div><strong>$${subtotal.toLocaleString('es-CL')}</strong></div>
            <button class="btn btn-danger btn-sm" onclick="removeCartItem(${index})"><i class="bi bi-trash"></i></button>
        `;
        container.appendChild(row);
    });

    document.getElementById('cart-total-amount').textContent = `$${total.toLocaleString('es-CL')}`;
}

function removeCartItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

function applyCoupon() {
    const code = document.getElementById('coupon-code').value.trim();
    const msg = document.getElementById('coupon-message');
    if (code.toUpperCase() === 'DUOC2026') {
        msg.style.color = 'green';
        msg.textContent = '¡Convenio Duoc UC validado correctamente!';
    } else {
        msg.style.color = 'red';
        msg.textContent = 'Código de convenio no reconocido.';
    }
}

function checkoutProcess() {
    if (getCart().length === 0) return alert('El carrito está vacío.');
    alert('¡Solicitud de equipamiento enviada al Departamento de Operaciones!');
    saveCart([]);
    renderCart();
}

/* ==========================================================================
   RENDERIZADO DE CATÁLOGOS Y DETALLES
   ========================================================================== */

function renderHomeProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const container = document.getElementById('home-featured-products');
    container.innerHTML = '';
    products.slice(0, 3).forEach(p => container.appendChild(createProductCardHTML(p)));
}

function renderCatalogProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const container = document.getElementById('catalog-products-grid');
    container.innerHTML = '';
    products.forEach(p => container.appendChild(createProductCardHTML(p)));
}

function createProductCardHTML(prod) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <h4>${prod.nombre}</h4>
        <div class="price">$${prod.precio.toLocaleString('es-CL')}</div>
        <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-block" onclick="viewProductDetail('${prod.codigo}')">Detalles</button>
            <button class="btn btn-primary btn-block" onclick="addToCartByCode('${prod.codigo}')">Añadir</button>
        </div>
    `;
    return card;
}

let selectedProductForDetail = null;
function viewProductDetail(code) {
    const products = JSON.parse(localStorage.getItem('products'));
    selectedProductForDetail = products.find(p => p.codigo === code);
    if (!selectedProductForDetail) return;

    document.getElementById('detail-product-category').textContent = selectedProductForDetail.categoria;
    document.getElementById('detail-title').textContent = selectedProductForDetail.nombre;
    document.getElementById('detail-price').textContent = `$${selectedProductForDetail.precio.toLocaleString('es-CL')}`;
    document.getElementById('detail-description').textContent = selectedProductForDetail.descripcion;
    document.getElementById('detail-main-img').src = selectedProductForDetail.imagen;
    document.getElementById('thumb1').src = selectedProductForDetail.imagen;

    navigateTo('view-detalle-producto');
}

function changeDetailImage(src) { document.getElementById('detail-main-img').src = src; }

function addCurrentDetailToCart() {
    const qty = parseInt(document.getElementById('detail-qty').value) || 1;
    if (selectedProductForDetail) addToCartByCode(selectedProductForDetail.codigo, qty);
}

/* ==========================================================================
   FORMULARIOS CLIENTE/USUARIO
   ========================================================================== */

function handleUserRegister(e) {
    e.preventDefault();
    const err = document.getElementById('reg-error-msg');
    err.style.display = 'none';

    const correo = document.getElementById('reg-correo').value.trim();
    const correoConf = document.getElementById('reg-correo-confirm').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const passConf = document.getElementById('reg-pass-confirm').value;

    if (correo !== correoConf) return showError(err, 'Los correos no coinciden.');
    if (pass !== passConf) return showError(err, 'Las contraseñas no coinciden.');
    if (!isValidEmailDomain(correo)) return showError(err, 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.');

    alert('¡Registro de colaborador completado exitosamente!');
    navigateTo('view-login');
}

function handleLogin(e) {
    e.preventDefault();
    const correo = document.getElementById('login-correo').value.trim();
    const err = document.getElementById('login-error-msg');
    err.style.display = 'none';

    if (!isValidEmailDomain(correo)) return showError(err, 'Dominio no permitido.');

    localStorage.setItem('currentUserRole', 'Administrador');
    alert('Sesión iniciada correctamente.');
    navigateTo('view-admin');
}

function handleContactSubmit(e) {
    e.preventDefault();
    alert('Mensaje enviado al área de Soporte Tecnológico.');
    e.target.reset();
}

function showError(el, msg) { el.textContent = msg; el.style.display = 'block'; }

/* ==========================================================================
   ADMINISTRACIÓN Y CONTROL DE ROLES
   ========================================================================== */

function applyRoleRestrictions() {
    const role = localStorage.getItem('currentUserRole') || 'Administrador';
    document.getElementById('user-role-label').textContent = role;
    document.getElementById('admin-welcome-title').textContent = `Panel Operativo AccesoSeguro - ${role}`;

    const itemProductos = document.getElementById('menu-item-productos');
    const itemUsuarios = document.getElementById('menu-item-usuarios');
    const itemAsistencia = document.getElementById('menu-item-asistencia');

    if (role === 'Vendedor') { // Supervisor de Control
        itemProductos.style.display = 'flex';
        itemAsistencia.style.display = 'flex';
        itemUsuarios.style.display = 'none';
    } else if (role === 'Cliente') { // Empleado / Guardia
        alert('Los accesos a la configuración del panel están restringidos.');
        navigateTo('view-home');
    } else {
        itemProductos.style.display = 'flex';
        itemUsuarios.style.display = 'flex';
        itemAsistencia.style.display = 'flex';
    }
}

function changeSimulatedRole(newRole) {
    localStorage.setItem('currentUserRole', newRole);
    applyRoleRestrictions();
}

function switchAdminSubView(id) {
    document.querySelectorAll('.admin-subview').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    document.querySelectorAll('.sidebar-menu li').forEach(m => m.classList.remove('active'));
}

function renderAdminTables() {
    // Render Tabla Asistencia
    const logs = JSON.parse(localStorage.getItem('attendanceLogs')) || [];
    const aTbody = document.getElementById('admin-attendance-tbody');
    aTbody.innerHTML = '';
    logs.forEach(l => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${l.fechaHora}</td><td>${l.edificio}</td><td>${l.run}</td><td>${l.tipo}</td><td><span class="btn btn-success btn-sm">${l.estado}</span></td>`;
        aTbody.appendChild(tr);
    });

    // Render Tabla Productos
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const pTbody = document.getElementById('admin-products-tbody');
    pTbody.innerHTML = '';
    products.forEach((p, idx) => {
        const isCritical = p.stock <= p.stockCritico;
        const tr = document.createElement('tr');
        if (isCritical) tr.className = 'stock-critical-alert';
        tr.innerHTML = `
            <td>${p.codigo}</td>
            <td>${p.nombre}</td>
            <td>$${p.precio.toLocaleString('es-CL')}</td>
            <td>${p.stock} ${isCritical ? '⚠️' : ''}</td>
            <td>${p.stockCritico}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editProduct(${idx})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${idx})"><i class="bi bi-trash"></i></button>
            </td>
        `;
        pTbody.appendChild(tr);
    });

    // Render Tabla Usuarios
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const uTbody = document.getElementById('admin-users-tbody');
    uTbody.innerHTML = '';
    users.forEach((u, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${u.run}</td>
            <td>${u.nombre} ${u.apellidos}</td>
            <td>${u.correo}</td>
            <td>${u.rol}</td>
            <td>${u.region} / ${u.comuna}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editUser(${idx})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${idx})"><i class="bi bi-trash"></i></button>
            </td>
        `;
        uTbody.appendChild(tr);
    });
}

// Mantenedor Productos CRUD
function openProductForm() {
    document.getElementById('form-admin-producto').reset();
    document.getElementById('prod-edit-index').value = "-1";
    switchAdminSubView('admin-producto-form-view');
}

function handleProductSubmit(e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById('prod-edit-index').value);
    const products = JSON.parse(localStorage.getItem('products')) || [];

    const newProd = {
        codigo: document.getElementById('prod-codigo').value.trim(),
        nombre: document.getElementById('prod-nombre').value.trim(),
        precio: parseFloat(document.getElementById('prod-precio').value),
        stock: parseInt(document.getElementById('prod-stock').value),
        stockCritico: parseInt(document.getElementById('prod-stock-critico').value),
        categoria: document.getElementById('prod-categoria').value,
        descripcion: "Equipamiento de alta seguridad.",
        imagen: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=500&q=80"
    };

    if (idx === -1) products.push(newProd);
    else products[idx] = newProd;

    localStorage.setItem('products', JSON.stringify(products));
    renderAdminTables();
    switchAdminSubView('admin-productos-list');
}

function editProduct(idx) {
    const p = JSON.parse(localStorage.getItem('products'))[idx];
    document.getElementById('prod-edit-index').value = idx;
    document.getElementById('prod-codigo').value = p.codigo;
    document.getElementById('prod-nombre').value = p.nombre;
    document.getElementById('prod-precio').value = p.precio;
    document.getElementById('prod-stock').value = p.stock;
    document.getElementById('prod-stock-critico').value = p.stockCritico;
    document.getElementById('prod-categoria').value = p.categoria;
    switchAdminSubView('admin-producto-form-view');
}

function deleteProduct(idx) {
    if (confirm('¿Eliminar este equipo del inventario?')) {
        const products = JSON.parse(localStorage.getItem('products'));
        products.splice(idx, 1);
        localStorage.setItem('products', JSON.stringify(products));
        renderAdminTables();
    }
}

// Mantenedor Usuarios CRUD
function openUserForm() {
    document.getElementById('form-admin-usuario').reset();
    document.getElementById('user-edit-index').value = "-1";
    switchAdminSubView('admin-usuario-form-view');
}

function handleAdminUserSubmit(e) {
    e.preventDefault();
    const err = document.getElementById('usr-error-msg');
    err.style.display = 'none';

    const run = document.getElementById('usr-run').value.trim();
    const correo = document.getElementById('usr-correo').value.trim();

    if (!isValidRUN(run)) return showError(err, 'RUN inválido (ej: 19011022K).');
    if (!isValidEmailDomain(correo)) return showError(err, 'Correo con dominio no permitido.');

    const idx = parseInt(document.getElementById('user-edit-index').value);
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const newUser = {
        run: run.toUpperCase(),
        nombre: document.getElementById('usr-nombre').value.trim(),
        apellidos: document.getElementById('usr-apellidos').value.trim(),
        correo: correo,
        rol: document.getElementById('usr-rol').value,
        region: document.getElementById('usr-region').value,
        comuna: document.getElementById('usr-comuna').value,
        direccion: document.getElementById('usr-direccion').value.trim()
    };

    if (idx === -1) users.push(newUser);
    else users[idx] = newUser;

    localStorage.setItem('users', JSON.stringify(users));
    renderAdminTables();
    switchAdminSubView('admin-usuarios-list');
}

function editUser(idx) {
    const u = JSON.parse(localStorage.getItem('users'))[idx];
    document.getElementById('user-edit-index').value = idx;
    document.getElementById('usr-run').value = u.run;
    document.getElementById('usr-nombre').value = u.nombre;
    document.getElementById('usr-apellidos').value = u.apellidos;
    document.getElementById('usr-correo').value = u.correo;
    document.getElementById('usr-rol').value = u.rol;
    document.getElementById('usr-region').value = u.region;
    updateComunasDropdown('usr-region', 'usr-comuna');
    document.getElementById('usr-comuna').value = u.comuna;
    document.getElementById('usr-direccion').value = u.direccion;
    switchAdminSubView('admin-usuario-form-view');
}

function deleteUser(idx) {
    if (confirm('¿Eliminar usuario del sistema?')) {
        const users = JSON.parse(localStorage.getItem('users'));
        users.splice(idx, 1);
        localStorage.setItem('users', JSON.stringify(users));
        renderAdminTables();
    }
}

function logout() {
    alert('Sesión finalizada.');
    navigateTo('view-home');
}

document.addEventListener('DOMContentLoaded', () => {
    initLocalStorage();
    populateRegionsDropdowns();
    const cart = getCart();
    document.getElementById('cart-count').textContent = cart.reduce((s, i) => s + i.cantidad, 0);

    const commentInput = document.getElementById('contact-comentario');
    if (commentInput) {
        commentInput.addEventListener('input', (e) => {
            document.getElementById('char-count').textContent = e.target.value.length;
        });
    }

    navigateTo('view-home');
});