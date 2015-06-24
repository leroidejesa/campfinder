import DS from 'ember-data';
//
// export default DS.Model.extend({
//   campgroundName: DS.attr('string'),
//   description: DS.attr('string'),
//   // review: DS.attr('string'),
//   waterSource: DS.attr('string'),
//   GPSLocation: DS.attr('string'),
//   campImageURL: DS.attr('string'),
//   submittedBy: DS.attr('string'),
//   comments: DS.hasMany('comment', {async: true})
// });


export default DS.Model.extend({
  elevation: DS.attr('string')
});
