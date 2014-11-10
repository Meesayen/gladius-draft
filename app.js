var
  fs = require('fs'),
  express = require('express'),
  consolidate = require('consolidate'),
  app = express(),

  recursive = require('recursive-readdir'),
  Handlebars = require('handlebars'),
  helpers = require('./handlebars.helpers.js'),
  PARTIALS = {},

  handler, fetchJson;

module.exports = app;

helpers.partial = function(partialName, partialObj) {
  PARTIALS[partialName] = partialObj.fn;
};
helpers.block = function(blockName, blockObj) {
  var json = fetchJson(blockName);

  Object.keys(json).forEach(function(k) {
    blockObj.data.root[k] = json[k];
  });
  if (blockName in PARTIALS) {
    return PARTIALS[blockName](blockObj.data.root);
  }
  return blockObj.fn(blockObj.data.root);
};
// Register partials
var templatesDir = './views/';
recursive(templatesDir, ['*.json'], function(err, files) {
  if (!err) {
    files.forEach(function(file) {
      var
        source = fs.readFileSync(file, 'utf8'),
        partial = /\/(.+)\.hbs/.exec(file).pop();
      Handlebars.registerPartial(partial, source);
    });
  }
});
Object.keys(helpers).forEach(function(k) {
  Handlebars.registerHelper(k, helpers[k]);
});

// serve static files
app.use(express.static('public/'));

app.engine('.hbs', consolidate.handlebars);
app.set('view engine', '.hbs');

// set templates location
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
handler = function(req, res, next, extra) {
  var json = fetchJson(req.params.template);
  json.__dev__ = process.env.NODE_ENV === 'production' ? false : true;
  Object.keys(extra || {}).forEach(function(k) {
    json[k] = extra[k];
  });
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
