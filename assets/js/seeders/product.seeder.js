const defaultProducts = [

    {
        id: 1,

        name: 'Beras Premium 5kg',

        slug: 'beras-premium-5kg',

        price: 65000,

        stock: 20,

        category: 'Sembako',

        description:
            'Beras kualitas premium',

        image:
            'https://picsum.photos/300?1',

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()
    }

];

(function seedProducts() {

    const existingProducts =
        Storage.get('products');

    if (
        !existingProducts ||
        !existingProducts.length
    ) {

        Storage.set(
            'products',
            defaultProducts
        );

        AppState.products =
            defaultProducts;

        console.log(
            '[Seeder] Default products seeded'
        );
    }

})();