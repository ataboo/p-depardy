module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class PreRound extends Stage {
        entry() {
            console.log('pre round entry');
        }

        sync() {
            this.gameLoop.emitAll('pre-start', {ready: this.gameLoop.ready()});
        }

        onHost(event, data) {
            if (event === 'start-pick') {
                this.gameLoop.setStage('picking');
            }
        }
    }

    return new PreRound(gameLoop);
};
