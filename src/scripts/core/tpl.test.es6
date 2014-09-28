/* global Text */

import { render, renderSync, renderString, renderStringSync } from './tpl.es6';

var stupidJshint;

// FIXME remove this hack when Handlebars will be removed from Karma.
window.R = window.R || window.Handlebars;

describe('tpl.es6: Templates helper', () => {

  beforeEach(() => {
    window["R"] = window["R"] || {};
    window["R"]["templates"] = window["R"]["templates"] || {};
    window["R"]["templates"]["vn2537948v523048v57m2384bn84357"] =
        window["Handlebars"].template(function (R,depth0,helpers,partials,data) {
      this.compilerInfo = [4,'>= 1.0.0'];
      helpers = this.merge(helpers, R.helpers); data = data || {};
      return "<div>\n  <p>Booking Form goes here</p>\n</div>\nWelcome here\n<ul>\n  <li>one</li>\n  <li>two</li>\n</ul>\n";
    });
  });

  describe('.render()', () => {
    it('should return a Promise instance', () => {
      var promise = render('vn2537948v523048v57m2384bn84357');
      expect(promise).to.be.an.instanceof(Promise);
    });
    it('should return a HTMLElement instance on Promise fulfillment', (done) => {
      render('vn2537948v523048v57m2384bn84357').then(frag => {
        expect(frag).to.be.an.instanceof(HTMLElement);
        done();
      });
    });
    it('should produce the correct node tree', (done) => {
      render('vn2537948v523048v57m2384bn84357').then(frag => {
        var node = frag;
        if (node.nodeType === 3) {
          node = node.nextSibling;
        }
        expect(node).to.be.an.instanceof(HTMLDivElement);
        stupidJshint = expect(node.querySelector('p')).to.be.ok;
        node = node.nextSibling;
        expect(node).to.be.an.instanceof(Text);
        node = node.nextSibling;
        if (node.nodeType === 3) {
          node = node.nextSibling;
        }
        expect(node).to.be.an.instanceof(HTMLUListElement);
        expect(node.querySelectorAll('li').length).to.be.equal(2);
        done();
      });
    });
  });

  describe('.renderSync()', () => {
    it('should return a HTMLElement instance', () => {
      var rendered = renderSync('vn2537948v523048v57m2384bn84357');
      expect(rendered).to.be.an.instanceof(HTMLElement);
    });
    it('should produce the correct node tree', () => {
      var
        rendered = renderSync('vn2537948v523048v57m2384bn84357'),
        node = rendered;
      if (node.nodeType === 3) {
        node = node.nextSibling;
      }
      expect(node).to.be.an.instanceof(HTMLDivElement);
      stupidJshint = expect(node.querySelector('p')).to.be.ok;
      node = node.nextSibling;
      expect(node).to.be.an.instanceof(Text);
      node = node.nextSibling;
      if (node.nodeType === 3) {
        node = node.nextSibling;
      }
      expect(node).to.be.an.instanceof(HTMLUListElement);
      expect(node.querySelectorAll('li').length).to.be.equal(2);
    });
  });

  describe('.renderString()', () => {
    it('should return a Promise', () => {
      var promise = renderString('vn2537948v523048v57m2384bn84357');
      expect(promise).to.be.an.instanceof(Promise);
    });
    it('should return a string upon Promise fulfillment', () => {
      renderString('vn2537948v523048v57m2384bn84357').then(templ => {
        expect(templ).to.be.a('string');
      });
    });
    it('should produce the correct node tree representation', () => {
      renderString('vn2537948v523048v57m2384bn84357').then(templ => {
        expect(templ).to.be.equal('<div>\n  <p>Booking Form goes here</p>\n' +
          '</div>\nWelcome here\n<ul>\n  <li>one</li>\n  <li>two</li>\n</ul>\n');
      });
    });
  });

  describe('.renderStringSync()', () => {
    it('should return a string', () => {
      var rendered = renderStringSync('vn2537948v523048v57m2384bn84357');
      expect(rendered).to.be.a('string');
    });
    it('should produce the correct node tree representation', () => {
      var rendered = renderStringSync('vn2537948v523048v57m2384bn84357');
      expect(rendered).to.be.equal('<div>\n  <p>Booking Form goes here</p>\n' +
        '</div>\nWelcome here\n<ul>\n  <li>one</li>\n  <li>two</li>\n</ul>\n');
    });
  });
});
