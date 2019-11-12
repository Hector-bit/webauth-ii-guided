const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const knexSessionStorage = require("connect-session-knex")(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knexConnection = require('../database/dbConfig');
const server = express();
// 2: configure the session and cookies
const sessionConfiguration = {
  name: 'booger', // default name is sid
  secret: process.env.COOKIE_SECRET || 'not a safe secret',
  cookie: {
    maxAge: 1000 * 60 * 60, //valid for 1 hour (in miliseconds)
    secure: process.env.NODE_ENV === "development" ? false : true, // do we send cookie over https only?
    httpOnly: true, //prevent client javascript code from accessing to the cookie
  },
  resave: false, //save sessions even when  
  saveUninitialized: true,
  store: new knexSessionStorage({
    knex: knexConnection,
    clearInterval: 1000 * 60 * 10, //delete expired session every 10 minutes
    tablename: 'user_sessions',
    sidfieldname: 'id',
    createtable: true
  })
}

server.use(helmet());
server.use(express.json());
server.use(cors()); //research credentails: "true" when "withCredentials" connecting from your React application
server.use(session(sessionConfiguration)); //3: use the session middleware globally

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up', session: req.session });
});

module.exports = server;
