/**
 * Created by Eric on 4/9/2015.
 */

class BoardManager {
    constructor() { }

    tryGetCell( x, y, gameBoard ) {
        return this.isValidMove( x, y ) ?
            gameBoard.rows[ y ][ x ] :
            null;
    }

    isValidMove( x, y ) {
        return ( x > -1 && y > -1 ) && ( x < 8 && y < 8 );
    }
}
