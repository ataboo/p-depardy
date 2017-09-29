module.exports = function() {
  let GridSquare = require('./gridsquare')();
  let Player = require('./player');
  const CATEGORIES = ['First One Has a Longer title', 'Second One has a longer title', 'Third One', 'Fourth One has a longer title', 'Fifth One', 'Sixth One'];
  const VALUES = [200, 400, 600, 800, 1000];

  class GameData {
    constructor(gameLoop) {
      this.players = {};
      this.stageName = 'entry';
      this.gridSquares = [];
      this.locked = false;
      this.activeQuestion = [0, 0];
      this.lastPicker = undefined;
      this.gameLoop = gameLoop;
      this.playerSummaries = undefined;
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
        categories: CATEGORIES,
        gridSquares: outGrid
      };
    }

    player(userId) {
        return this.players[userId];
    }

    awardCurrentQuestion() {
        let player = this.players[this.checkingContestant];
        let gridSquare = this.currentGridSquare();

        if (player && gridSquare) {
            player.score += gridSquare.value;
            this.updatePlayerSummaries();
        } else {
            console.error('Cannot find player with id: '+playerId);
        }
    }

    addHost(user, done) {
        if (this.locked) {
            console.error('Cant add contestant when game is locked.');
            done(false);
            return;
        }
        let player = new Player(user, Player.HOST, () => {
            this.addPlayer(player);
            done(true);
        })
    }

    addContestant(user, done) {
        if (this.locked) {
            console.error('Cant add contestant when game is locked.');
            done(false);
            return;
        }

        let player = new Player(user, Player.CONTESTANT, () => {
            this.addPlayer(player);
            done(true);
        })
    }

    addSpectator(user, done) {
        let player = new Player(user, Player.SPECTATOR, () => {
            this.addPlayer(player);
            done(true);
        })
    }

    addPlayer(player) {
      let existingPlayer = this.player(player.id);
      if (existingPlayer) {
        existingPlayer.socket = player.socket;
        existingPlayer.type = player.type;
      } else {
        this.players[player.id] = player;
      }

      console.log(player.name);
      this.updatePlayerSummaries();
      this.eachPlayer((player) => {
          if (player.type == Player.SPECTATOR) {
              this.sendGrid(player);
          }
      })
      player.emit('check-in', {player_id: player.id});
      this.gameLoop.currentStage().sync();

      return this.player(player.id);
    }

    removePlayer(user) {
        if (this.player(user.id)) {
            delete this.players[user.id];
            this.updatePlayerSummaries();
            this.eachPlayer((player) => {
                if (player.type == Player.SPECTATOR) {
                    this.sendGrid(player);
                }
            })

            return true;
        }

        return false;
    }

    updatePlayerSummaries() {
        this.playerSummaries = this.playerType(Player.CONTESTANT).map((player) => {
            return {
                id: player.id,
                name: player.name,
                score: player.score
            };
        });
    }


    gridSize() {
      return [this.gridSquares.length, this.gridSquares[0].length];
    }

    currentGridSquare() {
        if (!this.activeQuestion) {
            console.log('no current grid.');
            return undefined;
        }

        return this.gridSquares[this.activeQuestion[0]][this.activeQuestion[1]];
    };

    sendGrid(player) {
        console.log('send grid.');
        console.dir(this.playerSummaries);

        player.socket.send(
            JSON.stringify({event: 'init-grid', data: { grid: this.spectatorGrid(), players: this.playerSummaries } })
        );
    }

    eachPlayer(callback) {
      for(let id in this.players) {
        if (this.players.hasOwnProperty(id)) {
            callback(this.players[id]);
        }
      }
    }

    mapPlayer(callback) {
      let mapped = [];

      for(let id in this.players) {
        if (this.players.hasOwnProperty(id)) {
          mapped.push(callback(this.player(id)));
        }
      }

      return mapped;
    }

    playerType(type) {
      return Object.values(this.players).filter(player => {
        return player.type === type;
      });
    }

    nextPicker() {
      let contestants = this.playerType(Player.CONTESTANT);
      if (!this.lastPicker || !this.player(this.lastPicker)) {
        if (contestants.length) {
          this.lastPicker = contestants[Math.floor(contestants.length*Math.random())].id;
        } else {
          return false;
        }

      }

      return this.player(this.lastPicker);
    }
  }

  return GameData;
};
