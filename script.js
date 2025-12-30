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

    // Set scrollable height
    // We want enough scroll space to traverse all layers
    // Add extra padding at end to let the last layer sit a bit
    scrollTrack.style.height = `${(layerCount) * depth + 500}px`;

    // Position layers initially
    layers.forEach((layer, index) => {
        const initialZ = -1 * index * depth;
        layer.style.transform = `translateZ(${initialZ}px)`;
        layer.dataset.initialZ = initialZ;
    });

    // Scroll Loop
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;

        // Move the world forward
        const world = document.getElementById('world');
        if (world) {
            world.style.transform = `translateZ(${scrollTop}px)`;
        }

        // "Vaporize" Logic per layer
        layers.forEach(layer => {
            const initialZ = parseFloat(layer.dataset.initialZ);
            const currentZ = initialZ + scrollTop; // Position relative to camera

            // Behind camera (>0)
            if (currentZ > 50) { // Give a little buffer before vanishing
                const distancePast = currentZ - 50;
                // Fast fade out
                const opacity = Math.max(0, 1 - (distancePast / 200));
                // Blur increases as it disappears behind
                const blur = Math.min(20, distancePast / 10);

                layer.style.opacity = opacity;
                layer.style.filter = `blur(${blur}px)`;

                // Hide completely to improve perf once passed
                if (opacity <= 0) layer.style.visibility = 'hidden';
                else layer.style.visibility = 'visible';

            } else {
                // In front of camera (<0)
                const distanceAway = -currentZ;
                let opacity = 1;

                // Fade in from deep distance (> 500px away)
                if (distanceAway > 800) {
                    opacity = 1 - ((distanceAway - 800) / 1000);
                }

                layer.style.opacity = Math.max(0, opacity);
                layer.style.filter = 'blur(0px)';
                layer.style.visibility = 'visible';
            }
        });
    });
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
