/**
 * Created by Osvaldo on 29/10/15.
 */

/**
 * Mensagem que supre a necessidade do browser, usada para comunicacao entre as classes do cliente ou retorna os dados
 * para o server com a funcacao toServer.
 *
 * @param {String} evento
 * @param {object} source
 * @param {object} dado
 * @param {String} flag
 * @param {Number} idMsg
 *
 * @constructor
 */
var Mensagem = function(source, evento, dado, flag, idMsg){
    if(typeof source === 'undefined'){
        throw new Error("N�o � possivel criar uma mensagem sem um source");
    }

    if(!this.constructor._idMessage){
        this.constructor._idMessage = 0;
    }

    /**
     * Id desta mensagem
     * @type {number}
     * @private
     */
    this._id = idMsg? idMsg: ++this.constructor._idMessage;

    /**
     * Evento que será enviado e usado para a comunicação
     * @type {String}
     * @private
     */
    this._evento = evento;

    /**
     *  Objecto que criou a mensagem
     * @type {object}
     * @private
     */
    this._source = source;

    /**
     * Flag (opcional) para identifica��o de mensagem quando necess�rio.
     * @type {*}
     * @private
     */
    this._flag = flag

    /**
     * Payload da memensagem
     * @type {*}
     * @private
     */
    this._dado = dado;

    /**
     * Em caso de erro, este atributo ter� o objeto do erro.
     * @type {Error}
     * @private
     */
    this._erro = null;

    /**
     * Boolean indiciando se esta mensagem � valida ou n�o
     * @type {boolean}
     * @private
     */
    this._success = this._dado? true : false;

};


/**
 * Seta o id da mensagem (representa a mensagem e si que � unica, n�o este objeto) que identifica ela e suas sucessoras
 * @param id
 */
Mensagem.prototype.setId = function(id){
    this._id = id;
};

/**
 * Retorna o id da mensagem inicial que foi criada
 * @returns {*}
 */
Mensagem.prototype.getId = function(){
    return this._id;
};


/**
 * Seta um valor de Mensagem que � considerado v�lido
 * @param {*} dado
 * @throws Error
 */
Mensagem.prototype.setDado = function(dado){
    if(dado === void(0)) throw new Error("Invalid number of paramaters");
    this._erro = null;
    this._success = true;
    this._dado = dado;
    return this;
};

/**
 * Seta um valor de Mensagem que � o tranforma em invalido. Erro
 * @param {Error} dado
 */
Mensagem.prototype.setErro = function(err){
    this._dado = null;
    this._success = false;
    this._erro = err;
    return this;
};

/**
 * Retorna a dado de cria��o da mensagem
 * Esta dado � copiada no memonto da clonagem
 * @returns {int}
 */
Mensagem.prototype.getDado = function(){
    return this._dado;
};

/**
 * Retorna o source da Mensagem
 * @returns {object}
 */
Mensagem.prototype.getSource = function(){
    return this._source;
};

/**
 * Seta o source da Mensagem
 * @returns {object}
 */
Mensagem.prototype.setSource = function(source){
    this._source = source;
    return this;
};

/**
 * Retorna um representa��o de erro, caso este objeto seja invalido == erro;
 * @returns {*}
 */
Mensagem.prototype.getErro = function(){
    return this._erro;
};


/**
 * Retorna true se este objeto representar um erro
 * @returns {boolean}
 */
Mensagem.prototype.isErro = function(){
    return !this._success;
};

Mensagem.prototype.isSuccess = function(){
    return this._success;
};

Mensagem.prototype.getFlag = function(){
    return this._flag;
};

Mensagem.prototype.setFlag = function(flag){
    this._flag = flag;
    return this;
};

Mensagem.prototype.setSuccess = function(success){
    this._success = success;
    return this;
};

Mensagem.prototype.getEvento = function(){
    return this._evento;
};

Mensagem.prototype.setEvento = function(evento){
    this._evento = evento;
    return this;
};

/**
 * Formata a mensagem para o servidor.
 *
 * @returns {{evento: String, success: boolean, dados: object, erro: object, flag: String}}
 */
Mensagem.prototype.toServer = function(){
    return {
        evento: this.getEvento(),
        success: this.isSuccess(),
        dados: this.getDado(),
        erro: this.getErro(),
        flag: this.getFlag()
    };
};

Mensagem.prototype.fromServer = function(msg){
    this.setEvento(msg.evento);
    this.setFlag(msg.flag);
    if(msg.success){
        this.setDado(msg.dado);
    } else{
        this.setErro(msg.erro);
    }
};

window.Mensagem = Mensagem;