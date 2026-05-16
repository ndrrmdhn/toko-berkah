const AdminState = {
  editId: null,
  search: '',
  currentTab: 'products'
};

const DOM = {};

document.addEventListener('DOMContentLoaded', initAdmin);

function initAdmin() {
  try {
    if (!AuthService.check()) {
      window.location.href = 'login.html';
      return;
    }

    cacheDOM();
    bindTabEvents();
    bindProductEvents();
    bindRentalEvents();
    bindCMSEvents();
    renderAdminName();
    showTab('products');
  } catch (error) {
    console.error('[Admin Init Error]', error);
    showToast('Terjadi kesalahan sistem');
  }
}

function cacheDOM() {
  DOM.tbody = document.getElementById('product-table-body');
  DOM.form = document.getElementById('product-form');
  DOM.search = document.getElementById('search-products');
  DOM.modal = document.getElementById('product-modal');
  DOM.empty = document.getElementById('empty-products');
}

/* ===== TAB MANAGEMENT ===== */

function bindTabEvents() {
  document.querySelectorAll('.sidebar-menu-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const tab = item.dataset.tab;
      if (tab) showTab(tab);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeRentalModalFn();
      closeCMSModalFn();
    }
  });
}

function showTab(tabName) {
  AdminState.currentTab = tabName;

  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Show selected tab
  const tab = document.getElementById(tabName + '-tab');
  if (tab) tab.classList.add('active');

  // Update sidebar active
  document.querySelectorAll('.sidebar-menu-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabName);
  });

  // Update section title
  const sectionTitle = document.getElementById('section-title');
  if (sectionTitle) {
    const titles = {
      products: 'Kelola produk marketplace',
      rentals: 'Kelola kontrakan dan properti',
      cms: 'Kelola konten website'
    };
    sectionTitle.textContent = titles[tabName] || '';
  }

  // Render content
  if (tabName === 'products') {
    renderProductDashboard();
  } else if (tabName === 'rentals') {
    renderRentalDashboard();
  } else if (tabName === 'cms') {
    renderCMSDashboard();
  }
}

/* ===== PRODUCT TAB MANAGEMENT ===== */

function renderProductDashboard() {
  renderProductStats();
  renderProductTable();
}

function renderProductStats() {
  const products = ProductService.getAll();
  const totalProducts = document.getElementById('total-products');
  const totalStock = document.getElementById('total-stock');

  if (totalProducts) totalProducts.textContent = products.length;
  if (totalStock) {
    totalStock.textContent = products.reduce((sum, item) => sum + item.stock, 0);
  }
}

function renderProductTable() {
  const tbody = document.getElementById('product-table-body');
  const empty = document.getElementById('empty-products');

  if (!tbody) return;

  let products = ProductService.getAll();

  const searchInput = document.getElementById('search-products');
  if (searchInput && searchInput.value) {
    const query = searchInput.value.toLowerCase();
    products = products.filter(product =>
      product.name.toLowerCase().includes(query)
    );
  }

  if (empty) {
    empty.classList.toggle('hidden', products.length > 0);
  }

  tbody.innerHTML = products.map(product => `
    <tr>
      <td>
        <div class="product-info">
          <img
            src="${escapeHTML(product.image)}"
            class="product-thumb"
            alt="${escapeHTML(product.name)}"
            onerror="this.src='https://placehold.co/100'"
          >
          <div>
            <strong>${escapeHTML(product.name)}</strong>
            <p>${escapeHTML(product.description || '-')}</p>
          </div>
        </div>
      </td>
      <td>${formatPrice(product.price)}</td>
      <td>${product.stock}</td>
      <td>${escapeHTML(product.category)}</td>
      <td>
        <button class="btn btn-sm ${product.visible ? 'btn-success' : 'btn-secondary'}" data-action="toggle-visible" data-id="${product.id}">
          ${product.visible ? 'Tampil' : 'Sembunyi'}
        </button>
      </td>
      <td>
        <button class="btn btn-warning" data-action="edit" data-id="${product.id}">Edit</button>
        <button class="btn btn-danger" data-action="delete" data-id="${product.id}">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function bindProductEvents() {
  const searchProducts = document.getElementById('search-products');
  if (searchProducts) {
    searchProducts.addEventListener('input', () => renderProductTable());
  }

  const addProductBtn = document.getElementById('add-product-btn');
  if (addProductBtn) {
    addProductBtn.addEventListener('click', openProductModal);
  }

  const closeProductModalBtn = document.getElementById('close-product-modal');
  if (closeProductModalBtn) {
    closeProductModalBtn.addEventListener('click', closeProductModal);
  }

  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', handleProductSubmit);
  }

  const productImage = document.getElementById('product-image');
  if (productImage) {
    productImage.addEventListener('input', () => {
      const preview = document.getElementById('preview-product');
      if (preview) {
        preview.src = productImage.value || 'https://placehold.co/300x200';
      }
    });
  }

  const productTbody = document.getElementById('product-table-body');
  if (productTbody) {
    productTbody.addEventListener('click', handleProductTableClick);
  }
}

let adminProductEditId = null;

function openProductModal() {
  adminProductEditId = null;
  const form = document.getElementById('product-form');
  if (form) form.reset();

  const title = document.getElementById('product-modal-title');
  if (title) title.textContent = 'Tambah Produk';

  const preview = document.getElementById('preview-product');
  if (preview) preview.src = 'https://placehold.co/300x200';

  const visibleCheckbox = document.getElementById('product-visible');
  if (visibleCheckbox) visibleCheckbox.checked = true;

  Modal.open('product-modal');
}

function closeProductModal() {
  Modal.close('product-modal');
}

function handleProductTableClick(e) {
  const button = e.target.closest('button');
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'edit') editProduct(id);
  else if (action === 'delete') deleteProduct(id);
  else if (action === 'toggle-visible') toggleProductVisible(id);
}

function editProduct(id) {
  const product = ProductService.find(id);
  if (!product) return;

  adminProductEditId = id;

  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-stock').value = product.stock;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-image').value = product.image;
  document.getElementById('product-visible').checked = product.visible;

  const preview = document.getElementById('preview-product');
  if (preview) preview.src = product.image;

  const title = document.getElementById('product-modal-title');
  if (title) title.textContent = 'Edit Produk';

  Modal.open('product-modal');
}

function handleProductSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submit-product-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Menyimpan...';
  }

  try {
    const data = {
      name: document.getElementById('product-name').value.trim(),
      price: Number(document.getElementById('product-price').value),
      stock: Number(document.getElementById('product-stock').value),
      category: document.getElementById('product-category').value,
      description: document.getElementById('product-description').value.trim(),
      image: document.getElementById('product-image').value.trim() || 'https://placehold.co/300x200',
      visible: document.getElementById('product-visible').checked
    };

    if (!data.name || data.price <= 0) {
      showToast('Data tidak lengkap atau tidak valid');
      return;
    }

    if (adminProductEditId) {
      ProductService.update(adminProductEditId, data);
      showToast('Produk berhasil diupdate');
    } else {
      ProductService.create(data);
      showToast('Produk berhasil ditambahkan');
    }

    renderProductDashboard();
    closeProductModal();
  } catch (error) {
    console.error(error);
    showToast('Gagal menyimpan produk');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Simpan Produk';
    }
  }
}

function deleteProduct(id) {
  if (!confirm('Yakin ingin menghapus produk?')) return;

  ProductService.delete(id);
  renderProductDashboard();
  showToast('Produk berhasil dihapus');
}

function toggleProductVisible(id) {
  const product = ProductService.find(id);
  if (!product) return;

  ProductService.update(id, {
    visible: !product.visible
  });

  renderProductTable();
}

function renderAdminName() {
  const el = document.getElementById('admin-name');
  if (!el) return;

  const user = Storage.get('currentUser');
  el.textContent = `Halo, ${user?.username || 'Admin'}`;
}

/* ===== HELPERS ===== */

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

/* LOGOUT */
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      AuthService.logout();
      window.location.href = 'login.html';
    });
  }
});
