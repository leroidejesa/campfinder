import DS from 'ember-data';

export default DS.Model.extend({
  commentText: DS.attr('string'),
  commentAuthor: DS.attr('string'),
  campsite: DS.belongsTo('campsite', {async: true})
});
