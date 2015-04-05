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
    constructor ( row, col, points ) {
        this.x = col;
        this.y = row;
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

class ScoreKeeper {
    constructor( gameBoard ) {
        this.gameBoard = gameBoard;
        this.numRows = gameBoard.rows.length;
        this.numCols = gameBoard.rows[0].length;
    }


    isLegalMove( x, y, player ) {
        return this.setScoreForMove( x, y, player ) > 0;
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
        let points = 0;

        points += this.searchUp( x, y, player );
        points += this.searchUpAndRight( x, y, player );
        points += this.searchRight( x, y, player );
        points += this.searchDownAndRight( x, y, player );
        points += this.searchDown( x, y, player );
        points += this.searchDownAndLeft( x, y, player );
        points += this.searchLeft( x, y, player );
        points += this.searchUpAndLeft( x, y, player );

        console.log( "POINTS EARNED: %d", points );
        return points;
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
            return 0;
        }

        function getScore( r, c ) {
            console.log( "getScore: row: %d col: %d player: %d", r, c, player );
            let [ reachedEdge, isEmpty, isPoint, cell ] = self.checkCell( r, c, player );

            if ( reachedEdge || isEmpty ) {
                cells = [];
                return 0;
            } else if ( isPoint ) {
                cells.push( cell );
                return getScore( r + rowInc, c + colInc );
            } else {
                cells.forEach( function ( cell ) {
                    cell.player = player;
                } );
                return cells.length;
            }
        }

        return getScore( row, col );
    }

    checkCell( row, col, player ) {
        console.log("checkCell: row %d col %d", row, col);
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
        console.log("searchRight( %d, %d, %d )", startingX, startingY, player);
        return this.calculatePoints( startingY, startingX + 1, 0, 1, player );
    }

    searchLeft( startingX, startingY, player ) {
        console.log("searchLeft( %d, %d, %d )", startingX, startingY, player);
        return this.calculatePoints( startingY, startingX - 1, 0, -1, player );
    }

    searchUp( startingX, startingY, player ) {
        console.log("searchUp( %d, %d, %d )", startingX, startingY, player);
        return this.calculatePoints( startingY + 1, startingX, 1, 0, player );
    }

    searchDown( startingX, startingY, player ) {
        console.log("searchDown( %d, %d, %d )", startingX, startingY, player);
        return this.calculatePoints( startingY - 1, startingX, -1, 0, player );
    }

    searchUpAndRight( startingX, startingY, player ) {
        console.log("searchUpAndRight( %d, %d, %d )", startingX, startingY, player);
        return this.calculatePoints( startingY + 1, startingX + 1, 1, 1, player );
    }

    searchUpAndLeft( startingX, startingY, player ) {
        console.log("searchUpAndLeft( %d, %d, %d )", startingX, startingY, player);
        return this.calculatePoints( startingY + 1, startingX - 1, 1, -1, player );
    }

    searchDownAndRight( startingX, startingY, player ) {
        console.log("searchDownAndRight( %d, %d, %d )", startingX, startingY, player);
        return this.calculatePoints( startingY - 1, startingX + 1, -1, 1, player );
    }

    searchDownAndLeft( startingX, startingY, player ) {
        console.log("searchDownAndLeft( %d, %d, %d )", startingX, startingY, player);
        return this.calculatePoints( startingY - 1, startingX - 1, -1, -1, player );
    }

}