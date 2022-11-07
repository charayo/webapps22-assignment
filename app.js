//load config
const config = require('./config.json');

//dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const { application } = require('express');

//connect to Db
mongoose.connect(config.mongodb, {dbName: "mongooseDB"})
.then(()=>{
    console.log('connection successful')
})
.catch((err) => console.error(err));

//configure app
const app = express();

//view
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); //parse incoming request for post body
app.use(bodyParser.json());
app.use(session({secret: 'pandas', resave:true, saveUninitialized: true}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require('./passport.js')(passport)
require('./routes.js')(app, passport)

app.listen(config.port)
console.log("listening on  http://"+config.host+ config.port)