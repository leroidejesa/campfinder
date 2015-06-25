import Ember from "ember";

var FeaturedController = {
  showingAll: false,
  actions: {
    switch: function() {
      this.set('showingAll', true);
    }
  }
};

export default Ember.ObjectController.extend(FeaturedController);
