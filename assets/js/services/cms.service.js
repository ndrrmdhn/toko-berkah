const CmsService = {
  get() {
    return AppState.cms;
  },

  update(data) {
    AppState.cms = normalizeCms({
      ...AppState.cms,
      ...data
    });

    this.save();
    return AppState.cms;
  },

  save() {
    Storage.set('cms', AppState.cms);
  }
};
