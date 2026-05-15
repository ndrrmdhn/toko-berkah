function renderAll() {
  if (typeof renderProducts === 'function') renderProducts();
  if (typeof renderAdminTable === 'function') renderAdminTable();
  if (typeof renderCategoryChips === 'function') renderCategoryChips();
}

// Global helper
function formatPrice(price) {
  return `Rp ${price.toLocaleString('id-ID')}`;
}

window.formatPrice = formatPrice;
window.renderAll = renderAll;