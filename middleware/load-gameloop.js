module.exports = function() {
  let global = require('./global');
    let GameLoop = require('../models/gameloop')();

    function _getLoop(done) {
        if (!global.gameLoop) {
            global.gameLoop = new GameLoop();
            global.gameLoop.init(() => {done(global.gameLoop);});
        } else {
            done(global.gameLoop);
        }
    }

    function middleware(req, res, next) {
        if(!req.gameLoop) {
            _getLoop((loop) => {
                req.gameLoop = loop;
                next();
            })
        } else {
            next();
        }
    }

    return {
        Middleware: middleware,
        getLoop: _getLoop
    };
};
