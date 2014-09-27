import base from './routes/base.es6';

export var responses = {
  '/api/testing': base.testing,
  '/api/one': base.one,
  '/api/last': base.last,
  '/api/awesome-list-data': base.awesomeList
};
