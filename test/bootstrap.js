global.Immutable = require('../bower_components/immutable/dist/immutable.min.js')
process.env.NODE_PATH = __dirname+'../source/';
require('module').Module._initPaths();

global.StoreStub = function(state) {
  var _state = state;

  this.getState = function() {
    return _state
  }

  this.setState = function(stateOrFunction) {
    if (typeof stateOrFunction === 'function') {
      _state = _state.withMutations(stateOrFunction)
    } else {
      _state = stateOrFunction
    }
  }
}
