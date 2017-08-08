var redis = require('redis');
var Redis = redis.RedisClient;
var client = redis.createClient();

client.set = function (key, value) {
	return new Promise(function (done, fail) {
		Redis.prototype.set.call(client, key, value, function (err, data) {
			if (err) fail(err);
			else done(data);
		});
	});
};

client.get = function (key) {
	return new Promise(function (done, fail) {
		Redis.prototype.get.call(client, key, function (err, data) {
			if (err) fail(err);
			else done(data);
		});
	});
};

client.del = client.remove = function (key) {
	return new Promise(function (done, fail) {
		Redis.prototype.del.call(client, key, function (err, data) {
			if (err) fail(err);
			else done(data);
		});
	});
};

client.setJSON = function (key, value) {
	return client.set(key, JSON.stringify(value));
};

client.getJSON = function (key) {
	return client.get(key).then(function (value) {
		if (!value) return value;

		return JSON.parse(value);
	});
};

module.exports = client;