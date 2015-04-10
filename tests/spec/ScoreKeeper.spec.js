/**
 * Created by Eric on 4/5/2015.
 */
describe( "ScoreKeeper", function () {
    var _sk;

    beforeEach( function () {
        _sk = new ScoreKeeper();
    } );

    describe( "getFlatGameboard", function () {
        it( "should return a matrix as a flat one dimensional array", function () {
            var gb = {
                    rows: [
                        [ 1, 2, 3 ],
                        [ 4, 5, 6 ],
                        [ 7, 8, 9 ]
                    ]
                },
                expected = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

            expect( _sk.getFlatGameBoard( gb ) ).toEqual( expected );
        } );
    } );

    describe( "getEmptyCells", function () {
        it( "should return only the cells of the game board that are unoccupied", function () {
            var gb = {
                    rows: [
                        [ { player: 1 }, { player: 1 }, { player: 0 } ],
                        [ { player: 1 }, { player: 1 }, { player: 0 } ],
                        [ { player: 1 }, { player: 0 }, { player: 0 } ]
                    ]
                },
                sut = _sk.getEmptyCells( gb ),
                expected = [ { player: 0 }, { player: 0 }, { player: 0 }, { player: 0 } ];

            expect( sut.length ).toBe( 4 );
            expect( sut ).toEqual( expected );
        } );
    } );

    describe( "getScoreForPlayer", function () {
        it( "should return the number of cells of the game board occupied by the player", function () {
            var gb = {
                    rows: [
                        [ { player: 1 }, { player: 1 }, { player: 0 } ],
                        [ { player: 1 }, { player: 1 }, { player: 0 } ],
                        [ { player: 1 }, { player: 0 }, { player: 0 } ]
                    ]
                },
                sut = _sk.getScoreForPlayer( 1, gb );

            expect( sut ).toBe( 5 );
        } );
    } );

    describe( "resetMoveScoreRatings", function () {
        it( "should set isHighestScoring property to false on all cells", function () {
            var gb = {
                    rows: [
                        [ { player: 1, isHighestScoring: true }, { player: 1 }, { player: 0 } ],
                        [ { player: 1 }, { player: 1 }, { player: 0 } ],
                        [ { player: 1 }, { player: 0 }, { player: 0 } ]
                    ]
                },
                expected = {
                    rows: [
                        [ { player: 1, isHighestScoring: false }, { player: 1, isHighestScoring: false }, {
                            player: 0,
                            isHighestScoring: false
                        } ],
                        [ { player: 1, isHighestScoring: false }, { player: 1, isHighestScoring: false }, {
                            player: 0,
                            isHighestScoring: false
                        } ],
                        [ { player: 1, isHighestScoring: false }, { player: 0, isHighestScoring: false }, {
                            player: 0,
                            isHighestScoring: false
                        } ]
                    ]
                };

            var sut = _sk.resetMoveScoreRatings( gb );

            expect( sut ).toEqual( expected );
        } )
    } );

    describe( "checkCell", function () {
        it( "should return an object with the results from scoring that location for player", function () {
            var sut = _sk.checkCell( { player: 2, row: 2, col: 1 }, 1 ),
                expected = {
                    isValidMove: true,
                    isEmpty: false,
                    isPoint: true
                };

            expect( sut ).toEqual( expected );

        } );

        it( "should return false for valid move if coords are out of bounds", function () {
            var sut = _sk.checkCell( { player: 2, row: 8, col: 1 }, 1 ),
                expected = {
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
            spyOn( _sk, "isValidMove" );
            gb = {
                rows: [
                    [ { player: 1, row: 0, col: 0 }, { player: 1, row: 0, col: 1 }, { player: 0, row: 0, col: 2 } ],
                    [ { player: 1, row: 1, col: 0 }, { player: 1, row: 1, col: 1 }, { player: 0, row: 1, col: 2 } ],
                    [ { player: 1, row: 2, col: 0 }, { player: 0, row: 2, col: 1 }, { player: 0, row: 2, col: 2 } ]
                ]
            };
        } );

        it( "searchRight should search in the right direction", function () {
            _sk.searchRight( 1, 1, 1, gb );
            expect( _sk.isValidMove ).toHaveBeenCalledWith( { player: 0, row: 1, col: 2 } )
        } );

        it( "searchLeft should search in the right direction", function () {
            _sk.searchLeft( 1, 1, 1, gb );
            expect( _sk.isValidMove ).toHaveBeenCalledWith( { player: 1, row: 1, col: 0 } )
        } );

        it( "searchUp should search in the right direction", function () {
            _sk.searchUp( 1, 1, 1, gb );
            expect( _sk.isValidMove ).toHaveBeenCalledWith( { player: 1, row: 0, col: 1 } )
        } );

        it( "searchDown should search in the right direction", function () {
            _sk.searchDown( 1, 1, 1, gb );
            expect( _sk.isValidMove ).toHaveBeenCalledWith( { player: 0, row: 2, col: 1 } )
        } );

        it( "searchDownAndRight should search in the right direction", function () {
            _sk.searchDownAndRight( 1, 1, 1, gb );
            expect( _sk.isValidMove ).toHaveBeenCalledWith( { player: 0, row: 2, col: 2 } )
        } );

        it( "searchDownAndLeft should search in the right direction", function () {
            _sk.searchDownAndLeft( 1, 1, 1, gb );
            expect( _sk.isValidMove ).toHaveBeenCalledWith( { player: 1, row: 2, col: 0 } )
        } );

        it( "searchUpAndRight should search in the right direction", function () {
            _sk.searchUpAndRight( 1, 1, 1, gb );
            expect( _sk.isValidMove ).toHaveBeenCalledWith( { player: 0, row: 0, col: 2 } )
        } );

        it( "searchUpAndLeft should search in the right direction", function () {
            _sk.searchUpAndLeft( 1, 1, 1, gb );
            expect( _sk.isValidMove ).toHaveBeenCalledWith( { player: 1, row: 0, col: 0 } )
        } );
    } );

    describe("searchAt", function () {
       it("should return an empty array if passed an invalid cell location", function() {
           var sut = _sk.searchAt( 0, 0, 0, 0, 1, {
               rows: [
                   [{ row: -1, col: 1 }]
               ]
           } );

           expect( sut ).toEqual([]);
       });
    });


} );