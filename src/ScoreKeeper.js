/**
 * Created by Eric on 4/5/2015.
 */
class ScoreKeeper {
    constructor( gameBoard ) {
        this.gameBoard = gameBoard;
        this.numRows = gameBoard.rows.length;
        this.numCols = gameBoard.rows[0].length;
    }

    playerHasNextMove( playerNumber ) {
        let self = this;
        self.getEmptyCells().forEach( function ( cell ) {
            if ( self.setScoreForMove( cell.col, cell.row, playerNumber ) > 0 ) {
                return true;
            }
        } );

        return false;
    }

    getGameBoardState( currentPlayerNumber, nextPlayerNumber) {
        let nextPlayerHasMove = this.playerHasNextMove( nextPlayerNumber ),
            currentPlayerHasMove = this.playerHasNextMove( currentPlayerNumber ),
            gameOver = !nextPlayerHasMove && !currentPlayerHasMove;

        return [ nextPlayerHasMove, currentPlayerHasMove, gameOver ];
    }


    setScoreForMove( x, y, player ) {
        let hits = [];

        hits = hits.concat( this.searchUp( x, y, player ) );
        hits = hits.concat( this.searchUpAndRight( x, y, player  ));
        hits = hits.concat( this.searchRight( x, y, player ));
        hits = hits.concat( this.searchDownAndRight( x, y, player ));
        hits = hits.concat( this.searchDown( x, y, player ));
        hits = hits.concat( this.searchDownAndLeft( x, y, player ));
        hits = hits.concat( this.searchLeft( x, y, player ));
        hits = hits.concat( this.searchUpAndLeft( x, y, player ));

        console.log( "POINTS EARNED: %d", hits.length );
        console.log( "HITS: ", hits );
        return hits;
    }

    getFlatGameBoard() {
        return Array.prototype.concat.apply( [], this.gameBoard.rows );
    }

    getEmptyCells() {
        return this.getFlatGameBoard().filter( function ( c ) {
            return c.player === 0;
        } );
    }

    calculatePoints( row, col, rowInc, colInc, player ) {
        let cells = [], self = this;

        if ( row === -1 || col === -1 || row === 8 || col === 8 ) {
            return [];
        }

        function getScore( r, c ) {
            let [ reachedEdge, isEmpty, isPoint, cell ] = self.checkCell( r, c, player );

            if ( reachedEdge || isEmpty ) {
                return [];
            } else if ( isPoint ) {
                console.log("HIT! ", cell);
                cells.push( cell );
                return getScore( r + rowInc, c + colInc );
            } else {
                console.log("Returning cells: ", cells);
                return cells;
            }
        }

        return getScore( row, col );
    }

    checkCell( row, col, player ) {
        let hasReachedEdge = ( row === this.numRows - 1 || col === this.numCols - 1 ),
            cell = this.gameBoard.rows[ row ][ col ],
            isEmptyCell = cell.player === 0,
            isPoint = cell.player !== player && !isEmptyCell;

        return [ hasReachedEdge, isEmptyCell, isPoint, cell ];
    }

    getScoreForPlayer( playerNumber ) {
        return this.getFlatGameBoard().reduce(function ( score, cell) {
            if ( cell.player === playerNumber ) {
                score++;
            }
            return score;
        }, 0)
    }

    searchRight( startingX, startingY, player ) {
        return this.calculatePoints( startingY, startingX + 1, 0, 1, player );
    }

    searchLeft( startingX, startingY, player ) {
        return this.calculatePoints( startingY, startingX - 1, 0, -1, player );
    }

    searchUp( startingX, startingY, player ) {
        return this.calculatePoints( startingY + 1, startingX, 1, 0, player );
    }

    searchDown( startingX, startingY, player ) {
        return this.calculatePoints( startingY - 1, startingX, -1, 0, player );
    }

    searchUpAndRight( startingX, startingY, player ) {
        return this.calculatePoints( startingY + 1, startingX + 1, 1, 1, player );
    }

    searchUpAndLeft( startingX, startingY, player ) {
        return this.calculatePoints( startingY + 1, startingX - 1, 1, -1, player );
    }

    searchDownAndRight( startingX, startingY, player ) {
        return this.calculatePoints( startingY - 1, startingX + 1, -1, 1, player );
    }

    searchDownAndLeft( startingX, startingY, player ) {
        return this.calculatePoints( startingY - 1, startingX - 1, -1, -1, player );
    }
}