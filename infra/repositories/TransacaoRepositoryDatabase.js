class TransacaoRepositoryDatabase {
	connection;

	constructor (connection) {
		this.connection = connection;
	}

	async save (transacao, clienteId) {
		return this.connection.query(
			`insert into transacoes (valor, tipo, descricao, cliente_id, realizada_em) 
			values ($1, $2, $3, $4, $5)`, 
			[transacao.getValor(), transacao.getTipo(), 
			transacao.getDescricao(), clienteId, new Date()]
		);
	}
}

module.exports = TransacaoRepositoryDatabase;