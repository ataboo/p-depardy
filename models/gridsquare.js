module.exports = function() {
    function GridSquare (attrs) {
        this.blank = false;
        this.question = attrs.question;
        this.value = attrs.value;
        this.answer = attrs.answer;
        this.double = attrs.double;
    }

    GridSquare.prototype.public = function() {
        let square = Object.assign({}, this);

        square.answer = undefined;
        square.double = undefined;
        return square;
    };

    return GridSquare;
};