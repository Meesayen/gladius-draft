var square = require('./square.js');
var tpl = require('./core/tpl.es6');

describe('square', function(){
  it('should produce squared result', function () {
    expect(square.square(4)).to.equal(16);
  });
});

describe('div.pippo', function() {
  var container;

  beforeEach(function() {
    var pippo = document.createElement('div');
    pippo.classList.add('pippo');
    container = document.createElement("div");
    container.appendChild(pippo);
    document.body.appendChild(container);
  });
  afterEach(function() {
    document.body.removeChild(container);
  });

  describe('when instantiated without parameters', function() {
    var el;

    beforeEach(function() {
      el = document.querySelector('.pippo');
    });

    it('should have no class other than pippo', function() {
      expect(el.className).to.not.be.equal('pippo')
    });
  });
});

describe('handlebar templates!', function() {
  var container;

  beforeEach(function() {
    container = document.createElement("div");
    container.innerHTML = tpl.renderString('bookingform');
    document.body.appendChild(container);
  });
  afterEach(function() {
    document.body.removeChild(container);
  });

  describe('when instantiated', function() {
    var el;

    beforeEach(function() {
      el = document.querySelector('div');
    });

    it('should have the template rendered!', function() {
      expect(el.querySelector('p').textContent).to.be.equal('Booking Form goes here');
    });
  });
});
