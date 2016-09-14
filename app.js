/**
 * This the main entry file for the app.
 */

var Express = require('express'),
  Path = require('path'),
  CookieParser = require('cookie-parser'),
  BodyParser = require('body-parser'),
  exphbs = require('express-handlebars'),
  expressValidator = require('express-validator'),
  flash = require('connect-flash'),
  session = require('express-session'),
  passport = require('passport'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  appConfig = require('./config/config');

// Setup database
mongoose.connect('mongodb://' + appConfig.database.host + '/' + appConfig.database.dbName);
mongoose.connection;


// Init App
var app = Express();

// View engine
app.set('views',Path.join(__dirname,'views'));
app.engine('.html',exphbs({defaultLayout: 'layout', extname: '.html'}));
app.set('view engine','.html');

// BodyParser middleware
app.use(BodyParser.json({limit: '50mb'})); // Set request size
app.use(BodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(CookieParser());

// Serve static folder
app.use(Express.static(Path.join(__dirname, 'public')));

// Express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(expressValidator({
  errorFormatter : function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}));

// Connect flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Creates server logs
app.use(morgan('dev'));

require('./routes/index')(app);

// Set port
app.set('port', (process.env.PORT || appConfig[appConfig.server].port));
app.set('host', (process.env.HOST || appConfig[appConfig.server].host));

app.listen(app.get('port'), function () {
  console.log('Server started at ' + app.get('host') + ':' + app.get('port'));
});
