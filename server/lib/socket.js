//A Map from socketID to its nickname and radioID
var socketMap = {};
//A Map from radioID to its status, socketID and guests
var radioMap = {};
module.exports = function(io) {
	io.on('connection', function(socket) {
		socket.on('announce_join', function(data) {
			socketMap[socket.id] = {
				'nickname': data.nickname,
				'radioid': data.radioid
			};
			console.log(data.nickname + ' joined ' + data.radioid + '.');
			io.sockets.in('radio_' + data.radioid).emit('update_chat', {
				message: {
					sender: '[SERVER]',
					body: data.nickname + ' has joined the chat room.'
				}
			});
		});

		socket.on('join_radio', function(data) {
			socket.join('radio_' + data.radioid);
			console.log(socket.id + ' connected to ' + data.radioid);
			//The broadcaster connect to the radio
			if (data.isBroadcaster) {
				// if the broadcaster is reconnected
				if (radioMap[data.radioid]) {
					radioMap[data.radioid]['isConnected'] = true;
					radioMap[data.radioid]['socketid'] = socket.id;
					io.sockets.in('radio_' + data.radioid).emit('update_broadcaster_status', {
						'isBroadcasterConnected': true
					});
				} else {
					radioMap[data.radioid] = {
						'isConnected': true,
						'socketid': socket.id,
						'guests': {}
					};
				}
				// broadcaster came from another channel --> notify that channel
				if (socketMap[socket.id]) {
					var prevRadio = socketMap[socket.id]['radioid'];
					socket.leave['radio_' + prevRadio];
					delete radioMap[prevRadio]['guests'][socket.id];

					//update viewer count for the previous channel
					var viewerCount = Object.keys(radioMap[prevRadio]['guests']).length;
					if (socketMap[socket.id]['nickname']) {
						io.sockets.in('radio_' + prevRadio).emit('update_chat', {
							message: {
								sender: '[SERVER]',
								body: socketMap[socket.id]['nickname'] + ' has left.'
							}
						});
					}
					io.sockets.in('radio_' + prevRadio).emit('update_viewer_count', {
						count: viewerCount
					});
					if (Object.keys(radioMap[prevRadio]['guests']).length === 0 &&
						!radioMap[prevRadio]['isConnected']) {
						delete radioMap[prevRadio];
					}
				}
				socketMap[socket.id] = {
					'nickname': data.username,
					'radioid': data.radioid
				};
			}
			// The guest connect to the radio
			else {
				// If there isn't a broadcaster, create a placeholder
				if (!radioMap[data.radioid]) {
					radioMap[data.radioid] = {
						'isConnected': false,
						'socketid': null,
						'guests': {}
					};
				}
				// guest came from another channel --> notify that channel
				if (socketMap[socket.id]) {
					var prevRadio = socketMap[socket.id]['radioid'];
					socket.leave('radio_' + prevRadio);
					delete radioMap[prevRadio]['guests'][socket.id];

					// if the guest was the broadcaster of the previous channel
					if (data.username === prevRadio) {
						io.sockets.in('radio_' + prevRadio).emit('update_broadcaster_status', {
							'isBroadcasterConnected': false
						});
					}
					//update viewer count for the previous channel
					var viewerCount = Object.keys(radioMap[prevRadio]['guests']).length;
					if (socketMap[socket.id]['nickname']) {
						io.sockets.in('radio_' + prevRadio).emit('update_chat', {
							message: {
								sender: '[SERVER]',
								body: socketMap[socket.id]['nickname'] + ' has left.'
							}
						});
					}
					io.sockets.in('radio_' + prevRadio).emit('update_viewer_count', {
						count: viewerCount
					});
					if (Object.keys(radioMap[prevRadio]['guests']).length === 0 &&
						!radioMap[prevRadio]['isConnected']) {
						delete radioMap[prevRadio];
					}
					//join current channel
					socketMap[socket.id]['radioid'] = data.radioid;
					if (socketMap[socket.id]['nickname']) {
						console.log(socketMap[socket.id]['nickname'] + ' joined ' + data.radioid + '.');
						io.sockets.in('radio_' + data.radioid).emit('update_chat', {
							message: {
								sender: '[SERVER]',
								body: socketMap[socket.id]['nickname'] + ' has joined the chat room.'
							}
						});
					}
				} else {
					// guest is a new connection
					socketMap[socket.id] = {
						'nickname': data.username,
						'radioid': data.radioid,
					};
				}
				if (!radioMap[data.radioid]['isConnected']) {
					io.sockets.in('radio_' + data.radioid).emit('update_broadcaster_status', {
						'isBroadcasterConnected': false
					});
				}
				radioMap[data.radioid]['guests'][socket.id] = true;

				// if applicable update socketid and status of the guest in radioMap
				if (data.username && radioMap[data.username]) {
					radioMap[data.username]['socketid'] = socket.id;
					radioMap[data.username]['isConnected'] = false;
				}
			}
			// update viewer count of the new channel
			var viewerCount = Object.keys(radioMap[data.radioid]['guests']).length;
			io.sockets.in('radio_' + data.radioid).emit('update_viewer_count', {
				count: viewerCount
			});
		});

		socket.on('broadcast_player_status', function(data) {
			io.sockets.in('radio_' + data.radioId).emit('update_player_status', data);
		});

		socket.on('send_message', function(data) {
			io.sockets.in('radio_' + data.radioid).emit('update_chat', {
				message: {
					sender: data.nickname,
					body: data.message
				}
			});
		});

		socket.on('disconnect', function(data) {
			console.log('Socket: ' + socket.id + ' disconnected from server.');
			console.log("Data: " + JSON.stringify(data));
			if (!socketMap[socket.id]) {
				return;
			}
			var radioid = socketMap[socket.id]['radioid'];
			if (radioMap[radioid]['socketid'] === socket.id) {
				// The broadcaster is disconnected
				io.sockets.in('radio_' + radioid).emit('update_broadcaster_status', {
					'isBroadcasterConnected': false
				});
				radioMap[radioid]['isConnected'] = false;
				delete socketMap[socket.id];
			} else {
				//The guest is disconnected
				if (socket.id in radioMap[radioid]['guests']) {
					delete radioMap[radioid]['guests'][socket.id];
					if (socketMap[socket.id]['nickname']) {
						io.sockets.in('radio_' + radioid).emit('update_chat', {
							message: {
								sender: '[SERVER]',
								body: socketMap[socket.id]['nickname'] + ' has left.'
							}
						});
					}
					delete socketMap[socket.id];
					var viewerCount = Object.keys(radioMap[radioid]['guests']).length;
					io.sockets.in('radio_' + radioid).emit('update_viewer_count', {
						count: viewerCount
					});
					if (Object.keys(radioMap[radioid]['guests']).length === 0 &&
						!radioMap[radioid]['isConnected']) {
						delete radioMap[radioid];
					}
				}
			}
		});
	});
};