/**
 * Created by Eric on 4/9/2015.
 */

var BoardManager = {
    tryGetCell: function ( x, y, gameBoard ) {
        return this.isValidMove( x, y ) ?
            gameBoard.rows[ y ][ x ] :
            null;
    },
    isValidMove: function ( x, y ) {
        //console.log("isValidMove: %d %d ", x, y);
        return ( x > -1 && y > -1 ) && ( x < 8 && y < 8 );
    }
};
