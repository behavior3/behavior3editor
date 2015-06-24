/** @module b3e */

(function () {
  "use strict";

  /**
   * The settings manager handle the editor settings.
   *
   * @class SettingsManager
   * @constructor
   */
  var SettingsManager = function() {
    this._dict = {};
  }
  var p = SettingsManager.prototype;
  
  /**
   * Erases all current settings.
   * 
   * @method clear
   */
  p.clear = function() {
    this._dict = {};
  }

  /**
   * Stores a value into the settings.
   * 
   * @method set
   * @param {String} key The unique identifier.
   * @param {Object} value The value.
   */
  p.set = function(key, value) {
    this._dict[key] = value;
  }

  /**
   * Retrieves a value from the settings.
   * 
   * @method get
   * @param {String} key The unique identifier.
   * @return {Object} The value.
   */
  p.get = function(key) {
    return this._dict[key]
  }

  /**
   * Stores a set of values into the settings.
   * 
   * @method load
   * @param {String} data An object containing pairs of `key, values`.
   */
  p.load = function(data) {
    for (var key in data) {
      this.set(key, data[key]);
    }
  }
 
  b3e.SettingsManager = SettingsManager;
})();