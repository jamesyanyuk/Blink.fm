//A Map from socketID to its nickname and radioID
var socketMap = {};

//A Map from radioID to its status, socketID, guests and recommendationList
var radioMap = {};

module.exports = function(io) {
	io.sockets.on('connection', function(socket) {
		socket.on('announce_join', function(data) {
			socketMap[socket.id] = {
				'nickname': data.nickname,
				'radioid': data.radioid
			};
			console.log(data.nickname + ' joined ' + data.radioid + '.');
			io.sockets.in('radio_' + data.radioid).emit('update_chat', {
				message: {
					sender: '[SERVER]',
					body: data.nickname + ' is now listening. There are currently ' + Object.keys(radioMap[data.radioid]['guests']).length + ' people listening to this radio'
				}
			});
		});

		socket.on('join_radio', function(data) {
			socket.join('radio_' + data.radioid);
			console.log(socket.id + ' connected to ' + data.radioid);
			if (data.isBroadcaster) { //The broadcaster connect to the radio	
				if (radioMap[data.radioid] && !radioMap[data.radioid]['isConnected']) { //The broadcaster is reconnected
					radioMap[data.radioid]['isConnected'] = true;
					radioMap[data.radioid]['socketid'] = socket.id;
					io.sockets.in('radio_' + data.radioid).emit('update_broadcaster_status', {
						'isBroadcasterConnected': true
					});
				} else {
					radioMap[data.radioid] = {
						'isConnected': true,
						'socketid': socket.id,
						'guests': {},
						'recommendationList': []
					};
				}
				socketMap[socket.id] = {
					'nickname': data.radioid,
					'radioid': data.radioid
				};
				io.sockets.in('radio_' + data.radioid).emit('update_recommendation_list', radioMap[data.radioid]['recommendationList']);
			} else { // The guest connect to the radio
				if (socketMap[socket.id]) { //The guest change channel
					//left current radio
					var radioid = socketMap[socket.id]['radioid'];
					socket.leave('radio_' + radioid);
					delete radioMap[radioid]['guests'][socket.id];
					if (socketMap[socket.id]['nickname']) {
						io.sockets.in('radio_' + radioid).emit('update_chat', {
							message: {
								sender: '[SERVER]',
								body: socketMap[socket.id]['nickname'] + ' has left. There are currently ' + Object.keys(radioMap[radioid]['guests']).length + ' people listening to this radio'
							}
						});
					}
					if (Object.keys(radioMap[radioid]['guests']).length === 0 && !radioMap[radioid]['isConnected']) {
						delete radioMap[radioid];
					}
				}
				/* This apply for both case and also has to happens before a guest join new channel
				so I left it outside of the condition. */
				if (!radioMap[data.radioid]) { // If there isn't a broadcaster, create a placeholder
					radioMap[data.radioid] = {
						'isConnected': false,
						'socketid': null,
						'guests': {},
						'recommendationList': []
					};
				}
				if (!radioMap[data.radioid]['isConnected']) {
					io.sockets.in('radio_' + data.radioid).emit('update_broadcaster_status', {
						'isBroadcasterConnected': false
					});
				}
				radioMap[data.radioid]['guests'][socket.id] = true;
				io.sockets.in('radio_' + data.radioid).emit('update_recommendation_list', radioMap[data.radioid]['recommendationList']);
				if (socketMap[socket.id]) { //continue to process when guest change channel
					// join new radio
					socketMap[socket.id]['radioid'] = data.radioid;
					if (socketMap[socket.id]['nickname']) {
						console.log(socketMap[socket.id]['nickname'] + ' joined ' + data.radioid + '.');
						io.sockets.in('radio_' + data.radioid).emit('update_chat', {
							message: {
								sender: '[SERVER]',
								body: socketMap[socket.id]['nickname'] + ' is now listening. There are currently ' + Object.keys(radioMap[data.radioid]['guests']).length + ' people listening to this radio'
							}
						});
					}
				} else {
					// At this point, the socket is a new guest connection
					socketMap[socket.id] = {
						'radioid': data.radioid
					};
				}
			}
			console.log(radioMap);
			console.log(socketMap);
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

		socket.on('add_recommendation_video', function (video){
			var radioid = socketMap[socket.id]['radioid'];
			var recList = radioMap[radioid]['recommendationList'];
			for (var i=0; i<recList.length; i++){
				if (recList[i]['id'] === video.id){
					recList[i]['likes'][socket.id] = true;
					recList[i]['likes_cnt'] = Object.keys(recList[i]['likes']).length;
					io.sockets.in('radio_' + radioid).emit('update_recommendation_list', recList);
					return;
				}
			}
			video['likes'] = {};
			video['likes'][socket.id] = true;
			video['likes_cnt'] = 1;
			recList.push(video);
			io.sockets.in('radio_' + radioid).emit('update_recommendation_list', recList);
		});

		socket.on('like_recommendation_video', function (video){
			var radioid = socketMap[socket.id]['radioid'];
			var recList = radioMap[radioid]['recommendationList'];
			for (var i=0; i<recList.length; i++){
				if (recList[i]['id'] === video.id){
					recList[i]['likes'][socket.id] = true;
					recList[i]['likes_cnt'] = Object.keys(recList[i]['likes']).length;
					break;
				}
			}
			recList.sort(function (a,b){
				return -(a['likes_cnt']-b['likes_cnt']);
			})
			io.sockets.in('radio_' + radioid).emit('update_recommendation_list', recList);
		});

		socket.on('remove_recommendation_video', function (video){
			var radioid = socketMap[socket.id]['radioid'];
			var recList = radioMap[radioid]['recommendationList'];
			var pos;
			for (var i=0; i<recList.length; i++){
				if (recList[i]['id'] === video.id){
					pos = i;
					break;
				}
			}
			recList.splice(pos, 1);
			io.sockets.in('radio_' + radioid).emit('update_recommendation_list', recList);
		});

		socket.on('disconnect', function(data) {
			console.log('Socket: ' + socket.id + ' disconnected from server.');
			console.log("Data: " + JSON.stringify(data));
			if (!socketMap[socket.id])
				return;
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
								body: socketMap[socket.id]['nickname'] + ' has left. There are currently ' + Object.keys(radioMap[radioid]['guests']).length + ' people listening to this radio'
							}
						});
					}
					delete socketMap[socket.id];
					if (Object.keys(radioMap[radioid]['guests']).length === 0 && !radioMap[radioid]['isConnected']) {
						delete radioMap[radioid];
					}
				}
			}
		});
	});
};