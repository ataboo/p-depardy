module.exports = function(socket) {

  let host = require('./socket/host-socket');
  let contestant = require('./socket/contestant-socket');
  let spectator = require('./socket/spectator-socket');

  socket.on('connection', function connection(ws, req) {
    switch (req.url.replace('/', '')) {
        case 'host':
          host(ws, req);
          break;
        case 'spectator':
          spectator(ws, req);
          break;
        case 'contestant':
          contestant(ws, req);
          break;
        default:
          console.log('WS in bad route.');
    }
  });
};
