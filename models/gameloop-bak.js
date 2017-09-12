module.exports = function(redisClient, socketIo) {
    let GridSquare = require('./gridsquare')();
    let Stages;
    let util = require('util');

    const CATEGORIES = [
        'First One',
        'Second One'
    ];

    const VALUES = [
        100,
        200,
        300,
        400,
        500
    ];

    const CONTESTANT_CAP = 3;

    const GAMELOOP_NAMESPACE = 'p-depardy_gameloops';

    function GameLoop(serialized) {
        Stages = require('./stages/stages')(this);
        if (serialized) {
            this.stageName = serialized.stageName;
            this.gridSquares = serialized.gridSquares;
            this.contestants = serialized.contestants;
            this.spectators = serialized.spectators;
            this.host = serialized.host;
            this.activeQuestion = serialized.activeQuestion;
            this.checkingContestant = serialized.checkingContestant;
            this.lastPicker = serialized.lastPicker;
            for(let x of Object.keys(serialized.gridSquares)) {

                for(let y of Object.keys(serialized.gridSquares[x])) {
                    this.gridSquares[x][y] = new GridSquare(serialized.gridSquares[x][y]);
                }
            }

            this.currentStage().entry();
        }
    }

    GameLoop.load = function (done) {
        redisClient.hget(GAMELOOP_NAMESPACE, 0, function (err, res) {
            if (err || !res) {
                console.log('Starting new Game...');
                let gameLoop = new GameLoop();
                gameLoop.init(() => {
                    gameLoop.currentStage().entry();
                    done(null, gameLoop);
                })
            } else {
                console.log('Loading existing game...');
                let gameLoop = new GameLoop(JSON.parse(res));
                done(null, gameLoop);
            }
        });
    };

    GameLoop.clear = function (done) {
        redisClient.hdel(GAMELOOP_NAMESPACE, 0, function (err, res) {
            if (err) {
                console.log('Failed to delete gameloop.');
                console.log(err);
            } else {
                console.log('Cleared gameloop.');
            }

            done(null, null);
        });
    };

    GameLoop.prototype.save = function (done) {
        let gameLoop = this;
        redisClient.hset(GAMELOOP_NAMESPACE, 0, this.serialize(), function (err, res) {
            if (err) {
                console.log('Failed to save gameloop.');
                console.log(res);
                done(err, null);
            } else {
                done(null, gameLoop);
            }
        });
    };

    GameLoop.prototype.getUserType = function(userId) {
        if (this.host && this.host.id === userId) {
            return 'host';
        }

        if (this.contestants.hasOwnProperty(userId)) {
            return 'contestant';
        }

        return 'spectator';
    };

    GameLoop.prototype.serialize = function () {
        let gameLoop = this;

        return JSON.stringify({
            stageName: gameLoop.stageName,
            gridSquares: gameLoop.gridSquares,
            contestants: gameLoop.contestants,
            spectators: gameLoop.spectators,
            host: gameLoop.host,
            activeQuestion: gameLoop.activeQuestion,
            checkingContestant: gameLoop.checkingContestant,
            lastPicker: gameLoop.lastPicker
        });
    };

    GameLoop.prototype.init = function init(done) {
        this.gridSquares = [];
        this.contestants = {};
        this.spectators = {};

        //load config

        //init grid
        for (let x = 0; x < CATEGORIES.length; x++) {
            let values = [];
            for (let y = 0; y < VALUES.length; y++) {
                let attrs = {
                    question: "Question for " + CATEGORIES[x] + " " + VALUES[y],
                    answer: "Answer for " + CATEGORIES[x] + " " + VALUES[y],
                    value: VALUES[y],
                    category: CATEGORIES[x]
                };
                values[y] = new GridSquare(attrs);
            }

            this.gridSquares[x] = values;
        }

        this.setStage('pre_round');

        done(false);
    };

    GameLoop.prototype.hostCheckIn = function (user, done) {
        if (this.host) {
            if (this.host.id === user.id) {

                if (user.socketId) {
                    this.host.socketId = user.socketId;
                }
                done(true, null);
            } else {
                done(false, 'Someone else is hosting this game.')
            }
        } else {
            this.host = {
                id: user.id
            };

            this.save(() => {
                done(true);
            });
        }
    };

    GameLoop.prototype.contestantCheckIn = function (user, done) {
        if (!this.gridSquares) {
            done(false, 'Game not Started yet.');
            return;
        }

        if (this.contestants.hasOwnProperty(user.id)) {
            if (user.socketId) {
                this.contestants[user.id].socketId = user.socketId;
            }

            done(true);
            return;
        }

        this._addNewContestant(user, done);
    };

    GameLoop.prototype.spectatorCheckIn = function (user, done) {
        if (!this.gridSquares) {
            done(false, 'Game not Hosted Yet.');
            return;
        }

        let spectator = {
            id: user.id,
        };

        if (user.socketId) {
            spectator.socketId = user.socketId;
        }

        this.spectators[user.id] = spectator;

        this._addNewContestant(user, done);
    };

    GameLoop.prototype.checkOut = function (user, done) {
        if (this.host.id === user.id) {
            this.host = null;
        } else {
            if(this.contestants.hasOwnProperty(user.id)) {
                delete this.contestants[user.id];
            }
        }

        this.save(() => {
            done(true);
        })
    };

    GameLoop.prototype._addNewContestant = function (user, done) {
        if (!this._canAddContestant()) {
            done(false, 'Cannot add any more contestants.');
            return;
        }

        this.contestants[user.id] = {
            id: user.id,
            score: 0
        };

        this.save(() => {
            done(true);
        });
    };

    GameLoop.prototype._canAddContestant = function () {
        return Object.keys(this.contestants).length < CONTESTANT_CAP;
    };

    GameLoop.prototype.emit = function(event, users, data) {
        for(let i=0; i<Object.values(users).length; i++) {
            let user = Object.values(users)[i];
            socketIo.to(user.socketId).emit(event, data);
        }
    };

    GameLoop.prototype.emitAll = function(event, data) {
        let users = Object.assign({}, this.contestants);
        users = Object.assign(users, this.spectators);

        if (this.host) {
            users[this.host.id] = this.host;
        }

        this.emit(event, users, data);
    };

    GameLoop.prototype.emitHost = function(event, data) {
        this.emit(event, { user: this.host }, data);
    };

    GameLoop.prototype.emitContestants = function(event, data) {
        this.emit(event, this.contestants, data);
    };

    GameLoop.prototype.setStage = function(stageName) {
        this.stageName = stageName;

        console.log('Set Stage to: '+stageName);

        this.currentStage().entry();

        this.save(() => {});
    };

    GameLoop.prototype.currentStage = function() {
        return Stages[this.stageName];
    };

    GameLoop.prototype.onContestant = function(event, user, data) {
        let stage = this.currentStage();

        if (stage) {
            stage.onContestant(event, user, data);
        }
    };

    GameLoop.prototype.onHost = function(event, user, data) {
        let stage = this.currentStage();

        if (stage) {
            stage.onHost(event, user, data);
        }
    };

    GameLoop.prototype.nextPicker = function() {
        if(this.lastPicker && this.contestants[this.lastPicker]) {
            return this.contestants[this.lastPicker];
        }

        //TODO: make random.
        return Object.values(this.contestants)[0];
    };

    GameLoop.prototype.currentGridSquare = function() {
        if (!this.activeQuestion) {
            console.log('no current grid.');
            return undefined;
        }

        console.log('Active Question is: '+this.activeQuestion);
        console.log('Current Grid is: '+util.inspect(this.gridSquares[this.activeQuestion[0]][this.activeQuestion[1]]));

        return this.gridSquares[this.activeQuestion[0]][this.activeQuestion[1]];
    };

    GameLoop.prototype.setQuestion = function(gridPos) {
        this.activeQuestion = gridPos;

        if (gridPos) {
            let gridSquare = this.gridSquares[gridPos[0]][gridPos[1]];
            return !gridSquare.blank;
        }

        return false;
    };

    return GameLoop;
};