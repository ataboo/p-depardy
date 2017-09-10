module.exports = function(redisClient, socketIo) {
    let GameLoop = require('../models/gameloop')(redisClient, socketIo);
    let gameLoop;

    function _getLoop(done) {
        if (!gameLoop) {
            GameLoop.load((err, loop) => {
                gameLoop = loop;
                done(gameLoop);
            })
        } else {
            done(gameLoop);
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