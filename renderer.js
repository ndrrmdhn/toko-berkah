function createProductCard(product) {
  return `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      
      <div class="product-content">
        <h3>${product.name}</h3>

        <p class="price">
          Rp ${product.price.toLocaleString('id-ID')}
        </p>

        <button
          class="btn-primary buy-btn"
          data-id="${product.id}"
        >
          Beli
        </button>
      </div>
    </div>
  `;
}