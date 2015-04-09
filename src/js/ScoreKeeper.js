/**
 * Created by Eric on 4/5/2015.
 */
class ScoreKeeper {
    constructor() { }

    playerHasNextMove( playerNumber, gameBoard ) {
        let self = this;
        self.getEmptyCells( gameBoard ).forEach( function ( cell ) {
            if ( self.setScoreForMove( cell.col, cell.row, playerNumber ) > 0 ) {
                return true;
            }
        } );

        return false;
    }


    setScoreForMove( x, y, player, gameBoard ) {
        let hits = [];

        hits = hits.concat( this.searchUp( x, y, player, gameBoard ) );
        hits = hits.concat( this.searchUpAndRight( x, y, player, gameBoard ) );
        hits = hits.concat( this.searchRight( x, y, player, gameBoard ) );
        hits = hits.concat( this.searchDownAndRight( x, y, player, gameBoard ) );
        hits = hits.concat( this.searchDown( x, y, player, gameBoard ) );
        hits = hits.concat( this.searchDownAndLeft( x, y, player, gameBoard ) );
        hits = hits.concat( this.searchLeft( x, y, player, gameBoard ) );
        hits = hits.concat( this.searchUpAndLeft( x, y, player, gameBoard ) );

        console.log( "POINTS EARNED: %d", hits.length );
        console.log( "HITS: ", hits );
        return hits;
    }

    getFlatGameBoard( gameBoard ) {
        return Array.prototype.concat.apply( [], gameBoard.rows );
    }

    getEmptyCells( gameBoard ) {
        return this.getFlatGameBoard( gameBoard ).filter( function ( c ) {
            return c.player === 0;
        } );
    }

    calculatePoints( cell, rowInc, colInc, player, gameBoard ) {
        let cells = [], self = this;

        function getScore( r, c ) {
            let cell = gameBoard[ r ][ c ],
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
        let valid = this.isValidMove( cell ),
            empty = valid ? cell.player === 0 : false,
            point = valid ? cell.player !== player && !empty : false;

        return {
            isValidMove: valid,
            isEmpty: empty,
            isPoint: point
        };
    }

    getScoreForPlayer( playerNumber, gameBoard ) {
        return this.getFlatGameBoard( gameBoard ).reduce( function ( score, cell ) {
            if ( cell.player === playerNumber ) {
                score++;
            }
            return score;
        }, 0 )
    }

    resetMoveScoreRatings( gameBoard ) {
        this.getFlatGameBoard( gameBoard ).forEach( function ( cell ) {
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
        let cell = gameBoard.rows[ y + rowInc ][ x + colInc ];

        return this.isValidMove( cell ) ?
            this.calculatePoints( cell, rowInc, colInc, player, gameBoard ) : [];
    }

    isValidMove( cell ) {
        return cell.row > -1 &&
               cell.col > -1 &&
               cell.row < 8 &&
               cell.col < 8;
    }
}