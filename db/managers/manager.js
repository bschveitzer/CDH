/**
 * Created by Osvaldo on 06/10/15.
 */
var hub = require('../../hub/hub.js');

var types = require('../Banco.js').mongoose.Schema.Types;


function Manager() {}

Manager.prototype.create = function(msg){
    var me = this;
    var dados = msg.getRes();
    this.model.create(dados, function(err, res){
        if(res){
            me.emitManager(msg, '.created', {res: res});
        } else{
            me.emitManager(msg, '.error.created', {err: err});
            console.log('erro no create', err);
        }
    })
};

Manager.prototype.read = function(msg){
    var me = this;
    var dados = msg.getRes();
    if(dados._id){
        this.model.findById(dados._id, function(err, res){
            if(res){
                me.emitManager(msg, '.readed', {res: res});
            } else{
                me.emitManager(msg, '.error.readed', {err: err});
            }
        })
    } else{
        this.model.find(function(err, res){
            if(res){
                me.emitManager(msg, '.readed', {res: res});
            } else{
                me.emitManager(msg, '.error.readed', {err: err});
            }
        })
    }
};

Manager.prototype.update = function(msg){
    var me = this;
    var dados = msg.getRes();
    this.model.findByIdAndUpdate(dados._id, {$set: dados}, function(err, res){
        if(res){
            me.model.findById(dados._id, function(err, res){
                if(res){
                    me.emitManager(msg, '.updated', {res: res});
                } else{
                    me.emitManager(msg, '.error.readedupdated', {err: err});
                }
            });
        } else{
            me.emitManager(msg, '.error.updated', {err: err});
        }
    })
};

Manager.prototype.destroy = function(msg){
    var me = this;
    var dados = msg.getRes();
    this.model.remove({_id: dados._id}, function(err, res){
        if(res){
            me.emitManager(msg, '.destroied', {res: res});
        } else{
            me.emitManager(msg, '.error.destroied', {err: err});
        }
    })
};

Manager.prototype.emitManager = function(msgAntiga, subEvt, dado){
    var me = this;
    var evt = msgAntiga.getFlag()+subEvt;
    var retorno = msgAntiga.next(me, evt, dado, msgAntiga.getFlag());
    hub.emit(retorno.getEvento(), retorno);
};

module.exports = Manager;