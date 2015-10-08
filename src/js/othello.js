
/**
 * Created by Eric on 4/4/2015.
 */

(() => {
    let _playerOne = new Player( 1 ),
        _playerTwo = new Player( 2 ),
        _activePlayer = _playerOne,
        _players = [ _playerOne, _playerTwo ],
        _scoreKeeper, _gameOver = false,
        _startTime = new Date(),
        _repo = new Repository(),
        _boardManager = new BoardManager(),
        gameBoard = _boardManager.getInitialGameboard(),
        _lastMoveTime = new Date();

   

    _scoreKeeper = new ScoreKeeper( _boardManager );

    function renderGameBoard() {
        let html = '';

        gameBoard.rows.forEach( ( row, i ) => {
            row.forEach( ( cell, j ) => {
                html += `<div class='cell' data-target="${cell.potentialTarget}" data-is-highest-scoring-move="${cell.isHighestScoring}" data-player-num="${cell.player}" data-row-num='${i}' data-col-num='${j}'>${cell.player}</div>`;
            } );
        } );

        $( ".game-board" ).html( html );
    }

    var recordTimeForMove = function ( move, matchStartTime ) {
        let now = new Date();

        move.time = now - _lastMoveTime;
        move.timeInMatch = now - matchStartTime;
        _lastMoveTime = now;

        _repo.recordMove( {
            players: _players,
            gameBoard: gameBoard,
            timestamp: now - matchStartTime,
            gameCompleted: _gameOver
        } );
    };

    $( ".game-board" ).on( "click", ".cell", function () {
        let $cell = $( this );
        let row = +$cell.data( "row-num" );
        let col = +$cell.data( "col-num" );
        let player = +$cell.data( "player-num" );
        let isHighestScoring = $cell.data("is-highest-scoring-move");
        let cellObj = gameBoard.rows[ row ][ col ];
        let isTarget = $cell.data( "target" );
        let [ activePlayerNumber, otherPlayerNumber ] = getPlayerNumbers();

        if ( !isTarget )
            return;

        // calculate points and set cell values
        let hits = _scoreKeeper.setScoreForMove( col, row, activePlayerNumber, gameBoard );
        let pointsEarned = hits.length;

        if ( pointsEarned === 0 )
            return;

        let move = new Move( row, col, pointsEarned, activePlayerNumber, isHighestScoring );
        gameBoard.moves.push( move );

        cellObj.player = activePlayerNumber;

        hits.forEach( function ( h ) {
            h.player = activePlayerNumber
        } );

        recordTimeForMove( move, _startTime );

        // check if next player has any moves based on board state
        // no, declare victory, else continue
        let potentialNextMoves = getPotentialNextMovesForNextPlayer();
        console.log( "Potential Next Moves: ", potentialNextMoves );
        let highestScoringNextMove = potentialNextMoves.sort( ( c1, c2 ) => {
            return c2.pointValue - c1.pointValue;
        } )[ 0 ];

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
        _scoreKeeper.resetMoveScoreRatings( gameBoard );

        if ( potentialNextMoves ) {
            console.log( "It's now player %d's turn", otherPlayerNumber );
        } else {
            console.log( "No next moves for player %d", otherPlayerNumber );
        }


    } );

    function getPotentialNextMovesForNextPlayer() {
        let flatGamBoard = _scoreKeeper.getFlatGameBoard( gameBoard );
        flatGamBoard.forEach( ( cell ) => {
            cell.potentialTarget = false;
        } );

        let activePlayerCells = flatGamBoard
            .filter( ( cell ) => {
                return cell.player === _activePlayer.number;
            } );

        let potentialNextMoves = [];

        activePlayerCells.forEach( function ( c ) {
            let above = _boardManager.tryGetCell( c.col, c.row - 1, gameBoard );
            scoreMove( above, potentialNextMoves );

            let aboveRight = _boardManager.tryGetCell( c.col + 1, c.row - 1, gameBoard );
            scoreMove( aboveRight, potentialNextMoves );

            let aboveLeft = _boardManager.tryGetCell( c.col - 1, c.row - 1, gameBoard );
            scoreMove( aboveLeft, potentialNextMoves );

            let left = _boardManager.tryGetCell( c.col - 1, c.row, gameBoard );
            scoreMove( left, potentialNextMoves );

            let right = _boardManager.tryGetCell( c.col + 1, c.row, gameBoard );
            scoreMove( right, potentialNextMoves );

            let below = _boardManager.tryGetCell( c.col, c.row + 1, gameBoard );
            scoreMove( below, potentialNextMoves );

            let belowRight = _boardManager.tryGetCell( c.col + 1, c.row + 1, gameBoard );
            scoreMove( belowRight, potentialNextMoves );

            let belowLeft = _boardManager.tryGetCell( c.col - 1, c.row + 1, gameBoard );
            scoreMove( belowLeft, potentialNextMoves );
        } );

        return potentialNextMoves;
    }

    function moveEarnsPoints( cell ) {
        let [x,  otherPlayerNumber ] = getPlayerNumbers(),
            hits = _scoreKeeper.setScoreForMove( cell.col, cell.row, otherPlayerNumber, gameBoard ),
            points = hits.length,
            isHit = cell.player === 0 && points > 0;

        return { isHit: isHit, points: points };
    }

    function scoreMove( move, potentialNextMoves ) {
        if ( move === null ) return;

        let moveResult = moveEarnsPoints( move );
       // console.log( "isHit: %d %d points: %d", move.row, move.col, moveResult.points );
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

            player.score = _scoreKeeper.getScoreForPlayer( player.number, gameBoard );

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
        let potentialMoves = [
            gameBoard.rows[ 2 ][ 4 ],
            gameBoard.rows[ 3 ][ 5 ],
            gameBoard.rows[ 4 ][ 2 ],
            gameBoard.rows[ 5 ][ 3 ]
        ];

        potentialMoves.forEach( function ( cell ) {
            cell.potentialTarget = true;
        } );
    }

    function getPlayerNumbers() {
        let otherPlayerIndex = _activePlayer.number === 1 ? 1 : 0;
        return [ _activePlayer.number, _players[ otherPlayerIndex ].number ];
    }

    setNewGameValues();
    renderGameBoard();
    updateScoreBoards( _players );


    // console.log( "Empty cells: ", _scoreKeeper.getEmptyCells( gameBoard ) );
})();
