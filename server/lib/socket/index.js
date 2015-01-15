var idmap = [];
var guests = 0;

module.exports = function (io) {
	io.sockets.on('connection', function (socket) {
		socket.on('announce_join', function (data) {
			console.log(data.nickname + ' joined ' + data.radioid + '.');

			io.sockets.in('radio_' + data.radioid).emit('update_chat', {
				message: {
					sender: '[SERVER]',
					body: data.nickname + ' is now listening. There are currently ' + guests + ' people listening to this radio'
				}
			});
		});

		socket.on('join_radio', function (data) {
			socket.join('radio_' + data.radioid);
			guests+=1;
			console.log(socket.id + ' connected to ' + data.radioid);
		});

		socket.on('broadcast_player_status', function (data) {
			io.sockets.in('radio_' + data.radioId).emit('update_player_status', data);
		});

		socket.on('send_message', function (data) {
			io.sockets.in('radio_' + data.radioid).emit('update_chat', {
				message: {
					sender: data.nickname,
					body: data.message
				}
			});
		});

		socket.on('disconnect', function (data) {
			console.log('Socket: ' + socket.id + ' disconnected from server.');
			guests-=1;
			io.sockets.in('radio_' + data.radioid).emit('update_chat', {
				message: {
					sender: '[SERVER]',
					body: data.nickname + ' has left. There are currently ' + guests + ' people listening to this radio'
				}
			});
			/* Will need to create a socket.id to nickname map, etc */
			//io.sockets.in('radio_' + data.radioid).emit('update_chat', {
			//    message: {
			//        sender: '[SERVER]',
			//        body: data.nickname + ' has left.'
			//    }
			//});
		});
	});
}