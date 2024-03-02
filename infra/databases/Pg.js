const { Pool } = require('pg');

class Pg {
	connection;

	constructor () {
		this.connection = new Pool({
			user: 'postgres',
			host: 'localhost',
			database: 'rinhadb',
			password: 'postgres',
			port: 5432,
			max: 15
		});
	}

	async connect () {
		return this.connection.connect();
	}

	async query (query, params) {
		return this.connection.query(query, params);
	}

	async close () {
		await this.connection.end();
	}
}

module.exports = Pg;
