const dotenv = require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });;

const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const http = require('http');
const { errorHandler } = require('./middleware/errorMiddleware');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const connectDB = require('./config/db');

const port = process.env.PORT || 3500;

connectDB();

const app = express();

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());
app.use(cookieParser());
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
// }));
app.use(passport.initialize());

app.use('/api/auth', require('./routes/usersRoutes.js'));
app.use('/api/rick-and-morty', require('./routes/rickAndMortyRoutes.js'));

app.use(errorHandler);
const server = http.createServer(app);

server.listen(port, () => console.log(`Express Server started on port ${port}`));
