const AppState = {

  currentUser:
    Storage.get('currentUser', null),

  products:
    Storage.get('products', [
      {
        id: 1,
        name: 'Beras Premium 5kg',
        price: 65000,
        stock: 20,
        category: 'Sembako',
        description: 'Beras kualitas premium',
        image:
          'https://picsum.photos/300?1'
      }
    ])
};