const ProductService = {
  getAll() {
    return [...AppState.products];
  },

  getVisible() {
    return this.getAll().filter(
      product => product.visible !== false
    );
  },

  find(id) {
    return AppState.products.find(
      product => product.id === Number(id)
    );
  },

  create(data) {
    const now = new Date().toISOString();

    const product = {
      id: Date.now(),
      name: sanitize(data.name),
      slug: createSlug(data.name),
      price: safeNumber(data.price),
      stock: safeNumber(data.stock),
      category: sanitize(data.category),
      description: sanitize(data.description),
      image:
        sanitize(data.image) ||
        'https://placehold.co/300x200',
      visible:
        data.visible !== false,
      createdAt: now,
      updatedAt: now
    };

    AppState.products = [product, ...AppState.products];
    this.save();

    return product;
  },

  update(id, data) {
    let updatedProduct = null;

    AppState.products =
      AppState.products.map(product => {
        if (product.id !== Number(id)) {
          return product;
        }

        updatedProduct = {
          ...product,
          ...data,
          slug: createSlug(data.name || product.name),
          visible:
            data.visible !== undefined
              ? data.visible
              : product.visible,
          updatedAt: new Date().toISOString()
        };

        return updatedProduct;
      });

    this.save();
    return updatedProduct;
  },

  delete(id) {
    const exists = AppState.products.some(
      product => product.id === Number(id)
    );

    if (!exists) {
      return false;
    }

    AppState.products =
      AppState.products.filter(
        product => product.id !== Number(id)
      );

    this.save();
    return true;
  },

  save() {
    Storage.set('products', AppState.products);
  }
};