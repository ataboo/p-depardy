module.exports = function() {
  let GridSquare = require('./gridsquare')();
  const CATEGORIES = ['First One', 'Second One'];
  const VALUES = [100, 200, 300, 400, 500];

  class GameData {
    constructor() {
      this.contestants = {};
      this.spectators = {};
      this.stageName = 'entry';
      this.gridSquares = [];
      this.locked = false;
      this.activeQuestion = [0, 0];
      this.lasPicker = undefined;
    }

    init(done) {
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

      done();
    }

    allUsers() {
      let users = Object.assign({}, this.contestants, this.spectators);

      if (this.host) {
          users[this.host.id] = this.host;
      }

      return users;
    }

    spectatorGrid() {
      let outGrid = [];

      for(let[x, col] of Object.entries(this.gridSquares)) {
          outGrid[x] = [];
        for(let[y, gridSquare] of Object.entries(col)) {
            console.log(gridSquare.label());
            outGrid[x][y] = gridSquare.label();
          }
      }


      return {
        catagories: CATEGORIES,
        gridSquares: outGrid
      };
    }

    hostId() {
      return this.host ? this.host.id : undefined;
    }

    getHost() {
      return this.host;
    }

    findSpectator(userId) {
      return this.spectators[userId];
    }

    findContestants(userId) {
      return this.contestants[userId];
    }

    addHost(user) {
      if (this.locked) {
        console.error('Cant add host when game is locked.');
        return;
      }

      if (this.findContestants(user.id)) {
        this.contestants[user.id] = undefined;
      }

      this.host = user;
    }

    gridSize() {
      return [this.gridSquares.length, this.gridSquares[0].length];
    }

    currentGridSquare() {
        if (!this.activeQuestion) {
            console.log('no current grid.');
            return undefined;
        }

        console.log('Active Question is: ' + this.activeQuestion);

        return this.gridSquares[this.activeQuestion[0]][this.activeQuestion[1]];
    };

    addContestant(user) {
      if (this.locked) {
        console.error('Cant add contestant when game is locked.');
        return;
      }

      if (host && host.id === user.id) {
        host = undefined;
      }

      this.contestants[user.id] = user;
    }

    addSpectator(user) {
      this.spectators[user.id] = user;
    }

    getUserType(userId) {
      if (this.host && this.host.id === userId) {
        return 'host';
      }
      if (this.contestants.hasOwnProperty(userId)) {
        return 'contestant';
      }
      return 'spectator';
    }
  }

  return GameData;
};
