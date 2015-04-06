/**
 * Created by Eric on 4/4/2015.
 */

(() => {
    let gameBoard = {
            rows: []
        },
        _playerOne = new Player( 1 ),
        _playerTwo = new Player( 2 ),
        _activePlayer = _playerOne,
        _players = [ _playerOne, _playerTwo ],
        _scoreKeeper;

    const rowNum = 8;
    const colNum = 8;

    for ( let i = 0; i < rowNum; i++ ) {
        let row = [];
        for ( let j = 0; j < colNum; j++ ) {
            row.push( new Cell( i, j ) );
        }
        gameBoard.rows.push( row );
    }

    _scoreKeeper = new ScoreKeeper( gameBoard );

    function renderGameBoard() {
        console.log( "Gameboard: ", gameBoard );
        let html = '';
        gameBoard.rows.forEach( function ( row, i ) {
            row.forEach( function ( cell, j ) {
                html += `<div class='cell' data-target="${cell.potentialTarget}" data-player-num="${cell.player}" data-row-num='${i}' data-col-num='${j}'>${cell.player}</div>`;
            } );

        } );

        $( ".game-board" ).html( html );
    }

    $( ".game-board" ).on( "click", ".cell", function () {
        let $cell = $( this );
        let row = +$cell.data( "row-num" );
        let col = +$cell.data( "col-num" );
        let player = +$cell.data( "player-num" );
        let cellObj = gameBoard.rows[ row ][ col ];
        let isTarget = $cell.data("target");
        let [ activePlayerNumber, otherPlayerNumber ] = getPlayerNumbers();
        //let [ nextPlayerHasMove, currentPlayerHasMove, gameOver ] =
        //    _scoreKeeper.getGameBoardState( activePlayerNumber, otherPlayerNumber );

        if ( !isTarget ) return;

        // calculate points and set cell values
        cellObj.player = activePlayerNumber;
        let pointsEarned = _scoreKeeper.setScoreForMove( col, row, activePlayerNumber );
        let move = new Move( row, col, pointsEarned );

        _activePlayer.moves.push( move );

        // check if next player has any moves based on board state
        // no, declare victory, else continue
        let potentialNextMoves = getPotentialNextMovesForNextPlayer( );

        //if ( gameOver ) {
        //    // announce verdict
        //    console.log("GAME OVER");
        //} else if ( nextPlayerHasMove ) {
        //    updateActivePlayer( otherPlayerNumber );
        //    // change active player in UI
        //    console.log( "It's now player %d's turn", otherPlayerNumber );
        //} else if ( currentPlayerHasMove ) {
        //    // update UI with status
        //    console.log( "It's still player %d's turn", otherPlayerNumber );
        //}

        updateActivePlayer( otherPlayerNumber );
        renderGameBoard();
        updateScoreBoards( _players );

        if ( potentialNextMoves ) {
            console.log( "It's now player %d's turn", otherPlayerNumber );
        } else {
            console.log( "No next moves for player %d", otherPlayerNumber );
        }


    } );

    function getPotentialNextMovesForNextPlayer( ) {
        let flatGamBoard = _scoreKeeper.getFlatGameBoard();
        flatGamBoard.forEach( function ( cell ) {
            cell.potentialTarget = false;
        } );

        let activePlayerCells = flatGamBoard
            .filter( function ( cell ) {
                return cell.player === _activePlayer.number;
            } );

        console.log("Active player cells: ", activePlayerCells);

        let potentialNextMoves = [];
        let rows = gameBoard.rows;
        activePlayerCells.forEach( function ( c ) {
            let above = rows[ c.row + 1 ][ c.col ];
            if ( above.player === 0 ) {
                above.potentialTarget = true;
                potentialNextMoves.push( above );
            }


            let aboveRight = rows[ c.row + 1 ][ c.col + 1 ];
            if ( aboveRight.player === 0 ) {
                aboveRight.potentialTarget = true;
                potentialNextMoves.push( aboveRight );
            }

            let aboveLeft = rows[ c.row + 1 ][ c.col - 1 ];
            if ( aboveLeft.player === 0 ) {
                aboveLeft.potentialTarget = true;
                potentialNextMoves.push( aboveLeft );
            }

            let left = rows[ c.row ][ c.col - 1 ];
            if ( left.player === 0 ) {
                left.potentialTarget = true;
                potentialNextMoves.push( left );
            }

            let right = rows[ c.row ][ c.col + 1 ];
            if ( right.player === 0 ) {
                right.potentialTarget = true;
                potentialNextMoves.push( right );
            }

            let below = rows[ c.row - 1 ][ c.col ];
            if ( below.player === 0 ) {
                below.potentialTarget = true;
                potentialNextMoves.push( below );
            }

            let belowRight = rows[ c.row - 1 ][ c.col + 1 ];
            if ( belowRight.player === 0 ) {
                belowRight.potentialTarget = true;
                potentialNextMoves.push( belowRight );
            }

            let belowLeft = rows[ c.row - 1 ][ c.col - 1 ];
            if ( belowLeft.player === 0 ) {
                belowLeft.potentialTarget = true;
                potentialNextMoves.push( belowLeft );
            }

            return potentialNextMoves;
        } );
    }

    function updateActivePlayer( newPlayerNumber ) {
        let playerIndex = newPlayerNumber === 1 ? 0 : 1;
        _activePlayer = _players[ playerIndex ];
    }

    function updateScoreBoards( players ) {
        players.forEach( function ( player ) {
            let $playerSoreBoard = $( ".player-" + player.number );

            player.score = _scoreKeeper.getScoreForPlayer( player.number );

            $( ".player-" + player.number + " .score" ).html( player.score );
            $( ".player-" + player.number + " .moves" ).html( player.moves.length );

            if ( player.number === _activePlayer.number ) {
                $playerSoreBoard.addClass( "active" );
            } else {
                $playerSoreBoard.removeClass( "active" );
            }
        } );
    }

    function setNewGameValues() {
        gameBoard.rows[ 3 ][ 3 ].player = 1;
        gameBoard.rows[ 4 ][ 3 ].player = 2;
        gameBoard.rows[ 3 ][ 4 ].player = 2;
        gameBoard.rows[ 4 ][ 4 ].player = 1;

        // mark player one potential targets
        gameBoard.rows[ 2 ][ 4 ].potentialTarget = true;
        gameBoard.rows[ 3 ][ 5 ].potentialTarget = true;
        gameBoard.rows[ 4 ][ 2 ].potentialTarget = true;
        gameBoard.rows[ 5 ][ 3 ].potentialTarget = true;
    }

    function getPlayerNumbers() {
        let otherPlayerIndex = _activePlayer.number === 1 ? 1 : 0;
        return [ _activePlayer.number, _players[ otherPlayerIndex ].number ];
    }

    setNewGameValues();
    renderGameBoard();
    updateScoreBoards( _players );


    console.log( "Empty cells: ", _scoreKeeper.getEmptyCells() );
})();
