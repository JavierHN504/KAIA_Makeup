// ========================================
// KAIA MAKEUP - FUNCIONES DE PRODUCTOS
// ========================================

// Cargar página de producto individual
function loadProductPage(productId) {
    const product = getProductDetails(productId);
    if (!product) {
        loadPage('catalog');
        return;
    }
    
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="product-page" style="margin-top: 100px; padding: 40px 0;">
            <div class="container">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="#" onclick="loadPage('home')">Inicio</a></li>
                        <li class="breadcrumb-item"><a href="#" onclick="loadPage('catalog')">Catálogo</a></li>
                        <li class="breadcrumb-item active">${product.name}</li>
                    </ol>
                </nav>
                
                <div class="row">
                    <div class="col-lg-6">
                        <div class="product-gallery">
                            <img src="${product.images[0]}" alt="${product.name}" class="main-image w-100">
                            <div class="thumbnail-images mt-3">
                                ${product.images.map((img, index) => `
                                    <img src="${img}" alt="${product.name} ${index + 1}" 
                                         class="thumbnail ${index === 0 ? 'active' : ''}"
                                         onclick="changeMainImage('${img}', this)">
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-6">
                        <h1 class="product-title">${product.name}</h1>
                        <div class="product-rating mb-3">
                            ${generateStars(product.rating)}
                            <span class="ms-2">(${product.reviews} reseñas)</span>
                        </div>
                        
                        <div class="product-price mb-4">
                            <span class="h2 text-primary">Lps. ${product.currentPrice.toLocaleString()}</span>
                            ${product.originalPrice ? `
                                <span class="h4 text-muted text-decoration-line-through ms-2">
                                    Lps. ${product.originalPrice.toLocaleString()}
                                </span>
                            ` : ''}
                        </div>
                        
                        <p class="product-description">${product.description}</p>
                        
                        ${product.colors ? `
                            <div class="product-options mb-4">
                                <h5>Color:</h5>
                                <div class="color-options">
                                    ${product.colors.map((color, index) => `
                                        <button class="color-btn ${index === 0 ? 'active' : ''}" 
                                                style="background-color: ${color.hex}"
                                                onclick="selectColor(this, '${color.name}')"
                                                title="${color.name}">
                                        </button>
                                    `).join('')}
                                </div>
                                <p class="selected-color mt-2">Seleccionado: <strong>${product.colors[0].name}</strong></p>
                            </div>
                        ` : ''}
                        
                        <div class="quantity-selector mb-4">
                            <h5>Cantidad:</h5>
                            <div class="quantity-controls d-inline-flex">
                                <button class="quantity-btn" onclick="decreaseQuantity()">
                                    <i class="bi bi-dash"></i>
                                </button>
                                <input type="number" class="quantity-input" value="1" min="1" id="productQuantity">
                                <button class="quantity-btn" onclick="increaseQuantity()">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="product-actions mb-4">
                            <button class="btn btn-primary btn-lg w-100 mb-3" 
                                    onclick="addProductToCart(${product.id})">
                                AGREGAR AL CARRITO
                            </button>
                            <button class="btn btn-outline-primary btn-lg w-100" 
                                    onclick="addToWishlist(${product.id})">
                                <i class="bi bi-heart"></i> AGREGAR A FAVORITOS
                            </button>
                        </div>
                        
                        <div class="product-features">
                            <h5>Características:</h5>
                            <ul class="list-unstyled">
                                <li><i class="bi bi-check-circle text-success"></i> ${product.features.join('</li><li><i class="bi bi-check-circle text-success"></i> ')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Tabs de información adicional -->
                <div class="row mt-5">
                    <div class="col-12">
                        <ul class="nav nav-tabs" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" data-bs-toggle="tab" href="#description">
                                    Descripción
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-bs-toggle="tab" href="#specifications">
                                    Especificaciones
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-bs-toggle="tab" href="#reviews">
                                    Reseñas (${product.reviews})
                                </a>
                            </li>
                        </ul>
                        
                        <div class="tab-content mt-4">
                            <div class="tab-pane fade show active" id="description">
                                <p>${product.fullDescription}</p>
                            </div>
                            <div class="tab-pane fade" id="specifications">
                                ${generateSpecifications(product.specifications)}
                            </div>
                            <div class="tab-pane fade" id="reviews">
                                ${generateReviews(product.reviewsList)}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Productos relacionados -->
                <div class="row mt-5">
                    <div class="col-12">
                        <h3 class="mb-4">CÓMPRALO CON</h3>
                        <div class="row">
                            ${generateRelatedProducts(product.related)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar estilos específicos de la página de producto
    addProductPageStyles();
}

// Obtener detalles del producto
function getProductDetails(productId) {
    // Simulación de datos del producto
    const products = {
        1: {
            id: 1,
            name: 'Base Matte Aqua',
            currentPrice: 1200,
            originalPrice: null,
            rating: 4.5,
            reviews: 123,
            description: 'Base de maquillaje de larga duración con acabado mate. Perfecta para piel grasa.',
            fullDescription: 'Nuestra Base Matte Aqua ha sido especialmente formulada para proporcionar una cobertura perfecta durante todo el día. Su fórmula libre de aceites controla el brillo y minimiza la apariencia de los poros, dejando un acabado mate natural. Enriquecida con ingredientes hidratantes que cuidan tu piel mientras la embellecen.',
            images: [
                'https://images.unsplash.com/photo-1631214524020-7e18db76a46f?w=600&h=600&fit=crop',
                'https://images.unsplash.com/photo-1631214524115-6a2c86b0fc42?w=600&h=600&fit=crop',
                'https://images.unsplash.com/photo-1631214523985-1e0a2756ce8f?w=600&h=600&fit=crop'
            ],
            colors: [
                { name: 'Porcelana', hex: '#F5DEB3' },
                { name: 'Natural', hex: '#FFE4C4' },
                { name: 'Beige', hex: '#FFDAB9' },
                { name: 'Caramelo', hex: '#D2B48C' }
            ],
            features: [
                'Acabado mate de larga duración',
                'Control de brillo hasta por 12 horas',
                'Fórmula libre de aceites',
                'No comedogénico',
                'Protección solar SPF 15',
                'Producto vegano y cruelty-free'
            ],
            specifications: {
                'Acabado': 'Mate',
                'Tipo de piel': 'Grasa a mixta',
                'Cobertura': 'Media a completa',
                'Duración': '12 horas',
                'Contenido': '30ml',
                'País de origen': 'Honduras'
            },
            reviewsList: [
                {
                    author: 'María G.',
                    rating: 5,
                    date: '2024-01-15',
                    comment: 'La mejor base que he probado! Dura todo el día sin oxidarse.'
                },
                {
                    author: 'Ana P.',
                    rating: 4,
                    date: '2024-01-10',
                    comment: 'Muy buena cobertura, aunque me gustaría que tuviera más tonos.'
                }
            ],
            related: [2, 11, 12]
        },
        2: {
            id: 2,
            name: 'Lip Gloss Aqua',
            currentPrice: 470,
            originalPrice: 510,
            rating: 4.7,
            reviews: 56,
            description: 'Brillo, hidratación y confianza en cada aplicación.',
            fullDescription: 'Nuestro Lip Gloss Aqua fue creado para quienes quieren resaltar su belleza natural sin comprometer el cuidado de su piel. Fórmula ligera, vegana y libre de crueldad, con acabado brillante y tonos que se adaptan a todos los estilos.',
            images: [
                'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
                'https://images.unsplash.com/photo-1631730486784-74b9f6b0f546?w=600&h=600&fit=crop'
            ],
            colors: [
                { name: 'Rosado', hex: '#FFB6C1' },
                { name: 'Coral', hex: '#FF69B4' },
                { name: 'Natural', hex: '#FFC0CB' }
            ],
            features: [
                'Brillo intenso sin pegajosidad',
                'Fórmula hidratante con vitamina E',
                'Larga duración',
                'Aroma suave a vainilla',
                'Aplicador de precisión',
                'Vegano y cruelty-free'
            ],
            specifications: {
                'Acabado': 'Glossy',
                'Tipo de labial': 'Brillo',
                'Color': 'Rosado',
                'Contenido': '15ml',
                'Ingredientes principales': 'Aceite de ricino, manteca de karité, vitamina E'
            },
            reviewsList: [
                {
                    author: 'Sofía R.',
                    rating: 5,
                    date: '2024-01-20',
                    comment: 'Me encanta! No es pegajoso y dura bastante.'
                }
            ],
            related: [9, 10, 3]
        }
    };
    
    return products[productId] || null;
}

// Cambiar imagen principal
function changeMainImage(imageSrc, thumbnail) {
    document.querySelector('.main-image').src = imageSrc;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Seleccionar color
function selectColor(button, colorName) {
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    document.querySelector('.selected-color strong').textContent = colorName;
}

// Aumentar cantidad
function increaseQuantity() {
    const input = document.getElementById('productQuantity');
    input.value = parseInt(input.value) + 1;
}

// Disminuir cantidad
function decreaseQuantity() {
    const input = document.getElementById('productQuantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Agregar producto al carrito con cantidad específica
function addProductToCart(productId) {
    const quantity = parseInt(document.getElementById('productQuantity').value);
    addToCart(productId, quantity);
}

// Agregar a favoritos
function addToWishlist(productId) {
    if (!AppState.wishlist.includes(productId)) {
        AppState.wishlist.push(productId);
        showNotification('✓ Producto agregado a favoritos', 'success');
    } else {
        showNotification('Este producto ya está en tus favoritos', 'info');
    }
}

// Generar especificaciones
function generateSpecifications(specs) {
    return `
        <table class="table table-striped">
            ${Object.entries(specs).map(([key, value]) => `
                <tr>
                    <td><strong>${key}:</strong></td>
                    <td>${value}</td>
                </tr>
            `).join('')}
        </table>
    `;
}

// Generar reseñas
function generateReviews(reviews) {
    return reviews.map(review => `
        <div class="review-item mb-4 pb-4 border-bottom">
            <div class="d-flex justify-content-between mb-2">
                <div>
                    <strong>${review.author}</strong>
                    <div class="rating">
                        ${generateStars(review.rating)}
                    </div>
                </div>
                <small class="text-muted">${review.date}</small>
            </div>
            <p>${review.comment}</p>
        </div>
    `).join('');
}

// Generar productos relacionados
function generateRelatedProducts(relatedIds) {
    return relatedIds.map(id => {
        const product = getProductById(id);
        return `
            <div class="col-md-4 mb-4">
                <div class="product-card" onclick="loadPage('product', {id: ${product.id}})">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">Lps. ${product.price.toLocaleString()}</p>
                        <button class="btn btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                            AGREGAR AL CARRITO
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Agregar estilos específicos de la página de producto
function addProductPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .product-gallery .main-image {
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        .thumbnail-images {
            display: flex;
            gap: 10px;
        }
        
        .thumbnail {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 5px;
            cursor: pointer;
            opacity: 0.6;
            transition: all 0.3s ease;
        }
        
        .thumbnail.active,
        .thumbnail:hover {
            opacity: 1;
            border: 2px solid var(--primary-pink);
        }
        
        .product-title {
            font-size: 2rem;
            color: var(--dark-gray);
            margin-bottom: 15px;
        }
        
        .product-rating {
            display: flex;
            align-items: center;
        }
        
        .product-description {
            font-size: 1.1rem;
            color: var(--text-dark);
            line-height: 1.8;
            margin-bottom: 30px;
        }
        
        .color-options {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        
        .color-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 3px solid transparent;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .color-btn:hover {
            transform: scale(1.1);
        }
        
        .color-btn.active {
            border-color: var(--primary-pink);
            box-shadow: 0 0 0 2px white, 0 0 0 4px var(--primary-pink);
        }
        
        .quantity-selector {
            margin-bottom: 30px;
        }
        
        .product-features li {
            margin-bottom: 10px;
        }
        
        .product-features i {
            margin-right: 10px;
        }
        
        .review-item {
            padding: 20px 0;
        }
        
        .nav-tabs .nav-link {
            color: var(--text-dark);
            border: none;
            border-bottom: 2px solid transparent;
            padding: 10px 20px;
        }
        
        .nav-tabs .nav-link.active {
            color: var(--primary-pink);
            border-bottom-color: var(--primary-pink);
            background: none;
        }
    `;
    document.head.appendChild(style);
}

// Cargar página "Acerca de"
function loadAboutPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="about-page" style="margin-top: 100px;">
            <!-- Header -->
            <section class="about-header text-center py-5" style="background-color: var(--light-pink);">
                <div class="container">
                    <h1 class="display-4 mb-3">¿Quiénes somos?</h1>
                    <p class="lead">Maquillaje que me hace sentir segura sin exagerar</p>
                </div>
            </section>
            
            <!-- Historia -->
            <section class="about-story py-5">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-6">
                            <h2 class="section-title">Nuestra Historia</h2>
                            <p>Kaia nace como una respuesta a la necesidad de acceder a maquillaje original y de alta calidad en Honduras. Nos dimos cuenta de que muchas mujeres no solo buscan verse bien, sino cuidar su piel con productos seguros, confiables y alineados con sus valores.</p>
                            <p>Iniciamos esta tienda con la convicción de ofrecer una alternativa real, ética y moderna. Elegimos el nombre Kaia por su raíz griega, que nos transmite fuerza y belleza natural, dos elementos que creemos toda mujer merece celebrar en su día a día.</p>
                        </div>
                        <div class="col-lg-6">
                            <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop" 
                                 alt="KAIA Makeup" class="img-fluid rounded shadow">
                        </div>
                    </div>
                </div>
            </section>
            
                        <!-- Misión y Visión -->
            <section class="mission-vision py-5" style="background-color: var(--light-gray);">
                <div class="container">
                    <div class="row">
                        <!-- Misión -->
                        <div class="col-md-6 mb-4">
                            <div class="about-card">
                                <h3 class="fw-bold">Misión</h3>
                                <p>Empoderar a mujeres a sentirse la mejor versión de sí mismas a través de productos de belleza de alta calidad, veganos, libres de crueldad animal y adecuados para todo tipo de piel.</p>
                                <p>En Kaia, nos comprometemos a ofrecer una experiencia segura, confiable y alineada con los estándares internacionales, cuidando tanto la piel como la autenticidad de cada mujer.</p>
                            </div>
                        </div>

                        <!-- Visión -->
                        <div class="col-md-6 mb-4">
                            <div class="about-card">
                                <h3 class="fw-bold">Visión</h3>
                                <p>Convertirnos en una marca de referencia en el mundo del maquillaje en Honduras, con presencia tanto en línea como en puntos físicos.</p>
                                <p>Queremos expandirnos a través de al menos dos sucursales en Tegucigalpa y San Pedro Sula, y consolidarnos como una marca de belleza consciente, innovadora y cercana a las mujeres hondureñas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
            <!-- Valores -->
            <section class="values py-5">
                <div class="container">
                    <h2 class="section-title text-center mb-5">Nuestros valores</h2>
                    <div class="row">
                        <div class="col-md-3 text-center mb-4">
                            <div class="value-icon mb-3">
                                <i class="bi bi-heart-fill" style="font-size: 3rem; color: var(--primary-pink);"></i>
                            </div>
                            <h4>Autenticidad</h4>
                            <p>Productos honestos para mujeres reales</p>
                        </div>
                        <div class="col-md-3 text-center mb-4">
                            <div class="value-icon mb-3">
                                <i class="bi bi-tree" style="font-size: 3rem; color: var(--primary-pink);"></i>
                            </div>
                            <h4>Sostenibilidad</h4>
                            <p>Compromiso con el medio ambiente</p>
                        </div>
                        <div class="col-md-3 text-center mb-4">
                            <div class="value-icon mb-3">
                                <i class="bi bi-people-fill" style="font-size: 3rem; color: var(--primary-pink);"></i>
                            </div>
                            <h4>Inclusión</h4>
                            <p>Belleza para todas</p>
                        </div>
                        <div class="col-md-3 text-center mb-4">
                            <div class="value-icon mb-3">
                                <i class="bi bi-star-fill" style="font-size: 3rem; color: var(--primary-pink);"></i>
                            </div>
                            <h4>Experiencia</h4>
                            <p>Cada compra es un momento de autocuidado</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Equipo -->
            <section class="team py-5" style="background-color: var(--light-pink);">
                <div class="container">
                    <h2 class="section-title text-center mb-5">Nuestro equipo</h2>
                    <div class="row">
                        <div class="col-md-3 text-center mb-4">
                            <img src="./img/workTeam/Stefi.png" alt="Stefi Chávez" class="rounded-circle mb-3" width="160" height="160">
                            <h5>Stefi Chávez</h5>
                            <p class="text-muted">Directora general y directora de logística</p>
                            <p><small>Producto favorito: Base Matte Aqua</small></p>
                        </div>
                        <div class="col-md-3 text-center mb-4">
                            <img src="./img/workTeam/Nathalie.png" alt="Nathalie Pagoaga" class="rounded-circle mb-3" width="160" height="160">
                            <h5>Nathalie Pagoaga</h5>
                            <p class="text-muted">Directora creativa</p>
                            <p><small>Producto favorito: Lip Gloss Wonder</small></p>
                        </div>
                        <div class="col-md-3 text-center mb-4">
                            <img src="./img/workTeam/Sofía.png" alt="Sofía Ochoa" class="rounded-circle mb-3" width="160" height="160">
                            <h5>Sofía Ochoa</h5>
                            <p class="text-muted">Directora de arte</p>
                            <p><small>Producto favorito: Highlighter Kaia Lover</small></p>
                        </div>
                        <div class="col-md-3 text-center mb-4">
                            <img src="./img/workTeam/Carmen.png" alt="Carmen Servellón" class="rounded-circle mb-3" width="160" height="160">
                            <h5>Carmen Servellón</h5>
                            <p class="text-muted">Directora de ventas</p>
                            <p><small>Producto favorito: Rímel Mega Lash PRO</small></p>
                        </div>

                    </div>
                </div>
            </section>
            
            <!-- CTA -->
            <section class="about-cta py-5 text-center" style="background-color: var(--accent-yellow);">
                <div class="container">
                    <h3 class="mb-4">Maquillaje es arte. Belleza es Kaia.</h3>
                    <button class="btn-ver-mas" onclick="loadPage('catalog')">
                        DESCUBRE NUESTROS PRODUCTOS
                    </button>
                </div>
            </section>
        </div>
    `;
}

// Cargar página de cuenta
function loadAccountPage() {
    // Verificar si el usuario está logueado
    if (!AppState.user) {
        loadLoginPage();
        return;
    }
    
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="account-page">
            <div class="container">
                <div class="account-header">
                    <div class="account-greeting">
                        <div>
                            <h1>Hola, ${AppState.user.name}</h1>
                            <p>¿No sos ${AppState.user.name}? / <a href="#" class="logout-link" onclick="logout()">Cerrar sesión</a></p>
                        </div>
                    </div>
                </div>
                
                <div class="row mt-4">
                    <div class="col-md-3">
                        <div class="account-nav">
                            <a href="#" class="account-nav-item active" onclick="showAccountSection('info')">
                                Información personal
                            </a>
                            <a href="#" class="account-nav-item" onclick="showAccountSection('wishlist')">
                                Mi lista de deseos
                            </a>
                            <a href="#" class="account-nav-item" onclick="showAccountSection('orders')">
                                Historial de pedidos
                            </a>
                            <a href="#" class="account-nav-item" onclick="showAccountSection('addresses')">
                                Direcciones
                            </a>
                        </div>
                    </div>
                    
                    <div class="col-md-9">
                        <div class="account-content" id="accountContent">
                            ${generateAccountInfo()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generar información de cuenta
function generateAccountInfo() {
    return `
        <div class="personal-info-section">
            <h2>Información personal</h2>
            <div class="info-group">
                <span class="info-label">Nombre:</span>
                <span class="info-value">${AppState.user.name}</span>
            </div>
            <div class="info-group">
                <span class="info-label">Email:</span>
                <span class="info-value">${AppState.user.email}</span>
            </div>
            <button class="edit-info-btn" onclick="editAccountInfo()">Editar información</button>
        </div>
    `;
}

// Cargar página de login
function loadLoginPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="login-page" style="margin-top: 100px; min-height: 60vh;">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="card shadow">
                            <div class="card-body p-5">
                                <h2 class="text-center mb-4">Iniciar Sesión</h2>
                                <form onsubmit="handleLogin(event)">
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Contraseña</label>
                                        <input type="password" class="form-control" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
                                </form>
                                <hr class="my-4">
                                <p class="text-center">¿No tienes cuenta? <a href="#" onclick="loadRegisterPage()">Regístrate</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Manejar login
function handleLogin(event) {
    event.preventDefault();
    // Simulación de login
    AppState.user = {
        name: 'Nathalie Pagoaga',
        email: 'nathalie.pagoaga@unitec.edu'
    };
    loadAccountPage();
}

// Cargar página de checkout
function loadCheckoutPage() {
    if (AppState.cart.length === 0) {
        loadPage('cart');
        return;
    }
    
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="checkout-page" style="margin-top: 100px; min-height: 60vh;">
            <div class="container">
                <h1 class="text-center mb-4">Checkout</h1>
                <div class="checkout-steps mb-5">
                    <div class="step active">
                        <span class="step-number">1</span>
                        <span>Datos de envío</span>
                    </div>
                    <span class="step-divider"></span>
                    <div class="step">
                        <span class="step-number">2</span>
                        <span>Pago</span>
                    </div>
                    <span class="step-divider"></span>
                    <div class="step">
                        <span class="step-number">3</span>
                        <span>Confirmación</span>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-body">
                                <h3>Datos de Envío</h3>
                                <form onsubmit="handleCheckout(event)">
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label>Nombre Completo</label>
                                            <input type="text" class="form-control" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label>Teléfono</label>
                                            <input type="tel" class="form-control" required>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label>Dirección</label>
                                        <input type="text" class="form-control" required>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label>Ciudad</label>
                                            <input type="text" class="form-control" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label>Código Postal</label>
                                            <input type="text" class="form-control">
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-primary btn-lg w-100">
                                        Continuar al Pago
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <h4>Resumen del Pedido</h4>
                                ${generateCheckoutSummary()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generar resumen de checkout
function generateCheckoutSummary() {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 1000 ? 0 : 100;
    const total = subtotal + shipping;
    
    return `
        <div class="checkout-summary">
            ${AppState.cart.map(item => `
                <div class="d-flex justify-content-between mb-2">
                    <span>${item.name} x${item.quantity}</span>
                    <span>Lps. ${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            `).join('')}
            <hr>
            <div class="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>Lps. ${subtotal.toLocaleString()}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Envío</span>
                <span>${shipping === 0 ? 'GRATIS' : `Lps. ${shipping.toLocaleString()}`}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between h5">
                <span>Total</span>
                <span class="text-primary">Lps. ${total.toLocaleString()}</span>
            </div>
        </div>
    `;
}

// Manejar checkout
function handleCheckout(event) {
    event.preventDefault();
    showNotification('✓ Pedido realizado con éxito!', 'success');
    AppState.cart = [];
    saveCartToStorage();
    updateCartCount();
    loadPage('home');
}