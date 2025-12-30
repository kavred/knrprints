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
            // If it's passed the fadeEnd, it's invisible/gone.
            if (opacity < 0.05) {
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
