/* global DocumentFragment */
/* global Text */

var tpl = require('./tpl.es6');
var stupidJshint;

describe('Templates wrapper', function() {

  beforeEach(function () {
    window["Handlebars"] = window["Handlebars"] || {};
    window["Handlebars"]["templates"] = window["Handlebars"]["templates"] || {};
    window["Handlebars"]["templates"]["m0cu124012u3c048u12c034umc0182u3m4c908u1m23cm1823u4c890123um4c82u1m34m98c219384c92813u4c98123u4c8u"] =
        window["Handlebars"].template(function (Handlebars,depth0,helpers,partials,data) {
      this.compilerInfo = [4,'>= 1.0.0'];
      helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
      return "<div>\n  <p>Booking Form goes here</p>\n</div>\nWelcome here\n<ul>\n  <li>one</li>\n  <li>two</li>\n</ul>\n";
    });
  });

  describe('.render()', function () {
    it('should return a DocumentFragment instance', function () {
      var rendered = tpl.render('m0cu124012u3c048u12c034umc0182u3m4c908u1m23cm1823u4c890123um4c82u1m34m98c219384c92813u4c98123u4c8u');
      expect(rendered).to.be.an.instanceof(DocumentFragment);
    });
    it('should produce the correct node tree', function () {
      var
        rendered = tpl.render('m0cu124012u3c048u12c034umc0182u3m4c908u1m23cm1823u4c890123um4c82u1m34m98c219384c92813u4c98123u4c8u'),
        node = rendered.firstChild;
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
  describe('.renderString()', function () {
    it('should return a string', function () {
      var rendered = tpl.renderString('m0cu124012u3c048u12c034umc0182u3m4c908u1m23cm1823u4c890123um4c82u1m34m98c219384c92813u4c98123u4c8u');
      expect(rendered).to.be.a('string');
    });
    it('should produce the correct node tree representation', function () {
      var rendered = tpl.renderString('m0cu124012u3c048u12c034umc0182u3m4c908u1m23cm1823u4c890123um4c82u1m34m98c219384c92813u4c98123u4c8u');
      expect(rendered).to.be.equal('<div>\n  <p>Booking Form goes here</p>\n' +
        '</div>\nWelcome here\n<ul>\n  <li>one</li>\n  <li>two</li>\n</ul>\n');
    });
  });
});
