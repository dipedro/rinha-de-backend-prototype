const CustomError = require('../shared/exceptions/custom-error');
const { isValidPositiveNumber } = require('../shared/utils');

class Cliente {
	id;
	nome;
	limite;
	saldo

	constructor (id, nome, limite, saldo) {
		this.setId(id);
		this.setNome(nome);
		this.setLimite(limite);
		this.setSaldo(saldo);
	};

	getId = function () {
		return this.id;
	};

	setId = function (id) {
		if (!isValidPositiveNumber(id))
			throw new CustomError('Id inválido', 422);

		this.id = id;
	};

	getNome = function () {
		return this.nome;
	};

	setNome = function (newNome) {
		this.nome = newNome;
	}

	getLimite = function () {
		return this.limite;
	};

	setLimite = function (newLimite) {
		this.limite = newLimite;
	};

	getSaldo = function () {
		return this.saldo;
	};

	setSaldo = function (newSaldo) {
		if (!Number.isInteger(newSaldo)) {
			throw new CustomError('Saldo inválido', 422);
		}
		this.saldo = newSaldo;
	};
}

module.exports = Cliente;