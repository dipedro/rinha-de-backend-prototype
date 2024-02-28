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
			max: 15, // maximum number of clients the pool should contain
			//idleTimeoutMillis: 1, // how long a client is allowed to remain idle before being closed
  			//connectionTimeoutMillis: 2000, // how long to wait in milliseconds while trying to connect to the database before timing out
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
