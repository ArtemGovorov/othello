"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Created by Eric on 4/4/2015.
 */

(function () {
    var gameBoard = {
        rows: []
    };

    var rowNum = 8;
    var colNum = 8;

    var Cell = function Cell(row, col) {
        _classCallCheck(this, Cell);

        this.row = row;
        this.col = col;
        this.value = "" + this.row + "-" + this.col;
    };

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
                html += "<div class='cell' data-row-num='" + i + "' data-col-num='" + j + "'>" + cell.value + "</div>";
            });
        });

        $(".game-board").html(html);
    }

    $(".game-board").on("click", ".cell", function () {
        var $cell = $(this);
        var row = +$cell.data("row-num");
        var col = +$cell.data("col-num");
        var cellObj = gameBoard.rows[row][col];

        console.log("You clicked row %d column %d", row, col);
        console.log("Cell Object: ", cellObj);
    });

    renderGameBoard();
})();
//# sourceMappingURL=app.js.map