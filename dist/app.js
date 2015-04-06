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
            var points = 0;

            points += this.searchUp(x, y, player);
            points += this.searchUpAndRight(x, y, player);
            points += this.searchRight(x, y, player);
            points += this.searchDownAndRight(x, y, player);
            points += this.searchDown(x, y, player);
            points += this.searchDownAndLeft(x, y, player);
            points += this.searchLeft(x, y, player);
            points += this.searchUpAndLeft(x, y, player);

            console.log("POINTS EARNED: %d", points);
            return points;
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
                return 0;
            }

            function getScore(_x, _x2) {
                var _again = true;

                _function: while (_again) {
                    _self$checkCell = _self$checkCell2 = reachedEdge = isEmpty = isPoint = cell = undefined;
                    _again = false;
                    var r = _x,
                        c = _x2;

                    console.log("getScore: row: %d col: %d player: %d", r, c, player);

                    var _self$checkCell = self.checkCell(r, c, player);

                    var _self$checkCell2 = _slicedToArray(_self$checkCell, 4);

                    var reachedEdge = _self$checkCell2[0];
                    var isEmpty = _self$checkCell2[1];
                    var isPoint = _self$checkCell2[2];
                    var cell = _self$checkCell2[3];

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
    }, {
        key: "checkCell",
        value: function checkCell(row, col, player) {
            console.log("checkCell: row %d col %d", row, col);
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

        //let [ nextPlayerHasMove, currentPlayerHasMove, gameOver ] =
        //    _scoreKeeper.getGameBoardState( activePlayerNumber, otherPlayerNumber );

        if (!isTarget) return;

        // calculate points and set cell values
        cellObj.player = activePlayerNumber;
        var pointsEarned = _scoreKeeper.setScoreForMove(col, row, activePlayerNumber);
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
            if (above.player === 0) {
                above.potentialTarget = true;
                potentialNextMoves.push(above);
            }

            var aboveRight = rows[c.row + 1][c.col + 1];
            if (aboveRight.player === 0) {
                aboveRight.potentialTarget = true;
                potentialNextMoves.push(aboveRight);
            }

            var aboveLeft = rows[c.row + 1][c.col - 1];
            if (aboveLeft.player === 0) {
                aboveLeft.potentialTarget = true;
                potentialNextMoves.push(aboveLeft);
            }

            var left = rows[c.row][c.col - 1];
            if (left.player === 0) {
                left.potentialTarget = true;
                potentialNextMoves.push(left);
            }

            var right = rows[c.row][c.col + 1];
            if (right.player === 0) {
                right.potentialTarget = true;
                potentialNextMoves.push(right);
            }

            var below = rows[c.row - 1][c.col];
            if (below.player === 0) {
                below.potentialTarget = true;
                potentialNextMoves.push(below);
            }

            var belowRight = rows[c.row - 1][c.col + 1];
            if (belowRight.player === 0) {
                belowRight.potentialTarget = true;
                potentialNextMoves.push(belowRight);
            }

            var belowLeft = rows[c.row - 1][c.col - 1];
            if (belowLeft.player === 0) {
                belowLeft.potentialTarget = true;
                potentialNextMoves.push(belowLeft);
            }

            return potentialNextMoves;
        });
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