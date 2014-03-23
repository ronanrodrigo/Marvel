App = Ember.Application.create();
App.Router.map(function(){
  this.resource('about');
  this.resource('comics', function(){
    this.resource('comic', {path: ':comic_id'})
  });
  this.resource('stories', function(){
    this.resource('story', {path: ':story_id'});
  });
});

App.StoriesRoute = Ember.Route.extend({
  model: function(){
    ts = new Date().getTime();
    publicKey = "e438176d564bd323d172a6358c8cd85f";
    privateKey = "0263597fde88673e43539f79947caf7c32539abb";
    hash = md5(ts + privateKey + publicKey);
    url = "http://gateway.marvel.com/v1/public/stories?apikey="+publicKey+"&hash="+hash+"&ts="+ts;
    return $.getJSON(url).then(function(resource){
      return resource.data.results
    });
  }
});

App.StoryRoute = Ember.Route.extend({
  model: function(params) {
    ts = new Date().getTime();
    publicKey = "e438176d564bd323d172a6358c8cd85f";
    privateKey = "0263597fde88673e43539f79947caf7c32539abb";
    hash = md5(ts + privateKey + publicKey);
    story_id = params.story_id
    url = "http://gateway.marvel.com/v1/public/stories/"+story_id+"?apikey="+publicKey+"&hash="+hash+"&ts="+ts;
    return $.getJSON(url).then(function(resource){
      // data.post.body = data.post.content;
      console.log(resource.data.results[0]);
      return resource.data.results[0];
    })
  }
});

App.ComicsRoute = Ember.Route.extend({
  model: function(){
    publicKey = "e438176d564bd323d172a6358c8cd85f";
    privateKey = "0263597fde88673e43539f79947caf7c32539abb";
    ts = new Date().getTime();
    hash = md5(ts + privateKey + publicKey);
    url = "http://gateway.marvel.com/v1/public/comics?apikey="+publicKey+"&hash="+hash+"&ts="+ts;
    return $.getJSON(url).then(function(resource){
      return resource.data.results.map(function(result){
        result.thumbnail_path = result.thumbnail.path + "." + result.thumbnail.extension;
        return result
      });
    });
  }
})

App.ComicRoute = Ember.Route.extend({
  model: function(params){
    publicKey = "e438176d564bd323d172a6358c8cd85f";
    privateKey = "0263597fde88673e43539f79947caf7c32539abb";
    ts = new Date().getTime();
    hash = md5(ts + privateKey + publicKey);
    comic_id = params.comic_id
    url = "http://gateway.marvel.com/v1/public/comics/"+comic_id+"?apikey="+publicKey+"&hash="+hash+"&ts="+ts;
    return $.getJSON(url).then(function(resource){
      resource.data.results[0].thumbnail_path = resource.data.results[0].thumbnail.path + "." + resource.data.results[0].thumbnail.extension;
      return resource.data.results[0];
    });
  }
})

var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
  return new Handlebars.SafeString(showdown.makeHtml(input));
});

Ember.Handlebars.helper('format-date', function(date) {
  return moment(date).fromNow();
});

