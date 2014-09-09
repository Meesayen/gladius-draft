// configuration of express app for
//   handlebars and static content

var
  fs = require('fs'),
  express = require('express'),
  exHb  = require('express-handlebars'),
  app = express(),

  // inheritance hack
  // FIXME should be a WeakMap
  PARTIALS = {},

  // helpers dict
  helpers = require('./handlebars.helpers.js'),
  handler, tpl, fetchJson;

module.exports = app;


// Extending custom helpers with Handlebars.java specific ones
helpers.precompile = function() {
  // Do absolute nothing.
};
helpers.partial = function(partialName, partialObj) {
  PARTIALS[partialName] = partialObj.fn;
};
helpers.block = function(blockName, blockObj) {
  var json = fetchJson(blockName);
  for (var k in json) {
    if (json.hasOwnProperty(k)) {
      blockObj.data.root[k] = json[k];
    }
  }
  if (blockName in PARTIALS) {
    return PARTIALS[blockName](blockObj.data.root);
  }
  return blockObj.fn(blockObj.data.root);
};


// serve static files
app.use(express.static('public'));

tpl = exHb.create({
  defaultLayout: 'mainlayout',
  extname: '.hbs',
  layoutsDir: 'views/',
  partialsDir: 'views/',
  helpers: helpers
});

// set templates location
app.engine('.hbs', tpl.engine);
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views/');


fetchJson = function(id) {
  var json;
  try {
    json = JSON.parse(fs.readFileSync(
      app.get('views') + id + '.json',
      'utf-8'
    ));
  } catch (e) {
    json = {};
  } finally {
    return json;
  }
};

// all requests handler
handler = function(req, res) {
  var json = fetchJson(req.params.template);
  res.render(req.params.template, json);
};


app.param(function(name, fn) {
  if (fn instanceof RegExp) {
    return function(req, res, next, val) {
      var captures;
      if ((captures = fn.exec(String(val)))) {
        req.params[name] = captures;
        next();
      } else {
        next('route');
      }
    };
  }
});
// Needed to suppress .ico and other files with extension failure messages.
app.param('template', /^\w+$/);
app.get('/:template', handler);

// default index handler
app.get('/', function(req) {
  req.params.template = 'index';
  handler.apply(null, arguments);
});
