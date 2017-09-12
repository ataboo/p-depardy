module.exports = function() {
  let GridSquare = require('./gridsquare')();
  const CATEGORIES = ['First One', 'Second One'];
  const VALUES = [100, 200, 300, 400, 500];
  const CONTESTANT_CAP = 3;

  class GameData {
    constructor() {
      this.contestants = {};
      this.spectators = {};
      this.stageName = 'entry';
      this.gridSquares = [];
      this.locked = false;
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

    addHost(user) {
      if (this.locked) {
        console.error('Cant add host when game is locked.');
        return;
      }

      if (this.contestants.keys().includes(user.id)) {
        this.contestants[user.id] = undefined;
      }

      this.host = user;
    }

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
}
