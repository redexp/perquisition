var Faye = require('faye');
var config = require('app/config');
var server = server = require('https').createServer(config.ssl);

var faye = new Faye.NodeAdapter({mount: '/faye'});

faye.attach(server);
server.listen(8001);

module.exports = faye;