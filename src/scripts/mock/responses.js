var base = require('./routes/base.es6');

exports.responses = {
  '/api/testing': base.testing,
  '/api/one': base.one,
  '/api/last': base.last,
  '/api/awesome-list-data': base.awesomeList
};
