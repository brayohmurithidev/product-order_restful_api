const express = require('express'); //import express module from express
const app = express(); 
const morgan = require('morgan'); //this returns calls and requests in the cli
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const  orderRoutes = require('./api/routes/orders');

// CREATE A CONNECTION WITH PRODUCT

mongoose.connect('mongodb+srv://brayohdephaz:'+ process.env.MONGO_ATLAS_PW + '@cluster0.ivfej.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// test connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error'));
db.once("open", function(){
    console.log("Connected Successfully");
})


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// SOLVE THE CORS errors
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origi', '*'); //Allows access to all controll for * all urls
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content-Type, Accept, Authorization');

    // Method options request checks for
    if(req.method === 'OPTIONS'){
        req.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();

});

app.use ('/products', productRoutes);
app.use ('/orders', orderRoutes);

// Handle errors that dont succeed from the above middlewares

app.use ((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

// Middleware that will handle all errors 
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});
module.exports = app;