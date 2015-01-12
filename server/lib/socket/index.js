var idmap = [];

module.exports = function(io) {
    console.log('socket lib loaded');
    io.sockets.on('connection', function(socket) {
        socket.on('join_radio', function(data) {

        });

        socket.on('disconnect', function(data) {
            console.log('Socket: ' + socket.id + ' disconnected from server.');
            //socket.emit('')
        });
    });
}