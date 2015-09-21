/**
 * Created by Eric on 4/5/2015.
 */
describe( "ScoreKeeper", function () {
    var _sk, _bm;

    beforeEach( function () {
        _bm = new BoardManager();
        _sk = new ScoreKeeper(_bm);
    } );

    describe( "getFlatGameboard", function () {
        it( "should return a matrix as a flat one dimensional array", function () {
            const gb = {
                rows: [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9]
                ]
            };
            const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            expect( _sk.getFlatGameBoard( gb ) ).toEqual( expected );
        } );
    } );

    describe( "getEmptyCells", function () {
        it( "should return only the cells of the game board that are unoccupied", function () {
            const expected = [{ player: 0 }, { player: 0 }, { player: 0 }, { player: 0 }];
            const gb = {
                rows: [
                    [{ player: 1 }, { player: 1 }, { player: 0 }],
                    [{ player: 1 }, { player: 1 }, { player: 0 }],
                    [{ player: 1 }, { player: 0 }, { player: 0 }]
                ]
            };
            const sut = _sk.getEmptyCells( gb );

            expect( sut.length ).toBe( 4 );
            expect( sut ).toEqual( expected );
        } );
    } );

    describe( "getScoreForPlayer", function () {
        it( "should return the number of cells of the game board occupied by the player", function () {
            const gb = {
                rows: [
                    [{ player: 1 }, { player: 1 }, { player: 0 }],
                    [{ player: 1 }, { player: 1 }, { player: 0 }],
                    [{ player: 1 }, { player: 0 }, { player: 0 }]
                ]
            };
      
            const sut = _sk.getScoreForPlayer( 1, gb );
            expect( sut ).toBe( 5 );
        } );
    } );

    describe( "resetMoveScoreRatings", function () {
        it("should set isHighestScoring property to false on all cells", function() {
            const expected = {
                rows: [
                    [
                        { player: 1, isHighestScoring: false }, { player: 1, isHighestScoring: false }, {
                            player: 0,
                            isHighestScoring: false
                        }
                    ],
                    [
                        { player: 1, isHighestScoring: false }, { player: 1, isHighestScoring: false }, {
                            player: 0,
                            isHighestScoring: false
                        }
                    ],
                    [
                        { player: 1, isHighestScoring: false }, { player: 0, isHighestScoring: false }, {
                            player: 0,
                            isHighestScoring: false
                        }
                    ]
                ]
            };
            const gb = {
                rows: [
                    [{ player: 1, isHighestScoring: true }, { player: 1 }, { player: 0 }],
                    [{ player: 1 }, { player: 1 }, { player: 0 }],
                    [{ player: 1 }, { player: 0 }, { player: 0 }]
                ]
            };
            const sut = _sk.resetMoveScoreRatings(gb);
            expect(sut).toEqual(expected);
        });
    } );

    describe( "checkCell", function () {
        it( "should return an object with the results from scoring that location for player", function () {
            var sut = _sk.checkCell( { player: 2, row: 2, col: 1 }, 1 );
            const expected = {
                isValidMove: true,
                isEmpty: false,
                isPoint: true
            };
            expect( sut ).toEqual( expected );

        } );

        it( "should return false for valid move if coords are out of bounds", function () {
            const sut = _sk.checkCell( { player: 2, row: 8, col: 1 }, 1 );
            const expected = {
                isValidMove: false,
                isEmpty: false,
                isPoint: false
            };
            expect( sut ).toEqual( expected );

            var sut2 = _sk.checkCell( { player: 2, row: 1, col: -1 }, 1 );

            expect( sut2 ).toEqual( expected );
        } );
    } );

    describe( "search*", function () {
        var gb;

        beforeEach( function () {
            spyOn( _bm, "isValidMove" );
            gb = {
                rows: [
                    [{ player: 1, row: 0, col: 0 }, { player: 1, row: 0, col: 1 }, { player: 0, row: 0, col: 2 }],
                    [{ player: 1, row: 1, col: 0 }, { player: 1, row: 1, col: 1 }, { player: 0, row: 1, col: 2 }],
                    [{ player: 1, row: 2, col: 0 }, { player: 0, row: 2, col: 1 }, { player: 0, row: 2, col: 2 }]
                ]
            };
        } );

        it( "searchRight should search in the right direction", function () {
            _sk.searchRight( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 2, 1 );
        } );

        it( "searchLeft should search in the right direction", function () {
            _sk.searchLeft( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 0, 1 );
        } );

        it( "searchUp should search in the right direction", function () {
            _sk.searchUp( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 1, 0 );
        } );

        it( "searchDown should search in the right direction", function () {
            _sk.searchDown( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 1, 2 );
        } );

        it( "searchDownAndRight should search in the right direction", function () {
            _sk.searchDownAndRight( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 2, 2 );
        } );

        it( "searchDownAndLeft should search in the right direction", function () {
            _sk.searchDownAndLeft( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 0, 2 );
        } );

        it( "searchUpAndRight should search in the right direction", function () {
            _sk.searchUpAndRight( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 2, 0 );
        } );

        it( "searchUpAndLeft should search in the right direction", function () {
            _sk.searchUpAndLeft( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 0, 0 );
        } );
    } );

    describe( "searchAt", function () {
        it( "should return an empty array if passed an invalid cell location", function () {
            var sut = _sk.searchAt( 0, 0, 0, 0, 1, {
                rows: [
                    [{ row: -1, col: 1 }]
                ]
            } );

            expect( sut ).toEqual( [] );
        } );
    } );
} );
