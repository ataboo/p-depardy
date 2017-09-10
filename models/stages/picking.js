module.exports = function(gameLoop) {
    let Stage = require('./stage')();

    class Picking extends Stage {
        entry() {
            console.log('picking entry.');

            this.picker = this.gameLoop.nextPicker();

            console.log('picker is: '+this.picker.id);

            this.pickSpot = [0, 0];
            this.size = [ this.gameLoop.gridSquares.length, this.gameLoop.gridSquares[0].length];

            this.gameLoop.emitAll('picking', this.picker);
        }

        onContestant(event, user, data) {
            console.log('heard from : '+user.id);
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