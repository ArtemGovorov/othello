/**
 * Created by Eric on 4/5/2015.
 */
class ScoreKeeper {
    constructor( boardManager ) {
        this.boardManager = boardManager;
    }

    playerHasNextMove( playerNumber, gameBoard ) {
        let self = this;

        self.getEmptyCells( gameBoard ).forEach( cell  =>
            self.setScoreForMove( cell.col, cell.row, playerNumber ) > 0 );

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

        searchDirections.forEach(( direction ) => {
            hits = hits.concat( this["search" + direction]( x, y, player, gameBoard ) );
        } );

        return hits;
    }

    

    calculatePoints( cell, rowInc, colInc, player, gameBoard ) {
        let cells = [], self = this;

        function getScore( r, c ) {
            if ( self.boardManager.tryGetCell( c, r, gameBoard ) === null ) {
                return [];
            }

            let cell = gameBoard.rows[r][c],
                result = self.checkCell( cell, player );

            if ( !result.isValidMove || result.isEmpty ) {
                return [];
            } else if ( result.isPoint ) {
                cells.push( cell );
                return getScore( r + rowInc, c + colInc );
            } else {
                return cells;
            }
        }

        return getScore( cell.row, cell.col );
    }

    checkCell( cell, player ) {
        const valid = this.boardManager.isValidMove( cell.col, cell.row ),
              empty = valid ? cell.player === 0 : false,
              point = valid ? cell.player !== player && !empty : false;

        return {
            isValidMove: valid,
            isEmpty: empty,
            isPoint: point
        };
    }

    getScoreForPlayer( playerNumber, gameBoard ) {
        return this.boardManager.getFlatGameBoard(gameBoard).reduce(( score, cell ) => {
            if (cell.player === playerNumber)
                score++;

            return score;
        }, 0);
    }

    resetMoveScoreRatings( gameBoard ) {
        this.boardManager.getFlatGameBoard( gameBoard )
            .forEach( cell  => cell.isHighestScoring = false );

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
        let cell = this.boardManager.tryGetCell( x + colInc, y + rowInc, gameBoard );
        return cell !== null ?
            this.calculatePoints( cell, rowInc, colInc, player, gameBoard ) : [];
    }


}
