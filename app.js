var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('./common/json_logger');
var mongoose = require("mongoose");
var dbData = require('./config/db-config')
var bodyParser = require('body-parser') 


mongoose
  .connect(dbData.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// logger.token('postData', (request) => {
//   if (request.method == 'POST') return ' ' + JSON.stringify(request.body);
//   else return ' ';
// });

// app.use(
//   logger(
//     ':method :url :status :res[content-length] - :response-time ms :postData'
//   )
// );

const expressPino = require('express-pino-logger')(logger.opts,logger.pino.destination(logger.LOG_DESTINATION))
app.use(expressPino)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/employees', require('./routes'));

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
