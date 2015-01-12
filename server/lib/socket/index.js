var idmap = [];

module.exports = function(io) {
    io.sockets.on('connection', function(socket) {
        console.log('\nTEST\n');

        socket.on('join_radio', function(data) {
            socket.join('radio_' + data.radioid);
            console.log(data.nickname + ' joined ' + data.radioid + '.');

            io.sockets.in('radio_' + data.radioid).emit('updatechat', {
                message: {
                    sender: '[SERVER]',
                    body: data.nickname + ' is now listening.'
                }
            });
        });

        socket.on('sendmessage', function(data) {
            io.sockets.in('radio_' + data.radioid).emit('updatechat', {
                message: {
                    sender: data.nickname,
                    body: data.message
                }
            });
        });

        socket.on('disconnect', function(data) {
            console.log('Socket: ' + socket.id + ' disconnected from server.');

            io.sockets.in('radio_' + data.radioid).emit('updatechat', {
                message: {
                    sender: '[SERVER]',
                    body: data.nickname + ' has left.'
                }
            });
        });
    });
}