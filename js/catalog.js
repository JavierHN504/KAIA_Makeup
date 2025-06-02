// ========================================
// KAIA MAKEUP - FUNCIONES DEL CATÁLOGO
// ========================================

// Estado del catálogo
const CatalogState = {
    currentCategory: 'all',
    currentFilters: {
        marca: [],
        priceRange: [0, 5000],
        rating: 0,
        acabado: [],
        formulacion: [],
        cobertura: []
    },
    sortBy: 'featured',
    viewMode: 'grid'
};

// Cargar página del catálogo
function loadCatalogPage(params = {}) {
    const mainContent = document.getElementById('mainContent');
    
    // Si viene una categoría específica
    if (params.category) {
        CatalogState.currentCategory = params.category;
    }
    
    mainContent.innerHTML = `
        <div class="catalog-page">
            <div class="catalog-header">
                <div class="container">
                    <h1>Catálogo</h1>
                    <p>Descubre nuestra colección completa de productos</p>
                </div>
            </div>
            
            <div class="container">
                <!-- Categorías -->
                <div class="catalog-categories">
                    <button class="category-tab ${CatalogState.currentCategory === 'all' ? 'active' : ''}" 
                            onclick="filterByCategory('all')">
                        Todos
                    </button>
                    <button class="category-tab ${CatalogState.currentCategory === 'ojos' ? 'active' : ''}" 
                            onclick="filterByCategory('ojos')">
                        Ojos
                    </button>
                    <button class="category-tab ${CatalogState.currentCategory === 'labios' ? 'active' : ''}" 
                            onclick="filterByCategory('labios')">
                        Labios
                    </button>
                    <button class="category-tab ${CatalogState.currentCategory === 'rostro' ? 'active' : ''}" 
                            onclick="filterByCategory('rostro')">
                        Rostro
                    </button>
                    <button class="category-tab ${CatalogState.currentCategory === 'piel' ? 'active' : ''}" 
                            onclick="filterByCategory('piel')">
                        Piel
                    </button>
                </div>
                
                <div class="row mt-4">
                    <!-- Sidebar de filtros -->
                    <div class="col-lg-3">
                        <div class="catalog-filters">
                            <h4>Filtros</h4>
                            
                            <!-- Marca -->
                            <div class="filter-group">
                                <h4>Marca</h4>
                                <label>
                                    <input type="checkbox" value="kaia" onchange="toggleFilter('marca', 'kaia')">
                                    KAIA Original
                                </label>
                                <label>
                                    <input type="checkbox" value="premium" onchange="toggleFilter('marca', 'premium')">
                                    KAIA Premium
                                </label>
                            </div>
                            
                            <!-- Precio -->
                            <div class="filter-group">
                                <h4>Precio</h4>
                                <input type="range" min="0" max="5000" value="5000" 
                                       onchange="updatePriceFilter(this.value)">
                                <div class="price-range">
                                    <span>Lps. 0</span>
                                    <span id="maxPrice">Lps. 5000</span>
                                </div>
                            </div>
                            
                            <!-- Puntuación -->
                            <div class="filter-group">
                                <h4>Puntuación</h4>
                                <div class="star-filter" onclick="filterByRating(4)">
                                    <span class="stars">★★★★☆</span>
                                    <span class="count">& up (203)</span>
                                </div>
                                <div class="star-filter" onclick="filterByRating(3)">
                                    <span class="stars">★★★☆☆</span>
                                    <span class="count">& up (152)</span>
                                </div>
                                <div class="star-filter" onclick="filterByRating(2)">
                                    <span class="stars">★★☆☆☆</span>
                                    <span class="count">& up (100)</span>
                                </div>
                            </div>
                            
                            <!-- Acabado -->
                            <div class="filter-group">
                                <h4>Acabado</h4>
                                <label>
                                    <input type="checkbox" value="matte" onchange="toggleFilter('acabado', 'matte')">
                                    Matte
                                </label>
                                <label>
                                    <input type="checkbox" value="glossy" onchange="toggleFilter('acabado', 'glossy')">
                                    Glossy
                                </label>
                                <label>
                                    <input type="checkbox" value="satin" onchange="toggleFilter('acabado', 'satin')">
                                    Satinado
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Productos -->
                    <div class="col-lg-9">
                        <!-- Controles -->
                        <div class="catalog-controls">
                            <div class="results-count">
                                <span id="resultsCount">1-20 de 30 resultados</span>
                            </div>
                            <div class="sort-controls">
                                <select onchange="sortProducts(this.value)">
                                    <option value="featured">Destacados</option>
                                    <option value="price-low">Precio: Menor a Mayor</option>
                                    <option value="price-high">Precio: Mayor a Menor</option>
                                    <option value="name">Nombre: A-Z</option>
                                    <option value="rating">Mejor Valorados</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Grid de productos -->
                        <div class="catalog-products ${CatalogState.viewMode}" id="catalogProducts">
                            ${generateCatalogProducts()}
                        </div>
                        
                        <!-- Paginación -->
                        <div class="catalog-pagination">
                            <button class="pagination-btn" onclick="previousPage()" disabled>
                                <i class="bi bi-chevron-left"></i>
                            </button>
                            <button class="pagination-btn active">1</button>
                            <button class="pagination-btn">2</button>
                            <button class="pagination-btn">3</button>
                            <button class="pagination-btn" onclick="nextPage()">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;    
}

// Generar productos del catálogo
function generateCatalogProducts() {
    const products = getCatalogProducts();
    
    return products.map(product => `
        <div class="catalog-product-card">
            ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
            ${product.isNew ? `<div class="new-badge">NUEVO</div>` : ''}
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="quick-view-btn" onclick="showQuickView(${product.id})">
                        VER MÁS
                    </button>
                </div>
            </div>
            <div class="catalog-product-info">
                <h3 class="catalog-product-name">${product.name}</h3>
                <div class="catalog-product-price">
                    <span class="current-price">Lps. ${product.currentPrice.toLocaleString()}</span>
                    ${product.originalPrice ? `
                        <span class="original-price">Lps. ${product.originalPrice.toLocaleString()}</span>
                    ` : ''}
                </div>
                <div class="rating">
                    ${generateStars(product.rating)}
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                ${product.colors ? `
                    <div class="product-colors">
                        ${product.colors.map(color => `
                            <span class="color-option" style="background-color: ${color}"></span>
                        `).join('')}
                    </div>
                ` : ''}
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    AGREGAR AL CARRITO
                </button>
            </div>
        </div>
    `).join('');
}

// Obtener productos del catálogo (simulado)
function getCatalogProducts() {
    const allProducts = [
        {
            id: 5,
            name: 'Brocha pequeña para ojos',
            category: 'ojos',
            currentPrice: 200,
            image: 'https://petrizzio.cl/cdn/shop/products/set-brochas-ojos-pzzo-947144.png?v=1647014822',
            rating: 4.5,
            reviews: 30
        },
        {
            id: 6,
            name: 'Sombras tonos rosa',
            category: 'ojos',
            currentPrice: 350,
            image: 'https://www.collarela.com/cdn/shop/files/SOMBRACOLORROSATRENDY02_1200x1200.jpg?v=1710169794',
            rating: 5,
            reviews: 45,
            colors: ['#FFB6C1', '#FFC0CB', '#FFD1DC']
        },
        {
            id: 7,
            name: 'Serum de pestañas',
            category: 'ojos',
            currentPrice: 250,
            image: 'https://beautyface.hn/cdn/shop/products/LASHLASH.jpg?v=1624342156',
            rating: 4,
            reviews: 22,
            isNew: true
        },
        {
            id: 8,
            name: 'Mascara LoveIt',
            category: 'ojos',
            currentPrice: 365,
            image: 'https://xoxo-eg.com/cdn/shop/files/Essence-Love-It-A-Choco-Lot-Lash-Without-Limits-Br-0_533x.jpg?v=1736200755',
            rating: 4.8,
            reviews: 67
        },
        {
            id: 9,
            name: 'Labial Matte Aqua',
            category: 'labios',
            currentPrice: 586,
            originalPrice: 650,
            discount: 10,
            image: 'https://m.media-amazon.com/images/I/517yqFWkDFL.jpg',
            rating: 5,
            reviews: 89,
            colors: ['#DC143C', '#FF69B4', '#C71585', '#8B0000']
        },
        {
            id: 10,
            name: 'Lip Gloss Aqua',
            category: 'labios',
            currentPrice: 470,
            originalPrice: 510,
            discount: 8,
            image: 'https://d1flfk77wl2xk4.cloudfront.net/Assets/07/930/XXL_p0208693007.jpg',
            rating: 4.7,
            reviews: 56,
            colors: ['#FF0000','#FFB6C1', '#FF69B4', '#FFC0CB']
        },
        {
            id: 11,
            name: 'Base Matte Aqua',
            category: 'rostro',
            currentPrice: 980,
            originalPrice: 1200,
            discount: 18,
            image: 'https://aquavera.shop/cdn/shop/files/avbm3-durazno-235indi.png?v=1699561497',
            rating: 4.5,
            reviews: 123,
            colors: ['#F5DEB3', '#FFE4C4', '#FFDAB9', '#D2B48C']
        },
        {
            id: 12,
            name: 'Polvos Matte Aqua',
            category: 'rostro',
            currentPrice: 850,
            originalPrice: 980,
            discount: 13,
            image: 'https://agarabenidorm.com/wp-content/uploads/2023/06/802575-1.jpg',
            rating: 4.3,
            reviews: 78
        },

        {
        id: 13,
        name: 'Highlighter Kaia Lov',
        category: 'rostro',
        currentPrice: 450,
        image: 'https://caiacosmetics.com/img/bilder/artiklar/zoom/CAI2681_1.jpg?m=1748440246&w=741',
        rating: 4,
        reviews: 33,
        discount: 4,
        colors: ['#FFEBCD', '#FFF8DC', '#FFD700']
            },
            {
        id: 14,
        name: 'Lip Gloss Wonder',
        category: 'labios',
        currentPrice: 580,
        image: 'https://wonderskin.com/cdn/shop/files/ProductPage-RedTopGloss1.jpg?v=1731316046',
        rating: 5,
        reviews: 61,
        discount: 15,
        colors: ['#FF0000','#FF69B4', '#FF1493']
            },
            {
        id: 15,
        name: 'Rímel Mega LashPRO',
        category: 'ojos',
        currentPrice: 600,
        image: 'https://www.techniccosmetics.com/cdn/shop/files/28545megalashopen-WC.jpg?v=1717060828',
        rating: 5,
        reviews: 74
            }
    ];
    
    // Filtrar por categoría
    let filteredProducts = allProducts;
    if (CatalogState.currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === CatalogState.currentCategory);
    }

    // Filtrar por precio (NUEVO)
    const [minPrice, maxPrice] = CatalogState.currentFilters.priceRange;
    filteredProducts = filteredProducts.filter(p => p.currentPrice >= minPrice && p.currentPrice <= maxPrice);
    
    // Aplicar otros filtros...
    // (En una aplicación real, aquí aplicarías todos los filtros)
    
    // Ordenar
    switch(CatalogState.sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.currentPrice - b.currentPrice);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.currentPrice - a.currentPrice);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    return filteredProducts;
}

// Filtrar por categoría
function filterByCategory(category) {
    CatalogState.currentCategory = category;
    loadCatalogPage();
}

// Toggle filtro
function toggleFilter(filterType, value) {
    const index = CatalogState.currentFilters[filterType].indexOf(value);
    if (index > -1) {
        CatalogState.currentFilters[filterType].splice(index, 1);
    } else {
        CatalogState.currentFilters[filterType].push(value);
    }
    applyFilters();
}

// Actualizar filtro de precio
function updatePriceFilter(value) {
    CatalogState.currentFilters.priceRange[1] = parseInt(value);
    document.getElementById('maxPrice').textContent = `Lps. ${value}`;
    applyFilters();
}

// Filtrar por rating
function filterByRating(rating) {
    CatalogState.currentFilters.rating = rating;
    applyFilters();
}

// Aplicar filtros
function applyFilters() {
    // Actualizar productos mostrados
    const productsContainer = document.getElementById('catalogProducts');
    if (productsContainer) {
        productsContainer.innerHTML = generateCatalogProducts();
    }
}

// Ordenar productos
function sortProducts(sortBy) {
    CatalogState.sortBy = sortBy;
    applyFilters();
}

// Mostrar vista rápida
function showQuickView(productId) {
    // Obtener información del producto
    const product = getProductById(productId);
    if (!product) return;
    
    // Crear modal
    const modalHTML = `
        <div class="quick-view-modal show" id="quickViewModal">
            <div class="quick-view-content">
                <button class="close-modal" onclick="closeQuickView()">
                    <i class="bi bi-x"></i>
                </button>
                <div class="row">
                    <div class="col-md-6">
                        <img src="${product.image}" alt="${product.name}" class="w-100">
                    </div>
                    <div class="col-md-6">
                        <h2>${product.name}</h2>
                        <p class="product-price">Lps. ${product.price.toLocaleString()}</p>
                        <p>Brillo, hidratación y confianza en cada aplicación.</p>
                        <div class="mt-4">
                            <button class="btn btn-ver-mas" onclick="addToCart(${product.id}); closeQuickView();">
                                AGREGAR AL CARRITO
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Cerrar vista rápida
function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.remove();
    }
}

// Cargar más productos
function loadMoreProducts() {
    showNotification('Cargando más productos...', 'info');
    // Simular carga de más productos
}

// Navegación de páginas
function previousPage() {
    // Implementar navegación
}

function nextPage() {
    // Implementar navegación
}

function getProductById(productId) {
    const allProducts = getCatalogProducts();
    return allProducts.find(p => p.id === productId);
}

function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;

    // Revisar si ya está en el carrito
    const existingItem = AppState.cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        product.quantity = 1;
        AppState.cart.push(product);
    }

    saveCartToStorage();
    updateCartCounter(); // actualiza el número del carrito
    showNotification(`${product.name} agregado al carrito`, 'success');
}

window.addToCart = addToCart;

