module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Checking extends Stage {
        entry() {
            console.log('Checking answer.');
        }

        onHost(event, user, data) {
            console.log('Checking got daters: '+data);

            if (event === 'right-answer') {
                let contestant = this.gameLoop.contestants[this.gameLoop.checkingContestant];
                console.log('contestant: '+contestant);

                contestant.score += this.gameLoop.currentGridSquare().value;
                this.gameLoop.lastPicker = contestant.id;
                this.gameLoop.emitAll('update-users', this.gameLoop.contestants);
                this.gameLoop.setStage('show_answer');
                return;
            }

            if (event === 'wrong-answer') {
                let unbuzzed = Object.values(this.gameLoop.contestants).filter(function(user) {
                    return !user.buzzed
                });

                console.log('Unbuzzed: '+unbuzzed);

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