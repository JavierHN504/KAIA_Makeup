// ========================================
// KAIA MAKEUP - FUNCIONES DEL CARRITO
// ========================================

// Agregar producto al carrito
function addToCart(productId, quantity = 1) {
    // Obtener información del producto
    const product = getProductById(productId);
    if (!product) return;
    
    // Verificar si el producto ya está en el carrito
    const existingItem = AppState.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        AppState.cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // Guardar y actualizar UI
    saveCartToStorage();
    updateCartCount();
    
    // Mostrar notificación
    showNotification(`✓ ${product.name} agregado al carrito`, 'success');
}

// Remover producto del carrito
function removeFromCart(productId) {
    AppState.cart = AppState.cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    
    // Si estamos en la página del carrito, actualizar
    if (AppState.currentPage === 'cart') {
        loadCartPage();
    }
}

// Actualizar cantidad en el carrito
function updateCartQuantity(productId, quantity) {
    const item = AppState.cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCartToStorage();
            updateCartCount();
            
            // Actualizar totales si estamos en la página del carrito
            if (AppState.currentPage === 'cart') {
                updateCartTotals();
            }
        }
    }
}

// Cargar página del carrito
function loadCartPage() {
    const mainContent = document.getElementById('mainContent');
    
    if (AppState.cart.length === 0) {
        mainContent.innerHTML = `
            <div class="cart-page">
                <div class="container">
                    <div class="empty-cart">
                        <i class="bi bi-cart-x"></i>
                        <h2>Tu carrito está vacío</h2>
                        <p>¡Agrega algunos productos para comenzar!</p>
                        <button class="btn btn-ver-mas" onclick="loadPage('catalog')">
                            Ver Catálogo
                        </button>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    mainContent.innerHTML = `
        <div class="cart-page">
            <div class="container">
                <div class="cart-header">
                    <h1>Resumen de Carrito</h1>
                    <p>${AppState.cart.length} producto${AppState.cart.length > 1 ? 's' : ''} en tu carrito</p>
                </div>
                
                <div class="row">
                    <div class="col-lg-8">
                        <div class="cart-container">
                            <table class="cart-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="cartItems">
                                    ${generateCartItems()}
                                </tbody>
                            </table>
                            
                            <div class="cart-actions">
                                <a href="#" class="continue-shopping" onclick="loadPage('catalog'); return false;">
                                    <i class="bi bi-arrow-left"></i> Seguir comprando
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-4">
                        <div class="cart-summary">
                            <h3>Resumen del pedido</h3>
                            
                            <div class="discount-code">
                                <h4>Código de descuento</h4>
                                <form class="discount-form" onsubmit="applyDiscount(event)">
                                    <input type="text" placeholder="Código" id="discountCode">
                                    <button type="submit">Aplicar</button>
                                </form>
                            </div>
                            
                            <div id="cartSummary">
                                ${generateCartSummary()}
                            </div>
                            
                            <button class="checkout-btn" onclick="loadPage('checkout')">
                                Ir al checkout <i class="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar event listeners
    setupCartEventListeners();
}

// Generar items del carrito
function generateCartItems() {
    return AppState.cart.map(item => `
        <tr>
            <td>
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Lps. ${item.price.toLocaleString()}</p>
                    </div>
                </div>
            </td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="bi bi-dash"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="updateQuantity(${item.id}, this.value)" min="1">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
            </td>
            <td>
                <span class="cart-price">Lps. ${(item.price * item.quantity).toLocaleString()}</span>
            </td>
            <td>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Generar resumen del carrito
function generateCartSummary() {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 1000 ? 0 : 100; // Envío gratis sobre Lps. 1000
    const discount = AppState.discount || 0;
    const total = subtotal + shipping - discount;
    
    return `
        <div class="summary-row">
            <span>Subtotal</span>
            <span>Lps. ${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Envío</span>
            <span>${shipping === 0 ? 'GRATIS' : `Lps. ${shipping.toLocaleString()}`}</span>
        </div>
        ${discount > 0 ? `
            <div class="summary-row">
                <span>Descuento</span>
                <span>-Lps. ${discount.toLocaleString()}</span>
            </div>
        ` : ''}
        <div class="summary-row">
            <span>Total</span>
            <span>Lps. ${total.toLocaleString()}</span>
        </div>
    `;
}

// Calcular subtotal
function calculateSubtotal() {
    return AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Actualizar cantidad desde UI
function updateQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    if (isNaN(newQuantity) || newQuantity < 0) return;
    
    updateCartQuantity(productId, newQuantity);
}

// Actualizar totales del carrito
function updateCartTotals() {
    const cartSummary = document.getElementById('cartSummary');
    if (cartSummary) {
        cartSummary.innerHTML = generateCartSummary();
    }
    
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        cartItems.innerHTML = generateCartItems();
    }
}

// Aplicar código de descuento
function applyDiscount(event) {
    event.preventDefault();
    const code = document.getElementById('discountCode').value.toUpperCase();
    
    // Códigos de descuento de ejemplo
    const discountCodes = {
        'KAIA10': 0.10,
        'KAIA20': 0.20,
        'WELCOME': 0.15
    };
    
    if (discountCodes[code]) {
        const subtotal = calculateSubtotal();
        AppState.discount = Math.floor(subtotal * discountCodes[code]);
        updateCartTotals();
        showNotification(`✓ Código ${code} aplicado - ${discountCodes[code] * 100}% de descuento`, 'success');
    } else {
        showNotification('❌ Código de descuento inválido', 'error');
    }
}

// Configurar event listeners del carrito
function setupCartEventListeners() {
    // Los event listeners están inline por simplicidad
}

// Vaciar carrito
function clearCart() {
    if (confirm('¿Estás segura de que deseas vaciar el carrito?')) {
        AppState.cart = [];
        saveCartToStorage();
        updateCartCount();
        loadCartPage();
    }
}

// Obtener producto por ID (simulado)
function getProductById(id) {
    // En una aplicación real, esto vendría de una API o base de datos
    const products = [
        {
            id: 1,
            name: 'Base Matte Aqua',
            price: 1200,
            image: 'https://images.unsplash.com/photo-1631214524020-7e18db76a46f?w=300&h=300&fit=crop'
        },
        {
            id: 2,
            name: 'Lip Gloss Wonder',
            price: 580,
            image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'
        },
        {
            id: 3,
            name: 'Highlighter Kaia Lov',
            price: 450,
            image: 'https://images.unsplash.com/photo-1617220379428-c7f2c5b89936?w=300&h=300&fit=crop'
        },
        {
            id: 4,
            name: 'Rímel Mega LashPRO',
            price: 600,
            image: 'https://images.unsplash.com/photo-1631214540553-a4e4e9a2d634?w=300&h=300&fit=crop'
        }
    ];
    
    return products.find(p => p.id === id);
}