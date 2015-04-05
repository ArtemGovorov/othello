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

var Move = function Move(row, col, player) {
    _classCallCheck(this, Move);

    this.x = col;
    this.y = row;
    this.player = player;
    this.pointValue = 0;
};

var Cell = function Cell(row, col) {
    _classCallCheck(this, Cell);

    this.row = row;
    this.col = col;
    this.player = 0;
    this.value = "" + this.row + "-" + this.col;
};
"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

/**
 * Created by Eric on 4/4/2015.
 */

(function () {
    var gameBoard = {
        rows: []
    },
        _moves = [],
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

        var _getPlayerNumbers = getPlayerNumbers();

        var _getPlayerNumbers2 = _slicedToArray(_getPlayerNumbers, 2);

        var activePlayerNumber = _getPlayerNumbers2[0];
        var otherPlayerNumber = _getPlayerNumbers2[1];

        // calculate points and set cell values
        cellObj.player = activePlayerNumber;
        var move = new Move(row, col, activePlayerNumber);
        var pointsEarned = setScoreForMove(move.x, move.y, move.player);
        move.pointValue = pointsEarned;

        _moves.push(move);
        _activePlayer.moves.push(move);
        _activePlayer.score += move.pointValue;

        // check if next player has any moves based on board state
        // no, declare victory, else continue

        // update board
        renderGameBoard();
        updateScoreBoards(_players);

        // update state
        updateActivePlayer(otherPlayerNumber);

        console.log("Cell Object: ", cellObj);
        console.log("It's now player %d's turn", otherPlayerNumber);
    });

    function updateActivePlayer(otherPlayerNumber) {
        var playerIndex = otherPlayerNumber === 1 ? 0 : 1;
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

    function setScoreForMove(x, y, player) {
        var points = 0;

        points += searchUp(x, y, player);
        points += searchUpAndRight(x, y, player);
        points += searchRight(x, y, player);
        points += searchDownAndRight(x, y, player);
        points += searchDown(x, y, player);
        points += searchDownAndLeft(x, y, player);
        points += searchLeft(x, y, player);
        points += searchUpAndLeft(x, y, player);

        console.log("POINTS EARNED: %d", points);
        return points;
    }

    function getPlayerNumbers() {
        var otherPlayerIndex = _activePlayer.number === 1 ? 1 : 0;
        return [_activePlayer.number, _players[otherPlayerIndex].number];
    }

    function calculatePoints(row, col, rowInc, colInc, player) {
        var cells = [];

        function getScore(_x, _x2) {
            var _again = true;

            _function: while (_again) {
                _checkCell = _checkCell2 = reachedEdge = isEmpty = isPoint = cell = undefined;
                _again = false;
                var r = _x,
                    c = _x2;

                console.log("getScore: row: %d col: %d player: %d", r, c, player);

                var _checkCell = checkCell(r, c, player);

                var _checkCell2 = _slicedToArray(_checkCell, 4);

                var reachedEdge = _checkCell2[0];
                var isEmpty = _checkCell2[1];
                var isPoint = _checkCell2[2];
                var cell = _checkCell2[3];

                if (reachedEdge || isEmpty) {
                    cells = [];
                    return 0;
                } else if (isPoint) {
                    cells.push(cell);
                    _x = r + rowInc;
                    _x2 = c + colInc;
                    _again = true;
                    continue _function;
                } else {
                    cells.forEach(function (cell) {
                        cell.player = player;
                    });
                    return cells.length;
                }
            }
        }

        return getScore(row, col);
    }

    function checkCell(row, col, player) {
        var hasReachedEdge = row === rowNum || col === colNum;

        var cell = gameBoard.rows[row][col],
            isEmptyCell = cell.player === 0,
            isPoint = cell.player !== player && !isEmptyCell;

        return [hasReachedEdge, isEmptyCell, isPoint, cell];
    }

    function searchRight(startingX, startingY, player) {
        console.log("searchRight x: %d y: %d player: %d", startingX, startingY, player);

        return calculatePoints(startingY, startingX + 1, 0, 1, player);
    }

    function searchLeft(startingX, startingY, player) {
        // decrement startingX while cells belong to other player
        return 0;
    }

    function searchUp(startingX, startingY, player) {
        // increment startingY while cells belong to other player
        return 0;
    }

    function searchDown(startingX, startingY, player) {
        // decrement startingY while cells belong to other player
        return 0;
    }

    function searchUpAndRight(startingX, startingY, player) {
        // increment startingX and startingY while cells belong to other player
        return 0;
    }

    function searchUpAndLeft(startingX, startingY, player) {
        // decrement startingX and increment startingY while cells belong to other player
        return 0;
    }

    function searchDownAndRight(startingX, startingY, player) {
        // decrement startingY and increment startingX while cells belong to other player
        return 0;
    }

    function searchDownAndLeft(startingX, startingY, player) {
        // decrement startingY and startingX while cells belong to other player
        return 0;
    }

    setNewGameValues();
    renderGameBoard();
    updateScoreBoards(_players);
})();
//# sourceMappingURL=app.js.map