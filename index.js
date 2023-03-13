const express = require('express');
const {router} = require('./routes');
const {routerAuth} = require('./routes');
const path = require('path');
const app = express();
const morgan = require('morgan');
const session = require('express-session');
const isAuth = require('./middlewares/isAuth');
const isAlreadyAuth = require('./middlewares/isAlreadyAuth');
const loginController = require('./controllers/auth/loginController');
const bodyParser = require('body-parser');
require('dotenv').config()


//CONFIG
app.use(express.static('public'));
app.use(session({
    secret: 'clave',
    resave: true,
    saveUninitialized: true,

}))

//MIDDLEWARES
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/* app.use(cors()); */



//RUTAS
app.get('/',(req,res)=>{res.redirect('/login')})
app.use("/login",isAlreadyAuth,router);
app.use("/home",isAuth,routerAuth);
app.get('/logout',loginController.logout);

app.get("*",(req,res)=>{res.send("Ruta no encontrada!")});


app.listen(process.env.port,()=>{console.log("corriendo puerto 8000")});

module.exports = app;