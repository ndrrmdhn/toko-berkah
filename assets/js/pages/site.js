function initSitePage() {
  renderSite();
}

function renderSite() {
  const cms = CmsService.get();

  renderLogo(cms);
  renderNav(cms);
  renderMobileNav(cms);
  renderFooter(cms);
  renderHeroSection(cms);
  renderCategoryChips(cms);
}

function renderLogo(cms) {
  document.querySelectorAll('.site-logo, .logo').forEach(el => {
    el.textContent = cms.logoText || cms.siteName;
  });
}

function renderNav(cms) {
  const navContainers = Array.from(
    document.querySelectorAll('.nav-links')
  );

  if (!navContainers.length) return;

  const navHtml = cms.navLinks
    .map(link => `
      <a href="${escapeHTML(link.url)}">
        ${escapeHTML(link.label)}
      </a>
    `)
    .join('');

  navContainers.forEach(nav => {
    nav.innerHTML = navHtml;
  });
}

function renderMobileNav(cms) {
  const mobileNav = document.getElementById('mobile-nav');
  if (!mobileNav) return;

  mobileNav.innerHTML = cms.navLinks
    .map(link => `
      <a href="${escapeHTML(link.url)}">
        ${escapeHTML(link.label)}
      </a>
    `)
    .join('');
}

function renderFooter(cms) {
  const footer = document.querySelector('.footer');
  const footerLinks = document.querySelector('.footer-links');
  const footerSocial = document.getElementById('footer-social') || document.querySelector('.footer-social');
  const footerContact = document.getElementById('footer-contact');
  const footerBrand = document.getElementById('footer-brand');
  const footerAbout = document.getElementById('footer-about');

  if (footerBrand) {
    footerBrand.textContent = cms.siteName;
  } else if (footer) {
    const brandHeading = footer.querySelector('h3');
    if (brandHeading) {
      brandHeading.textContent = cms.siteName;
    }
  }

  if (footerAbout) {
    footerAbout.textContent = cms.footer.about;
  } else if (footer) {
    const aboutParagraph = footer.querySelector('.footer-content > div p');
    if (aboutParagraph) {
      aboutParagraph.textContent = cms.footer.about;
    }
  }

  if (footerLinks) {
    footerLinks.innerHTML = cms.footer.links
      .map(link => `
        <a href="${escapeHTML(link.url)}">
          ${escapeHTML(link.label)}
        </a>
      `)
      .join('');
  }

  if (footerSocial) {
    footerSocial.innerHTML = cms.footer.social
      .map(link => `
        <a href="${escapeHTML(link.url)}" aria-label="${escapeHTML(link.label)}" target="_blank" rel="noreferrer noopener">
          <i class="${escapeHTML(link.icon)}"></i>
        </a>
      `)
      .join('');
  }

  if (footerContact) {
    footerContact.textContent = cms.footer.contact;
  }
}

function renderHeroSection(cms) {
  const hero = document.querySelector('.hero') || document.getElementById('hero-section');
  if (!hero) return;

  if (!cms.hero.visible) {
    hero.classList.add('hidden');
    return;
  }

  hero.classList.remove('hidden');
  hero.querySelectorAll('.hero-badge, #hero-badge').forEach(el => {
    el.textContent = cms.hero.badge;
  });
  hero.querySelectorAll('.hero-title, #hero-title, h1').forEach(el => {
    el.textContent = cms.hero.title;
  });
  hero.querySelectorAll('.hero-subtitle, #hero-subtitle, p').forEach(el => {
    if (el.closest('.hero-content')) {
      el.textContent = cms.hero.subtitle;
    }
  });
  const primaryCta = hero.querySelector('.hero-actions .btn-primary') || document.getElementById('hero-cta-primary');
  const secondaryCta = hero.querySelector('.hero-actions .btn-dark') || document.getElementById('hero-cta-secondary');

  if (primaryCta) {
    primaryCta.textContent = cms.hero.primaryCta.label;
    primaryCta.href = cms.hero.primaryCta.url;
  }

  if (secondaryCta) {
    secondaryCta.textContent = cms.hero.secondaryCta.label;
    secondaryCta.href = cms.hero.secondaryCta.url;
  }
}

function renderCategoryChips(cms) {
  const categoryContainer = document.getElementById('category-chips');
  if (!categoryContainer) return;

  categoryContainer.innerHTML = cms.categories
    .map(category => `
      <button type="button" class="category-chip">
        ${escapeHTML(category)}
      </button>
    `)
    .join('');
}

function escapeHTML(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
