// ==========================================
// 1. DATA (Qalereya və Reytinq Əlavə Edildi)
// ==========================================
// ==========================================
// 8. FOOTER MODALLARI VƏ MƏLUMAT BAZASI
// ==========================================
// Promo Kod və Çatdırılma State
let activeDiscount = 0; // Faizlə (məs: 0.10)
const DELIVERY_FEE = 5.00;

// ==========================================
// 1. PROMO KOD SİSTEMİ
// ==========================================
function applyPromoCode() {
    const code = document.getElementById('promo-input').value.trim().toUpperCase();
    if (code === "YENI2026") {
        activeDiscount = 0.10; // 10% endirim
        showToast("10% endirim tətbiq olundu!", "success");
    } else {
        activeDiscount = 0;
        showToast("Yanlış promo kod!", "error");
    }
    updateCartUI();
}

// ==========================================
// 2. YENİLƏNMİŞ SƏBƏT (5 AZN Çatdırılma ilə)
// ==========================================
function updateCartUI() {
    const container = document.getElementById('cart-items');
    const cartFooter = document.querySelector('.cart-footer');
    
    if (!container || !cartFooter) return;
    
    container.innerHTML = ''; 
    let subtotal = 0;
    let count = 0;

    // 1. Səbət boşdursa göstərilən vizual
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
                <div style="font-size:3rem; margin-bottom:10px;">🛒</div>
                <p>Səbətiniz boşdur.</p>
                <button class="btn btn-primary btn-sm" style="margin-top:15px;" onclick="toggleCart()">Kəşf et</button>
            </div>`;
        document.getElementById('cart-count').innerText = '0';
        cartFooter.innerHTML = `
            <div class="cart-total"><span>Cəmi:</span><span>0.00 ₼</span></div>
            <button class="btn btn-primary btn-full" disabled>Səbət Boşdur</button>`;
        return;
    }

    // 2. Məhsulların render edilməsi və subtotalın hesablanması
    cart.forEach(item => {
        subtotal += parseFloat(item.price) * parseInt(item.quantity);
        count += parseInt(item.quantity);
        
        const sizeHTML = item.selectedSize ? `<div class="cart-item-meta">Ölçü: ${item.selectedSize}</div>` : '';
        
        container.innerHTML += `
            <div class="cart-item" style="position:relative; margin-bottom:15px; background:var(--bg-color); padding:12px; border-radius:12px;">
                <img src="${item.image}" style="width:70px; height:70px; object-fit:cover; border-radius:8px;">
                <div class="cart-item-info" style="margin-left:12px; flex:1;">
                    <h4 style="font-size:0.95rem; margin-bottom:4px; padding-right:20px;">${item.name}</h4>
                    ${sizeHTML}
                    <div style="color:var(--primary); font-weight:700; font-size:1rem;">${item.price.toFixed(2)} ₼</div>
                    <div class="quantity-controls" style="display:flex; align-items:center; gap:10px; margin-top:8px;">
                        <button onclick="updateQuantity('${item.cartItemId}', -1)" style="width:25px; height:25px; border-radius:4px; border:1px solid var(--border-color); cursor:pointer;">-</button>
                        <span style="font-weight:600;">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.cartItemId}', 1)" style="width:25px; height:25px; border-radius:4px; border:1px solid var(--border-color); cursor:pointer;">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.cartItemId}')" style="position:absolute; top:12px; right:12px; background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.2rem;">&times;</button>
            </div>`;
    });

    // 3. KRİTİK HESABLAMA (XƏTASIZ MƏNTİQ)
    const freeDeliveryLimit = 50;
    const deliveryFee = subtotal >= freeDeliveryLimit ? 0 : 5.00;
    const discountAmount = subtotal * activeDiscount;
    const finalTotal = (subtotal - discountAmount) + deliveryFee;

    // 4. Footer hissəsinin (Promo kod və Cəmi məbləğ) qurulması
    cartFooter.innerHTML = `
        <div class="promo-section" style="margin-bottom:15px; display:flex; gap:8px;">
            <input type="text" id="promo-input" placeholder="Promo kod (YENI2026)" style="flex:1; padding:10px; border:1px solid var(--border-color); border-radius:10px; background:var(--bg-color); color:var(--text-main); font-size:0.85rem; outline:none;">
            <button class="btn btn-primary btn-sm" onclick="applyPromoCode()" style="border-radius:10px;">Ok</button>
        </div>
        
        <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:12px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span>Məhsullar:</span> 
                <span style="color:var(--text-main); font-weight:600;">${subtotal.toFixed(2)} ₼</span>
            </div>
            
            ${activeDiscount > 0 ? `
            <div style="display:flex; justify-content:space-between; color:#10b981; margin-bottom:6px;">
                <span>Endirim (10%):</span> 
                <span>-${discountAmount.toFixed(2)} ₼</span>
            </div>` : ''}
            
            <div style="display:flex; justify-content:space-between;">
                <span>Çatdırılma:</span> 
                <span style="color:${deliveryFee === 0 ? '#10b981' : 'var(--primary)'}; font-weight:700;">
                    ${deliveryFee === 0 ? 'PULSUZ' : '+5.00 ₼'}
                </span>
            </div>
        </div>

        <div class="cart-total" style="margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:1.1rem; font-weight:500;">Yekun Məbləğ:</span>
            <span id="cart-total-price" style="font-size:1.4rem; font-weight:800; color:var(--text-main);">${finalTotal.toFixed(2)} ₼</span>
        </div>

        <button class="btn btn-primary btn-full" onclick="checkout()" style="border-radius:12px; height:55px; font-size:1.1rem;">
            Sifarişi Təsdiqlə
        </button>
    `;

    // Səbət ikonundakı rəqəmi yenilə
    document.getElementById('cart-count').innerText = count;
}
const infoData = {
    delivery: {
        title: "Çatdırılma və Ödəniş",
        content: "Sifarişləriniz təsdiqləndikdən sonra <b>ən gec 24 saat ərzində</b> qapınıza çatdırılır. Ödənişi həm onlayn bank kartı ilə, həm də qapıda kuryerə nağd şəkildə həyata keçirə bilərsiniz. Paytaxt daxili çatdırılma tamamilə pulsuzdur."
    },
    returns: {
        title: "Qaytarma Şərtləri",
        content: "Müştəri məmnuniyyəti bizim üçün önəmlidir. Məhsulu təhvil aldıqdan sonra 14 gün ərzində heç bir səbəb göstərmədən qaytara bilərsiniz. Qaytarılan məhsulun qablaşdırması zədələnməməli və məhsulda istifadə izləri olmamalıdır."
    },
    warranty: {
        title: "Rəsmi Zəmanət",
        content: "Platformamızda satılan bütün elektronika və avtomobil aksesuarlarına 1 illik rəsmi zəmanət təqdim edilir. Geyimlərdə və ayaqqabılarda isə istehsal qüsurlarına qarşı 6 aylıq zəmanət mövcuddur."
    },
    contact: {
        title: "Bizimlə Əlaqə",
        content: "Sizə kömək etməkdən məmnun olarıq!<br><br>📍 <b>Ünvan:</b> Bakı şəh, Nizami küç. 42<br>📞 <b>Telefon:</b> +994 50 123 45 67<br>✉️ <b>E-poçt:</b> support@ulvon.az<br>🕒 <b>İş saatları:</b> Həftənin 7 günü, 24 saat xidmətinizdəyik."
    }
};

function openInfoModal(type) {
    // Eğer bir event gelirse (isteğe bağlı), yukarı kaydırmayı durdur
    if (window.event) {
        window.event.preventDefault();
    }

    const data = infoData[type];
    if (data) {
        document.getElementById('info-title').innerText = data.title;
        document.getElementById('info-content').innerHTML = data.content;
        document.getElementById('info-modal-overlay').classList.add('active');

        // Sayfanın arkada kaymasını engelle
        document.body.style.overflow = 'hidden';
    }
}

function closeInfoModal() {
    document.getElementById('info-modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Global closeModals funksiyasını da güncəlləyirik ki, kənara basanda bu modal da bağlansın
const oldCloseModals = window.closeModals;
window.closeModals = function (e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeProductModal();
        closeAuthModal();
        closeProfileModal();
        closeInfoModal(); // Yeni əlavə
    }
}
const products = [

    {
        id: 1, name: "Pro Futbol Ayaqqabısı (Qara)", category: "Ayaqqabı", price: 185.00, oldPrice: 210.00,
        sizes: ["39", "40", "41", "42", "43", "44"], rating: 4.8, reviews: 124, color: "Qara",
        description: "Meydanda mükəmməl top nəzarəti. Güclü zərbələr üçün asimmetrik bağcıq.",
        image: "https://placehold.co/600x600/1e293b/ffffff?text=Futbol+Ayaqqabisi",
        gallery: ["https://placehold.co/600x600/1e293b/ffffff?text=Futbol+Ayaqqabisi"]
    },
    {
        id: 2, name: "Parabola Həndəsi T-Shirt", category: "Geyim", price: 45.00,
        sizes: ["S", "M", "L", "XL"], rating: 4.9, reviews: 89,
        description: "Kvadratik funksiya detalları ilə bəzədilmiş 100% premium pambıq köynək.",
        image: "https://placehold.co/600x600/475569/ffffff?text=Parabola+T-Shirt",
        gallery: [
            "https://placehold.co/600x600/475569/ffffff?text=Parabola+T-Shirt",
            "https://placehold.co/600x600/64748b/ffffff?text=Arxa+Dizayn"
        ]
    },
    {
        id: 3, name: "Gündəlik Krossovka (Ağ)", category: "Ayaqqabı", price: 120.00,
        sizes: ["40", "41", "42", "43"], rating: 4.5, reviews: 210,
        description: "Şəhər mühitində gündəlik istifadə üçün yüngül, ortopedik altlıqlı rahat ayaqqabı.",
        image: "https://placehold.co/600x600/f8fafc/0f172a?text=Ağ+Krossovka",
        gallery: ["https://placehold.co/600x600/f8fafc/0f172a?text=Ağ+Krossovka", "https://placehold.co/600x600/e2e8f0/0f172a?text=Detallar"]
    },
    {
        id: 4, name: "Premium L405 Avto-Tutacaq", category: "Aksesuar", price: 55.00,
        sizes: [], rating: 4.7, reviews: 56,
        description: "Lüks avtomobillər üçün maqnitli telefon tutacağı.",
        image: "https://placehold.co/600x600/0f172a/ffffff?text=Avto+Tutacaq",
        gallery: ["https://placehold.co/600x600/0f172a/ffffff?text=Avto+Tutacaq"]
    }
];

// ==========================================
// 2. STATE VƏ BAŞLANĞIC
// ==========================================
let cart = JSON.parse(localStorage.getItem('ulvon_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('ulvon_user')) || null;
let wishlist = JSON.parse(localStorage.getItem('ulvon_wishlist')) || [];
let activeCategory = 'All'; let activeSort = 'default'; let searchQuery = ''; let currentSelectedSize = null;

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderProducts();
    updateCartUI();
    checkAuthStatus();
    initScrollAnimations();
});

// ==========================================
// 3. QARANLIQ REJİM (DARK MODE) VƏ MOBİL MENYU
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('ulvon_theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('theme-icon').innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ulvon_theme', newTheme);
    initTheme(); // İkonu yeniləmək üçün
}

function toggleMenu() {
    document.getElementById('nav-links').classList.toggle('active');
}

// ==========================================
// 4. MƏHSUL RENDERİ VƏ FİLTRLƏMƏ
// ==========================================
function renderProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    productList.innerHTML = '';

    // 1. Filtrləmə Məntiqi (Kateqoriya, Axtarış və Qiymət Aralığı)
    let filtered = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
        return matchesCategory && matchesSearch && matchesPrice;
    });

    // 2. Sıralama Məntiqi (Ucuzdan bahaya / Bahadan ucuza)
    if (activeSort === 'low-to-high') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'high-to-low') {
        filtered.sort((a, b) => b.price - a.price);
    }

    // 3. Məhsul Tapılmadıqda Mesaj
    if (filtered.length === 0) {
        productList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--text-muted);">
                <p>Axtarışınıza uyğun məhsul tapılmadı.</p>
            </div>`;
        return;
    }

    // 4. Məhsulların DOM-a Əlavə Edilməsi
    filtered.forEach(p => {
        const isWished = wishlist.includes(p.id);
        const card = document.createElement('div');
        card.className = 'product-card reveal active';

        // Reytinq ulduzlarının yaradılması
        const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));

        // Qiymət vizualı (Endirim varsa köhnə qiymətin göstərilməsi)
const priceHTML = p.oldPrice 
    ? `<span class="old-price">${p.oldPrice.toFixed(2)} ₼</span> <span style="color:#ef4444">${p.price.toFixed(2)} ₼</span>`
    : `<span>${p.price.toFixed(2)} ₼</span>`;

const discountBadge = p.oldPrice ? `<div class="discount-badge">Endirim</div>` : '';

// Kart HTML-nə əlavə edin...
        card.innerHTML = `
            ${discountBadge}
            <div class="wishlist-icon ${isWished ? 'active' : ''}" onclick="toggleWishlistItem(event, ${p.id})" style="position: absolute; top: 15px; right: 15px; z-index: 10; cursor: pointer; transition: 0.3s;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWished ? '#ef4444' : 'none'}" stroke="${isWished ? '#ef4444' : 'currentColor'}" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
            </div>
            <div class="product-img-wrapper" onclick="openProductModal(${p.id})" style="width: 100%; height: 280px; overflow: hidden; background: #f1f5f9; cursor: pointer;">
                <img src="${p.image}" class="product-img" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: 0.5s;">
            </div>
            <div class="product-info" onclick="openProductModal(${p.id})" style="padding: 20px; cursor: pointer;">
                <div class="product-category" style="font-size: 0.75rem; font-weight: 600; color: var(--primary); text-transform: uppercase; margin-bottom: 5px;">${p.category}</div>
                <h3 class="product-title" style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</h3>
                <div class="product-rating" style="color: #fbbf24; font-size: 0.9rem; margin-bottom: 10px;">
                    ${stars} <span style="color: var(--text-muted); font-size: 0.8rem; margin-left: 5px;">(${p.reviews})</span>
                </div>
                <div class="product-price" style="font-size: 1.3rem;">
                    ${priceHTML}
                </div>
            </div>
        `;
        productList.appendChild(card);
    });

    // Wishlist sayğacını yenilə
    const wishlistCountLabel = document.getElementById('wishlist-count');
    if (wishlistCountLabel) {
        wishlistCountLabel.innerText = wishlist.length;
    }
}

function setCategoryFilter(cat) {
    activeCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText === cat || (cat === 'All' && btn.innerText === 'Hamısı')) btn.classList.add('active');
    });
    renderProducts();
}
function handleSearch() { searchQuery = document.getElementById('search-input').value; renderProducts(); }
function handleSort() { activeSort = document.getElementById('sort-select').value; renderProducts(); }

// ==========================================
// 5. MƏHSUL MODALI VƏ QALEREYA
// ==========================================
let minPrice = 0;
let maxPrice = 10000;

function handlePriceFilter() {
    minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    maxPrice = parseFloat(document.getElementById('max-price').value) || 10000;
    renderProducts();
}

// renderProducts funksiyasındakı filtered hissəsini belə yeniləyin:
let filtered = products.filter(p => {
    return (activeCategory === 'All' || p.category === activeCategory) && 
           p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
           p.price >= minPrice && p.price <= maxPrice;
});
function openProductModal(id) {
    const p = products.find(i => i.id === id);
    if (!p) return;
    currentSelectedSize = null;

    let sizesHTML = '';
    if (p.sizes && p.sizes.length > 0) {
        sizesHTML = `<div class="size-selector"><h4>Ölçü Seçin:</h4><div class="sizes-container" id="modal-sizes">
            ${p.sizes.map(s => `<button class="size-btn" onclick="selectSize(this, '${s}')">${s}</button>`).join('')}
        </div></div>`;
    }

    // Qalereya HTML
    const galleryThumbs = p.gallery.map((img, idx) =>
        `<img src="${img}" class="thumb ${idx === 0 ? 'active' : ''}" onclick="changeMainImage(this, '${img}')">`
    ).join('');

    const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));

    document.getElementById('product-modal-body').innerHTML = `
        <div class="product-detail-grid">
            <div class="gallery-container">
                <img src="${p.image}" class="main-img" id="main-product-img">
                <div class="thumbnails">${galleryThumbs}</div>
            </div>
            <div class="product-detail-content">
                <div class="product-category">${p.category}</div>
                <h2>${p.name}</h2>
                <div class="product-rating" style="margin-bottom: 20px; font-size:1.1rem;">${stars} <span style="color:var(--text-muted)">(${p.rating} / 5)</span></div>
                <div class="product-price" style="font-size:2rem; margin-bottom: 20px; color:var(--primary);">${p.price.toFixed(2)} ₼</div>
                <p>${p.description}</p>
                ${sizesHTML}
                <button class="btn btn-primary btn-full" onclick="addToCart(${p.id})">Səbətə At</button>
            </div>
        </div>
    `;
    document.getElementById('product-modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function changeMainImage(el, src) {
    document.getElementById('main-product-img').src = src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

function selectSize(btn, size) {
    currentSelectedSize = size;
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}
function closeProductModal() { document.getElementById('product-modal-overlay').classList.remove('active'); document.body.style.overflow = ''; }

// ==========================================
// 6. SƏBƏT VƏ CHECKOUT (SİFARİŞLƏRƏ ƏLAVƏ)
// ==========================================
function addToCart(id) {
    const p = products.find(i => i.id === id);
    if (p.sizes.length > 0 && !currentSelectedSize) return showToast("Zəhmət olmasa ölçü seçin", "error");

    const cartId = currentSelectedSize ? `${p.id}-${currentSelectedSize}` : `${p.id}`;
    const exist = cart.find(i => i.cartItemId === cartId);
    if (exist) exist.quantity += 1;
    else cart.push({ ...p, cartItemId: cartId, selectedSize: currentSelectedSize, quantity: 1 });

    saveCart(); updateCartUI(); closeProductModal();
    if (!document.getElementById('cart-sidebar').classList.contains('active')) toggleCart();
    showToast("Səbətə əlavə edildi!", "success");
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const cartFooter = document.querySelector('.cart-footer');
    if (!container || !cartFooter) return;
    
    container.innerHTML = ''; 
    let subtotal = 0;

    if (cart.length === 0) {
        // ... (Səbət boşdursa göstərilən hissə eynidir)
        return;
    }

    cart.forEach(item => {
        subtotal += parseFloat(item.price) * parseInt(item.quantity);
    });

    // --- YENİ: PULSUZ ÇATDIRILMA PROQRES BARI ---
    const freeLimit = 50;
    const remaining = freeLimit - subtotal;
    const progressPercent = Math.min((subtotal / freeLimit) * 100, 100);
    
    let deliveryMessage = "";
    if (subtotal >= freeLimit) {
        deliveryMessage = `<div style="color:#10b981; font-weight:700; font-size:0.85rem;">Təbriklər! Çatdırılmanız artıq <span style="text-decoration:underline;">PULSUZDUR!</span> 🎉</div>`;
    } else {
        deliveryMessage = `<div style="color:var(--text-muted); font-size:0.85rem;">Pulsuz çatdırılma üçün daha <b>${remaining.toFixed(2)} ₼</b>-lik məhsul əlavə edin.</div>`;
    }

    const progressBarHTML = `
        <div class="delivery-progress-wrapper" style="padding:15px; background:var(--bg-color); border-radius:15px; margin-bottom:20px; border:1px solid var(--border-color);">
            ${deliveryMessage}
            <div class="progress-bg" style="width:100%; height:8px; background:var(--border-color); border-radius:10px; margin-top:10px; overflow:hidden;">
                <div class="progress-fill" style="width:${progressPercent}%; height:100%; background:linear-gradient(90deg, var(--primary), #10b981); transition: 0.5s ease-out;"></div>
            </div>
        </div>
    `;
    
    // Proqres barını konteynerin ən başına əlavə edirik
    container.innerHTML = progressBarHTML;

    // ... (Bundan sonra məhsulların loop ilə əlavə olunması davam edir)
    cart.forEach(item => {
        const sizeHTML = item.selectedSize ? `<div class="cart-item-meta">Ölçü: ${item.selectedSize}</div>` : '';
        container.innerHTML += `
            <div class="cart-item" style="position:relative;">
                <img src="${item.image}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>${sizeHTML}
                    <div style="font-weight:700;">${item.price.toFixed(2)} ₼</div>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.cartItemId}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.cartItemId}', 1)">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.cartItemId}')" class="remove-btn">&times;</button>
            </div>`;
    });

    // --- HESABLAMA VƏ FOOTER HİSSƏSİ ---
    const deliveryFee = subtotal >= freeLimit ? 0 : 5.00;
    const discountValue = subtotal * activeDiscount;
    const grandTotal = (subtotal - discountValue) + deliveryFee;

    cartFooter.innerHTML = `
        <div class="promo-section" style="margin-bottom:15px; display:flex; gap:8px;">
            <input type="text" id="promo-input" placeholder="Promo kod" style="flex:1; padding:10px; border:1px solid var(--border-color); border-radius:10px; background:var(--bg-color); color:var(--text-main);">
            <button class="btn btn-primary btn-sm" onclick="applyPromoCode()">Ok</button>
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span>Subtotal:</span> <span>${subtotal.toFixed(2)} ₼</span></div>
            ${activeDiscount > 0 ? `<div style="display:flex; justify-content:space-between; color:#10b981; margin-bottom:5px;"><span>Endirim:</span> <span>-${discountValue.toFixed(2)} ₼</span></div>` : ''}
            <div style="display:flex; justify-content:space-between;">
                <span>Çatdırılma:</span> 
                <span style="color:${deliveryFee === 0 ? '#10b981' : 'var(--primary)'}; font-weight:800;">
                    ${deliveryFee === 0 ? 'PULSUZ' : '+5.00 ₼'}
                </span>
            </div>
        </div>
        <div class="cart-total" style="border-top:1px solid var(--border-color); padding-top:10px; margin-bottom:15px;">
            <span>Yekun:</span>
            <span>${grandTotal.toFixed(2)} ₼</span>
        </div>
        <button class="btn btn-primary btn-full" onclick="checkout()">Sifarişi Təsdiqlə</button>
    `;
    
    document.getElementById('cart-count').innerText = cart.reduce((a, b) => a + b.quantity, 0);
}
// Səbətdən tam silmək üçün yeni funksiya
function removeFromCart(cartItemId) {
    cart = cart.filter(i => i.cartItemId !== cartItemId);
    saveCart();
    updateCartUI();
    showToast("Məhsul səbətdən silindi", "error");
}
function updateQuantity(id, change) {
    const item = cart.find(i => i.cartItemId === id);
    if (item) { item.quantity += change; if (item.quantity <= 0) cart = cart.filter(i => i.cartItemId !== id); saveCart(); updateCartUI(); }
}
function saveCart() { localStorage.setItem('ulvon_cart', JSON.stringify(cart)); }
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
    document.getElementById('cart-overlay').classList.toggle('active');
}

function checkout() {
    if (cart.length === 0) return showToast("Səbətiniz boşdur!", "error");
    if (!currentUser) { toggleCart(); openAuthModal('login'); return showToast("Sistemə daxil olun.", "error"); }

    // Yeni Sifariş Yarat və İstifadəçiyə Əlavə Et
    const orderTotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const newOrder = { id: 'ORD-' + Math.floor(1000 + Math.random() * 9000), date: new Date().toLocaleDateString('az-AZ'), items: [...cart], total: orderTotal };

    currentUser.orders = currentUser.orders || [];
    currentUser.orders.unshift(newOrder); // Ən yenisi yuxarıda

    // LocalStorage Yenilə
    let users = JSON.parse(localStorage.getItem('ulvon_users')) || [];
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) users[idx] = currentUser;
    localStorage.setItem('ulvon_users', JSON.stringify(users));
    localStorage.setItem('ulvon_user', JSON.stringify(currentUser));

    cart = []; saveCart(); updateCartUI(); toggleCart();
    showToast("Sifarişiniz qəbul olundu!", "success");
}

// ==========================================
// 7. TOAST, WISHLIST, AUTH VƏ PROFİL
// ==========================================
function toggleWishlistItem(e, id) {
    e.stopPropagation();
    if (wishlist.includes(id)) { wishlist = wishlist.filter(w => w !== id); showToast("Sevimlilərdən silindi.", "error"); }
    else { wishlist.push(id); showToast("Sevimlilərə əlavə edildi!", "success"); }
    localStorage.setItem('ulvon_wishlist', JSON.stringify(wishlist)); renderProducts();
}
function toggleWishlist() { showToast(`Sevimlilərinizdə ${wishlist.length} məhsul var.`, "success"); }

function showToast(msg, type = 'success') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div'); t.className = `toast ${type}`;
    t.innerHTML = `<span>${type === 'success' ? '✅' : '⚠️'}</span> <div>${msg}</div>`;
    c.appendChild(t); setTimeout(() => { t.style.animation = 'fadeOutRight 0.3s forwards'; setTimeout(() => t.remove(), 300); }, 3000);
}

// Auth
let authMode = 'login';
function openAuthModal(mode) { authMode = mode; updateAuthUI(); document.getElementById('auth-modal-overlay').classList.add('active'); }
function closeAuthModal() { document.getElementById('auth-modal-overlay').classList.remove('active'); }
function toggleAuthMode() { authMode = authMode === 'login' ? 'register' : 'login'; updateAuthUI(); }
function updateAuthUI() {
    document.getElementById('auth-title').innerText = authMode === 'login' ? 'Giriş' : 'Qeydiyyat';
    document.getElementById('name-group').style.display = authMode === 'login' ? 'none' : 'block';
    document.getElementById('auth-submit').innerText = authMode === 'login' ? 'Daxil Ol' : 'Tamamla';
    document.getElementById('auth-switch-text').innerText = authMode === 'login' ? 'Hesabınız yoxdur?' : 'Hesabınız var?';
    document.getElementById('auth-switch-link').innerText = authMode === 'login' ? 'Qeydiyyat' : 'Giriş';
}

document.getElementById('auth-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value, pass = document.getElementById('auth-pass').value;
    if (pass.length < 6) return showToast("Şifrə min. 6 simvol olmalıdır", "error");
    let users = JSON.parse(localStorage.getItem('ulvon_users')) || [];

    if (authMode === 'register') {
        if (users.find(u => u.email === email)) return showToast("Bu e-poçt mövcuddur.", "error");
        currentUser = { name: document.getElementById('auth-name').value, email, pass, orders: [] };
        users.push(currentUser); localStorage.setItem('ulvon_users', JSON.stringify(users));
        showToast("Qeydiyyat uğurludur!", "success");
    } else {
        const user = users.find(u => u.email === email && u.pass === pass);
        if (user) { currentUser = user; showToast(`Xoş gəldin, ${user.name}!`, "success"); }
        else return showToast("Yanlış məlumatlar.", "error");
    }
    localStorage.setItem('ulvon_user', JSON.stringify(currentUser)); closeAuthModal(); checkAuthStatus(); this.reset();
});

function checkAuthStatus() {
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');

    if (currentUser) {
        // İstifadəçi daxil olubsa: Girişi gizlət, Profili göstər
        authButtons.classList.add('hidden');
        authButtons.style.display = 'none';

        userProfile.classList.remove('hidden');
        userProfile.style.display = 'flex';

        document.getElementById('user-greeting').innerText = `Salam, ${currentUser.name.split(' ')[0]}`;
    } else {
        // İstifadəçi çıxış edibsə (və ya daxil olmayıbsa): Profili gizlət, Girişi göstər
        authButtons.classList.remove('hidden');
        authButtons.style.display = 'flex';

        userProfile.classList.add('hidden');
        userProfile.style.display = 'none';
    }
}
function logout() { currentUser = null; localStorage.removeItem('ulvon_user'); checkAuthStatus(); showToast("Hesabdan çıxıldı", "success"); }

// Profil və Sifarişlər
function openProfileModal() {
    if (!currentUser) return;
    document.getElementById('profile-info').innerHTML = `<b>Ad:</b> ${currentUser.name} <br> <b>E-poçt:</b> ${currentUser.email}`;
    const ordersContainer = document.getElementById('order-history-list');

    if (!currentUser.orders || currentUser.orders.length === 0) {
        ordersContainer.innerHTML = '<p style="color:var(--text-muted)">Hələ heç bir sifarişiniz yoxdur.</p>';
    } else {
        ordersContainer.innerHTML = currentUser.orders.map(o => `
            <div class="order-card">
                <div class="order-header"><span>Sifariş No: ${o.id}</span> <span>${o.date}</span></div>
                ${o.items.map(i => `<div class="order-item"><span>${i.quantity}x ${i.name} ${i.selectedSize ? '(' + i.selectedSize + ')' : ''}</span> <span>${(i.price * i.quantity).toFixed(2)} ₼</span></div>`).join('')}
                <div class="order-header" style="border:none; margin-top:10px; padding:0; color:var(--primary);"><span>Cəmi:</span> <span>${o.total.toFixed(2)} ₼</span></div>
            </div>
        `).join('');
    }
    document.getElementById('profile-modal-overlay').classList.add('active');
}
function closeProfileModal() { document.getElementById('profile-modal-overlay').classList.remove('active'); }

function closeModals(e) { if (e.target.classList.contains('modal-overlay')) { closeProductModal(); closeAuthModal(); closeProfileModal(); } }
function initScrollAnimations() {
    const h = document.querySelector('.glass-header');
    window.addEventListener('scroll', () => window.scrollY > 50 ? h.classList.add('scrolled') : h.classList.remove('scrolled'));
    const obs = new IntersectionObserver((entries, o) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); o.unobserve(e.target); } }), { threshold: 0.1 });
    setTimeout(() => document.querySelectorAll('.reveal').forEach(el => obs.observe(el)), 100);
}
document.getElementById('newsletter-form')?.addEventListener('submit', function (e) { e.preventDefault(); showToast("Abunə oldunuz!", "success"); this.reset(); });