const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')

const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

const productsRoute = require('./Routes/Products');
const usersRoute = require('./Routes/Users');
//const ordersRoute = require('./Routes/Orders');

app.use('/api/v1/categories', productsRoute);
app.use('/api/v1/users', usersRoute);
//app.use('/users/:userId/orders', ordersRoute);

app.get('/', (req, res)=>{
   res.send('We are on home'); 
});

mongoose.connect( process.env.DB_CONNECTION , { useNewUrlParser: true} ,
() => console.log("Connected to DB")
);

app.listen(port);