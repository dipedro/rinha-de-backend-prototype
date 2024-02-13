class ClienteRepositoryDatabase {
	connection;

	constructor (connection) {
		this.connection = connection;
	}

	async findById (id) {
		const result = await this.connection.query(
			`select * from clientes where id = $1 limit 1`, [id]
		);

		return result.rows[0];
	}

	/* async saldo (id) {
		const result = await this.connection.query(
			`select sum(valor) from transacoes where cliente_id = $1`, [id]
		);

		return +result.rows[0].sum;
	} */

	async extrato (id) {
		const result = await this.connection.query(
			`select * from transacoes where cliente_id = $1 order by realizada_em desc limit 10`, [id]
		);

		return result.rows;
	}

	async atualizarSaldo (cliente) {
		await this.connection.query(
			`update clientes set saldo = $1 where id = $2`, [cliente.getSaldo(), cliente.getId()]
		);
	}
}

module.exports = ClienteRepositoryDatabase;