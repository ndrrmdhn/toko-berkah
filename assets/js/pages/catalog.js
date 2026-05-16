const CatalogState = {
  search: '',
  category: 'Semua',
  sort: 'latest'
};

const CatalogDOM = {};

document.addEventListener(
  'DOMContentLoaded',
  initCatalog
);

function initCatalog() {

  try {

    initSitePage();

    cacheDOM();

    bindEvents();

    renderCategories();

    renderCatalog();

    syncStorageListener();

  } catch (error) {

    console.error(
      '[Catalog Init Error]',
      error
    );

    showErrorState();
  }
}

function cacheDOM() {

  CatalogDOM.grid =
    document.getElementById(
      'products-grid'
    );

  CatalogDOM.searchInput =
    document.getElementById(
      'search-input'
    );

  CatalogDOM.resultCount =
    document.getElementById(
      'result-count'
    );

  CatalogDOM.emptyState =
    document.getElementById(
      'empty-state'
    );

  CatalogDOM.loadingState =
    document.getElementById(
      'loading-state'
    );

  CatalogDOM.categoryChips =
    document.getElementById(
      'category-chips'
    );

  CatalogDOM.sortSelect =
    document.getElementById(
      'sort-select'
    );

  CatalogDOM.resetButton =
    document.getElementById(
      'reset-filter-btn'
    );
}

function bindEvents() {

  if (CatalogDOM.searchInput) {

    CatalogDOM.searchInput
      .addEventListener(
        'input',
        handleSearch
      );
  }

  if (CatalogDOM.sortSelect) {

    CatalogDOM.sortSelect
      .addEventListener(
        'change',
        handleSort
      );
  }

  if (CatalogDOM.resetButton) {

    CatalogDOM.resetButton
      .addEventListener(
        'click',
        resetFilters
      );
  }

  if (CatalogDOM.categoryChips) {

    CatalogDOM.categoryChips
      .addEventListener(
        'click',
        handleCategoryClick
      );
  }

  const waBtn =
    document.getElementById(
      'wa-btn'
    );

  if (waBtn) {

    waBtn.addEventListener(
      'click',
      openWhatsApp
    );
  }
}

function handleSearch(e) {

  CatalogState.search =
    e.target.value
      .trim()
      .toLowerCase();

  renderCatalog();
}

function handleSort(e) {

  CatalogState.sort =
    e.target.value;

  renderCatalog();
}

function handleCategoryClick(e) {

  const button =
    e.target.closest(
      '.category-chip'
    );

  if (!button) return;

  CatalogState.category =
    button.dataset.category;

  updateActiveCategory();

  renderCatalog();
}

function resetFilters() {

  CatalogState.search = '';
  CatalogState.category = 'Semua';
  CatalogState.sort = 'latest';

  if (CatalogDOM.searchInput) {
    CatalogDOM.searchInput.value = '';
  }

  if (CatalogDOM.sortSelect) {
    CatalogDOM.sortSelect.value =
      'latest';
  }

  updateActiveCategory();

  renderCatalog();
}

function renderCatalog() {

  try {

    showLoading();

    let products =
      ProductService.getAll();

    products =
      filterProducts(products);

    products =
      sortProducts(products);

    updateResultCount(
      products.length
    );

    renderProducts(products);

    toggleEmptyState(
      products.length === 0
    );

  } catch (error) {

    console.error(
      '[Catalog Render Error]',
      error
    );

    showErrorState();

  } finally {

    hideLoading();
  }
}

function filterProducts(products) {

  return products.filter(product => {

    const matchSearch =
      product.name
        .toLowerCase()
        .includes(
          CatalogState.search
        );

    const matchCategory =
      CatalogState.category ===
        'Semua'
        ? true
        : product.category ===
        CatalogState.category;

    return (
      matchSearch &&
      matchCategory
    );
  });
}

function sortProducts(products) {

  switch (
  CatalogState.sort
  ) {

    case 'low':

      return products.sort(
        (a, b) =>
          a.price - b.price
      );

    case 'high':

      return products.sort(
        (a, b) =>
          b.price - a.price
      );

    case 'latest':

    default:

      return products.sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      );
  }
}

function renderProducts(products) {

  if (!CatalogDOM.grid) return;

  if (!products.length) {

    CatalogDOM.grid.innerHTML = '';

    return;
  }

  CatalogDOM.grid.innerHTML =
    products
      .map(renderProductCard)
      .join('');
}

function renderProductCard(product) {

  return `
    <article class="product-card">

      <div class="product-image">

        <img
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onerror="
            this.src='https://placehold.co/400x300'
          "
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
          ${escapeHTML(
    product.description ||
    'Tidak ada deskripsi'
  )}
        </p>

        <div class="product-footer">

          <strong class="product-price">
            ${formatPrice(
    product.price
  )}
          </strong>

          <span class="product-stock">
            Stok:
            ${product.stock}
          </span>

        </div>

      </div>

    </article>
  `;
}

function renderCategories() {

  if (
    !CatalogDOM.categoryChips
  ) return;

  const products =
    ProductService.getAll();

  const categories = [
    'Semua',
    ...new Set(
      products.map(
        product =>
          product.category
      )
    )
  ];

  CatalogDOM.categoryChips.innerHTML =
    categories
      .map(category => `
        <button
          class="
            category-chip
            ${category ===
          CatalogState.category
          ? 'active'
          : ''
        }
          "
          data-category="${escapeHTML(category)}"
        >
          ${escapeHTML(category)}
        </button>
      `)
      .join('');
}

function updateActiveCategory() {

  document
    .querySelectorAll(
      '.category-chip'
    )
    .forEach(button => {

      button.classList.toggle(
        'active',
        button.dataset.category ===
        CatalogState.category
      );

    });
}

function updateResultCount(count) {

  if (
    CatalogDOM.resultCount
  ) {

    CatalogDOM.resultCount.textContent =
      count;
  }
}

function toggleEmptyState(show) {

  if (
    !CatalogDOM.emptyState
  ) return;

  CatalogDOM.emptyState
    .classList.toggle(
      'hidden',
      !show
    );
}

function showLoading() {

  if (
    CatalogDOM.loadingState
  ) {

    CatalogDOM.loadingState
      .classList.remove(
        'hidden'
      );
  }
}

function hideLoading() {

  if (
    CatalogDOM.loadingState
  ) {

    CatalogDOM.loadingState
      .classList.add(
        'hidden'
      );
  }
}

function openWhatsApp() {

  window.open(
    'https://wa.me/628123456789',
    '_blank'
  );
}

function syncStorageListener() {

  window.addEventListener(
    'storage',
    e => {

      if (
        e.key === 'products'
      ) {

        AppState.products =
          Storage.get(
            'products',
            []
          );

        renderCategories();

        renderCatalog();
      }

    }
  );
}

function showErrorState() {

  if (
    CatalogDOM.grid
  ) {

    CatalogDOM.grid.innerHTML = `
      <div class="empty-state">
        Terjadi kesalahan saat memuat produk
      </div>
    `;
  }
}

function formatPrice(price) {

  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR'
    }
  ).format(price || 0);
}

function escapeHTML(
  text = ''
) {

  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}