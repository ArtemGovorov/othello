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
    constructor ( row, col, points, playerId ) {
        this.x = col;
        this.y = row;
        this.pointValue = points;
        this.player = playerId;
        this.time = 0;
    }
}

class Cell {
    constructor( row, col ) {
        this.row = row;
        this.col = col;
        this.player = 0;
        this.potentialTarget = false;
    }
}

