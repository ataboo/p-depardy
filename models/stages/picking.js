module.exports = function(gameLoop) {
    let Stage = require('./stage')();
    let pickTimeout = undefined;

    class Picking extends Stage {
        entry() {
            console.log('picking entry.');

            this.picker = this.gameLoop.nextPicker();

            if (!this.picker) {
                console.error('Failed to get next picker.');
                this.gameLoop.setStage('pre_round');
                return;
            }

            this.pickSpot = this.gameLoop.gameData.activeQuestion;

            if (typeof this.pickSpot === 'undefined') {
                this.pickSpot = [0, 0];
            }
            this.size = this.gameLoop.gameData.gridSize();
        }

        sync() {
            let pickerInvalid = !this.picker || this.picker.type != Stage.Player.CONTESTANT || this.picker.disabled;

            if (pickerInvalid) {
                if (!this.pickTimeout) {
                    this.pickTimeout = setTimeout(() => {
                        this.entry();
                    });
                }
            } else {
                if (this.pickTimeout) {
                    clearTimeout(this.pickTimeout);
                }
            }

            this.gameLoop.emitAll('picking', { player_id: this.picker.id });
            this.gameLoop.emitSpectators('highlight-square', this.pickSpot);
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
                case 'down':
                    this.pickSpot[1]++;
                    break;
                case 'right':
                    this.pickSpot[0]++;
                    break;
                case 'up':
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

            console.dir(this.pickSpot);

            this.gameLoop.emitSpectators('highlight-square', this.pickSpot);
        }

        _lockPick() {
            if (this.gameLoop.setQuestion(this.pickSpot)) {
                this.gameLoop.setStage('reading');
            }
        }
    }

    return new Picking(gameLoop);
};
