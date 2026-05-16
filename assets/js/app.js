document.addEventListener(
  'DOMContentLoaded',
  () => {
    console.log('[App] Initialized');
  }
);

/*
|--------------------------------------------------------------------------
| AUTO PERSIST STATE
|--------------------------------------------------------------------------
*/
window.addEventListener('beforeunload', () => {
  if (window.Storage && window.AppState) {
    Storage.set('products', AppState.products);
    Storage.set('rentals', AppState.rentals || []);
    Storage.set('cms', AppState.cms || {});
    Storage.set('currentUser', AppState.currentUser || null);
  }
});

/*
|--------------------------------------------------------------------------
| STORAGE SYNC ANTAR TAB
|--------------------------------------------------------------------------
*/
window.addEventListener('storage', event => {
  switch (event.key) {
    case 'products':
      AppState.products = normalizeProducts(
        Storage.get('products', [])
      );
      console.log('[App] Products synced');
      break;
    case 'rentals':
      AppState.rentals = normalizeRentals(
        Storage.get('rentals', [])
      );
      console.log('[App] Rentals synced');
      break;
    case 'cms':
      AppState.cms = normalizeCms(
        Storage.get('cms', DEFAULT_CMS)
      );
      console.log('[App] CMS synced');
      break;
    default:
      break;
  }
});
