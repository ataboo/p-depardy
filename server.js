require('dotenv').config();
let express = require('express');
let session = require('express-session');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let server = require('http').Server(app);
let passport = require("passport");
let WSServer = require('ws').Server;
let flash = require('connect-flash');
let RedisStore = require('connect-redis')(session);
let redis = require('redis');
let saveGameLoop = require('./middleware/save-gameloop');
// Server port.
const PORT = 3000;

// Initialize redis client for user and session storage.
let redisClient = require('./middleware/global').redisClient = redis.createClient({
	host: 'localhost',
	port: 6379
});

// Init redis session store using client.
let sessionStore = new RedisStore({
	client: redisClient,
	logErrors: true
});

let sessionParser = session({
		store: sessionStore,
		saveUninitialized: false,
		resave: false,
		secret: process.env.SESSION_SECRET
	});

// Init session middleware using session store
app.use(sessionParser);
app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());

app.use(passport.session());
// Load the passport strategy config.
require('./config/passport')(passport, redisClient);
// Init SocketIO and passport middleware.
const wss = new WSServer({
  verifyClient: (info, done) => {
    sessionParser(info.req, {}, () => {
      done(info.req.session.passport.user);
    });
  },
  server
});

let GameLoopLoad = require('./middleware/load-gameloop')(wss);
app.use(GameLoopLoad.Middleware);

// Public directory.
app.use(express.static(path.join(__dirname, '/public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(saveGameLoop());

// Set ejs view engine.
app.set('view engine', 'ejs');

// Add Views path.
app.set('views', path.join(__dirname, 'views'));

// Web Routes
require('./routes/web')(app, passport);

// Socket Events
require('./routes/sockets')(wss);

// Start Server
server.listen(PORT, function() {
	console.log('Listening on http://localhost'+PORT);
});
