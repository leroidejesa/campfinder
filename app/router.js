import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('mapyourroute', {path: '/'});
  this.resource('new-campsite');
  this.resource('browsesites');
  this.resource('campsite', {path: 'campsite/:campsite_id'}, function() {
    this.resource('new-comment');
  });
  this.resource('about');
});


export default Router;
