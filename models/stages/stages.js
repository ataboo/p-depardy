module.exports = function(gameLoop) {
    return {
        picking: require('./picking')(gameLoop),
        pre_round: require('./pre_round')(gameLoop),
        reading: require('./reading')(gameLoop),
        buzzing: require('./buzzing')(gameLoop),
        checking: require('./checking')(gameLoop),
        show_answer: require('./show_answer')(gameLoop)
    }
};