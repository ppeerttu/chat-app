

module.exports = (io) => {
  io.on('connection', socket => {

    console.log('socket connected with id: ' + socket.id);

    /**
     * { roomId: <int>, userId: <int>, message: <string>, time: <int> }
     */
    socket.on('message', data => {
      console.log('roomId: ' + data.roomId +', userId: ' + data.userId + ', message: ' + data.message);
      socket.to(data.roomId).emit('message', data);
      console.log(Object.keys(socket.rooms));
    });

    /**
     * { roomId: <int>, user: <User> }
     */
    socket.on('join', data => {
      console.log('Received join request from client: ' + data.user.userName);
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
      socket.to(data.roomId).emit('userLeave', data);
      socket.leave(data.roomId);
    });

    socket.on('disconnecting', data => {
      const rooms = Object.keys(socket.rooms);
      const id = socket.id;
      console.log('Socket connection closing: ' + data);
      console.log(rooms);
      rooms.forEach(room => {
        console.log(room);
        if (room !== id) {
          //socket.to(room).emit('userLeave', { roomId: room, user: null });
        }
      });
    });
  });
};
