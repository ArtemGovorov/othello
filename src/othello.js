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

    _scoreKeeper = new ScoreKeeper(gameBoard);


  //  console.log("Flat game board: ", getFlatGameBoard());
    console.log("Empty cells: ", _scoreKeeper.getEmptyCells());

    function renderGameBoard() {
        console.log( "Gameboard: ", gameBoard );
        let html = '';
        gameBoard.rows.forEach( function ( row, i ) {
            row.forEach( function ( cell, j ) {
                html += `<div class='cell' data-player-num="${cell.player}" data-row-num='${i}' data-col-num='${j}'>${cell.player}</div>`;
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
        let [ activePlayerNumber, otherPlayerNumber ] = getPlayerNumbers();
        //let [ nextPlayerHasMove, currentPlayerHasMove, gameOver ] =
        //    _scoreKeeper.getGameBoardState( activePlayerNumber, otherPlayerNumber );


        console.log("Active player: ", activePlayerNumber);
        if ( !_scoreKeeper.isLegalMove( col, row, activePlayerNumber ) ) {
            return;
        }

        // calculate points and set cell values
        cellObj.player = activePlayerNumber;
        let pointsEarned = _scoreKeeper.setScoreForMove( col, row, activePlayerNumber );
        let move = new Move( row, col, pointsEarned );

        _activePlayer.moves.push( move );

        // check if next player has any moves based on board state
        // no, declare victory, else continue

        // update board
        renderGameBoard();
        updateScoreBoards( _players );

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
            // change active player in UI
            console.log( "It's now player %d's turn", otherPlayerNumber );

    } );






    function updateActivePlayer( newPlayerNumber ) {
        let playerIndex = newPlayerNumber === 1 ? 0 : 1;
        _activePlayer = _players[ playerIndex ];
    }

    function updateScoreBoards( players ) {
        players.forEach( function ( player ) {

            player.score = _scoreKeeper.getScoreForPlayer( player.number );

            $( ".player-" + player.number + " .score" ).html( player.score );
            $( ".player-" + player.number + " .moves" ).html( player.moves.length );
        } );
    }

    function setNewGameValues() {
        gameBoard.rows[ 3 ][ 3 ].player = 1;
        gameBoard.rows[ 4 ][ 3 ].player = 2;
        gameBoard.rows[ 3 ][ 4 ].player = 2;
        gameBoard.rows[ 4 ][ 4 ].player = 1;
    }

    function getPlayerNumbers() {
        let otherPlayerIndex = _activePlayer.number === 1 ? 1 : 0;
        return [ _activePlayer.number, _players[ otherPlayerIndex ].number ];
    }

    setNewGameValues();
    renderGameBoard();
    updateScoreBoards( _players );
})();
