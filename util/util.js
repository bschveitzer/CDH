/**
 * Created by Osvaldo on 05/10/15.
 */

var Util = function(){
};

/**
 *
 * @param value
 * @param allowEmptyString
 * @returns {boolean|*}
 */
Util.prototype.isEmpty = function(value, allowEmptyString) {
    return (value == null) || (!allowEmptyString ? value === '' : false) || (this.isArray(value) && value.length === 0);
};

/**
 *
 * @type {Function}
 */
Util.prototype.isArray = ('isArray' in Array) ? Array.isArray : function(value) {
    return toString.call(value) === '[object Array]';
};

Util.prototype.isNumeric = function( obj ) {
    return  !this.isArray(obj ) && (obj - 0) == obj && (''+obj).replace(/^\s+|\s+$/g, "").length > 0;
};

Util.prototype.isValidId = function( obj ) {
    return !this.isEmpty(obj) && this.isNumeric(obj);
};

module.exports = new Util();