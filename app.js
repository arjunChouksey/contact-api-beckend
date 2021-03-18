const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const statusRoutes = require('./routes/statusRoutes');

const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.drz4b.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`
const PORT = process.env.PORT
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

//adding header to avoid CORS error=> (Cross Origin Resource Sharing Error)
app.use((req, res, next) => {
    //modify header
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next(); 
});

app.use('/user', userRoutes);
app.use('/contact', contactRoutes);
app.use('/status', statusRoutes);

app.use((error, req, res, next) => {
    console.log('Error handler executed')
    if(!error.message){
        error.message = "something went wrong in server"
    }
    res.status(error.statusCode||500).json({
        message: error.message
    })
})

mongoose.connect(URI, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then((res) => {
    console.log('CONNECTED TO DATABASE');
    app.listen(PORT||8080);
})
.catch((err) => {
    throw err;
})
