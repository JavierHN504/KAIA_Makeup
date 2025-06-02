// ========================================
// KAIA MAKEUP - JAVASCRIPT PRINCIPAL
// ========================================

// Estado global de la aplicación
const AppState = {
    currentPage: 'home',
    user: null,
    cart: [],
    wishlist: []
};

// Inicialización cuando el DOM está listo
window.addEventListener('load', function() {
    loadCartFromStorage();
    setupEventListeners();
    setupScrollEffects();
    
    // Asegurarse de que todas las funciones estén disponibles
    setTimeout(() => {
        initializeApp();
    }, 0);
});



// Inicializar la aplicación
function initializeApp() {
    // Cargar página inicial basada en hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        loadPage(hash);
    } else {
        loadPage('home');
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Navegación
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Categorías en home
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            loadPage('catalog', { category: category });
        });
    });
}

// Efectos de scroll
function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('mainNavbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// Sistema de enrutamiento SPA
function loadPage(page, params = {}) {
    // Actualizar estado
    AppState.currentPage = page;
    
    // Actualizar URL
    window.location.hash = page;
    
    // Actualizar navegación activa
    updateActiveNavigation(page);
    
    // Cargar contenido de la página
    const mainContent = document.getElementById('mainContent');
    
    switch(page) {
        case 'home':
            loadHomePage();
            break;
        case 'about':
            loadAboutPage();
            break;
        case 'catalog':
            loadCatalogPage(params);
            break;
        case 'cart':
            loadCartPage();
            break;
        case 'account':
            loadAccountPage();
            break;
        case 'product':
            loadProductPage(params.id);
            break;
        case 'checkout':
            loadCheckoutPage();
            break;
        default:
            loadHomePage();
    }
    
    // Scroll al top
    window.scrollTo(0, 0);
}

// Actualizar navegación activa
function updateActiveNavigation(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
}

// ========================================
// PÁGINAS
// ========================================

// Cargar página de inicio
function loadHomePage() {
    // El contenido ya está en el HTML, solo asegurarse de que esté visible
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-image">
                <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&h=800&fit=crop" alt="Belleza con propósito">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <h1>Belleza con propósito.</h1>
                    <p class="hero-subtitle">Más de 100% tendencia</p>
                </div>
            </div>
        </section>

        <!-- Colección Section -->
        <section class="collection-section">
            <div class="container">
                <h2 class="section-title">COLECCIÓN</h2>
                <div class="collection-categories">
                    <a href="#" class="category-item" data-category="ojos">
                        <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop" alt="Ojos">
                        <h3>OJOS</h3>
                    </a>
                    <a href="#" class="category-item" data-category="labios">
                        <img src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop" alt="Labios">
                        <h3>LABIOS</h3>
                    </a>
                    <a href="#" class="category-item" data-category="rostro">
                        <img src="https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?w=300&h=300&fit=crop" alt="Rostro">
                        <h3>ROSTRO</h3>
                    </a>
                    <a href="#" class="category-item" data-category="piel">
                        <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop" alt="Piel">
                        <h3>PIEL</h3>
                    </a>
                </div>
                <div class="text-center mt-4">
                    <button class="btn btn-ver-mas" onclick="loadPage('catalog')">VER MÁS</button>
                </div>
            </div>
        </section>

        <!-- Más Vendidos -->
        <section class="best-sellers-section">
            <div class="container">
                <h2 class="section-title">MÁS VENDIDOS</h2>
                <div class="row" id="bestSellers">
                    ${generateBestSellers()}
                </div>
                <div class="text-center mt-4">
                    <button class="btn btn-ver-mas" onclick="loadPage('catalog')">VER MÁS</button>
                </div>
            </div>
        </section>

        <!-- Sutil Bella Kaia Section -->
        <section class="brand-banner">
            <div class="brand-banner-overlay">
                <h2 class="brand-banner-text">SUTIL. BELLA. KAIA.</h2>
            </div>
        </section>


        <!-- Testimonios -->
        <section class="testimonials-section">
            <div class="container">
                <h2 class="section-title">TESTIMONIOS</h2>
                <div class="testimonial-card">
                    <div class="quote-icon">"</div>
                    <p class="testimonial-text">Kaia es esa marca honesta y con propósito que toda maquillista debería conocer.</p>
                    <p class="testimonial-author">-Mariela Rivera</p>
                    <p class="testimonial-role">Maquillista profesional</p>
                </div>
            </div>
        </section>

        <!-- Uso de Producto -->
        <section class="product-features">
            <div class="container">
                <h2 class="section-title">USO DE PRODUCTO</h2>
                <div class="features-grid">
                    <div class="feature-item">
                        <i class="bi bi-tree"></i>
                        <p>Producto Vegano</p>
                    </div>
                    <div class="feature-item">
                        <i class="bi bi-heart"></i>
                        <p>No testeado en animales</p>
                    </div>
                    <div class="feature-item">
                        <i class="bi bi-recycle"></i>
                        <p>Producto sostenible</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Newsletter -->
        <section class="newsletter-section">
            <div class="container">
                <div class="newsletter-content">
                    <h2>NEWSLETTER</h2>
                    <p>Suscríbete a nuestro</p>
                    <form id="newsletterForm" class="newsletter-form">
                        <input type="email" placeholder="E-mail" required>
                        <button type="submit">SUSCRIBIRSE</button>
                    </form>
                </div>
            </div>
        </section>
    `;
    
    // Re-establecer event listeners para los elementos nuevos
    setupHomeEventListeners();

}

// Generar productos más vendidos
function generateBestSellers() {
    const products = [
        {
            id: 1,
            name: 'Base Matte Aqua',
            price: 1200,
            image: 'https://aquavera.shop/cdn/shop/files/avbm3-durazno-235indi.png?v=1699561497',
            badge: '+30',
            rating: 4.5
        },
        {
            id: 2,
            name: 'Lip Gloss Wonder',
            price: 580,
            image: 'https://wonderskin.com/cdn/shop/files/ProductPage-RedTopGloss1.jpg?v=1731316046',
            badge: '+15',
            rating: 5
        },
        {
            id: 3,  
            name: 'Highlighter Kaia Lov',
            price: 450,
            image: 'https://caiacosmetics.com/img/bilder/artiklar/zoom/CAI2681_1.jpg?m=1748440246&w=741',
            badge: '+4',
            rating: 4
        },
        {
            id: 4,
            name: 'Rímel Mega LashPRO',
            price: 600,
            image: 'https://www.techniccosmetics.com/cdn/shop/files/28545megalashopen-WC.jpg?v=1717060828',
            rating: 5
        }
    ];

    return products.map(product => `
        <div class="col-6 col-md-3">
            <div class="product-card" onclick="loadPage('product', {id: ${product.id}})">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">Lps. ${product.price.toLocaleString()}</p>
                    <div class="rating">
                        ${generateStars(product.rating)}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}



// Generar estrellas de rating
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="bi bi-star-fill"></i>';
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            stars += '<i class="bi bi-star-half"></i>';
        } else {
            stars += '<i class="bi bi-star"></i>';
        }
    }
    return stars;
}

// Configurar event listeners para home
function setupHomeEventListeners() {
    // Categorías
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            loadPage('catalog', { category: category });
        });
    });
    
    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

// Manejar envío de newsletter
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simular envío
    showNotification('✓ ¡Gracias por suscribirte! Te enviaremos las últimas novedades.', 'success');
    
    // Limpiar formulario
    e.target.reset();
}

// ========================================
// UTILIDADES
// ========================================

// Añadir producto al carrito
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId); // asegurate que esta función existe

    if (!product) return;

    const existing = AppState.cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += quantity;
    } else {
        AppState.cart.push({
            id: productId,
            name: product.name,
            price: product.price || product.currentPrice,
            quantity: quantity,
            image: product.image || product.images?.[0]
        });
    }

    saveCartToStorage();
    updateCartCount();
    showNotification('✓ Producto agregado al carrito', 'success');
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    const toastHTML = `
        <div class="toast position-fixed bottom-0 end-0 m-3" role="alert" data-bs-autohide="true" data-bs-delay="3000">
            <div class="toast-header bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} text-white">
                <strong class="me-auto">KAIA MakeUp</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.querySelector('.toast:last-child');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remover después de mostrarse
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

// Cargar carrito desde localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('kaiaCart');
    if (savedCart) {
        AppState.cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Guardar carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('kaiaCart', JSON.stringify(AppState.cart));
}

// Actualizar contador del carrito en navbar
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Manejar cambios en el historial
// Escuchar cambios de hash para SPA
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        loadPage(hash);
    } else {
        loadPage('home');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.getElementById('cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', function () {
            loadPage('cart');
        });
    }
});

