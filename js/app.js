App = Ember.Application.create();
App.Router.map(function(){
  this.resource('about');
  this.resource('posts', function(){
    this.resource('post', {path: ':post_id'});
  });
});

App.PostsRoute = Ember.Route.extend({
  model: function(){
    return $.getJSON('http://tomdale.net/api/get_recent_posts/?callback=?').then(function(data){
      return data.posts.map(function(post){
        post.body = post.content;
        return post
      });
    });
    // return posts;
  }
});

App.PostRoute = Ember.Route.extend({
  model: function(params) {
    // return posts.findBy('id', params.post_id);
    return $.getJSON('http://tomdale.net/api/get_post/?id='+params.post_id+'&callback=?').then(function(data){
      data.post.body = data.post.content;
      return data.post;
    })
  }
});

App.PostController = Ember.ObjectController.extend({
  isEditing: false,
  actions:{
    edit: function(){
      this.set('isEditing', true);
    },
    doneEditing: function(){
      this.set('isEditing', false);
    }
  }
});

// var posts = [{
//   id: "1",
//   title: "Hello World",
//   author: {name: "Ronan"},
//   date: new Date("12-27-2014"),
//   excerpt: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//   body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
// },
// {
//   id: "2",
//   title: "Hello Joinville",
//   author: {name: "Ronan"},
//   date: new Date("12-27-2014"),
//   excerpt: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//   body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
// }]

var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
  return new Handlebars.SafeString(showdown.makeHtml(input));
});

Ember.Handlebars.helper('format-date', function(date) {
  return moment(date).fromNow();
});

