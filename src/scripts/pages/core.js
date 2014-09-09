// Importing polyfills to be attached to the global scope.
require('../core/polyfills.js');

// Little hack to take advantage of the regenerator-runtime hosted on wzrd.in
window.wrapGenerator = window.wrapGenerator || window.regeneratorRuntime.wrapGenerator;
