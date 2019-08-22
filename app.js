var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();
app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var session = require('express-session');
var LokiStore = require('connect-loki')(session);

var loki = require("lokijs");

var db = new loki('loki.json');
db.loadDatabase({}, function () {
    var _collection = db.getCollection('users');
    // _collection.clear();
    // db.saveDatabase();
    // console.log("Collection %s does not exit. Creating ...", 'users');
    _collection = db.addCollection('users');
    var col = _collection.data;
    col.forEach(function(value, index, col){
        //console.log(col[index].complete);
    });
});

var options = {};

var sessionMiddleware = session({
    store: new LokiStore(options),
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true,
    cookie : {
        maxAge: 1000* 60 * 60 *24 * 365
    }
});
try {
    app.io.use(function(socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    app.use(sessionMiddleware);
} catch (e) {
    console.log(e)
    app.io.use(function(socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    app.use(sessionMiddleware);
}
var socket = require('./bin/socket')(app.io, db);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
