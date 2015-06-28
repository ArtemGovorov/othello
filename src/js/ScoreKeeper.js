/**
 * Created by Eric on 4/5/2015.
 */
class ScoreKeeper {
    constructor() { }

    playerHasNextMove( playerNumber, gameBoard ) {
        let self = this;
        self.getEmptyCells( gameBoard ).forEach( ( cell ) => {
            if ( self.setScoreForMove( cell.col, cell.row, playerNumber ) > 0 )
                return true;
        } );

        return false;
    }

    setScoreForMove( x, y, player, gameBoard ) {
        let hits = [],
            searchDirections = [
              "Up",
              "UpAndRight",
              "Right",
              "DownAndRight",
              "Down",
              "DownAndLeft",
              "Left", 
              "UpAndLeft"
            ];

        searchDirections.forEach( ( direction ) => {
          hits = hits.concat( this["search" + direction]( x, y, player, gameBoard ) );
        } );

        return hits;
    }

    getFlatGameBoard( gameBoard ) {
        return Array.prototype.concat.apply( [], gameBoard.rows );
    }

    getEmptyCells( gameBoard ) {
        return this.getFlatGameBoard( gameBoard ).filter( ( c ) => {
            return c.player === 0;
        } );
    }

    calculatePoints( cell, rowInc, colInc, player, gameBoard ) {
        let cells = [], self = this;

        function getScore( r, c ) {
            if ( BoardManager.tryGetCell( c, r, gameBoard ) === null ) {
                return [];
            }

            let cell = gameBoard.rows[ r ][ c ],
                checkResult = self.checkCell( cell, player );

            if ( !checkResult.isValidMove || checkResult.isEmpty ) {
                return [];
            } else if ( checkResult.isPoint ) {
                cells.push( cell );
                return getScore( r + rowInc, c + colInc );
            } else {
                return cells;
            }
        }

        return getScore( cell.row, cell.col );
    }

    checkCell( cell, player ) {
        let valid = BoardManager.isValidMove( cell.col, cell.row ),
            empty = valid ? cell.player === 0 : false,
            point = valid ? cell.player !== player && !empty : false;

        return {
            isValidMove: valid,
            isEmpty: empty,
            isPoint: point
        };
    }

    getScoreForPlayer( playerNumber, gameBoard ) {
        return this.getFlatGameBoard( gameBoard ).reduce( ( score, cell ) => {
            if ( cell.player === playerNumber )
                score++;

            return score;
        }, 0 )
    }

    resetMoveScoreRatings( gameBoard ) {
        this.getFlatGameBoard( gameBoard ).forEach( ( cell ) => {
            cell.isHighestScoring = false;
        } );

        return gameBoard;
    }

    searchRight( startingX, startingY, player, gameBoard ) {
        return this.searchAt( startingX, startingY, 0, 1, player, gameBoard );
    }

    searchLeft( startingX, startingY, player, gameBoard ) {
        return this.searchAt( startingX, startingY, 0, -1, player, gameBoard );
    }

    searchUp( startingX, startingY, player, gameBoard ) {
        return this.searchAt( startingX, startingY, -1, 0, player, gameBoard );
    }

    searchDown( startingX, startingY, player, gameBoard ) {
        return this.searchAt( startingX, startingY, 1, 0, player, gameBoard );
    }

    searchUpAndRight( startingX, startingY, player, gameBoard ) {
        return this.searchAt( startingX, startingY, -1, 1, player, gameBoard );
    }

    searchUpAndLeft( startingX, startingY, player, gameBoard ) {
        return this.searchAt( startingX, startingY, -1, -1, player, gameBoard );
    }

    searchDownAndRight( startingX, startingY, player, gameBoard ) {
        return this.searchAt( startingX, startingY, 1, 1, player, gameBoard );
    }

    searchDownAndLeft( startingX, startingY, player, gameBoard ) {
        return this.searchAt( startingX, startingY, 1, -1, player, gameBoard );
    }

    searchAt( x, y, rowInc, colInc, player, gameBoard ) {
        let cell = BoardManager.tryGetCell(  x + colInc , y + rowInc , gameBoard );
        return cell !== null ?
            this.calculatePoints( cell, rowInc, colInc, player, gameBoard ) : [];
    }


}
