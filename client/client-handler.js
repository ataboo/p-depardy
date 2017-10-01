function _initSocket(handleEvent) {
    const location = window.location;
    let wsProt = location.protocol === 'https:' ? 'wss:' : 'ws:';
    let path = wsProt + '//' + location.host + location.pathname;

    let socket = new WebSocket(path);

    socket.onmessage = (raw) => {
        let data = JSON.parse(raw.data);
        if (data.event) {
            console.log(data.event);
            handleEvent(data.event, data.data);
        }
    };

    return socket;
}

module.exports = {
    initSocket: _initSocket
}
