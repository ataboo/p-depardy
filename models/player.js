const User = require('../models/user')();

class Player {
    constructor(user, type, done = null) {
        console.dir(user.id);

        User.findById(user.id, (err, user) => {
            this.name = user.name;
            this.email = user.email;

            if (typeof done === 'function') {
                done();
            }
        });

        this.socket = user.socket;
        this.id = user.id;
        this.type = type;
        this.buzzed = false;
        this.score = 0;
    }

    emit(event, data) {
        if (!this.socket) {
            console.error('User '+this.id+' has no socket.');
            return;
        }
        this.socket.send(JSON.stringify({event: event, data: data}));
    }
}

Player.CONTESTANT = 'contestant';
Player.HOST = 'host';
Player.SPECTATOR = 'spectator';

module.exports = Player;
