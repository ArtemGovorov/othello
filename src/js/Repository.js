/**
 * Created by Eric on 4/12/2015.
 */

class Repository {

    constructor() {
        this.snapshots = [];
    }

    recordMove( data ) {
        let snapshot = this.getSnapshotPattern( data.gameBoard );
        console.log( "Snapshot created: ", snapshot );

        this.snapshots.push( snapshot );
        data.snapShots = this.snapshots;
        console.log( "Saving Data: ", data );
    }

    getSnapshotPattern( gameboard ) {
        return gameboard.moves.reduce( ( pattern, move ) => {
            return pattern + `${move.x}-${move.y}-${move.player}-${ +move.wasHighestScoring || 0},`;
        }, "" );
    }
}

