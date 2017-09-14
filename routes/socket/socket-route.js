let GameLoopLoad = require('../../middleware/load-gameloop')();

class SocketRoute {
    constructor(ws, req) {
        this.ws = ws;
        this.req = req;
        this.user = { id: req.session.passport.user, socket: ws };

        if (!this.user) {
            console.error('No user object found.');
            return;
        }

        GameLoopLoad.getLoop((gameLoop) => {
            this.gameLoop = gameLoop;
            this.checkIn((success) => {
                if (success) {
                    this.registerEvents();
                } else {
                    //TODO: emit fail.
                    console.log('Failed to check in.')
                }
            });
        })
    }

    checkIn(done) {
        throw new Error('checkIn() should be implemented.');
    }

    handleEvent() {
        throw new Error('handleEvent() should be implemented.');
    }

    eventWhiteList() {
        throw new Error('eventWhiteList() should be implemented.')
    }

    registerEvents() {
        this.ws.on('message', (raw) => {
            let data =  JSON.parse(raw);

            if (!data.event || !(this.eventWhiteList().includes(data.event))) {
                console.error('Illegal event: '+data.event);
                return;
            }

            this.handleEvent(data);
        });

        this.ws.on('close', () => {
            console.log('checked out: '+this.user.id);
            this.gameLoop.checkOut(this.user, () => {});
        });
    }
}

module.exports = SocketRoute;