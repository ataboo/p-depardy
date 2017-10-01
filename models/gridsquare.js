module.exports = function() {
    function GridSquare (attrs) {
        this.blank = attrs.blank;
        this.question = attrs.question;
        this.category = attrs.category;
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

    GridSquare.prototype.label = function() {
        return this.blank ? '' : this.value;
    };

    return GridSquare;
};
