require('dotenv').config();
let express = require('express');
let session = require('express-session');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let server = require('http').Server(app);
let passport = require("passport");
let SocketIO = require('socket.io');
let passportSocketIo = require('passport.socketio');
let flash = require('connect-flash');
let RedisStore = require('connect-redis')(session);
let redis = require('redis');
let saveGameLoop = require('./middleware/save-gameloop');
// Server port.
const PORT = 3000;

// Initialize redis client for user and session storage.
let redisClient = redis.createClient({
	host: 'localhost',
	port: 6379,
	pass: process.env.REDIS_SECRET
});

// Init redis session store using client.
let sessionStore = new RedisStore({
	client: redisClient,
	logErrors: true,
	pass: process.env.REDIS_SECRET
});

// Init session middleware using session store
app.use(session({
		store: sessionStore,
		saveUninitialized: false,
		resave: false,
		secret: process.env.REDIS_SECRET
	}));


app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());

app.use(passport.session());
// Load the passport strategy config.
require('./config/passport')(passport, redisClient);
// Init SocketIO and passport middleware.
let io = SocketIO(server);

io.use(passportSocketIo.authorize({
	key: 'connect.sid',
	secret: process.env.REDIS_SECRET,
	store: sessionStore,
	passport: passport,
	cookieParser: cookieParser
}));
let gameLoop = require('./middleware/load-gameloop')(redisClient, io);
app.use(gameLoop.Middleware);

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
require('./routes/sockets')(io, gameLoop.getLoop);

// Start Server
server.listen(PORT, function() {
	console.log('Listening on http://localhost'+PORT);
});
