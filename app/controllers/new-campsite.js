import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    save: function() {
      var campsite = this.store.createRecord('campsite', {
        name: this.get('name'),
        description: this.get('description'),
        availability: this.get('availability'),
        lat: this.get('lat'),
        long: this.get('long'),
        state: this.get('state'),
        waterSource: this.get('waterSource'),
        campImageURL: this.get('campImageURL'),
        submittedBy: this.get('submittedBy')
      });
      campsite.save();

      this.setProperties({name: " ", description: " ", availability: " ", lat: " ", long: " ", state: " ", waterSource: " ", campImageURL: " ", submittedBy: " "});
      this.transitionToRoute('browsesites');
    }
  }
});
