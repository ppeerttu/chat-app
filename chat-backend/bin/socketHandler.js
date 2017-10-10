

module.exports = (io) => {
  io.on('connection', socket => {

    console.log('socket connected with id: ' + socket.id);

    /**
     * { roomId: <int>, userId: <int>, message: <string> }
     */
    socket.on('message', data => {
      console.log('roomId: ' + data.roomId +', userId: ' + data.userId + ', message: ' + data.message);
      socket.to(data.roomId).emit('message', { roomId: data.roomId, userId: data.userId, message: data.message });
    });

    /**
     * { roomId: <int>, user: <User> }
     */
    socket.on('join', data => {
      console.log('Received join request from client: ');
      console.log(data);
      socket.join(data.roomId, () => {
        socket.to(data.roomId).emit('userJoin', {
          socketId: socket.id,
          roomId: data.roomId,
          user: data.user
        });
      });
    });

    socket.on('userInfo', data => {
      socket.to(data.socketId).emit('userInfo', {
        roomId: data.roomId,
        user: data.user
      });
    });

    /**
     * { roomId: <int>, user: <User> }
     */
    socket.on('leave', data => {
      console.log('Received leave request from client: ');
      console.log(data);
      socket.leave(data.roomId, () => {
        let rooms = Object.keys(socket.rooms);
        console.log(rooms);
      });

    });

    socket.on('disconnect', data => {
      console.log('Socket connection closed! ' + data);
    });
  });
};
