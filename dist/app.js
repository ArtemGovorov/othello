"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Created by Eric on 4/4/2015.
 */

var Player = function Player(num) {
    _classCallCheck(this, Player);

    this.number = num;
    this.score = 2;
    this.moves = [];
};

var Move = function Move(num, points) {
    _classCallCheck(this, Move);

    this.number = num;
    this.pointValue = points;
};

var Cell = function Cell(row, col) {
    _classCallCheck(this, Cell);

    this.row = row;
    this.col = col;
    this.player = 0;
    this.value = "" + this.row + "-" + this.col;
};
/**
 * Created by Eric on 4/4/2015.
 */

"use strict";

(function () {
    var gameBoard = {
        rows: []
    },
        _totalMoves = 1,
        _playerOne = new Player(1),
        _playerTwo = new Player(2),
        _activePlayer = _playerOne,
        _players = [_playerOne, _playerTwo];

    var rowNum = 8;
    var colNum = 8;

    for (var i = 0; i < rowNum; i++) {
        var row = [];
        for (var j = 0; j < colNum; j++) {
            row.push(new Cell(i, j));
        }
        gameBoard.rows.push(row);
    }

    function renderGameBoard() {
        console.log("Gameboard: ", gameBoard);
        var html = "";
        gameBoard.rows.forEach(function (row, i) {
            row.forEach(function (cell, j) {
                html += "<div class='cell' data-player-num=\"" + cell.player + "\" data-row-num='" + i + "' data-col-num='" + j + "'>" + cell.player + "</div>";
            });
        });

        $(".game-board").html(html);
    }

    $(".game-board").on("click", ".cell", function () {
        var $cell = $(this);
        var row = +$cell.data("row-num");
        var col = +$cell.data("col-num");
        var player = +$cell.data("player-num");
        var cellObj = gameBoard.rows[row][col];

        // calculate points and set cell values
        cellObj.player = _activePlayer.number;
        var move = new Move(++_totalMoves, 1);
        _activePlayer.moves.push(move);
        _activePlayer.score += move.pointValue;

        // update board
        renderGameBoard();
        updateScoreBoards(_players);

        // update state
        updateActivePlayer(_activePlayer.number);

        console.log("Cell Object: ", cellObj);
        console.log("It's now player %d's turn", _activePlayer.number);
    });

    function updateActivePlayer(currentPlayer) {
        var playerIndex = currentPlayer === 1 ? 1 : 0;
        _activePlayer = _players[playerIndex];
    }

    function updateScoreBoards(players) {
        players.forEach(function (player) {
            $(".player-" + player.number + " .score").html(player.score);
            $(".player-" + player.number + " .moves").html(player.moves.length);
        });
    }

    function setNewGameValues() {
        gameBoard.rows[3][3].player = 1;
        gameBoard.rows[4][3].player = 2;
        gameBoard.rows[3][4].player = 2;
        gameBoard.rows[4][4].player = 1;
    }

    setNewGameValues();
    renderGameBoard();
    updateScoreBoards(_players);
})();
//# sourceMappingURL=app.js.map