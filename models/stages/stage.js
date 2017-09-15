module.exports = function() {
    class Stage {
        constructor(gameLoop) {
            this.gameLoop = gameLoop;
        }

        entry() {
            //
        }

        sync() {
            //
        }

        onContestant(event, user, data) {
            //
        }

        onHost(event, user, data) {
            //
        }
    }

    return Stage;
};