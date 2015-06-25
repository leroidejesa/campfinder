import Ember from "ember";

var CampsiteController = {
  isEditing: false,
  actions: {
    edit: function() {
      this.set('isEditing', true);
    },
    delete: function() {
      if (confirm("Are you sure you want to remove this campsite?")) {
        this.get('model').destroyRecord();
        this.transitionToRoute('browsesites');
      }
    },
    doneEditing: function() {
      this.get('model').save();
      this.set('isEditing', false);
    },
    setFeatured: function() {
      var model = this.get('model');
      model.toggleProperty('isFeatured');
      model.save();
      this.transitionToRoute('featured');
    }
  }
};

export default Ember.ObjectController.extend(CampsiteController);
