// KNR Prints - Global Logic

/* -------------------------------------------------------------------------- */
/*                                PRODUCT DATA                                */
/* -------------------------------------------------------------------------- */
const products = [
    // Workspace Environment
    {
        id: 'ws-001',
        title: 'Mechanical Key Switch',
        category: 'workspace',
        tier: 'signature',
        price: '$120.00',
        specs: ['Dimensions: 24x36"', 'Material: Archival Matte', 'Limited Run: 50'],
        engComment: 'Exploded view of a tactile switch mechanism. Note the gold-plated contact points for optimal actuation.',
        image: null // Placeholder
    },
    {
        id: 'ws-002',
        title: 'Circuit Topology',
        category: 'workspace',
        tier: 'essentials',
        price: '$45.00',
        image: null
    },
    {
        id: 'ws-003',
        title: 'Turbine Blade Schematic',
        category: 'workspace',
        tier: 'signature',
        price: '$140.00',
        specs: ['Dimensions: 18x24"', 'Paper: Cotton Rag 310gsm', 'Signed by Artist'],
        engComment: 'CFD analysis visualization of airflow over a high-pressure turbine blade. Optimization for thermal efficiency.',
        image: null
    },

    // Living Space Environment
    {
        id: 'ls-001',
        title: 'Brutalist Concrete I',
        category: 'living',
        tier: 'essentials',
        price: '$55.00',
        image: null
    },
    {
        id: 'ls-002',
        title: 'Suspension Bridge Node',
        category: 'living',
        tier: 'signature',
        price: '$180.00',
        specs: ['Dimensions: 30x40"', 'Frame: Aluminium', 'Museum Glass'],
        engComment: 'Detailed study of the main cable anchorage point. Tensile forces are distributed through the radial steel array.',
        image: null
    },
    {
        id: 'ls-003',
        title: 'Fluid Dynamics Abstract',
        category: 'living',
        tier: 'essentials',
        price: '$60.00',
        image: null
    },

    // Studio Environment
    {
        id: 'st-001',
        title: 'Camera Lens Cross-Section',
        category: 'studio',
        tier: 'signature',
        price: '$150.00',
        specs: ['Dimensions: 24x24"', 'Finish: Satin', 'Technical Grade'],
        engComment: 'Internal optical assembly of a prime lens. 14 elements in 10 groups with aspherical correction.',
        image: null
    },
    {
        id: 'st-002',
        title: 'Color Theory Wheel',
        category: 'studio',
        tier: 'essentials',
        price: '$40.00',
        image: null
    },
    {
        id: 'st-003',
        title: 'Acoustic Waveform',
        category: 'studio',
        tier: 'signature',
        price: '$130.00',
        specs: ['Dimensions: 12x48"', 'Sound dampening backing', 'Custom scale'],
        engComment: 'Visual representation of a sine sweep from 20Hz to 20kHz. The fundamental building block of audio engineering.',
        image: null
    }
];

/* -------------------------------------------------------------------------- */
/*                               INITIALIZATION                               */
/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Check for 3D World (Homepage)
    const world = document.getElementById('world');
    if (world) {
        init3DScroll();
    }

    // 2. Check for Product Grid (Sub-pages)
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        // Determine page context via URL or simple body check
        // For simplicity, let's look at the window.location.pathname

        const path = window.location.pathname;
        if (path.includes('collections.html')) {
            renderProducts('signature');
        } else if (path.includes('essentials.html')) {
            renderProducts('essentials');
        } else {
            // Fallback for general gallery if exists
            renderProducts('all');
        }
    }
});

// 3. Mobile Menu Logic
const hamburger = document.querySelector('.hamburger');
const mobileOverlay = document.querySelector('.mobile-nav-overlay');
const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close when link clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close if clicked outside (on overlay)
    mobileOverlay.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) {
            hamburger.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

/* -------------------------------------------------------------------------- */
/*                              3D SCROLL LOGIC                               */
/* -------------------------------------------------------------------------- */

function init3DScroll() {
    const layers = document.querySelectorAll('.layer');
    const scrollTrack = document.querySelector('.scroll-track');
    const depth = 1000; // Distance between layers
    const layerCount = layers.length;

    // Position layers initially
    layers.forEach((layer, index) => {
        const initialZ = -1 * index * depth;
        layer.style.transform = `translateZ(${initialZ}px)`;
        layer.dataset.initialZ = initialZ;
    });

    // Set scroll track height
    // Reduce buffer to prevent "black page" at end
    const totalDepth = (layers.length - 1) * depth;
    // Just enough interaction space + viewport height to finish scrolling
    scrollTrack.style.height = `${totalDepth + window.innerHeight}px`;

    // Initial Position
    function updateScroll() {
        const scrollTop = window.scrollY;

        // Move World
        const world = document.getElementById('world');
        if (world) {
            world.style.transform = `translateZ(${scrollTop}px)`;
        }

        // Vaporize Effect
        layers.forEach((layer, index) => {
            const layerZ = index * -depth; // Layer's original Z
            const currentZ = layerZ + scrollTop; // Position relative to camera (0)

            let opacity = 1;
            let blur = 0;
            // Z=0 is screen plane. Z=1000 is the user's eye (roughly).
            // We want to fade OUT as it comes towards us (pos Z).
            // Let's start fading at Z=100 and be gone by Z=600.
            const fadeStart = 100;
            const fadeEnd = 600;

            if (currentZ > fadeStart) {
                // Approaching eye
                const progress = (currentZ - fadeStart) / (fadeEnd - fadeStart);
                opacity = 1 - Math.max(0, Math.min(1, progress));
                blur = Math.max(0, Math.min(1, progress)) * 20;
            }

            // Clickability/Visibility Fix:
            // If it's starting to fade out significantly (passed camera), disable interactions
            // to allow clicks to pass through to the next layer (which is coming into view).
            // Threshold increased to 0.5 to unlock next layer sooner.
            if (opacity < 0.5) {
                layer.classList.add('passed'); // CSS handles pointer-events: none
                layer.classList.remove('active-layer');
            } else {
                layer.classList.remove('passed');
                layer.classList.add('active-layer');
            }

            // In front of camera check for deep fade in
            // Ideally we only want to fade out when passing, but let's keep it simple.
            // If it's way in front (e.g. -2000), it might be nice to fade it in too
            // But user didn't ask for that, just fix the clickability.

            layer.style.opacity = opacity;
            layer.style.filter = `blur(${blur}px)`;
        });

        requestAnimationFrame(updateScroll);
    }

    // Start loop
    window.addEventListener('scroll', () => {
        // Just trigger via rAF loop essentially or native scroll
        // Since we use rAF inside updateScroll for the loop if we wanted continuous
        // OR we can just bind to scroll.
        // Let's bind to scroll for efficiency, but updateScroll requests its own frame?
        // Actually the previous code had rAF loop. Let's stick to scroll listener for simple state updates.
    });

    // Better pattern:
    updateScroll();
    window.addEventListener('scroll', updateScroll);
}

/* -------------------------------------------------------------------------- */
/*                            PRODUCT RENDER LOGIC                            */
/* -------------------------------------------------------------------------- */

function renderProducts(filterMode = 'all') {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = '';

    let filteredProducts = products;
    if (filterMode === 'signature') {
        filteredProducts = products.filter(p => p.tier === 'signature');
    } else if (filterMode === 'essentials') {
        filteredProducts = products.filter(p => p.tier === 'essentials');
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = `product-card ${product.tier}`;

        // Build card HTML
        let specsHtml = '';
        if (product.tier === 'signature' && product.specs) {
            specsHtml = `
                <ul class="specs-list">
                    ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
                </ul>
            `;
        }

        let commentHtml = '';
        if (product.tier === 'signature' && product.engComment) {
            commentHtml = `<div class="eng-comment">// ENG: ${product.engComment}</div>`;
        }

        const tierLabel = product.tier === 'signature' ? 'Signature Series' : 'Essentials';
        const tierClass = product.tier === 'signature' ? 'tier-signature' : 'tier-essentials';

        card.innerHTML = `
            <div class="card-image-wrapper">
                <!-- Placeholder -->
                <div class="card-image-placeholder">
                    <span>${product.title}</span>
                </div>
            </div>
            <div class="card-content">
                <div class="card-header">
                    <span class="card-category">${product.category}</span>
                    <span class="card-tier ${tierClass}">${tierLabel}</span>
                </div>
                <h3 class="card-title">${product.title}</h3>
                <div class="card-price">${product.price}</div>
                
                ${specsHtml}
                ${commentHtml}
                
                <div class="card-meta">
                    <a href="#" class="btn-text">View Details →</a>
                </div>
            </div>
        `;

        productGrid.appendChild(card);
    });
}

/* -------------------------------------------------------------------------- */
/*                             DYNAMIC PRODUCT LOGIC                           */
/* -------------------------------------------------------------------------- */

const productDatabase = {
    // KINETIC SERIES
    'k_turbine': {
        title: 'Turbine Cross-Section',
        price: '240.00',
        desc: 'A detailed cutaway of a high-bypass turbofan engine, revealing the intricate blade geometry and compression stages. Perfect for aviation enthusiasts.',
        series: 'Kinetic',
        colors: ['#D4AF37', '#C0C0C0', '#cd7f32', '#333333'] // Gold, Silver, Bronze, Charcoal
    },
    'k_v12': {
        title: 'V12 Piston Assembly',
        price: '180.00',
        desc: 'Exploded view of a performance engine cylinder block, showcasing the piston, connecting rod, and crankshaft relationship in motion.',
        series: 'Kinetic',
        colors: ['#D4AF37', '#C0C0C0', '#cd7f32', '#333333']
    },
    'k_diff': {
        title: 'Differential Gear Set',
        price: '160.00',
        desc: 'Topological study of limited-slip differential gears. The mathematical beauty of torque distribution visualized.',
        series: 'Kinetic',
        colors: ['#D4AF37', '#C0C0C0', '#cd7f32', '#333333']
    },
    'k_hydro': {
        title: 'Hydraulic Actuator',
        price: '210.00',
        desc: 'Schematic of heavy machinery fluid dynamics. Power transfer through pressurized systems.',
        series: 'Kinetic',
        colors: ['#D4AF37', '#C0C0C0', '#cd7f32', '#333333']
    },
    'k_pump': {
        title: 'Centrifugal Pump',
        price: '195.00',
        desc: 'Flow analysis diagram of industrial pumping systems. The spiral volute geometry is a masterpiece of efficiency.',
        series: 'Kinetic',
        colors: ['#D4AF37', '#C0C0C0', '#cd7f32', '#333333']
    },
    'k_cam': {
        title: 'Camshaft Profile',
        price: '155.00',
        desc: 'Precision lift and duration geometry curves of a racing camshaft. Engineering at the micron level.',
        series: 'Kinetic',
        colors: ['#D4AF37', '#C0C0C0', '#cd7f32', '#333333']
    },
    'k_rotor': {
        title: 'Rotary Engine Rotor',
        price: '225.00',
        desc: 'Wankel engine combustion cycle visualization. The unique Reuleaux triangle in action.',
        series: 'Kinetic',
        colors: ['#D4AF37', '#C0C0C0', '#cd7f32', '#333333']
    },
    'k_trans': {
        title: 'Transmission Logic',
        price: '280.00',
        desc: 'Complex valve body pathways for automatic shifting. A labyrinth of fluid logic.',
        series: 'Kinetic',
        colors: ['#D4AF37', '#C0C0C0', '#cd7f32', '#333333']
    },

    // STRUCTURAL SERIES (Colors: Concrete, Steel Blue, Rust, Black)
    's_bridge': {
        title: 'Suspension Bridge Node',
        price: '320.00',
        desc: 'Analysis of main cable connection points and tension limits on a mega-structure bridge.',
        series: 'Structural',
        colors: ['#8c8c8c', '#4682B4', '#8B4513', '#1a1a1a']
    },
    's_beam': {
        title: 'I-Beam Stress Map',
        price: '190.00',
        desc: 'Load path visualization under maximum localized stress on a standard universal beam.',
        series: 'Structural',
        colors: ['#8c8c8c', '#4682B4', '#8B4513', '#1a1a1a']
    },
    's_dome': {
        title: 'Geodesic Dome Joint',
        price: '210.00',
        desc: 'Vertex connection detail for spherical structures. Buckminster Fuller\'s vision in print.',
        series: 'Structural',
        colors: ['#8c8c8c', '#4682B4', '#8B4513', '#1a1a1a']
    },
    's_sky': {
        title: 'The Skyscraper Core',
        price: '280.00',
        desc: 'Cross-section of elevator shaft and wind bracing systems in a supertall building.',
        series: 'Structural',
        colors: ['#8c8c8c', '#4682B4', '#8B4513', '#1a1a1a']
    },
    's_cant': {
        title: 'Cantilever Reinforcement',
        price: '175.00',
        desc: 'Rebar placement layout for extended concrete spans. The hidden strength within.',
        series: 'Structural',
        colors: ['#8c8c8c', '#4682B4', '#8B4513', '#1a1a1a']
    },
    's_truss': {
        title: 'Steel Truss Geometry',
        price: '165.00',
        desc: 'Warren truss triangulation efficiency study. Classic structural engineering.',
        series: 'Structural',
        colors: ['#8c8c8c', '#4682B4', '#8B4513', '#1a1a1a']
    },
    's_dam': {
        title: 'Buttress Dam Section',
        price: '240.00',
        desc: 'Hydrostatic pressure resistance engineering for massive water containment.',
        series: 'Structural',
        colors: ['#8c8c8c', '#4682B4', '#8B4513', '#1a1a1a']
    },
    's_isolator': {
        title: 'Seismic Isolator',
        price: '295.00',
        desc: 'Base isolation bearing for earthquake resistance. Engineering for safety and motion.',
        series: 'Structural',
        colors: ['#8c8c8c', '#4682B4', '#8B4513', '#1a1a1a']
    },

    // AEROSPACE SERIES (Colors: White, Orbit Blue, Heat Shield Orange, Carbon)
    'a_falcon': {
        title: 'Falcon Trajectory',
        price: '260.00',
        desc: 'Orbital insertion path mathematics and velocity charts for heavy lift vehicles.',
        series: 'Aerospace',
        colors: ['#ffffff', '#000080', '#FF4500', '#222222']
    },
    'a_naca': {
        title: 'NACA 2412 Airfoil',
        price: '185.00',
        desc: 'Classic camber profiles emphasizing lift coefficients. The shape of flight.',
        series: 'Aerospace',
        colors: ['#ffffff', '#000080', '#FF4500', '#222222']
    },
    'a_nozzle': {
        title: 'Rocket Nozzle Bell',
        price: '230.00',
        desc: 'De Laval nozzle expansion ratio blueprint. Optimizing thrust in vacuum.',
        series: 'Aerospace',
        colors: ['#ffffff', '#000080', '#FF4500', '#222222']
    },
    'a_inlet': {
        title: 'SR-71 Inlet Spike',
        price: '310.00',
        desc: 'Supersonic shockwave management geometry. Mastering air at Mach 3.',
        series: 'Aerospace',
        colors: ['#ffffff', '#000080', '#FF4500', '#222222']
    },
    'a_heli': {
        title: 'Helicopter Rotor Head',
        price: '275.00',
        desc: 'Cyclic and collective pitch mechanism details. Complexity in rotation.',
        series: 'Aerospace',
        colors: ['#ffffff', '#000080', '#FF4500', '#222222']
    },
    'a_station': {
        title: 'Space Station Module',
        price: '350.00',
        desc: 'Pressure vessel and docking port schematic. Living in the void.',
        series: 'Aerospace',
        colors: ['#ffffff', '#000080', '#FF4500', '#222222']
    },
    'a_solar': {
        title: 'Satellite Solar Array',
        price: '210.00',
        desc: 'Deployment hinge and photovoltaic cell layout. Harvesting stellar energy.',
        series: 'Aerospace',
        colors: ['#ffffff', '#000080', '#FF4500', '#222222']
    },
    'a_lander': {
        title: 'Landing Hexapod',
        price: '295.00',
        desc: 'Lunar lander shock absorption leg design. Touching down on alien worlds.',
        series: 'Aerospace',
        colors: ['#ffffff', '#000080', '#FF4500', '#222222']
    }
};

function initProductPage() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const product = productDatabase[productId];

    if (!product) {
        // Handle invalid ID (could redirect or show error)
        document.getElementById('product-title').innerText = 'Product Not Found';
        document.getElementById('product-desc').innerText = 'The item you are looking for does not exist.';
        return;
    }

    // Populate Data
    document.getElementById('product-title').innerText = product.title;
    document.getElementById('product-price').innerText = '$' + product.price;
    document.getElementById('product-desc').innerText = product.desc;
    
    // Breadcrumb Category
    const breadcrumbSpan = document.getElementById('category-crumb');
    breadcrumbSpan.innerText = product.series;
    
    // Image Placeholder
    const mainImg = document.getElementById('product-main-image');
    mainImg.innerText = product.title; // Placeholder text
    if(product.series === 'Kinetic') mainImg.style.background = 'radial-gradient(circle, #333, #000)';
    if(product.series === 'Structural') mainImg.style.background = 'radial-gradient(circle, #2a2a2a, #111)';
    if(product.series === 'Aerospace') mainImg.style.background = 'radial-gradient(circle, #1f1f1f, #050505)';

    // Colors
    const colorSelector = document.getElementById('color-selector');
    colorSelector.innerHTML = ''; // Clear existing
    product.colors.forEach((color, index) => {
        const div = document.createElement('div');
        div.className = 'color-option';
        div.style.backgroundColor = color;
        if (index === 0) div.classList.add('active'); // Select first by default
        
        div.addEventListener('click', () => {
             document.querySelectorAll('.color-option').forEach(el => el.classList.remove('active'));
             div.classList.add('active');
        });
        colorSelector.appendChild(div);
    });

    // Quantity Logic
    const qtyInput = document.getElementById('qty-input');
    const btnMinus = document.getElementById('qty-minus');
    const btnPlus = document.getElementById('qty-plus');

    btnMinus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val > 1) qtyInput.value = val - 1;
    });

    btnPlus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val < 10) qtyInput.value = val + 1;
    });
}
