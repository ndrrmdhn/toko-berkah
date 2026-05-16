const RentalService = {
  getAll() {
    return [...AppState.rentals];
  },

  getVisible() {
    return this.getAll().filter(
      rental => rental.visible !== false
    );
  },

  find(id) {
    return AppState.rentals.find(
      rental => rental.id === Number(id)
    );
  },

  create(data) {
    const now = new Date().toISOString();

    const rental = {
      id: Date.now(),
      title: sanitize(data.title),
      slug: createSlug(data.title),
      location: sanitize(data.location),
      price: safeNumber(data.price),
      size: sanitize(data.size),
      facilities: parseList(data.facilities),
      gallery: parseList(data.gallery),
      status: sanitize(data.status) || 'available',
      visible: data.visible !== false,
      description: sanitize(data.description),
      image:
        sanitize(data.image) ||
        'https://placehold.co/400x260',
      createdAt: now,
      updatedAt: now
    };

    AppState.rentals = [rental, ...AppState.rentals];
    this.save();

    return rental;
  },

  update(id, data) {
    let updatedRental = null;

    AppState.rentals =
      AppState.rentals.map(rental => {
        if (rental.id !== Number(id)) {
          return rental;
        }

        updatedRental = {
          ...rental,
          title:
            sanitize(data.title) ||
            rental.title,
          slug: createSlug(data.title || rental.title),
          location:
            sanitize(data.location) ||
            rental.location,
          price: safeNumber(data.price),
          size:
            sanitize(data.size) ||
            rental.size,
          facilities:
            parseList(data.facilities).length
              ? parseList(data.facilities)
              : rental.facilities,
          gallery:
            parseList(data.gallery).length
              ? parseList(data.gallery)
              : rental.gallery,
          status:
            sanitize(data.status) ||
            rental.status,
          visible:
            data.visible !== undefined
              ? data.visible
              : rental.visible,
          description:
            sanitize(data.description) ||
            rental.description,
          image:
            sanitize(data.image) ||
            rental.image,
          updatedAt: new Date().toISOString()
        };

        return updatedRental;
      });

    this.save();
    return updatedRental;
  },

  delete(id) {
    const exists = AppState.rentals.some(
      rental => rental.id === Number(id)
    );

    if (!exists) {
      return false;
    }

    AppState.rentals =
      AppState.rentals.filter(
        rental => rental.id !== Number(id)
      );

    this.save();
    return true;
  },

  save() {
    Storage.set('rentals', AppState.rentals);
  }
};
