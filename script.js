// Product Data
const products = [
    {
        id: 1,
        name: "Geometric Planter V1",
        price: "$45.00",
        environment: "living-space", // matches data-filter
        tier: "essentials",
        image: "geometric_planter.png",
        description: "A minimal geometric planter designed to elevate your living space.",
        colors: ["#FFFFFF", "#050505", "#E11D48", "#1E40AF"]
    },
    {
        id: 2,
        name: "Headphone Stand Pro",
        price: "$120.00",
        environment: "workspace",
        tier: "signature",
        image: "headphone_stand.png",
        description: "Industrial grade headphone stand with cable management.",
        specs: [
            { label: "Material", value: "Carbon Fiber PLA" },
            { label: "Layer Height", value: "0.1mm" },
            { label: "Weight", value: "350g" }
        ],
        colors: ["Matte Black", "Carbon Gray", "Industrial Silver"]
    },
    {
        id: 3,
        name: "Architectural Desk Org",
        price: "$65.00",
        environment: "workspace",
        tier: "essentials",
        image: "desk_organizer.png",
        description: "Keep your workspace clutter-free with this modular organizer.",
        colors: ["#FFFFFF", "#050505", "#888888"]
    },
    {
        id: 4,
        name: "Abstract Sculpture No. 4",
        price: "$250.00",
        environment: "studio",
        tier: "signature",
        image: "abstract_sculpture.png",
        description: "A limited run generative art piece for the modern studio.",
        specs: [
            { label: "Material", value: "Silk Gold PLA" },
            { label: "Print Time", value: "48 Hours" },
            { label: "Dimensions", value: "20x20x35cm" }
        ],
        colors: ["Gold", "Copper", "Marble White"]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const filterBtns = document.querySelectorAll('.environment-nav li');
    const modalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // 1. Render Products
    function renderProducts(filter = 'all') {
        productGrid.innerHTML = '';
        const filtered = filter === 'all'
            ? products
            : products.filter(p => p.environment === filter);

        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card fade-in';
            card.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">${product.price}</div>
                </div>
            `;

            // Add click listener for modal
            card.addEventListener('click', () => openModal(product));

            productGrid.appendChild(card);
            modalObserver.observe(card);
        });
    }

    // 2. Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            renderProducts(filterValue);
        });
    });

    // 3. Modal Logic
    const modalOverlay = document.getElementById('product-modal');
    const modalBody = document.querySelector('.modal-body');
    const closeModalBtn = document.querySelector('.close-modal');

    function openModal(product) {
        // Build content based on tier
        let contentHTML = '';

        if (product.tier === 'essentials') {
            // Essentials Layout
            contentHTML = `
                <div class="modal-grid">
                    <div class="modal-img-container">
                        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="modal-details">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <p class="product-price" style="font-size: 1.5rem;">${product.price}</p>
                        
                        <div>
                            <label style="color: #666; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Select Finish</label>
                            <div style="display: flex; gap: 10px; margin-top: 10px;">
                                ${product.colors.map(c => `
                                    <div style="width: 30px; height: 30px; border-radius: 50%; background: ${c}; border: 1px solid #333; cursor: pointer;"></div>
                                `).join('')}
                            </div>
                        </div>

                        <a href="#" class="cta-btn" style="text-align: center; margin-top: auto;">Secure Artifact</a>
                    </div>
                </div>
            `;
        } else {
            // Signature Layout
            contentHTML = `
                <div class="modal-grid" style="border: 1px solid var(--accent-red);">
                    <div class="modal-img-container">
                        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="modal-details">
                        <div style="border-bottom: 1px solid #333; padding-bottom: 1rem;">
                            <span style="color: var(--accent-red); font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase;">Signature Series</span>
                            <h2>${product.name}</h2>
                        </div>
                        
                        <div class="modal-specs">
                            <table>
                                ${product.specs.map(s => `
                                    <tr>
                                        <td>${s.label}</td>
                                        <td>${s.value}</td>
                                    </tr>
                                `).join('')}
                            </table>
                        </div>

                        <div style="margin-top: 1rem;">
                            <label style="color: #666; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Technical Finish</label>
                             <select style="width: 100%; background: #111; color: white; border: 1px solid #333; padding: 0.5rem; margin-top: 5px;">
                                ${product.colors.map(c => `<option>${c}</option>`).join('')}
                             </select>
                        </div>

                        <div style="margin-top: 1rem;">
                            <label style="color: #666; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Engineering Requirements</label>
                            <textarea style="width: 100%; background: #111; border: 1px solid #333; color: white; padding: 0.5rem; margin-top: 5px;" rows="3" placeholder="Specify custom tolerances or requirements..."></textarea>
                        </div>

                        <a href="#" class="cta-btn" style="text-align: center; background: var(--accent-red); color: white;">Initialize Order</a>
                    </div>
                </div>
            `;
        }

        modalBody.innerHTML = contentHTML;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // 4. Scroll Reveal
    const fadeElements = document.querySelectorAll('.fade-in, .scroll-reveal');
    fadeElements.forEach(el => modalObserver.observe(el));

    // Initial Render
    renderProducts();
});
