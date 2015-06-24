import Ember from "ember";

export default Ember.Controller.extend({
  needs: ['campsite'],
  actions: {
    save: function() {
      var comment = this.store.createRecord('comment', {
        commentText: this.get('commentText'),
        commentAuthor: this.get('commentAuthor')
      });
      comment.save();

      var campsite = this.get('controllers.campsite.model');
      campsite.get('comments').pushObject(comment);
      campsite.save();

      this.setProperties({commentText: " ", commentAuthor: " "});
      this.transitionToRoute('campsite', campsite.id);
    }
  }
});
