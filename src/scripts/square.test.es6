import { square } from './square.js';
import { renderStringSync } from './core/tpl.es6';

describe('square.es6: Useless test. Just for the sake of it.', () => {
  it('should produce squared result',  () => {
    expect(square(4)).to.equal(16);
  });

  describe('div.pippo', () => {
    var container;

    beforeEach(() => {
      var pippo = document.createElement('div');
      pippo.classList.add('pippo');
      container = document.createElement("div");
      container.appendChild(pippo);
      document.body.appendChild(container);
    });
    afterEach(() => {
      document.body.removeChild(container);
    });

    describe('when instantiated without parameters', () => {
      var el;

      beforeEach(() => {
        el = document.querySelector('.pippo');
      });

      it('should have no class other than pippo', () => {
        expect(el.className).to.be.equal('pippo');
      });
    });
  });

  describe('handlebar templates!', () => {
    var container;

    beforeEach(() => {
      container = document.createElement("div");
      container.innerHTML = renderStringSync('awesomeList');
      document.body.appendChild(container);
    });
    afterEach(() => {
      document.body.removeChild(container);
    });

    describe('when instantiated', () => {
      var el;

      beforeEach(() => {
        el = document.querySelector('div');
      });

      it('should have the template rendered!', () => {
        expect(el.querySelector('p').textContent).to.be.equal('Here goes an awesome list!');
      });
    });
  });
});

