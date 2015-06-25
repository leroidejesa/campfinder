import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  availability: DS.attr('string'),
  lat: DS.attr('string'),
  long: DS.attr('string'),
  state: DS.attr('string'),
  waterSource: DS.attr('string'),
  campImageURL: DS.attr('string'),
  submittedBy: DS.attr('string'),
  isFeatured: DS.attr('boolean'),
  comments: DS.hasMany('comment', {async: true})
});
