/**
 * Created by Eric on 4/10/2015.
 */
var koa = require('koa');
var app = koa();
var router = require("koa-route");
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