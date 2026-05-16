document.addEventListener('DOMContentLoaded', initHome);

function initHome() {
  try {
    initSitePage();
    bindMobileMenu();
    bindWhatsApp();
    renderFeaturedProducts();
    renderFeaturedRentals();
    syncStorageListener();
  } catch (error) {
    console.error('[Home Init Error]', error);
  }
}

/* ===== FEATURED PRODUCTS ===== */

function renderFeaturedProducts() {
  const cms = CmsService.get();
  const products = ProductService.getVisible().slice(0, 6);

  updateSectionHeader(
    'featured-products-title',
    cms.sections.featuredProductsTitle
  );
  updateSectionHeader(
    'featured-products-subtitle',
    cms.sections.featuredProductsSubtitle
  );

  renderProducts(products, 'featured-products', 'loading-products', 'empty-products');
}

function renderProducts(products, gridId, loadingId, emptyId) {
  const grid = document.getElementById(gridId);
  const loading = document.getElementById(loadingId);
  const empty = document.getElementById(emptyId);

  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = '';
    if (loading) loading.classList.add('hidden');
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (loading) loading.classList.add('hidden');
  if (empty) empty.classList.add('hidden');

  grid.innerHTML = products
    .map(product => `
      <article class="product-card">
        <div class="product-image">
          <img
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
            onerror="this.src='https://placehold.co/300x200'"
          >
        </div>
        <div class="product-body">
          <span class="product-category">
            ${escapeHTML(product.category)}
          </span>
          <h3 class="product-title">
            ${escapeHTML(product.name)}
          </h3>
          <p class="product-description">
            ${escapeHTML(product.description || 'Tidak ada deskripsi')}
          </p>
          <div class="product-footer">
            <strong class="product-price">
              ${formatPrice(product.price)}
            </strong>
            <span class="product-stock">
              Stok: ${product.stock}
            </span>
          </div>
        </div>
      </article>
    `)
    .join('');
}

/* ===== FEATURED RENTALS ===== */

function renderFeaturedRentals() {
  const cms = CmsService.get();
  const rentals = RentalService.getVisible().slice(0, 6);

  updateSectionHeader(
    'featured-rentals-title',
    cms.sections.featuredRentalsTitle
  );
  updateSectionHeader(
    'featured-rentals-subtitle',
    cms.sections.featuredRentalsSubtitle
  );

  renderRentals(rentals, 'featured-rentals', 'loading-rentals', 'empty-rentals');
}

function renderRentals(rentals, gridId, loadingId, emptyId) {
  const grid = document.getElementById(gridId);
  const loading = document.getElementById(loadingId);
  const empty = document.getElementById(emptyId);

  if (!grid) return;

  if (rentals.length === 0) {
    grid.innerHTML = '';
    if (loading) loading.classList.add('hidden');
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (loading) loading.classList.add('hidden');
  if (empty) empty.classList.add('hidden');

  grid.innerHTML = rentals
    .map(rental => `
      <article class="product-card">
        <div class="product-image">
          <img
            src="${escapeHTML(rental.image)}"
            alt="${escapeHTML(rental.title)}"
            loading="lazy"
            onerror="this.src='https://placehold.co/400x260'"
          >
        </div>
        <div class="product-body">
          <span class="product-category">
            ${escapeHTML(rental.location)}
          </span>
          <h3 class="product-title">
            ${escapeHTML(rental.title)}
          </h3>
          <p class="product-description">
            ${escapeHTML(rental.description || 'Tidak ada detail')}
          </p>
          <div class="product-footer">
            <strong class="product-price">
              ${formatPrice(rental.price)}/bln
            </strong>
            <span class="product-stock">
              ${escapeHTML(rental.size)}
            </span>
          </div>
        </div>
      </article>
    `)
    .join('');
}

/* ===== HELPERS ===== */

function updateSectionHeader(elementId, text) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = text;
}

function bindMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('show');
  });
}

function bindWhatsApp() {
  const waBtn = document.getElementById('wa-btn');

  if (!waBtn) return;

  waBtn.addEventListener('click', () => {
    window.open('https://wa.me/628123456789', '_blank');
  });
}

function syncStorageListener() {
  window.addEventListener('storage', event => {
    if (event.key === 'products' || event.key === 'rentals' || event.key === 'cms') {
      renderFeaturedProducts();
      renderFeaturedRentals();
    }
  });
}

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price || 0);
}

function escapeHTML(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
