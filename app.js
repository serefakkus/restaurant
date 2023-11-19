const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require("./config")
const verifyToken = require('./middleware/verify-token')
const restaurantVerifyToken = require("./middleware/rest-verify-token")
const franchiseVerifyToken = require('./middleware/fren-verify-token')

const indexRouter = require('./routes/index');
const usersSignRouter = require('./routes/users/users-sign');
const userRouter = require('./routes/users/user-info')
const restaurantSignRouter = require('./routes/Restaurant/restaurant-sign');
const restaurantRouter = require('./routes/Restaurant/restaurant-info');
const FranchiseNewRouter = require('./routes/Franchise/franchise-new')
const FranchiseGetRouter = require('./routes/Franchise/frenchise-get')
const FranchiseMenuRouter = require('./routes/Menu/menu-new')
const VoteGetRouter = require('./routes/users/vote-get')

const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:25327/user`, {});
    console.log(`MongoDB Connected: {conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
connectDB().then(() => {})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('user_api_secret_key',config.user_api_secret_key);
app.set('rest_api_secret_key',config.rest_api_secret_key);
app.set('fran_api_secret_key',config.fran_api_secret_key)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sign/user', usersSignRouter);
app.use('/user',verifyToken,userRouter);
app.use('/sign/rest',restaurantSignRouter);
app.use('/rest',restaurantVerifyToken,restaurantRouter)
app.use('/rest/franchise',restaurantVerifyToken,FranchiseNewRouter,FranchiseGetRouter)
app.use('/fran',franchiseVerifyToken,FranchiseMenuRouter)
app.use('/vote',VoteGetRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;