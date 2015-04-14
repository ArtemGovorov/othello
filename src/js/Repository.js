/**
 * Created by Eric on 4/12/2015.
 */

var Repository = function () {
    this.snapshots = [];
};

Repository.prototype.recordMove = function ( data ) {
    let snapshot = this.getSnapshotPattern( data.gameBoard );
    console.log( "Snapshot created: ", snapshot );

    this.snapshots.push( snapshot );
    data.snapShots = this.snapshots;
    console.log( "Saving Data: ", data );
};

Repository.prototype.getSnapshotPattern = function ( gameboard ) {
    return gameboard.moves.reduce( function ( pattern, move ) {
        return pattern + `${move.x}-${move.y}-${move.player}-${ +move.wasHighestScoring || 0},`;
    }, "" );
};
