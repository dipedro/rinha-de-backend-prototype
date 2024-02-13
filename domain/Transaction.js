const CustomError = require('../shared/exceptions/custom-error');
const { isValidPositiveNumber } = require('../shared/utils');

class Transacao {
	id;
	valor;
	tipo;
	descricao;

	constructor (valor, tipo, descricao) {
		this.setValor(valor);
		this.setTipo(tipo);
		this.setDescricao(descricao);
	};

	getId = function () {
		return this.id;
	};

	setId = function (id) {
		if (!isValidPositiveNumber(id))
			throw new CustomError('Id inválido', 422);

		this.id = id;
	};

	getValor = function () {
		return this.valor;
	};

	setValor = function (newValor) {

		if (!isValidPositiveNumber(newValor))
			throw new CustomError('Valor inválido', 422);

		this.valor = newValor;
	}

	getTipo = function () {
		return this.tipo;
	}

	setTipo = function (newTipo) {
		if (!['c', 'd'].includes(newTipo))
			throw new CustomError('Tipo inválido', 422);

		this.tipo = newTipo;
	}

	getDescricao = function () {
		return this.descricao;
	}

	setDescricao = function (newDescricao) {
		if (typeof newDescricao !== 'string' || newDescricao.length === 0 || newDescricao.length > 10)
			throw new CustomError('Descrição inválida', 422);

		this.descricao = newDescricao;
	}
}

module.exports = Transacao;