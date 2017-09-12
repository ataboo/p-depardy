module.exports = function(redisClient, socketIo) {
const GameData = require('./gamedata')();

  class GameLoop {
    constructor() {
      this.Stages = require('./stages/stages')(this);
      this.gameData = new GameData();
      this.setStage('pre_round');
    }

    init(done) {
      this.gameData.load(() => {
        this.currentStage.entry();
        done();
      })
    }

    currentStage() {
      Stages[this.gameData.stageName];
    }

    hostCheckIn(user, done) {
      if (!this.gameData.host) {
        this.gameData.addHost(user);
      } else {
        if (this.gameData.host.id !== user.id) {
          return (false, 'There is another host already.');
        }
      }

      return done(true);
    }

    contestantCheckIn(user, done) {
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
    }

    spectatorCheckIn(user, done) {
      if (!this.gridSquares) {
        done(false, 'Game not Hosted Yet.');
        return;
      }

      let spectator = {
        id: user.id
      };

      if (user.socketId) {
        spectator.socketId = user.socketId;
      }

      this.spectators[user.id] = spectator;

      this._addNewContestant(user, done);
    }

    checkOut(user, done) {
      if (this.host.id === user.id) {
        this.host = null;
      } else {
        if (this.contestants.hasOwnProperty(user.id)) {
          delete this.contestants[user.id];
        }
      }

      this.save(() => {
        done(true);
      })
    }

    _addNewContestant(user, done) {
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

    _canAddContestant() {
      return Object.keys(this.contestants).length < CONTESTANT_CAP;
    };

    emit(event, users, data) {
      for (let i = 0; i < Object.values(users).length; i++) {
        let user = Object.values(users)[i];
        socketIo.to(user.socketId).emit(event, data);
      }
    };

    emitAll(event, data) {
      let users = Object.assign({}, this.contestants);
      users = Object.assign(users, this.spectators);

      if (this.host) {
        users[this.host.id] = this.host;
      }

      this.emit(event, users, data);
    };

    emitHost(event, data) {
      this.emit(event, {
        user: this.host
      }, data);
    };

    emitContestants(event, data) {
      this.emit(event, this.contestants, data);
    };

    setStage(stageName) {
      this.stageName = stageName;

      console.log('Set Stage to: ' + stageName);

      this.currentStage().entry();

      this.save(() => {});
    };

    onContestant(event, user, data) {
      let stage = this.currentStage();

      if (stage) {
        stage.onContestant(event, user, data);
      }
    };

    onHost(event, user, data) {
      let stage = this.currentStage();

      if (stage) {
        stage.onHost(event, user, data);
      }
    };

    nextPicker() {
      if (this.lastPicker && this.contestants[this.lastPicker]) {
        return this.contestants[this.lastPicker];
      }

      //TODO: make random.
      return Object.values(this.contestants)[0];
    };

    currentGridSquare() {
      if (!this.activeQuestion) {
        console.log('no current grid.');
        return undefined;
      }

      console.log('Active Question is: ' + this.activeQuestion);
      console.log('Current Grid is: ' + util.inspect(this.gridSquares[this.activeQuestion[0]][this.activeQuestion[1]]));

      return this.gridSquares[this.activeQuestion[0]][this.activeQuestion[1]];
    };

    setQuestion(gridPos) {
      this.activeQuestion = gridPos;

      if (gridPos) {
        let gridSquare = this.gridSquares[gridPos[0]][gridPos[1]];
        return !gridSquare.blank;
      }

      return false;
    };
  };

  return GameLoop;
}
