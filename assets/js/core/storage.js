const Storage = {

  get(key, defaultValue = null) {

    try {

      const value =
        localStorage.getItem(key);

      return value
        ? JSON.parse(value)
        : defaultValue;

    } catch (error) {

      console.error(
        `Storage get error: ${key}`,
        error
      );

      return defaultValue;
    }
  },

  set(key, value) {

    try {

      localStorage.setItem(
        key,
        JSON.stringify(value)
      );

      return true;

    } catch (error) {

      console.error(
        `Storage set error: ${key}`,
        error
      );

      return false;
    }
  },

  remove(key) {

    localStorage.removeItem(key);
  },

  clear() {

    localStorage.clear();
  }
};