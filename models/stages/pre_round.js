module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class PreRound extends Stage {
        entry() {
            console.log('pre round entry');

            this.gameLoop.emitAll('pre-start', null);
        }

        onHost(event, data) {
            if (event === 'start-pick') {
                if (!this.gameLoop.nextPicker()) {
                    console.log('No pickers!!!');
                    return;
                }

                this.gameLoop.setStage('picking');
            }
        }
    }

    return new PreRound(gameLoop);
};