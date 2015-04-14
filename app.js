/**
 * Created by Eric on 4/10/2015.
 */
var koa = require('koa');
var app = koa();
var router = require("koa-route");


var monk = require('monk');
var co = require("co");
var wrap = require('co-monk');
var db = monk('localhost/othello');
var matches = wrap(db.get('matches'));

co(function *() {
    yield matches.insert({ name: 'Test Match 1', players: [] });
    yield matches.insert({ name: 'Test Match 2', players: [] });
    var res = yield matches.findOne({ name: 'Test Match 1' });
    res.name.should.equal('Test Match 1');

    var res2 = matches.find( { players: [] } );
    console.log("There are %d matches in the database", res2.length);
});


app.use(require('koa-static')("dist", {}));

// x-response-time
app.use(function *(next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    this.set('X-Response-Time', ms + 'ms');
});

// logger
app.use(function *(next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

// response

app.listen(3000);
console.log('listening on port 3000');