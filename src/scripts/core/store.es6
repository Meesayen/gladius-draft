/* global reqwest */
import registry from './storeRegistry.es6';
import { serialize, clone, lookup, async } from './utils.es6';

var req = reqwest;

var extendProps = function(props, data={}) {
  if (!props.data) {
    props.data = {};
  }
  Object.keys(data).forEach(k => {
    if (k[0] === ':') {
      props.url = props.url.replace(k, data[k]);
    } else {
      props.data[k] = data[k];
    }
  });
};

// mockServer noop for production environment
var _mockServer = window['mockServer'] || {
  shutdown: function() {},
  restart: function() {}
};

/**
 * Helper class that takes care of the communication with remote APIs. It will
 * be treated as a Singleton whenever an external module requires it as a
 * dependency.
 */
class Store {
  constructor() {
    this._cache = {};
  }

  /**
   * Method to asynchronously fetch data from a remote service.
   *
   * @param  {String} id: A string identifier for remote resource descriptor
   *                      registered in the storeRegistry.
   * @param  {Object} data: Optional data object which overrides default data
   *                        defined in the resource descriptor.
   * @return {Promise}
   */
  get(id, data, opts={}) {
    var
      cache = this._cache,
      regProps = clone(registry[id]),
      mapProps = null,
      comboData = null,
      cacheId = data ? id + serialize(data) : id,
      comboProps;

    if (cache[cacheId] && !regProps.nocache && !opts.nocache) {
      return cache[cacheId];
    }

    if (regProps instanceof Array) {
      cache[cacheId] = async(function* asyncGetCombo() {
        try {
          while((comboProps = regProps.shift())) {
            mapProps = comboProps.map || null;
            if (comboProps.id) {
              comboProps = registry[comboProps.id];
            }
            if (mapProps !== null) {
              for (var k in mapProps) {
                if (mapProps.hasOwnProperty(k)) {
                  comboProps.data[mapProps[k]] = lookup(comboData, k);
                }
              }
            }
            mapProps = null;
            extendProps(comboProps, data);
            if (comboProps.real || opts.real) {
              _mockServer.shutdown();
            }
            comboData = yield req(comboProps);
            _mockServer.restart();
          }
          return comboData;
        } catch(err) {
          throw err;
        }
      });
    } else {
      cache[cacheId] = async(function* asyncGet() {
        var res;
        try {
          extendProps(regProps, data);
          if (regProps.real || opts.real) {
            _mockServer.shutdown();
          }
          res = yield req(regProps);
          _mockServer.restart();
          return res;
        } catch(err) {
          throw err;
        }
      });
    }
    return cache[cacheId];
  }

  post(id, data) {
    // TODO
    console.log(id, data);
  }
}

/**
 * An instance of Store will be exported, to make sure it will be a Singleton
 * everytime it is required as a dependency.
 */
var store = new Store();
export default store;
