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
                html += `<div class='cell' data-target="${cell.potentialTarget}" data-is-highest-sciring-move="${cell.isHighestScoring}" data-player-num="${cell.player}" data-row-num='${i}' data-col-num='${j}'>${cell.player}</div>`;
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
        let isTarget = $cell.data( "target" );
        let [ activePlayerNumber, otherPlayerNumber ] = getPlayerNumbers();

        // calculate points and set cell values
        let hits = _scoreKeeper.setScoreForMove( col, row, activePlayerNumber );
        let pointsEarned = hits.length;

        if ( !isTarget || pointsEarned === 0 )
            return;

        cellObj.player = activePlayerNumber;
        hits.forEach( function ( h ) {
            h.player = activePlayerNumber
        } );

        let move = new Move( row, col, pointsEarned );

        _activePlayer.moves.push( move );

        // check if next player has any moves based on board state
        // no, declare victory, else continue
        let potentialNextMoves = getPotentialNextMovesForNextPlayer();
        console.log( "Potential Next Moves: ", potentialNextMoves );
        let highestScoringNextMove = potentialNextMoves.sort( function ( c1, c2 ) {
            return c2.pointValue - c1.pointValue;
        } )[0];

        highestScoringNextMove.isHighestScoring = true;

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
        _scoreKeeper.resetMoveScoreRatings();

        if ( potentialNextMoves ) {
            console.log( "It's now player %d's turn", otherPlayerNumber );
        } else {
            console.log( "No next moves for player %d", otherPlayerNumber );
        }


    } );

    function getPotentialNextMovesForNextPlayer() {
        let flatGamBoard = _scoreKeeper.getFlatGameBoard();
        flatGamBoard.forEach( function ( cell ) {
            cell.potentialTarget = false;
        } );

        let activePlayerCells = flatGamBoard
            .filter( function ( cell ) {
                return cell.player === _activePlayer.number;
            } );

        console.log( "Active player cells: ", activePlayerCells );

        let potentialNextMoves = [];
        let rows = gameBoard.rows;
        let moveResult;

        activePlayerCells.forEach( function ( c ) {
            let above = rows[ c.row + 1 ][ c.col ];
            scoreMove( above, potentialNextMoves );

            let aboveRight = rows[ c.row + 1 ][ c.col + 1 ];
            scoreMove( aboveRight, potentialNextMoves );

            let aboveLeft = rows[ c.row + 1 ][ c.col - 1 ];
            scoreMove( aboveLeft, potentialNextMoves );

            let left = rows[ c.row ][ c.col - 1 ];
            scoreMove( left, potentialNextMoves );

            let right = rows[ c.row ][ c.col + 1 ];
            scoreMove( right, potentialNextMoves );

            let below = rows[ c.row - 1 ][ c.col ];
            scoreMove( below, potentialNextMoves );

            let belowRight = rows[ c.row - 1 ][ c.col + 1 ];
            scoreMove( belowRight, potentialNextMoves );

            let belowLeft = rows[ c.row - 1 ][ c.col - 1 ];
            scoreMove( belowLeft, potentialNextMoves );
        } );

        return potentialNextMoves;
    }

    function moveEarnsPoints( cell ) {
        let [x,  otherPlayerNumber ] = getPlayerNumbers(),
            hits = _scoreKeeper.setScoreForMove( cell.col, cell.row, otherPlayerNumber ),
            points = hits.length,
            isHit = cell.player === 0 && points > 0;

        return { isHit: isHit, points: points };
    }

    function scoreMove( move, potentialNextMoves ) {
        let moveResult = moveEarnsPoints( move );
        console.log( "belowLeft isHit: %a points: %d", moveResult.isHit, moveResult.points );
        if ( moveResult.isHit ) {
            move.potentialTarget = true;
            move.pointValue = moveResult.points;

            if ( potentialNextMoves.indexOf( move ) === -1 )
                potentialNextMoves.push( move );
        }
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
