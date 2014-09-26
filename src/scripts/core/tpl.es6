/* global R */
/* global dust */

var
  doc = document,
  tmpDiv = doc.createElement('div');

export var render = (key, data) => {
  var
    frag = doc.createDocumentFragment(),
    el;
  return new Promise((resolve, reject) => {
    new Promise((resolve, reject) => {
      if (window['dust']) {
        dust.render(key, data || {}, (err, tpl) => {
          if (err) {
            reject(err);
          } else {

          }
          resolve(tpl);
        });
      } else {
        resolve(R.templates[key](data || {}));
      }
    }).then(tpl => {
      tmpDiv.innerHTML = tpl;
      while ((el = tmpDiv.firstChild)) {
        frag.appendChild(el);
      }
      resolve(frag);
    }, err => {
      reject(err);
    });
  });
};

export var renderSync = (key, data) => {
  var
    frag = doc.createDocumentFragment(),
    el;
  if (window['dust']) {
    console.warn('You must use the asynchronous method `render` to take' +
        ' advantage of Dust templates.');
    return frag;
  }
  tmpDiv.innerHTML = R.templates[key](data || {});
  while ((el = tmpDiv.firstChild)) {
    frag.appendChild(el);
  }
  return frag;
};

export var renderString = (key, data) => {
  return new Promise((resolve, reject) => {
    if (window['dust']) {
      dust.render(key, data || {}, (err, tpl) => {
        if (err) {
          reject(err);
        } else {
          resolve(tpl);
        }
      });
    } else {
      resolve(R.templates[key](data || {}));
    }
  });
};

export var renderStringSync = (key, data) => {
  if (window['dust']) {
    console.warn('You must use the asynchronous method `renderString` to take' +
        ' advantage of Dust templates.');
    return '';
  }
  return R.templates[key](data || {});
};

export var get = (key) => {
  return R.templates[key];
};
