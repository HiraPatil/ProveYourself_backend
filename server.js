const express = require('express');
const cors = require("cors");
const {errorHandler} = require('./middleware/errorHandler');
const dotenv = require('dotenv').config();
const app = express();


const contact = require('./routes/contact');
const users = require('./routes/users');
const recaptcha = require('./routes/recaptcha')
const mongoose = require('mongoose');
const connectDb = require('./config/dbconnection')

const port =  8000;

connectDb();
app.use(cors()); 
app.use(express.json());

app.use('/api/contact' , contact);

app.use('/api/users' , users);

app.use('/api/captcha' , recaptcha); 

app.use(errorHandler);

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
