const express = require('express') 
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const path = require('path') 
const exphbs = require('express-handlebars')
const passport = require('passport')
const methodOverride = require('method-override')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
var sslRedirect = require('heroku-ssl-redirect');
var favicon = require('serve-favicon')

app.use(sslRedirect());

dotenv.config({path:'./config/config.env'})

require('./config/passport')(passport)

connectDB()

const app = express()
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))


if(process.env.NODE_ENV === 'developement'){
    app.use(morgan('dev'))
}

const { formatDate,stripTags,truncate,editIcon} = require('./helpers/hbs')

app.engine('.hbs', exphbs({helpers:{
  formatDate,
  stripTags,
  editIcon,
  truncate,
}, defaultLayout:'main',extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
  }))

app.use(passport.initialize())
app.use(passport.session())

app.use(function (req,res,next){
  res.locals.user = req.user || null
  next()
}) 

app.use(express.static(path.join(__dirname,'public')))

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
const PORT = process.env.PORT || 3000

app.listen(PORT,console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`))