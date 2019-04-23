var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    localStrategy  = require("passport-local"),
    Posts     = require("./models/posts.js"),
    Comment        = require("./models/comments.js"),
    User           = require("./models/users.js"),
    postRoutes     = require("./routes/posts"),
    authRoutes     = require("./routes/index"),
    commentRoutes  = require("./routes/comments");
    
//local db, for work to production level, production db in comment
// mongoose.connect("mongodb://localhost:27017/colby", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://kari:colby@cluster0-z1udv.mongodb.net/colby?retryWrites=true");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//Passport config for authentication
app.use(require("express-session")({
    secret: "Colby loves Mikko.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//set current user for gatekeeping on edit/deletes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//routes
app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes);

//landing page
app.get("/", function(req, res){
   res.render("landing");
});

//secret page
app.get("/sekkrit", function(req, res){
   res.render("sekkrit");
});

//server start
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server started"); 
});