describe( "BoardManager", function () {
    var _sk, _bm;

    beforeEach( () => {
        _bm = new BoardManager();
        _sk = new ScoreKeeper( _bm );
    } );

    describe( "getFlatGameboard", () => {
        it( "should return a matrix as a flat one dimensional array", function () {
            const gb = {
                rows: [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9]
                ]
            };
            const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            expect( _bm.getFlatGameBoard( gb ) ).toEqual( expected );
        } );
    } );

    describe( "getEmptyCells", () => {
        it( "should return only the cells of the game board that are unoccupied", function () {
            const expected = [{ player: 0 }, { player: 0 }, { player: 0 }, { player: 0 }];
            const gb = {
                rows: [
                    [{ player: 1 }, { player: 1 }, { player: 0 }],
                    [{ player: 1 }, { player: 1 }, { player: 0 }],
                    [{ player: 1 }, { player: 0 }, { player: 0 }]
                ]
            };
            const sut = _bm.getEmptyCells( gb );

            expect( sut.length ).toBe( 4 );
            expect( sut ).toEqual( expected );
        } );
    } );

    describe( "getInitialGameboard", () => {
        it( "should return a gameboard with the initial center squares occupied", () => {
            const gb = _bm.getInitialGameboard();

            expect( gb.rows[3][3].player ).toBe( 1 );
            expect( gb.rows[4][4].player ).toBe( 1 );
            expect( gb.rows[3][4].player ).toBe( 2 );
            expect( gb.rows[4][3].player ).toBe( 2 );
        } )
    } );

} );