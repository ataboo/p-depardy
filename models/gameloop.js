module.exports = function(redisClient, socketIo) {
const GameData = require('./gamedata')();
const CONTESTANT_CAP = 3;

  class GameLoop {
    constructor() {
      this.Stages = require('./stages/stages')(this);
      this.gameData = new GameData();
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
      if (this.gameData.findContestants(user.id)) {
        delete this.contestants[user.id];
      }

      if (this.gameData.findSpectator(user.id)) {
        delete this.spectators[user.id];
      }

      if (!this.gameData.getHost()) {
        this.gameData.addHost(user);
      } else {
        if (this.gameData.hostId() !== user.id) {
          return (false, 'There is another host already.');
        }
      }

      this.gameData.host.socket = user.socket;
      return done(true);
    }

    contestantCheckIn(user, done) {
      if(this.gameData.hostId() === user.id) {
        this.gameData.host = undefined;
      }

      if (this.gameData.findSpectator(user.id)) {
        delete this.gameData.spectators[user.id];
      }

      if (this.gameData.findContestants(user.id)) {
        this.gameData.contestants[user.id].socket = user.socket;

        done(true);
        return;
      }

      this._addNewContestant(user, done);
    }

    spectatorCheckIn(user, done) {
      if(this.gameData.getHost() && this.gameData.getHost().id === user.id) {
        this.host = undefined;
      }

      if (this.gameData.findContestants(user.id)) {
        delete this.contestants[user.id];
      }

      this.sendGrid(user);

      if (this.gameData.findSpectator(user.id)) {

        this.gameData.spectators[user.id].socket = user.socket;

        done(true);
          return;
      }

      this._addNewSpectator(user, done);
    }

    checkOut(user, done) {
      if (this.gameData.hostId() === user.id) {
        this.gameData.host = null;
        done(true);
      }

      if (this.gameData.findContestants(user.id)) {
        delete this.gameData.contestants[user.id];
        done(true);
      }

      if (this.gameData.findSpectator(user.id)) {
        delete this.gameData.spectators[user.id];
        done(true);
      }

      done(false, 'User not found.');
    }

    sendGrid(user) {
      user.socket.send(JSON.stringify({event: 'init-grid', data: this.gameData.spectatorGrid()}))
    }

      _addNewContestant(user, done) {
      if (!this._canAddContestant()) {
        done(false, 'Cannot add any more contestants.');
        return;
      }

      this.gameData.contestants[user.id] = {
        id: user.id,
        score: 0,
        socket: user.socket
      };

      done(true);
    };

    _addNewSpectator(user, done) {
      this.gameData.spectators[user.id] = {
        id: user.id,
        socket: user.socket
      };

      done(true);
    }

    _canAddContestant() {
      return Object.keys(this.gameData.contestants).length < CONTESTANT_CAP;
    };

    emit(event, users, data) {
      console.dir(event);

      for (let userId in users) {
        let user = users[userId];
        if(!user.socket) {
          continue;
        }

        user.socket.send(JSON.stringify({event: event, data: data}));
      }
    };

    emitAll(event, data) {
      this.emit(event, this.gameData.allUsers(), data);
    };

    emitHost(event, data) {
      if (this.gameData.host) {
        let users = {};
        users[this.gameData.host.id] = this.gameData.host;

        this.emit(event, users, data);
      }
    };

    emitContestants(event, data) {
      this.emit(event, this.gameData.contestants, data);
    };

    emitSpectators(event, data) {
      this.emit(event, this.gameData.spectators, data);
    }

    setStage(stageName) {
      this.gameData.stageName = stageName;
      this.currentStage().entry();
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
      let lastPicker = this.gameData.findContestants(this.gameData.lastPicker);
      if (lastPicker) {
        return lastPicker;
      }

      //TODO: make random.
      return Object.values(this.gameData.contestants)[0];
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
  }

  return GameLoop;
};
