module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Checking extends Stage {
        entry() {
            console.log('Checking answer.');
        }

        onHost(event, user, data) {
            if (event === 'right-answer') {
                let contestant = this.gameLoop.contestants[user.id];
                contestant.score += this.gameLoop.activeQuestion.value;
                this.gameLoop.lastPicker = contestant.id;
                this.gameLoop.emitAll('update-users', this.gameLoop.contestants);
                this.gameLoop.setStage('show_answer');
                return;
            }

            if (event === 'wrong-answer') {
                this.gameLoop.emitAll('wrong-answer', user.id);

                let unbuzzed = this.gameLoop.contestants.filter(function(user) {
                    return !user.buzzed
                });

                if (unbuzzed.length) {
                    this.gameLoop.emit('start-buzzing', unbuzzed, '');
                    this.gameLoop.setStage('buzzing');
                } else {
                    this.setStage('show_answer');
                }
            }
        }
    }

    return new Checking(gameLoop);
};