var fs = require('fs');

module.exports = {
	portWEB: 8002,
	portSSL: 8003,
	ssl: {
		key:  fs.readFileSync(__dirname + '/../server.key', 'utf8'),
		cert: fs.readFileSync(__dirname + '/../server.crt', 'utf8'),
		ca:   fs.readFileSync(__dirname + '/../server.csr', 'utf8')
	},
	db: {
		username: "postgres",
		password: "postsql",
		database: "perquisition",
		host: "localhost",
		port: "5432",
		dialect: "postgres"
	}
};