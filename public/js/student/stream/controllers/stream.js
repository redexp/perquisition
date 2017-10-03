define('controllers/stream', [
	'spreadcast',
	'views/rooms-list'
], function (
	spreadcast,
	RoomsList
) {

	var rooms = new RoomsList({
		node: '#rooms-list'
	});

	rooms.model('list').add({
		id: 'room1',
		channels: []
	});
});