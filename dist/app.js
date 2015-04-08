"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * Created by Eric on 4/5/2015.
 */

var ScoreKeeper = (function () {
    function ScoreKeeper(gameBoard) {
        _classCallCheck(this, ScoreKeeper);

        this.gameBoard = gameBoard;
        this.numRows = gameBoard.rows.length;
        this.numCols = gameBoard.rows[0].length;
    }

    _createClass(ScoreKeeper, [{
        key: "playerHasNextMove",
        value: function playerHasNextMove(playerNumber) {
            var self = this;
            self.getEmptyCells().forEach(function (cell) {
                if (self.setScoreForMove(cell.col, cell.row, playerNumber) > 0) {
                    return true;
                }
            });

            return false;
        }
    }, {
        key: "getGameBoardState",
        value: function getGameBoardState(currentPlayerNumber, nextPlayerNumber) {
            var nextPlayerHasMove = this.playerHasNextMove(nextPlayerNumber),
                currentPlayerHasMove = this.playerHasNextMove(currentPlayerNumber),
                gameOver = !nextPlayerHasMove && !currentPlayerHasMove;

            return [nextPlayerHasMove, currentPlayerHasMove, gameOver];
        }
    }, {
        key: "setScoreForMove",
        value: function setScoreForMove(x, y, player) {
            var hits = [];

            hits = hits.concat(this.searchUp(x, y, player));
            hits = hits.concat(this.searchUpAndRight(x, y, player));
            hits = hits.concat(this.searchRight(x, y, player));
            hits = hits.concat(this.searchDownAndRight(x, y, player));
            hits = hits.concat(this.searchDown(x, y, player));
            hits = hits.concat(this.searchDownAndLeft(x, y, player));
            hits = hits.concat(this.searchLeft(x, y, player));
            hits = hits.concat(this.searchUpAndLeft(x, y, player));

            console.log("POINTS EARNED: %d", hits.length);
            console.log("HITS: ", hits);
            return hits;
        }
    }, {
        key: "getFlatGameBoard",
        value: function getFlatGameBoard() {
            return Array.prototype.concat.apply([], this.gameBoard.rows);
        }
    }, {
        key: "getEmptyCells",
        value: function getEmptyCells() {
            return this.getFlatGameBoard().filter(function (c) {
                return c.player === 0;
            });
        }
    }, {
        key: "calculatePoints",
        value: function calculatePoints(row, col, rowInc, colInc, player) {
            var cells = [],
                self = this;

            if (row === -1 || col === -1 || row === 8 || col === 8) {
                return [];
            }

            function getScore(_x, _x2) {
                var _again = true;

                _function: while (_again) {
                    _self$checkCell = _self$checkCell2 = reachedEdge = isEmpty = isPoint = cell = undefined;
                    _again = false;
                    var r = _x,
                        c = _x2;

                    var _self$checkCell = self.checkCell(r, c, player);

                    var _self$checkCell2 = _slicedToArray(_self$checkCell, 4);

                    var reachedEdge = _self$checkCell2[0];
                    var isEmpty = _self$checkCell2[1];
                    var isPoint = _self$checkCell2[2];
                    var cell = _self$checkCell2[3];

                    if (reachedEdge || isEmpty) {
                        return [];
                    } else if (isPoint) {
                        console.log("HIT! ", cell);
                        cells.push(cell);
                        _x = r + rowInc;
                        _x2 = c + colInc;
                        _again = true;
                        continue _function;
                    } else {
                        console.log("Returning cells: ", cells);
                        return cells;
                    }
                }
            }

            return getScore(row, col);
        }
    }, {
        key: "checkCell",
        value: function checkCell(row, col, player) {
            var hasReachedEdge = row === this.numRows - 1 || col === this.numCols - 1,
                cell = this.gameBoard.rows[row][col],
                isEmptyCell = cell.player === 0,
                isPoint = cell.player !== player && !isEmptyCell;

            return [hasReachedEdge, isEmptyCell, isPoint, cell];
        }
    }, {
        key: "getScoreForPlayer",
        value: function getScoreForPlayer(playerNumber) {
            return this.getFlatGameBoard().reduce(function (score, cell) {
                if (cell.player === playerNumber) {
                    score++;
                }
                return score;
            }, 0);
        }
    }, {
        key: "searchRight",
        value: function searchRight(startingX, startingY, player) {
            return this.calculatePoints(startingY, startingX + 1, 0, 1, player);
        }
    }, {
        key: "searchLeft",
        value: function searchLeft(startingX, startingY, player) {
            return this.calculatePoints(startingY, startingX - 1, 0, -1, player);
        }
    }, {
        key: "searchUp",
        value: function searchUp(startingX, startingY, player) {
            return this.calculatePoints(startingY + 1, startingX, 1, 0, player);
        }
    }, {
        key: "searchDown",
        value: function searchDown(startingX, startingY, player) {
            return this.calculatePoints(startingY - 1, startingX, -1, 0, player);
        }
    }, {
        key: "searchUpAndRight",
        value: function searchUpAndRight(startingX, startingY, player) {
            return this.calculatePoints(startingY + 1, startingX + 1, 1, 1, player);
        }
    }, {
        key: "searchUpAndLeft",
        value: function searchUpAndLeft(startingX, startingY, player) {
            return this.calculatePoints(startingY + 1, startingX - 1, 1, -1, player);
        }
    }, {
        key: "searchDownAndRight",
        value: function searchDownAndRight(startingX, startingY, player) {
            return this.calculatePoints(startingY - 1, startingX + 1, -1, 1, player);
        }
    }, {
        key: "searchDownAndLeft",
        value: function searchDownAndLeft(startingX, startingY, player) {
            return this.calculatePoints(startingY - 1, startingX - 1, -1, -1, player);
        }
    }]);

    return ScoreKeeper;
})();
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

var Move = function Move(row, col, points) {
    _classCallCheck(this, Move);

    this.x = col;
    this.y = row;
    this.pointValue = points;
};

var Cell = function Cell(row, col) {
    _classCallCheck(this, Cell);

    this.row = row;
    this.col = col;
    this.player = 0;
    this.potentialTarget = false;
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
        _playerOne = new Player(1),
        _playerTwo = new Player(2),
        _activePlayer = _playerOne,
        _players = [_playerOne, _playerTwo],
        _scoreKeeper = undefined;

    var rowNum = 8;
    var colNum = 8;

    for (var i = 0; i < rowNum; i++) {
        var row = [];
        for (var j = 0; j < colNum; j++) {
            row.push(new Cell(i, j));
        }
        gameBoard.rows.push(row);
    }

    _scoreKeeper = new ScoreKeeper(gameBoard);

    function renderGameBoard() {
        console.log("Gameboard: ", gameBoard);
        var html = "";
        gameBoard.rows.forEach(function (row, i) {
            row.forEach(function (cell, j) {
                html += "<div class='cell' data-target=\"" + cell.potentialTarget + "\" data-player-num=\"" + cell.player + "\" data-row-num='" + i + "' data-col-num='" + j + "'>" + cell.player + "</div>";
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
        var isTarget = $cell.data("target");

        var _getPlayerNumbers = getPlayerNumbers();

        var _getPlayerNumbers2 = _slicedToArray(_getPlayerNumbers, 2);

        var activePlayerNumber = _getPlayerNumbers2[0];
        var otherPlayerNumber = _getPlayerNumbers2[1];

        // calculate points and set cell values
        var hits = _scoreKeeper.setScoreForMove(col, row, activePlayerNumber);
        var pointsEarned = hits.length;

        if (!isTarget || pointsEarned === 0) return;

        cellObj.player = activePlayerNumber;
        hits.forEach(function (h) {
            h.player = activePlayerNumber;
        });

        var move = new Move(row, col, pointsEarned);

        _activePlayer.moves.push(move);

        // check if next player has any moves based on board state
        // no, declare victory, else continue
        var potentialNextMoves = getPotentialNextMovesForNextPlayer();

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

        updateActivePlayer(otherPlayerNumber);
        renderGameBoard();
        updateScoreBoards(_players);

        if (potentialNextMoves) {
            console.log("It's now player %d's turn", otherPlayerNumber);
        } else {
            console.log("No next moves for player %d", otherPlayerNumber);
        }
    });

    function getPotentialNextMovesForNextPlayer() {
        var flatGamBoard = _scoreKeeper.getFlatGameBoard();
        flatGamBoard.forEach(function (cell) {
            cell.potentialTarget = false;
        });

        var activePlayerCells = flatGamBoard.filter(function (cell) {
            return cell.player === _activePlayer.number;
        });

        console.log("Active player cells: ", activePlayerCells);

        var potentialNextMoves = [];
        var rows = gameBoard.rows;
        activePlayerCells.forEach(function (c) {
            var above = rows[c.row + 1][c.col];
            if (moveEarnsPoints(above)) {
                above.potentialTarget = true;
                potentialNextMoves.push(above);
            }

            var aboveRight = rows[c.row + 1][c.col + 1];
            if (moveEarnsPoints(aboveRight)) {
                aboveRight.potentialTarget = true;
                potentialNextMoves.push(aboveRight);
            }

            var aboveLeft = rows[c.row + 1][c.col - 1];
            if (moveEarnsPoints(aboveLeft)) {
                aboveLeft.potentialTarget = true;
                potentialNextMoves.push(aboveLeft);
            }

            var left = rows[c.row][c.col - 1];
            if (moveEarnsPoints(left)) {
                left.potentialTarget = true;
                potentialNextMoves.push(left);
            }

            var right = rows[c.row][c.col + 1];
            if (moveEarnsPoints(right)) {
                right.potentialTarget = true;
                potentialNextMoves.push(right);
            }

            var below = rows[c.row - 1][c.col];
            if (moveEarnsPoints(below)) {
                below.potentialTarget = true;
                potentialNextMoves.push(below);
            }

            var belowRight = rows[c.row - 1][c.col + 1];
            if (moveEarnsPoints(belowRight)) {
                belowRight.potentialTarget = true;
                potentialNextMoves.push(belowRight);
            }

            var belowLeft = rows[c.row - 1][c.col - 1];
            if (moveEarnsPoints(belowLeft)) {
                belowLeft.potentialTarget = true;
                potentialNextMoves.push(belowLeft);
            }

            return potentialNextMoves;
        });
    }

    function moveEarnsPoints(cell) {
        var _getPlayerNumbers3 = getPlayerNumbers();

        var _getPlayerNumbers32 = _slicedToArray(_getPlayerNumbers3, 2);

        var x = _getPlayerNumbers32[0];
        var otherPlayerNumber = _getPlayerNumbers32[1];
        var hits = _scoreKeeper.setScoreForMove(cell.col, cell.row, otherPlayerNumber);
        return cell.player === 0 && hits.length > 0;
    }

    function updateActivePlayer(newPlayerNumber) {
        var playerIndex = newPlayerNumber === 1 ? 0 : 1;
        _activePlayer = _players[playerIndex];
    }

    function updateScoreBoards(players) {
        players.forEach(function (player) {
            var $playerSoreBoard = $(".player-" + player.number);

            player.score = _scoreKeeper.getScoreForPlayer(player.number);

            $(".player-" + player.number + " .score").html(player.score);
            $(".player-" + player.number + " .moves").html(player.moves.length);

            if (player.number === _activePlayer.number) {
                $playerSoreBoard.addClass("active");
            } else {
                $playerSoreBoard.removeClass("active");
            }
        });
    }

    function setNewGameValues() {
        gameBoard.rows[3][3].player = 1;
        gameBoard.rows[4][3].player = 2;
        gameBoard.rows[3][4].player = 2;
        gameBoard.rows[4][4].player = 1;

        // mark player one potential targets
        gameBoard.rows[2][4].potentialTarget = true;
        gameBoard.rows[3][5].potentialTarget = true;
        gameBoard.rows[4][2].potentialTarget = true;
        gameBoard.rows[5][3].potentialTarget = true;
    }

    function getPlayerNumbers() {
        var otherPlayerIndex = _activePlayer.number === 1 ? 1 : 0;
        return [_activePlayer.number, _players[otherPlayerIndex].number];
    }

    setNewGameValues();
    renderGameBoard();
    updateScoreBoards(_players);

    console.log("Empty cells: ", _scoreKeeper.getEmptyCells());
})();
//# sourceMappingURL=app.js.map