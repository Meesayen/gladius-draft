/* global R */

var
  doc = document,
  tmpDiv = doc.createElement('div');

export var render = (key, data) => {
  var
    frag = doc.createDocumentFragment(),
    el;
  tmpDiv.innerHTML = R.templates[key](data || {});
  while ((el = tmpDiv.firstChild)) {
    frag.appendChild(el);
  }
  return frag;
};
export var renderString = (key, data) => {
  return R.templates[key](data || {});
};
export var get = (key) => {
  return R.templates[key];
};
