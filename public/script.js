// Configuración de la API
const API_BASE_URL = window.location.origin + '/api';

// Estado global de la aplicación
let currentEditingProduct = null;
let products = [];
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Elementos del DOM
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');

const productForm = document.getElementById('productForm');
const productsList = document.getElementById('productsList');
const loadingProducts = document.getElementById('loadingProducts');
const noProducts = document.getElementById('noProducts');
const refreshProductsBtn = document.getElementById('refreshProducts');
const cancelEditBtn = document.getElementById('cancelEdit');
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const deleteProductName = document.getElementById('deleteProductName');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkAuthStatus();
});

// Verificar estado de autenticación
function checkAuthStatus() {
    if (authToken && currentUser) {
        showMainContent();
        loadProducts();
    } else {
        showLoginSection();
    }
}

// Mostrar sección de login
function showLoginSection() {
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
    mainContent.style.display = 'none';
}

// Mostrar sección de registro
function showRegisterSection() {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    mainContent.style.display = 'none';
}

// Mostrar contenido principal
function showMainContent() {
    loginSection.style.display = 'none';
    registerSection.style.display = 'none';
    mainContent.style.display = 'block';
    
    // Actualizar información del usuario
    if (currentUser) {
        userName.textContent = currentUser.name;
        userEmail.textContent = currentUser.email;
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Formularios de autenticación
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Botones de cambio de vista
    showRegisterBtn.addEventListener('click', showRegisterSection);
    showLoginBtn.addEventListener('click', showLoginSection);
    
    // Botón de logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Formulario de productos
    productForm.addEventListener('submit', handleProductSubmit);
    
    // Botón de cancelar edición
    cancelEditBtn.addEventListener('click', cancelEdit);
    
    // Botón de actualizar productos
    refreshProductsBtn.addEventListener('click', loadProducts);
    
    // Modal de eliminación
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    
    // Cerrar modal al hacer clic fuera
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    // Event delegation para botones de productos
    productsList.addEventListener('click', handleProductActions);
}

// Función para manejar login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Guardar token y datos del usuario
            authToken = data.token;
            currentUser = data.user;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showNotification('Inicio de sesión exitoso', 'success');
            showMainContent();
            loadProducts();
        } else {
            // Manejar errores específicos
            if (response.status === 429) {
                throw new Error('Demasiados intentos de inicio de sesión. Por favor, espera 1 hora antes de intentar nuevamente.');
            } else if (response.status === 401) {
                throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
            } else if (response.status === 400) {
                throw new Error(data.error || data.message || 'Datos de entrada inválidos.');
            } else if (response.status === 404) {
                throw new Error('Usuario no encontrado. Verifica tu email o regístrate.');
            } else {
                throw new Error(data.error || data.message || 'Error en el inicio de sesión');
            }
        }
    } catch (error) {
        // Si es un error de red (no respuesta del servidor)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showNotification('Error de conexión. Verifica que el servidor esté ejecutándose.', 'error');
        } else {
            showNotification('Error en el inicio de sesión: ' + error.message, 'error');
        }
    }
}

// Función para manejar registro
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(registerForm);
    const registerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    // Validación básica de contraseña
    if (!registerData.password || registerData.password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Usuario registrado correctamente. Inicia sesión para continuar.', 'success');
            showLoginSection();
            registerForm.reset();
        } else {
            // Manejar errores específicos
            if (response.status === 429) {
                throw new Error('Demasiados intentos de registro. Por favor, espera 1 hora antes de intentar nuevamente.');
            } else if (response.status === 400) {
                throw new Error(data.error || data.message || 'Datos de entrada inválidos. Verifica que todos los campos estén completos.');
            } else if (response.status === 409) {
                throw new Error('El email ya está registrado. Usa otro email o inicia sesión.');
            } else {
                throw new Error(data.error || data.message || 'Error en el registro');
            }
        }
    } catch (error) {
        // Si es un error de red (no respuesta del servidor)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showNotification('Error de conexión. Verifica que el servidor esté ejecutándose.', 'error');
        } else {
            showNotification('Error en el registro: ' + error.message, 'error');
        }
    }
}

// Función para manejar logout
function handleLogout() {
    // Limpiar datos de autenticación
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Limpiar formularios
    productForm.reset();
    resetForm();
    
    // Mostrar sección de login
    showLoginSection();
    showNotification('Sesión cerrada correctamente', 'info');
}

// Función para obtener headers con autenticación
function getAuthHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return headers;
}

// Función para manejar acciones de productos usando event delegation
function handleProductActions(e) {
    const target = e.target;
    
    // Buscar el botón más cercano si se hizo clic en un icono
    const button = target.closest('button');
    if (!button) return;
    
    const productCard = button.closest('.product-card');
    if (!productCard) return;
    
    const productId = productCard.dataset.id;
    if (!productId) return;
    
    // Determinar qué acción realizar basado en las clases del botón
    if (button.classList.contains('btn-outline')) {
        // Botón de editar
        editProduct(productId);
    } else if (button.classList.contains('btn-danger')) {
        // Botón de eliminar
        showDeleteModal(productId);
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notifications = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    notifications.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Función para cargar productos
async function loadProducts() {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        
        if (response.ok) {
            // Manejar tanto el formato de desarrollo como el de producción
            products = data.products || data || [];
            renderProducts();
            showNotification('Productos cargados correctamente', 'success');
        } else {
            throw new Error(data.error || 'Error al cargar productos');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Error al cargar productos: ' + error.message, 'error');
        renderProducts(); // Mostrar lista vacía
    } finally {
        showLoading(false);
    }
}

// Función para mostrar/ocultar loading
function showLoading(show) {
    loadingProducts.style.display = show ? 'block' : 'none';
    productsList.style.display = show ? 'none' : 'grid';
    noProducts.style.display = 'none';
}

// Función para renderizar productos
function renderProducts() {
    if (products.length === 0) {
        productsList.style.display = 'none';
        noProducts.style.display = 'block';
        return;
    }
    
    productsList.style.display = 'grid';
    noProducts.style.display = 'none';
    
    productsList.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-header">
                <div>
                    <div class="product-name">${escapeHtml(product.name)}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                </div>
            </div>
            <div class="product-description">${escapeHtml(product.description)}</div>
            <div class="product-stock">
                <i class="fas fa-boxes"></i>
                <span>Stock: ${product.stock}</span>
                <span class="stock-badge ${getStockClass(product.stock)}">
                    ${getStockText(product.stock)}
                </span>
            </div>
            <div class="product-actions">
                <button class="btn btn-outline btn-sm" data-action="edit">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" data-action="delete">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Función para obtener clase CSS del stock
function getStockClass(stock) {
    if (stock > 20) return 'stock-high';
    if (stock > 5) return 'stock-medium';
    return 'stock-low';
}

// Función para obtener texto del stock
function getStockText(stock) {
    if (stock > 20) return 'Alto';
    if (stock > 5) return 'Medio';
    return 'Bajo';
}

// Función para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para manejar el envío del formulario
async function handleProductSubmit(e) {
    e.preventDefault();
    
    // Verificar autenticación
    if (!authToken) {
        showNotification('Debes iniciar sesión para realizar esta acción', 'error');
        return;
    }
    
    const formData = new FormData(productForm);
    const productData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock'))
    };
    
    try {
        if (currentEditingProduct) {
            await updateProduct(currentEditingProduct, productData);
        } else {
            await createProduct(productData);
        }
    } catch (error) {
        console.error('Error handling product:', error);
        showNotification('Error: ' + error.message, 'error');
    }
}

// Función para crear producto
async function createProduct(productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Producto creado correctamente', 'success');
            resetForm();
            loadProducts();
        } else {
            if (response.status === 401) {
                // Token expirado o inválido
                handleLogout();
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }
            throw new Error(data.error || data.message || 'Error al crear producto');
        }
    } catch (error) {
        throw new Error('Error al crear producto: ' + error.message);
    }
}

// Función para actualizar producto
async function updateProduct(productId, productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Producto actualizado correctamente', 'success');
            resetForm();
            loadProducts();
        } else {
            if (response.status === 401) {
                // Token expirado o inválido
                handleLogout();
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }
            throw new Error(data.error || data.message || 'Error al actualizar producto');
        }
    } catch (error) {
        throw new Error('Error al actualizar producto: ' + error.message);
    }
}

// Función para editar producto
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    currentEditingProduct = productId;
    
    // Llenar el formulario con los datos del producto
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    
    // Cambiar el texto del botón
    const submitBtn = productForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Producto';
    
    // Mostrar botón de cancelar
    cancelEditBtn.style.display = 'inline-flex';
    
    // Scroll al formulario
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Función para cancelar edición
function cancelEdit() {
    resetForm();
}

// Función para resetear el formulario
function resetForm() {
    productForm.reset();
    currentEditingProduct = null;
    
    // Restaurar el texto del botón
    const submitBtn = productForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Producto';
    
    // Ocultar botón de cancelar
    cancelEditBtn.style.display = 'none';
}

// Función para mostrar modal de eliminación
function showDeleteModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    deleteProductName.textContent = product.name;
    deleteModal.dataset.productId = productId;
    deleteModal.style.display = 'block';
}

// Función para cerrar modal de eliminación
function closeDeleteModal() {
    deleteModal.style.display = 'none';
    deleteModal.dataset.productId = '';
}

// Función para confirmar eliminación
async function confirmDelete() {
    const productId = deleteModal.dataset.productId;
    if (!productId) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Producto eliminado correctamente', 'success');
            closeDeleteModal();
            loadProducts();
        } else {
            if (response.status === 401) {
                // Token expirado o inválido
                handleLogout();
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }
            throw new Error(data.error || data.message || 'Error al eliminar producto');
        }
    } catch (error) {
        showNotification('Error al eliminar producto: ' + error.message, 'error');
        closeDeleteModal();
    }
}

// Función para obtener un producto específico (no usado en la UI pero disponible)
async function getProductById(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const data = await response.json();
        
        if (response.ok) {
            return data.product || data;
        } else {
            throw new Error(data.error || data.message || 'Error al obtener producto');
        }
    } catch (error) {
        throw new Error('Error al obtener producto: ' + error.message);
    }
}

// Manejo de errores global
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showNotification('Ha ocurrido un error inesperado', 'error');
});

// Manejo de promesas rechazadas no manejadas
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('Error de conexión con el servidor', 'error');
    e.preventDefault();
}); 