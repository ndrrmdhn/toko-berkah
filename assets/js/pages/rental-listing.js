const RentalListState = {
  search: '',
  sort: 'latest'
};

const RentalListDOM = {};

document.addEventListener('DOMContentLoaded', initRentalListing);

function initRentalListing() {
  try {
    initSitePage();
    cacheDOM();
    bindEvents();
    renderRentalListing();
    syncStorageListener();
  } catch (error) {
    console.error('[Rental Listing Init Error]', error);
    showErrorState();
  }
}

function cacheDOM() {
  RentalListDOM.grid = document.getElementById('rentals-grid');
  RentalListDOM.searchInput = document.getElementById('search-input');
  RentalListDOM.resultCount = document.getElementById('result-count');
  RentalListDOM.emptyState = document.getElementById('empty-state');
  RentalListDOM.loadingState = document.getElementById('loading-state');
  RentalListDOM.sortSelect = document.getElementById('sort-select');
  RentalListDOM.resetButton = document.getElementById('reset-filter-btn');
}

function bindEvents() {
  if (RentalListDOM.searchInput) {
    RentalListDOM.searchInput.addEventListener('input', handleSearch);
  }

  if (RentalListDOM.sortSelect) {
    RentalListDOM.sortSelect.addEventListener('change', handleSort);
  }

  if (RentalListDOM.resetButton) {
    RentalListDOM.resetButton.addEventListener('click', resetFilters);
  }

  const waBtn = document.getElementById('wa-btn');
  if (waBtn) {
    waBtn.addEventListener('click', openWhatsApp);
  }

  window.addEventListener('storage', e => {
    if (e.key === 'rentals') {
      renderRentalListing();
    }
  });
}

function handleSearch(e) {
  RentalListState.search = e.target.value.trim().toLowerCase();
  renderRentalListing();
}

function handleSort(e) {
  RentalListState.sort = e.target.value;
  renderRentalListing();
}

function resetFilters() {
  RentalListState.search = '';
  RentalListState.sort = 'latest';

  if (RentalListDOM.searchInput) {
    RentalListDOM.searchInput.value = '';
  }

  if (RentalListDOM.sortSelect) {
    RentalListDOM.sortSelect.value = 'latest';
  }

  renderRentalListing();
}

function renderRentalListing() {
  try {
    showLoading();

    let rentals = RentalService.getVisible();

    rentals = filterRentals(rentals);
    rentals = sortRentals(rentals);

    updateResultCount(rentals.length);
    renderRentals(rentals);
    toggleEmptyState(rentals.length === 0);
  } catch (error) {
    console.error('[Rental Render Error]', error);
    showErrorState();
  } finally {
    hideLoading();
  }
}

function filterRentals(rentals) {
  return rentals.filter(rental => {
    const matchSearch = rental.title
      .toLowerCase()
      .includes(RentalListState.search) ||
      rental.location
        .toLowerCase()
        .includes(RentalListState.search);

    return matchSearch;
  });
}

function sortRentals(rentals) {
  switch (RentalListState.sort) {
    case 'low':
      return rentals.sort((a, b) => a.price - b.price);
    case 'high':
      return rentals.sort((a, b) => b.price - a.price);
    case 'latest':
    default:
      return rentals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

function renderRentals(rentals) {
  if (!RentalListDOM.grid) return;

  if (!rentals.length) {
    RentalListDOM.grid.innerHTML = '';
    return;
  }

  RentalListDOM.grid.innerHTML = rentals
    .map(renderRentalCard)
    .join('');
}

function renderRentalCard(rental) {
  return `
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
  `;
}

function updateResultCount(count) {
  if (RentalListDOM.resultCount) {
    RentalListDOM.resultCount.textContent = count;
  }
}

function toggleEmptyState(show) {
  if (!RentalListDOM.emptyState) return;
  RentalListDOM.emptyState.classList.toggle('hidden', !show);
}

function showLoading() {
  if (RentalListDOM.loadingState) {
    RentalListDOM.loadingState.classList.remove('hidden');
  }
}

function hideLoading() {
  if (RentalListDOM.loadingState) {
    RentalListDOM.loadingState.classList.add('hidden');
  }
}

function openWhatsApp() {
  window.open('https://wa.me/628123456789', '_blank');
}

function syncStorageListener() {
  window.addEventListener('storage', e => {
    if (e.key === 'rentals') {
      AppState.rentals = Storage.get('rentals', []);
      renderRentalListing();
    }
  });
}

function showErrorState() {
  if (RentalListDOM.grid) {
    RentalListDOM.grid.innerHTML = `
      <div class="empty-state">
        Terjadi kesalahan saat memuat kontrakan
      </div>
    `;
  }
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
