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
        _players = [ _playerOne, _playerTwo ];

    const rowNum = 8;
    const colNum = 8;

    for ( let i = 0; i < rowNum; i++ ) {
        let row = [];
        for ( let j = 0; j < colNum; j++ ) {
            row.push( new Cell( i, j ) );
        }
        gameBoard.rows.push( row );
    }


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


        // calculate points and set cell values
        cellObj.player = activePlayerNumber;
        let pointsEarned = setScoreForMove( col, row, activePlayerNumber );
        let move = new Move( row, col, pointsEarned );

        _activePlayer.moves.push( move );
        _activePlayer.score += move.pointValue;

        // check if next player has any moves based on board state
        // no, declare victory, else continue

        // update board
        renderGameBoard();
        updateScoreBoards( _players );

        // update state
        updateActivePlayer( otherPlayerNumber );
        console.log( "It's now player %d's turn", otherPlayerNumber );
    } );

    function updateActivePlayer( newPlayerNumber ) {
        let playerIndex = newPlayerNumber === 1 ? 0 : 1;
        _activePlayer = _players[ playerIndex ];
    }

    function updateScoreBoards( players ) {
        players.forEach( function ( player ) {
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

    function setScoreForMove( x, y, player ) {
        let points = 0;

        points += searchUp( x, y, player );
        points += searchUpAndRight( x, y, player );
        points += searchRight( x, y, player );
        points += searchDownAndRight( x, y, player );
        points += searchDown( x, y, player );
        points += searchDownAndLeft( x, y, player );
        points += searchLeft( x, y, player );
        points += searchUpAndLeft( x, y, player );

        console.log( "POINTS EARNED: %d", points );
        return points;
    }

    function getPlayerNumbers() {
        let otherPlayerIndex = _activePlayer.number === 1 ? 1 : 0;
        return [ _activePlayer.number, _players[ otherPlayerIndex ].number ];
    }

    function calculatePoints( row, col, rowInc, colInc, player ) {
        let cells = [];

        if ( row === -1 || col === -1 ) {
            return 0;
        }

        function getScore( r, c ) {
            console.log( "getScore: row: %d col: %d player: %d", r, c, player );
            let [ reachedEdge, isEmpty, isPoint, cell ] = checkCell( r, c, player );

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

    function checkCell( row, col, player ) {
        let hasReachedEdge = ( row === rowNum || col === colNum );

        let cell = gameBoard.rows[ row ][ col ],
            isEmptyCell = cell.player === 0,
            isPoint = cell.player !== player && !isEmptyCell;

        return [ hasReachedEdge, isEmptyCell, isPoint, cell ];
    }

    function searchRight( startingX, startingY, player ) {
        return calculatePoints( startingY, startingX + 1, 0, 1, player );
    }

    function searchLeft( startingX, startingY, player ) {
        return calculatePoints( startingY, startingX - 1, 0, -1, player );
    }

    function searchUp( startingX, startingY, player ) {
        return calculatePoints( startingY + 1, startingX, 1, 0, player );
    }

    function searchDown( startingX, startingY, player ) {
        return calculatePoints( startingY - 1, startingX, -1, 0, player );
    }

    function searchUpAndRight( startingX, startingY, player ) {
        return calculatePoints( startingY + 1, startingX + 1, 1, 1, player );
    }

    function searchUpAndLeft( startingX, startingY, player ) {
        return calculatePoints( startingY + 1, startingX - 1, 1, -1, player );
    }

    function searchDownAndRight( startingX, startingY, player ) {
        return calculatePoints( startingY - 1, startingX + 1, -1, 1, player );
    }

    function searchDownAndLeft( startingX, startingY, player ) {
        return calculatePoints( startingY - 1, startingX - 1, -1, -1, player );
    }


    setNewGameValues();
    renderGameBoard();
    updateScoreBoards( _players );
})();
