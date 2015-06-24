import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    save: function() {
      var campsite = this.store.createRecord('campsite', {
        campgroundName: this.get('identifier'),
        description: this.get('description'),
        review: this.get('review'),
        waterSource: this.get('waterSource'),
        GPSLocation: this.get('GPSLocation'),
        campImageURL: this.get('campImageURL'),
        submittedBy: this.get('submittedBy')
      });
      campsite.save();

      this.setProperties({identifier: " ", description: " ", review: " ", waterSource: " ", GPSLocation: " ", campImageURL: " ", rating: " ", submittedBy: " "});
      this.transitionToRoute('new-campsite');
    }
  }
});
