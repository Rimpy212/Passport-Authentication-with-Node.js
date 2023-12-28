const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require('express-flash');
const session=require('express-session');
const passport = require('passport');

const app=express();

//passport config
require('./config/passport')(passport);

//DB config
const db=require('./config/keys').MongoURI;


//connect to mongo
mongoose.connect(db,{useNewUrlParser:true})
.then(()=> console.log("MongoDB Connected"))
.catch((err)=> console.log(err));


//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//BodyParser
app.use(express.urlencoded({extended: false}));

// Express Session middleware(it works in conjuction with passport module)
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


  //Connnect Flash
app.use(flash());

// Global variables
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
})



//Routes
app.use('/',require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT=process.env.PORT || 5000;

app.listen(PORT, console.log(`server started at ${PORT}`));