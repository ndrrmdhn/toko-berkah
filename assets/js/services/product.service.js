const ProductService = {

  getAll() {
    return AppState.products;
  },

  create(product) {

    product.id = Date.now();

    AppState.products.unshift(product);

    this.save();

    return product;
  },

  update(id, data) {

    const index =
      AppState.products.findIndex(
        p => p.id === id
      );

    if (index === -1) return false;

    AppState.products[index] = {
      ...AppState.products[index],
      ...data
    };

    this.save();

    return true;
  },

  delete(id) {

    AppState.products =
      AppState.products.filter(
        p => p.id !== id
      );

    this.save();
  },

  find(id) {
    return AppState.products.find(
      p => p.id === id
    );
  },

  save() {
    Storage.set(
      'products',
      AppState.products
    );
  }

};