var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

//セッション有効
app.use(session({
    secret: '○○',
}));
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

/*
//ミドルウェアの設定
app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});
*/


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/login', function(req, res){
  res.sendFile(__dirname + '/views/login.html');
});

app.post('/login',passport.authenticate('local', {
  failureRedirect: '/◆◆',  // 失敗したときの遷移先
  successRedirect: '/◇◇',  // 成功したときの遷移先
}));

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


passport.use(new LocalStrategy(function(username, password, done){
  // ここで username と password を確認して結果を返す
  User.findOne({ username: username }, function (err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'ユーザーIDが正しくありません。' });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'パスワードが正しくありません。' });
    }
    return done(null, user);
  });
}));

// 認証確認関数
function isAuthenticated(req, res, next){
  if (req.isAuthenticated()) {  // 認証済
      return next();
  }
  else {  // 認証されていない
      res.redirect('/login');  // ログイン画面に遷移
  }
}

//セッション管理の設定
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



module.exports = app;
