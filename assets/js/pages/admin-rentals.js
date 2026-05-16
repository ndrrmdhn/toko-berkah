/* RENTALS TAB MANAGEMENT */

function renderRentalDashboard() {
  renderRentalStats();
  renderRentalTable();
}

function renderRentalStats() {
  const rentals = RentalService.getAll();
  const totalRentals = document.getElementById('total-rentals');

  if (totalRentals) {
    totalRentals.textContent = rentals.length;
  }
}

function renderRentalTable() {
  const tbody = document.getElementById('rental-table-body');
  const empty = document.getElementById('empty-rentals');

  if (!tbody) return;

  let rentals = RentalService.getAll();

  const searchInput = document.getElementById('search-rentals');
  if (searchInput && searchInput.value) {
    const query = searchInput.value.toLowerCase();
    rentals = rentals.filter(rental =>
      rental.title.toLowerCase().includes(query) ||
      rental.location.toLowerCase().includes(query)
    );
  }

  if (empty) {
    empty.classList.toggle('hidden', rentals.length > 0);
  }

  tbody.innerHTML = rentals.map(rental => `
    <tr>
      <td>
        <div class="product-info">
          <img
            src="${escapeHTML(rental.image)}"
            class="product-thumb"
            alt="${escapeHTML(rental.title)}"
            onerror="this.src='https://placehold.co/100'"
          >
          <div>
            <strong>${escapeHTML(rental.title)}</strong>
            <p>${escapeHTML(rental.description || '-')}</p>
          </div>
        </div>
      </td>
      <td>${escapeHTML(rental.location)}</td>
      <td>${formatPrice(rental.price)}/bln</td>
      <td>${escapeHTML(rental.size)}</td>
      <td>
        <button class="btn btn-sm ${rental.visible ? 'btn-success' : 'btn-secondary'}" data-action="toggle-visible" data-id="${rental.id}">
          ${rental.visible ? 'Tampil' : 'Sembunyi'}
        </button>
      </td>
      <td>
        <button class="btn btn-warning" data-action="edit-rental" data-id="${rental.id}">Edit</button>
        <button class="btn btn-danger" data-action="delete-rental" data-id="${rental.id}">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function bindRentalEvents() {
  const searchRentals = document.getElementById('search-rentals');
  if (searchRentals) {
    searchRentals.addEventListener('input', () => renderRentalTable());
  }

  const addRentalBtn = document.getElementById('add-rental-btn');
  if (addRentalBtn) {
    addRentalBtn.addEventListener('click', openRentalModal);
  }

  const closeRentalModal = document.getElementById('close-rental-modal');
  if (closeRentalModal) {
    closeRentalModal.addEventListener('click', closeRentalModalFn);
  }

  const rentalForm = document.getElementById('rental-form');
  if (rentalForm) {
    rentalForm.addEventListener('submit', handleRentalSubmit);
  }

  const rentalImage = document.getElementById('rental-image');
  if (rentalImage) {
    rentalImage.addEventListener('input', () => {
      const preview = document.getElementById('preview-rental');
      if (preview) {
        preview.src = rentalImage.value || 'https://placehold.co/400x260';
      }
    });
  }

  const rentalTbody = document.getElementById('rental-table-body');
  if (rentalTbody) {
    rentalTbody.addEventListener('click', handleRentalTableClick);
  }
}

let adminRentalEditId = null;

function openRentalModal() {
  adminRentalEditId = null;
  const form = document.getElementById('rental-form');
  if (form) form.reset();

  const title = document.getElementById('rental-modal-title');
  if (title) title.textContent = 'Tambah Kontrakan';

  const preview = document.getElementById('preview-rental');
  if (preview) preview.src = 'https://placehold.co/400x260';

  Modal.open('rental-modal');
}

function closeRentalModalFn() {
  Modal.close('rental-modal');
}

function handleRentalTableClick(e) {
  const button = e.target.closest('button');
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'edit-rental') editRental(id);
  else if (action === 'delete-rental') deleteRental(id);
  else if (action === 'toggle-visible') toggleRentalVisible(id);
}

function editRental(id) {
  const rental = RentalService.find(id);
  if (!rental) return;

  adminRentalEditId = id;

  document.getElementById('rental-title').value = rental.title;
  document.getElementById('rental-location').value = rental.location;
  document.getElementById('rental-price').value = rental.price;
  document.getElementById('rental-size').value = rental.size;
  document.getElementById('rental-description').value = rental.description;
  document.getElementById('rental-image').value = rental.image;
  document.getElementById('rental-visible').checked = rental.visible;

  const preview = document.getElementById('preview-rental');
  if (preview) preview.src = rental.image;

  const title = document.getElementById('rental-modal-title');
  if (title) title.textContent = 'Edit Kontrakan';

  Modal.open('rental-modal');
}

function handleRentalSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submit-rental-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Menyimpan...';
  }

  try {
    const data = {
      title: document.getElementById('rental-title').value.trim(),
      location: document.getElementById('rental-location').value.trim(),
      price: Number(document.getElementById('rental-price').value),
      size: document.getElementById('rental-size').value.trim(),
      description: document.getElementById('rental-description').value.trim(),
      image: document.getElementById('rental-image').value.trim() || 'https://placehold.co/400x260',
      visible: document.getElementById('rental-visible').checked
    };

    if (!data.title || !data.location || data.price <= 0) {
      showToast('Data tidak lengkap atau tidak valid');
      return;
    }

    if (adminRentalEditId) {
      RentalService.update(adminRentalEditId, data);
      showToast('Kontrakan berhasil diupdate');
    } else {
      RentalService.create(data);
      showToast('Kontrakan berhasil ditambahkan');
    }

    renderRentalDashboard();
    closeRentalModalFn();
  } catch (error) {
    console.error(error);
    showToast('Gagal menyimpan kontrakan');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Simpan Kontrakan';
    }
  }
}

function deleteRental(id) {
  if (!confirm('Yakin ingin menghapus kontrakan?')) return;

  RentalService.delete(id);
  renderRentalDashboard();
  showToast('Kontrakan berhasil dihapus');
}

function toggleRentalVisible(id) {
  const rental = RentalService.find(id);
  if (!rental) return;

  RentalService.update(id, {
    visible: !rental.visible
  });

  renderRentalTable();
}
