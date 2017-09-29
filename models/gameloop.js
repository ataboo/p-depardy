module.exports = function (redisClient, socketIo) {
    const GameData = require('./gamedata')();
    const CONTESTANT_CAP = 3;
    let Player = require('./player');

    class GameLoop {
        constructor() {
            this.Stages = require('./stages/stages')(this);
            this.gameData = new GameData(this);
        }

        init(done) {
            this.gameData.init(() => {
                this.setStage('pre_round');
                done();
            })
        }

        currentStage() {
            return this.Stages[this.gameData.stageName];
        }

        hostCheckIn(user, done) {
            this.gameData.addHost(user, done);
        }

        contestantCheckIn(user, done) {
            this.gameData.addContestant(user, done);
        }

        spectatorCheckIn(user, done) {
            let spectator = this.gameData.addSpectator(user, done);
        }

        awardScoreToCurrent() {
            this.gameData.awardCurrentQuestion();
        }

        checkOut(user, done) {
            done(this.gameData.removePlayer(user));
        }

        emit(event, players, data) {
            for (let userId in players) {
                if (players.hasOwnProperty(userId)) {
                    players[userId].emit(event, data);
                }
            }
        };

        emitAll(event, data) {
            this.emit(event, this.gameData.players, data);
        };

        emitHost(event, data) {
            this.emit(event, this.gameData.playerType(Player.HOST), data);
        };

        emitContestants(event, data) {
            this.emit(event, this.gameData.playerType(Player.CONTESTANT), data);
        };

        emitSpectators(event, data) {
            this.emit(event, this.gameData.playerType(Player.SPECTATOR), data);
        }

        emitCheckingContestant(event, data) {
            this.emit(event, this.gameData.players[this.gameData.checkingContestant], data);
        }

        setStage(stageName) {
            this.gameData.stageName = stageName;
            this.currentStage().entry();
            this.currentStage().sync();
        };

        onContestant(event, user, data) {
            this.currentStage().onContestant(event, user, data);
        };

        unbuzzedPlayers() {
            return this.gameData.playerType('contestant').filter(function(user) {
                return !user.buzzed
            });
        }

        onHost(event, user, data) {
            this.currentStage().onHost(event, user, data);
        };

        nextPicker() {
            return this.gameData.nextPicker();
        };

        setQuestion(gridPos) {
            if (gridPos) {
                console.dir(gridPos);

                let gridSquare = this.gameData.gridSquares[gridPos[0]][gridPos[1]];
                this.gameData.activeQuestion = gridPos;
                return !gridSquare.blank;
            }

            return false;
        };

        resetBuzzing() {
            this.gameData.eachPlayer(function(player) {
                player.buzzed = false;
            });
        }

        syncUsers() {
            console.dir(this.gameData.playerSummaries);
            this.emitSpectators('update-users', {players: this.gameData.playerSummaries});
        }
    }

    return GameLoop;
};
