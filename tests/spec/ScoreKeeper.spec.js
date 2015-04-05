/**
 * Created by Eric on 4/5/2015.
 */
describe( "ScoreKeeper", function () {
    it( "should be defined", function () {
        expect( ScoreKeeper ).toBeDefined();
    } );

    it( "should set it's row and column count based on gameboard passed to constructor", function () {
        var sk = new ScoreKeeper({ rows: [
            [ { player: 0 }, { player: 0 } ],
            [ { player: 0 }, { player: 0 } ]
        ]});

        expect(sk.numRows).toBe(2);
        expect(sk.numCols).toBe(2);
    } );

    describe("")

} );