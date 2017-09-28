module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Checking extends Stage {
        entry() {
            console.log('Checking answer.');
        }

        onHost(event, user, data) {
            if (event === 'right-answer') {
                this.gameLoop.awardScoreToCurrent();
                this.wrapUp();
                return;
            }

            if (event === 'wrong-answer') {
                let unbuzzed = gameLoop.gameData.playerType('contestant').filter(function(user) {
                    return !user.buzzed
                });

                if (unbuzzed.length) {
                    this.gameLoop.emit('start-buzzing', unbuzzed, '');
                    this.gameLoop.setStage('buzzing');
                } else {
                    this.wrapUp();
                }
            }
        }

        wrapUp() {
            this.gameLoop.syncUsers();
            this.gameLoop.setStage('show_answer');
        }
    }

    return new Checking(gameLoop);
};
