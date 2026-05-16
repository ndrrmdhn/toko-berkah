/* CMS TAB MANAGEMENT */

function renderCMSDashboard() {
  renderCMSPreview();
}

function renderCMSPreview() {
  const cms = CmsService.get();

  document.getElementById('cms-name').textContent = cms.siteName;
  document.getElementById('cms-logo').textContent = cms.logoText;
  document.getElementById('cms-contact').textContent = cms.footer.contact;
  document.getElementById('cms-badge').textContent = cms.hero.badge;
  document.getElementById('cms-hero-title').textContent = cms.hero.title;
  document.getElementById('cms-hero-subtitle').textContent = cms.hero.subtitle;
  document.getElementById('cms-primary-cta').textContent = cms.hero.primaryCta.label;
  document.getElementById('cms-secondary-cta').textContent = cms.hero.secondaryCta.label;
  document.getElementById('cms-categories').textContent = cms.categories.join(', ');
  document.getElementById('cms-featured-products').textContent = cms.sections.featuredProductsTitle;
  document.getElementById('cms-featured-rentals').textContent = cms.sections.featuredRentalsTitle;
}

function bindCMSEvents() {
  const editCmsBtn = document.getElementById('edit-cms-btn');
  if (editCmsBtn) {
    editCmsBtn.addEventListener('click', openCMSModal);
  }

  const closeCmsModal = document.getElementById('close-cms-modal');
  if (closeCmsModal) {
    closeCmsModal.addEventListener('click', closeCMSModalFn);
  }

  const cmsForm = document.getElementById('cms-form');
  if (cmsForm) {
    cmsForm.addEventListener('submit', handleCMSSubmit);
  }
}

function openCMSModal() {
  const cms = CmsService.get();

  document.getElementById('cms-site-name').value = cms.siteName;
  document.getElementById('cms-logo-text').value = cms.logoText;
  document.getElementById('cms-footer-contact').value = cms.footer.contact;
  document.getElementById('cms-footer-about').value = cms.footer.about;

  document.getElementById('cms-hero-badge').value = cms.hero.badge;
  document.getElementById('cms-hero-title-input').value = cms.hero.title;
  document.getElementById('cms-hero-subtitle-input').value = cms.hero.subtitle;
  document.getElementById('cms-primary-label').value = cms.hero.primaryCta.label;
  document.getElementById('cms-secondary-label').value = cms.hero.secondaryCta.label;

  document.getElementById('cms-featured-title').value = cms.sections.featuredProductsTitle;
  document.getElementById('cms-featured-subtitle').value = cms.sections.featuredProductsSubtitle;
  document.getElementById('cms-rentals-title').value = cms.sections.featuredRentalsTitle;
  document.getElementById('cms-rentals-subtitle').value = cms.sections.featuredRentalsSubtitle;

  Modal.open('cms-modal');
}

function closeCMSModalFn() {
  Modal.close('cms-modal');
}

function handleCMSSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submit-cms-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Menyimpan...';
  }

  try {
    const cms = CmsService.get();

    const updates = {
      siteName: document.getElementById('cms-site-name').value.trim(),
      logoText: document.getElementById('cms-logo-text').value.trim(),
      hero: {
        ...cms.hero,
        badge: document.getElementById('cms-hero-badge').value.trim(),
        title: document.getElementById('cms-hero-title-input').value.trim(),
        subtitle: document.getElementById('cms-hero-subtitle-input').value.trim(),
        primaryCta: {
          ...cms.hero.primaryCta,
          label: document.getElementById('cms-primary-label').value.trim()
        },
        secondaryCta: {
          ...cms.hero.secondaryCta,
          label: document.getElementById('cms-secondary-label').value.trim()
        }
      },
      sections: {
        ...cms.sections,
        featuredProductsTitle: document.getElementById('cms-featured-title').value.trim(),
        featuredProductsSubtitle: document.getElementById('cms-featured-subtitle').value.trim(),
        featuredRentalsTitle: document.getElementById('cms-rentals-title').value.trim(),
        featuredRentalsSubtitle: document.getElementById('cms-rentals-subtitle').value.trim()
      },
      footer: {
        ...cms.footer,
        contact: document.getElementById('cms-footer-contact').value.trim(),
        about: document.getElementById('cms-footer-about').value.trim()
      }
    };

    CmsService.update(updates);
    renderCMSPreview();
    closeCMSModalFn();
    showToast('Konten website berhasil diupdate');
  } catch (error) {
    console.error(error);
    showToast('Gagal menyimpan konten website');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Simpan Perubahan';
    }
  }
}
