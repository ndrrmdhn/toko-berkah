const Utils = {

  formatPrice(price) {

    return new Intl.NumberFormat(
      'id-ID',
      {
        style: 'currency',
        currency: 'IDR'
      }
    ).format(price);

  },

  generateId() {
    return Date.now();
  }

};