module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Checking extends Stage {
        entry() {
            console.log('Checking answer.');
        }

        onHost(event, user, data) {
            if (event === 'right-answer') {
                let contestant = this.gameLoop.gameData.findContestants(this.gameLoop.gameData.checkingContestant);
                console.log('contestant: '+contestant);

                contestant.score += this.gameLoop.gameData.currentGridSquare().value;
                this.gameLoop.gameData.lastPicker = contestant.id;
                this.gameLoop.emitAll('update-users', this.gameLoop.contestants);
                this.gameLoop.setStage('show_answer');
                return;
            }

            if (event === 'wrong-answer') {
                let unbuzzed = Object.values(this.gameLoop.gameData.contestants).filter(function(user) {
                    return !user.buzzed
                });

                if (unbuzzed.length) {
                    this.gameLoop.emit('start-buzzing', unbuzzed, '');
                    this.gameLoop.setStage('buzzing');
                } else {
                    this.gameLoop.setStage('show_answer');
                }
            }
        }
    }

    return new Checking(gameLoop);
};