module.exports = function() {
    return function(req, res, next) {
        req.gameLoop.save(() => {
            console.log('saving game loop.');
            next();
        });
    }
};