/**
 * Created by Eric on 4/4/2015.
 */

class Player {
    constructor ( num ) {
        this.number = num;
        this.score = 2;
        this.moves = [];
    }
}

class Move {
    constructor ( num, points ) {
        this.number = num;
        this.pointValue = points;
    }
}

class Cell {
    constructor( row, col ) {
        this.row = row;
        this.col = col;
        this.player = 0;
        this.value = `${this.row}-${this.col}`;
    }
}