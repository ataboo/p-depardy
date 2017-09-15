class Player {
    constructor(user, type) {
        this.socket = user.socket;
        this.id = user.id;
        this.type = type;
        this.buzzed = false;
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