/**
 * Created by Raupp on 27/10/2014.
 */

var util = require('util');
var EventEmitter2 = require("eventemitter2").EventEmitter2;
var me;
/**
 *
 * @constructor
 */
function Hub(){
    me = this;
    EventEmitter2.call(this, {
        wildcard: true,
        newListener: true,
        maxListeners:2000
    });
}
util.inherits(Hub, EventEmitter2);

Hub.prototype.emitir = function(evt,msg){
  process.nextTick(function(){
      me.emit(evt,msg);
  })
};

module.exports = new Hub();