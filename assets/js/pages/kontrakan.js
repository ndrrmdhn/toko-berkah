const RentalState = {
    editId: null,
    search: ''
};

const RentalDOM = {};

document.addEventListener(
    'DOMContentLoaded',
    initRentalPage
);

function initRentalPage() {
    try {
        initSitePage();
        cacheDOM();
        bindEvents();
        renderRentalList();
        syncStorageListener();
    } catch (error) {
        console.error('[Kontrakan Init Error]', error);
        showErrorState();
    }
}

function cacheDOM() {
    RentalDOM.list =
        document.getElementById(
            'kontrakan-list'
        );

    RentalDOM.form =
        document.getElementById(
            'rental-form'
        );

    RentalDOM.searchInput =
        document.getElementById(
            'search-input'
        );

    RentalDOM.emptyState =
        document.getElementById(
            'empty-state'
        );

    RentalDOM.loadingState =
        document.getElementById(
            'loading-state'
        );

    RentalDOM.addButton =
        document.getElementById(
            'add-rental-btn'
        );
}

function bindEvents() {
    if (RentalDOM.addButton) {
        RentalDOM.addButton.addEventListener(
            'click',
            openCreateModal
        );
    }

    const closeBtn =
        document.getElementById(
            'close-modal-btn'
        );

    if (closeBtn) {
        closeBtn.addEventListener(
            'click',
            closeModal
        );
    }

    if (RentalDOM.form) {
        RentalDOM.form.addEventListener(
            'submit',
            handleSubmit
        );
    }

    if (RentalDOM.searchInput) {
        RentalDOM.searchInput.addEventListener(
            'input',
            handleSearch
        );
    }

    if (RentalDOM.list) {
        RentalDOM.list.addEventListener(
            'click',
            handleListClick
        );
    }

    document.addEventListener(
        'keydown',
        e => {
            if (e.key === 'Escape') {
                closeModal();
            }
        }
    );

    const imageInput =
        document.getElementById(
            'rental-image'
        );

    if (imageInput) {
        imageInput.addEventListener(
            'input',
            updatePreview
        );
    }
}

function handleSearch(e) {
    RentalState.search =
        e.target.value
            .trim()
            .toLowerCase();

    renderRentalList();
}

function handleListClick(e) {
    const button =
        e.target.closest('button');

    if (!button) return;

    const id =
        Number(button.dataset.id);

    const action =
        button.dataset.action;

    if (action === 'edit') {
        editRental(id);
    }

    if (action === 'delete') {
        deleteRental(id);
    }
}

function openCreateModal() {
    RentalState.editId = null;

    if (RentalDOM.form) {
        RentalDOM.form.reset();
    }

    const title =
        document.getElementById(
            'modal-title'
        );

    if (title) {
        title.textContent =
            'Tambah Kontrakan';
    }

    updatePreview();
    Modal.open('rental-modal');
}

function closeModal() {
    Modal.close('rental-modal');
}

function editRental(id) {
    const rental =
        RentalService.find(id);

    if (!rental) return;

    RentalState.editId = id;

    setValue('rental-title', rental.title);
    setValue('rental-location', rental.location);
    setValue('rental-price', rental.price);
    setValue('rental-size', rental.size);
    setValue('rental-description', rental.description);
    setValue('rental-image', rental.image);

    const availableCheckbox =
        document.getElementById(
            'rental-available'
        );

    if (availableCheckbox) {
        availableCheckbox.checked =
            rental.available;
    }

    const title =
        document.getElementById(
            'modal-title'
        );

    if (title) {
        title.textContent =
            'Edit Kontrakan';
    }

    updatePreview();
    Modal.open('rental-modal');
}

function handleSubmit(e) {
    e.preventDefault();

    const submitBtn =
        document.getElementById(
            'submit-btn'
        );

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent =
            'Menyimpan...';
    }

    try {
        const rental = getFormData();
        const validation =
            validateRental(rental);

        if (!validation.valid) {
            showToast(validation.message);
            return;
        }

        if (RentalState.editId) {
            RentalService.update(
                RentalState.editId,
                rental
            );

            showToast(
                'Kontrakan berhasil diupdate'
            );
        } else {
            RentalService.create(rental);

            showToast(
                'Kontrakan berhasil ditambahkan'
            );
        }

        renderRentalList();
        closeModal();
    } catch (error) {
        console.error(error);
        showToast(
            'Gagal menyimpan kontrakan'
        );
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent =
                'Simpan Kontrakan';
        }
    }
}

function getFormData() {
    return {
        title:
            getValue('rental-title')
                .trim(),
        location:
            getValue('rental-location')
                .trim(),
        price:
            Number(
                getValue('rental-price')
            ),
        size:
            getValue('rental-size')
                .trim(),
        description:
            getValue('rental-description')
                .trim(),
        image:
            getValue('rental-image')
                .trim() ||
            'https://placehold.co/400x260',
        available:
            document.getElementById(
                'rental-available'
            )?.checked ?? true
    };
}

function validateRental(rental) {
    if (!rental.title) {
        return {
            valid: false,
            message: 'Judul kontrakan wajib diisi'
        };
    }

    if (!rental.location) {
        return {
            valid: false,
            message: 'Lokasi kontrakan wajib diisi'
        };
    }

    if (rental.price <= 0) {
        return {
            valid: false,
            message: 'Harga kontrakan tidak valid'
        };
    }

    return { valid: true };
}

function deleteRental(id) {
    const confirmed =
        confirm(
            'Yakin ingin menghapus kontrakan?'
        );

    if (!confirmed) return;

    RentalService.delete(id);

    renderRentalList();

    showToast(
        'Kontrakan berhasil dihapus'
    );
}

function renderRentalList() {
    showLoading();

    let rentals =
        RentalService.getAll();

    if (RentalState.search) {
        rentals = rentals.filter(rental => {
            const query =
                RentalState.search;

            return (
                rental.title
                    .toLowerCase()
                    .includes(query) ||
                rental.location
                    .toLowerCase()
                    .includes(query)
            );
        });
    }

    if (!RentalDOM.list) {
        hideLoading();
        return;
    }

    RentalDOM.list.innerHTML =
        rentals
            .map(renderRentalCard)
            .join('');

    toggleEmptyState(
        rentals.length === 0
    );
    hideLoading();
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
          ${escapeHTML(
        rental.description ||
        'Tidak ada detail tambahan'
    )}
        </p>

        <div class="product-footer">
          <strong class="product-price">
            ${formatPrice(rental.price)}
          </strong>

          <span class="product-stock">
            Ukuran: ${escapeHTML(rental.size)}
          </span>
        </div>

        <div class="product-actions">
          <button
            type="button"
            class="btn btn-warning"
            data-action="edit"
            data-id="${rental.id}"
          >
            Edit
          </button>

          <button
            type="button"
            class="btn btn-danger"
            data-action="delete"
            data-id="${rental.id}"
          >
            Hapus
          </button>
        </div>
      </div>
    </article>
  `;
}

function toggleEmptyState(show) {
    if (!RentalDOM.emptyState) return;

    RentalDOM.emptyState.classList.toggle(
        'hidden',
        !show
    );
}

function showLoading() {
    if (!RentalDOM.loadingState) return;

    RentalDOM.loadingState.classList.remove(
        'hidden'
    );
}

function hideLoading() {
    if (!RentalDOM.loadingState) return;

    RentalDOM.loadingState.classList.add(
        'hidden'
    );
}

function updatePreview() {
    const preview =
        document.getElementById(
            'preview-image'
        );

    if (!preview) return;

    preview.src =
        getValue('rental-image') ||
        'https://placehold.co/400x260';
}

function showErrorState() {
    if (!RentalDOM.list) return;

    RentalDOM.list.innerHTML = `
    <div class="empty-state">
      Gagal memuat data kontrakan.
    </div>
  `;
}

function syncStorageListener() {
    window.addEventListener(
        'storage',
        e => {
            if (e.key === 'rentals') {
                AppState.rentals =
                    Storage.get('rentals', []);

                renderRentalList();
            }
        }
    );
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

function escapeHTML(text = '') {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getValue(id) {
    return (
        document.getElementById(id)?.value || ''
    );
}

function setValue(id, value) {
    const element =
        document.getElementById(id);

    if (element) {
        element.value = value || '';
    }
}
