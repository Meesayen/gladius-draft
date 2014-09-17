// import { store } from '../core/store';
var deserialize = require('../core/utils.es6').deserialize;
var store = require('../core/store.es6').store;
var tpl = require('../core/tpl.es6');

// Single call
store.get('one').then(function(data) {
  console.log(data.greetings);
});
// This one fails and receives default error message.
store.get('one', {fails:true}).then(function(data) {
  console.log(data.greetings);
}, function(err) {
  console.log(deserialize(err.responseText)['message'] || err.statusText);
});
// This one fails and receives custom error message.
store.get('two', {fails:true}).then(function(data) {
  console.log(data.greetings);
}, function(err) {
  console.log(deserialize(err.responseText)['message'] || err.statusText);
});

// Combo call
store.get('combo')
  .then(function(data) {
    console.log(data);
  }, function(err) {
    console.log(err);
  });

// The second time it fetches the cached value
setTimeout(function() {
  store.get('combo')
    .then(function(data) {
      console.log(data);
    }, function(/*err*/) {
      // console.log(err);
    });
}, 3000);

// Let's try with a template
setTimeout(function() {
  store.get('awesome-list-data')
    .then(function(data) {
      document.body.appendChild(tpl.render('awesomeList', data));
    }, function(/*err*/) {
      // console.log(err);
    });
}, 4000);

// Stupid thing for a stupid test.
module.exports.index = true;
