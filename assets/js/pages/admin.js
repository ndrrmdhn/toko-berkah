const AdminState = {
  editId: null,
  search: ''
};

const DOM = {};

document.addEventListener(
  'DOMContentLoaded',
  initAdmin
);

function initAdmin() {

  try {

    if (!AuthService.check()) {
      return;
    }

    cacheDOM();

    bindEvents();

    renderAdminName();

    renderDashboard();

  } catch (error) {

    console.error(error);

    showToast(
      'Terjadi kesalahan sistem'
    );
  }
}

function cacheDOM() {

  DOM.tbody =
    document.getElementById(
      'product-table-body'
    );

  DOM.form =
    document.getElementById(
      'product-form'
    );

  DOM.search =
    document.getElementById(
      'search-input'
    );

  DOM.modal =
    document.getElementById(
      'product-modal'
    );

  DOM.empty =
    document.getElementById(
      'empty-state'
    );
}

function bindEvents() {

  document
    .getElementById('logout-btn')
    .addEventListener(
      'click',
      AuthService.logout
    );

  document
    .getElementById('add-product-btn')
    .addEventListener(
      'click',
      openCreateModal
    );

  document
    .getElementById('close-modal-btn')
    .addEventListener(
      'click',
      closeModal
    );

  DOM.form.addEventListener(
    'submit',
    handleSubmit
  );

  // SEARCH
  if (DOM.search) {

    DOM.search.addEventListener(
      'input',
      e => {

        AdminState.search =
          e.target.value.toLowerCase();

        renderProducts();

      }
    );
  }

  // EVENT DELEGATION
  DOM.tbody.addEventListener(
    'click',
    handleTableClick
  );

  // ESC CLOSE
  document.addEventListener(
    'keydown',
    e => {

      if (e.key === 'Escape') {
        closeModal();
      }

    }
  );

  // IMAGE PREVIEW
  const imageInput =
    document.getElementById(
      'product-image'
    );

  if (imageInput) {

    imageInput.addEventListener(
      'input',
      updatePreview
    );
  }
}

function renderDashboard() {

  renderProducts();

  renderStats();
}

function renderAdminName() {

  const el =
    document.getElementById(
      'admin-name'
    );

  if (!el) return;

  const user =
    Storage.get(
      'currentUser'
    );

  el.textContent =
    `Halo, ${user?.username || 'Admin'}`;
}

function renderProducts() {

  if (!DOM.tbody) return;

  let products =
    ProductService.getAll();

  // FILTER SEARCH
  if (AdminState.search) {

    products =
      products.filter(product =>
        product.name
          .toLowerCase()
          .includes(AdminState.search)
      );
  }

  renderEmptyState(products);

  DOM.tbody.innerHTML =
    products.map(renderRow).join('');
}

function renderRow(product) {

  return `
    <tr>

      <td>

        <div class="product-info">

          <img
            src="${escapeHTML(product.image)}"
            class="product-thumb"
            alt="${escapeHTML(product.name)}"
            onerror="
              this.src='https://placehold.co/100'
            "
          >

          <div>

            <strong>
              ${escapeHTML(product.name)}
            </strong>

            <p>
              ${escapeHTML(
                product.description || '-'
              )}
            </p>

          </div>

        </div>

      </td>

      <td>
        ${formatPrice(product.price)}
      </td>

      <td>
        ${product.stock}
      </td>

      <td>
        ${escapeHTML(product.category)}
      </td>

      <td>

        <button
          class="btn btn-warning"
          data-action="edit"
          data-id="${product.id}"
        >
          Edit
        </button>

        <button
          class="btn btn-danger"
          data-action="delete"
          data-id="${product.id}"
        >
          Hapus
        </button>

      </td>

    </tr>
  `;
}

function handleTableClick(e) {

  const button =
    e.target.closest('button');

  if (!button) return;

  const id =
    Number(button.dataset.id);

  const action =
    button.dataset.action;

  if (action === 'edit') {
    editProduct(id);
  }

  if (action === 'delete') {
    deleteProduct(id);
  }
}

function renderStats() {

  const products =
    ProductService.getAll();

  const totalProducts =
    document.getElementById(
      'total-products'
    );

  const totalStock =
    document.getElementById(
      'total-stock'
    );

  if (totalProducts) {

    totalProducts.textContent =
      products.length;
  }

  if (totalStock) {

    totalStock.textContent =
      products.reduce(
        (sum, item) =>
          sum + item.stock,
        0
      );
  }
}

function renderEmptyState(products) {

  if (!DOM.empty) return;

  if (!products.length) {

    DOM.empty.classList.remove(
      'hidden'
    );

  } else {

    DOM.empty.classList.add(
      'hidden'
    );
  }
}

function openCreateModal() {

  AdminState.editId = null;

  DOM.form.reset();

  document.getElementById(
    'modal-title'
  ).textContent =
    'Tambah Produk';

  updatePreview();

  Modal.open('product-modal');
}

function closeModal() {

  Modal.close('product-modal');
}

function editProduct(id) {

  const product =
    ProductService.find(id);

  if (!product) return;

  AdminState.editId = id;

  setValue(
    'product-name',
    product.name
  );

  setValue(
    'product-price',
    product.price
  );

  setValue(
    'product-stock',
    product.stock
  );

  setValue(
    'product-category',
    product.category
  );

  setValue(
    'product-description',
    product.description
  );

  setValue(
    'product-image',
    product.image
  );

  document.getElementById(
    'modal-title'
  ).textContent =
    'Edit Produk';

  updatePreview();

  Modal.open('product-modal');
}

function handleSubmit(e) {

  e.preventDefault();

  const submitBtn =
    document.getElementById(
      'submit-btn'
    );

  submitBtn.disabled = true;

  submitBtn.textContent =
    'Menyimpan...';

  try {

    const product =
      getFormData();

    const validation =
      validateProduct(product);

    if (!validation.valid) {

      showToast(
        validation.message
      );

      return;
    }

    if (AdminState.editId) {

      ProductService.update(
        AdminState.editId,
        product
      );

      showToast(
        'Produk berhasil diupdate'
      );

    } else {

      ProductService.create(product);

      showToast(
        'Produk berhasil ditambahkan'
      );
    }

    renderDashboard();

    closeModal();

  } catch (error) {

    console.error(error);

    showToast(
      'Gagal menyimpan produk'
    );

  } finally {

    submitBtn.disabled = false;

    submitBtn.textContent =
      'Simpan Produk';
  }
}

function getFormData() {

  return {

    name:
      getValue(
        'product-name'
      ).trim(),

    price:
      Number(
        getValue(
          'product-price'
        )
      ),

    stock:
      Number(
        getValue(
          'product-stock'
        )
      ),

    category:
      getValue(
        'product-category'
      ),

    description:
      getValue(
        'product-description'
      ),

    image:
      getValue(
        'product-image'
      ) ||
      'https://placehold.co/300x200'
  };
}

function validateProduct(product) {

  if (!product.name) {

    return {
      valid: false,
      message: 'Nama wajib diisi'
    };
  }

  if (product.price <= 0) {

    return {
      valid: false,
      message: 'Harga tidak valid'
    };
  }

  if (product.stock < 0) {

    return {
      valid: false,
      message: 'Stok tidak valid'
    };
  }

  return {
    valid: true
  };
}

function deleteProduct(id) {

  const confirmed =
    confirm(
      'Yakin ingin menghapus produk?'
    );

  if (!confirmed) return;

  ProductService.delete(id);

  renderDashboard();

  showToast(
    'Produk berhasil dihapus'
  );
}

function updatePreview() {

  const preview =
    document.getElementById(
      'preview-image'
    );

  if (!preview) return;

  preview.src =
    getValue('product-image')
    ||
    'https://placehold.co/300x200';
}

function getValue(id) {

  return document
    .getElementById(id)
    .value;
}

function setValue(id, value) {

  document
    .getElementById(id)
    .value = value || '';
}

function formatPrice(price) {

  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR'
    }
  ).format(price);
}

function escapeHTML(text = '') {

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}