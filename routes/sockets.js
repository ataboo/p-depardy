module.exports = function(socket) {
  const url = require('url');

  // let GameLoopLoad = require('../middleware/load-gameloop')(io);
  //   let contestant = require('./socket/contestant');
  //   let host = require('./socket/host');
  //   let spectator = require('./socket/spectator');

  socket.on('connection', function connection(ws, req) {
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', function (message) {
      console.log(require('util').inspect(JSON.parse(message), { depth: null }));;
    });
  });
    // io.on('connection', function (socket) {
    //     if (socket.request.user && socket.request.user.logged_in) {
    //         GameLoopLoad.getLoop((gameLoop) => {
    //             _delegateSocketRoute(socket, gameLoop);
    //         });
    //     }
    // });
    //
    // function _delegateSocketRoute(socket, gameLoop) {
    //     let userType = gameLoop.getUserType(socket.request.user.id);
    //     console.log('userType: '+userType);
    //     switch(userType) {
    //         case 'host':
    //             host(socket, gameLoop);
    //             break;
    //         case 'contestant':
    //             contestant(socket, gameLoop);
    //             break;
    //         default:
    //             spectator(socket, gameLoop);
    //     }
    // }
};
