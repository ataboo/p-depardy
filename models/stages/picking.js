module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Picking extends Stage {
        entry() {
            console.log('picking entry.');

            this.picker = this.gameLoop.nextPicker();
            this.pickSpot = [0, 0];
            this.size = [ Object.keys(this.gameLoop.categories).length, this.gameLoop.categories[Object.keys(this.gameLoop.categories)[0]].length];

            this.gameLoop.emitAll('picking', this.picker);
        }

        onContestant(event, user, data) {
            if (user.id !== this.picker.id) {
                return;
            }

            switch(event) {
                case 'move-pick':
                    this._movePick(data);
                    break;
                case 'lock-pick':
                    this._lockPick();
                    break;
                default:
                    console.log('picking ignoring: '+event);
            }
        }

        _movePick(data) {
            switch (data) {
                case 'up':
                    this.pickSpot[1]++;
                    break;
                case 'right':
                    this.pickSpot[0]++;
                    break;
                case 'down':
                    this.pickSpot[1]--;
                    break;
                case 'left':
                    this.pickSpot[0]--;
                    break;
                default:
                    console.log('Move pick invalid daters: '+data);
            }

            this.pickSpot[0] = Math.min(Math.max(this.pickSpot[0], 0), this.size[0]-1);
            this.pickSpot[1] = Math.min(Math.max(this.pickSpot[1], 0), this.size[1]-1);

            this.gameLoop.emitAll('highlight-square', this.pickSpot);
            this.gameLoop.emitAll('outgoing', this.pickSpot);
        }

        _lockPick() {
            if (this.gameLoop.setQuestion(this.pickSpot)) {
                this.gameLoop.setStage('reading');
            }
        }
    }

    return new Picking(gameLoop);
};