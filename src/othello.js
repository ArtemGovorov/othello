/**
 * Created by Eric on 4/4/2015.
 */

(() => {
    let gameBoard = {
        rows: []
    };

    const rowNum = 8;
    const colNum = 8;

    class Cell {
        constructor( row, col ) {
            this.row = row;
            this.col = col;
            this.value = `${this.row}-${this.col}`;
        }
    }

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
                html += `<div class='cell' data-row-num='${i}' data-col-num='${j}'>${cell.value}</div>`;
            } );

        } );

        $( ".game-board" ).html( html );
    }

    $(".game-board").on("click", ".cell", function () {
        let $cell = $(this);
        let row = +$cell.data("row-num");
        let col = +$cell.data("col-num");
        let cellObj = gameBoard.rows[row][col];

        console.log("You clicked row %d column %d", row, col);
        console.log("Cell Object: ", cellObj);
    });

    renderGameBoard();
})();
