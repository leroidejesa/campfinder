import Ember from "ember";

var ByStateController = {
  // queryParams: ['state'],

};

// filteredCampsites: function() {
//   var campsite = this.get('campsite');
//   var state = this.get('campsite.state');
//
//   if (state) {
//     return campsite.filterBy('state', state);
//   } else {
//     return campsite;
//   }
// }.property('campsite', 'state')


export default Ember.ObjectController.extend(ByStateController);
