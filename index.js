var app = require('app');
var config = app.config;

app.engine('ejs', require('ejs-mate'));
app.set('views', 'app/views');
app.set('view engine', 'ejs');
app.disable('x-powered-by');

app.use(require('dont-sniff-mimetype')());
app.use(require('frameguard')());
app.use(require('x-xss-protection')());
app.use(require('body-parser').json());
app.use(require('cookie-parser')());
app.use(require('express').static(app.PUBLIC_DIR));

var session = require('express-session'),
	RedisSession = require('connect-redis')(session);

var db = require('app/db');
require('app/db/models/session');

app.use(session({
	name: 'session.sid',
	secret: app.IS_DEV ? '2156215kjlqsado@#$%' : require('uuid').v4(),
	resave: false,
	saveUninitialized: false,
	store: new RedisSession()
}));

app.use(require('app/lib/passport').initialize());
app.use(require('app/lib/passport').session());
app.use(require('app/views/helpers'));

require('app/controllers');

if (config.ssl && config.portSSL) {
	var fs = require('fs');

	require('https')
		.createServer(config.ssl, app)
		.listen(config.portSSL)
	;

	require('http')
		.createServer(function (req, res) {
			if (!req.headers['host']) {
				res.writeHead(404);
				res.end();
				return;
			}

			res.writeHead(301, {"Location": "https://" + req.headers['host'].replace(/:\d+$/, '') + req.url});
			res.end();
		})
		.listen(config.portWEB)
	;
}
else {
	app.listen(config.portWEB);
}

if (app.IS_DEV) {
	var socket = new (require('ws').Server)({port: 8100});
	socket.on('connection', function (item) {
		item.on('message', function (data) {
			socket.clients.forEach(function (client) {
				if (client !== item && client.readyState === 1) {
					client.send(data);
				}
			});
		});
	});
}