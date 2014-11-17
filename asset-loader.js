var AssetLoader = {
  _promises: [],
  add: function(promise) {
    this._promises.push(promise);
  },
  whenLoaded: function(cb) {
    $.when.apply($, this._promises).then(cb);
  }
};
