const DEFAULT_CMS = {
  siteName: 'Toko Berkah',
  logoText: 'Toko Berkah',
  navLinks: [
    { label: 'Home', url: 'index.html' },
    { label: 'Catalog', url: 'katalog.html' },
    { label: 'Kontrakan', url: 'kontrakan.html' },
    { label: 'Login', url: 'login.html' }
  ],
  hero: {
    visible: true,
    badge: 'Marketplace Sembako Modern',
    title: 'Belanja Kebutuhan Harian Jadi Lebih Mudah',
    subtitle: 'Sembako, minuman, snack, hingga kebutuhan rumah tangga tersedia lengkap dengan harga terbaik.',
    primaryCta: {
      label: 'Belanja Sekarang',
      url: 'katalog.html'
    },
    secondaryCta: {
      label: 'Lihat Produk',
      url: '#featured-products'
    }
  },
  categories: ['Semua', 'Sembako', 'Minuman', 'Snack', 'Pulsa', 'Kontrakan'],
  sections: {
    featuredProductsTitle: 'Produk Populer',
    featuredProductsSubtitle: 'Produk pilihan dengan harga terbaik',
    featuredRentalsTitle: 'Kontrakan Terbaru',
    featuredRentalsSubtitle: 'Kontrakan pilihan dengan fasilitas lengkap'
  },
  footer: {
    about: 'Marketplace kebutuhan harian modern dengan harga terjangkau.',
    contact: '0821-1234-5678',
    links: [
      { label: 'Tentang', url: '#' },
      { label: 'Bantuan', url: '#' },
      { label: 'Kontak', url: '#' }
    ],
    social: [
      { label: 'Instagram', icon: 'fab fa-instagram', url: '#' },
      { label: 'WhatsApp', icon: 'fab fa-whatsapp', url: 'https://wa.me/628123456789' }
    ]
  }
};

const AppState = {

  currentUser:
    Storage.get(
      'currentUser',
      null
    ),

  products:
    normalizeProducts(
      Storage.get(
        'products',
        []
      )
    ),

  rentals:
    normalizeRentals(
      Storage.get(
        'rentals',
        []
      )
    ),

  cms:
    normalizeCms(
      Storage.get(
        'cms',
        DEFAULT_CMS
      )
    )
};

function normalizeProducts(products = []) {

  return products.map(product => ({

    id:
      product.id || Date.now(),

    name:
      product.name || '',

    slug:
      product.slug ||
      createSlug(product.name),

    price:
      Number(product.price) || 0,

    stock:
      Number(product.stock) || 0,

    category:
      product.category || 'Umum',

    description:
      product.description || '',

    image:
      product.image ||
      'https://placehold.co/300x200',

    visible:
      product.visible !== undefined
        ? product.visible
        : true,

    createdAt:
      product.createdAt ||
      new Date().toISOString(),

    updatedAt:
      product.updatedAt ||
      new Date().toISOString()

  }));
}

function normalizeRentals(rentals = []) {

  return rentals.map(rental => ({

    id:
      rental.id || Date.now(),

    title:
      rental.title || '',

    slug:
      rental.slug ||
      createSlug(rental.title),

    location:
      rental.location || 'Unknown',

    price:
      Number(rental.price) || 0,

    size:
      rental.size || '',

    facilities:
      Array.isArray(rental.facilities)
        ? rental.facilities
        : parseList(rental.facilities),

    gallery:
      Array.isArray(rental.gallery)
        ? rental.gallery
        : parseList(rental.gallery),

    status:
      rental.status || 'available',

    visible:
      rental.visible !== undefined
        ? rental.visible
        : true,

    description:
      rental.description || '',

    image:
      rental.image ||
      'https://placehold.co/400x260',

    createdAt:
      rental.createdAt ||
      new Date().toISOString(),

    updatedAt:
      rental.updatedAt ||
      new Date().toISOString()

  }));
}

function normalizeCms(cms = {}) {
  return {
    ...DEFAULT_CMS,
    ...cms,
    navLinks: Array.isArray(cms.navLinks)
      ? cms.navLinks.map(link => ({
        label: sanitize(link.label),
        url: sanitize(link.url)
      }))
      : DEFAULT_CMS.navLinks,
    hero: {
      ...DEFAULT_CMS.hero,
      ...cms.hero
    },
    categories: Array.isArray(cms.categories)
      ? cms.categories.map(item => String(item).trim()).filter(Boolean)
      : DEFAULT_CMS.categories,
    sections: {
      ...DEFAULT_CMS.sections,
      ...cms.sections
    },
    footer: {
      ...DEFAULT_CMS.footer,
      ...cms.footer,
      links: Array.isArray(cms.footer?.links)
        ? cms.footer.links.map(link => ({
          label: sanitize(link.label),
          url: sanitize(link.url)
        }))
        : DEFAULT_CMS.footer.links,
      social: Array.isArray(cms.footer?.social)
        ? cms.footer.social.map(item => ({
          label: sanitize(item.label),
          icon: sanitize(item.icon),
          url: sanitize(item.url)
        }))
        : DEFAULT_CMS.footer.social
    }
  };
}
