const Storage = {

  get(key, defaultValue = null) {

    try {

      const raw =
        localStorage.getItem(key);

      if (!raw) {
        return defaultValue;
      }

      return JSON.parse(raw);

    } catch (error) {

      console.error(
        `[Storage] GET ${key}`,
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
        `[Storage] SET ${key}`,
        error
      );

      return false;
    }
  },

  remove(key) {

    try {

      localStorage.removeItem(key);

    } catch (error) {

      console.error(
        `[Storage] REMOVE ${key}`,
        error
      );
    }
  },

  clear() {

    try {

      localStorage.clear();

    } catch (error) {

      console.error(
        '[Storage] CLEAR',
        error
      );
    }
  }
};