/**
 * Created by Eric on 4/5/2015.
 */
describe( "ScoreKeeper", () => {
    var _sk, _bm;

    beforeEach( () => {
        _bm = new BoardManager();
        _sk = new ScoreKeeper(_bm);
    } );

    describe( "getScoreForPlayer", () => {
        it( "should return the number of cells of the game board occupied by the player", () => {
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

    describe( "resetMoveScoreRatings", () => {
        it("should set isHighestScoring property to false on all cells", () => {
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

    describe( "checkCell", () => {
        it( "should return an object with the results from scoring that location for player", () => {
            var sut = _sk.checkCell( { player: 2, row: 2, col: 1 }, 1 );
            const expected = {
                isValidMove: true,
                isEmpty: false,
                isPoint: true
            };
            expect( sut ).toEqual( expected );

        } );

        it( "should return false for valid move if coords are out of bounds", () => {
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

    describe( "search*", () => {
        var gb;

        beforeEach( () => {
            spyOn( _bm, "isValidMove" );
            gb = {
                rows: [
                    [{ player: 1, row: 0, col: 0 }, { player: 1, row: 0, col: 1 }, { player: 0, row: 0, col: 2 }],
                    [{ player: 1, row: 1, col: 0 }, { player: 1, row: 1, col: 1 }, { player: 0, row: 1, col: 2 }],
                    [{ player: 1, row: 2, col: 0 }, { player: 0, row: 2, col: 1 }, { player: 0, row: 2, col: 2 }]
                ]
            };
        } );

        it( "searchRight should search in the right direction", () => {
            _sk.searchRight( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 2, 1 );
        } );

        it( "searchLeft should search in the right direction", () => {
            _sk.searchLeft( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 0, 1 );
        } );

        it( "searchUp should search in the right direction", () => {
            _sk.searchUp( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 1, 0 );
        } );

        it( "searchDown should search in the right direction", () => {
            _sk.searchDown( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 1, 2 );
        } );

        it( "searchDownAndRight should search in the right direction", () => {
            _sk.searchDownAndRight( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 2, 2 );
        } );

        it( "searchDownAndLeft should search in the right direction", () => {
            _sk.searchDownAndLeft( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 0, 2 );
        } );

        it( "searchUpAndRight should search in the right direction", () => {
            _sk.searchUpAndRight( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 2, 0 );
        } );

        it( "searchUpAndLeft should search in the right direction", () => {
            _sk.searchUpAndLeft( 1, 1, 1, gb );
            expect( _bm.isValidMove ).toHaveBeenCalledWith( 0, 0 );
        } );
    } );

    describe( "searchAt", () => {
        it( "should return an empty array if passed an invalid cell location", () => {
            var sut = _sk.searchAt( 0, 0, 0, 0, 1, {
                rows: [
                    [{ row: -1, col: 1 }]
                ]
            } );

            expect( sut ).toEqual( [] );
        } );
    } );
} );
