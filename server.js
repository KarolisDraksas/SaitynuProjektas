const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')


const port = process.env.PORT || 3000;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport');
const session = require("express-session");

//const session = require('session');
app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());

const User = require("./Models/User");

app.post("/register", async (req, res) => {

   try {
     const { first_name, last_name, email, password } = req.body;
 
     if (!(email && password && first_name && last_name)) {
       res.status(400).send("All input is required");
     }
 
   
     const oldUser = await User.findOne({ email });
 
     if (oldUser) {
       return res.status(409).send("User Already Exist. Please Login");
     }
 
     encryptedPassword = await bcrypt.hash(password, 10);
 
     const user = await User.create({
       first_name,
       last_name,
       email: email.toLowerCase(), // sanitize: convert email to lowercase
       password: encryptedPassword,
     });
 
     const token = jwt.sign(
       { user_id: user._id, email },
       process.env.TOKEN_KEY,
       {
         expiresIn: "2h",
       }
     );
     user.token = token;
 
     res.status(201).json(user);
   } catch (err) {
     console.log(err);
   }
 });
 

 
 app.post("/login", async (req, res) => {

   try {
     const { email, password } = req.body;
 
     if (!(email && password)) {
       res.status(400).send("All input is required");
     }
     const sessionUser = await User.findOne({ email: email });

 
     if (sessionUser && (await bcrypt.compare(password, sessionUser.password))) {
       const token = jwt.sign(
         { user_id: sessionUser._id, email, role: sessionUser.role },
         process.env.TOKEN_KEY,
         {
           expiresIn: "2h",
           algorithm: 'HS256'
         }
       );
 
       sessionUser.token = token 
       
       res.status(200).json(sessionUser);
     } else{
     res.status(400).send("Invalid Credentials");}
   } catch (err) {
     console.log(err);
   }
 });

 const auth = require("./Middleware/auth");

 app.get("/welcome", auth, (req, res) => {

   res.status(200).send(req.user);
 });


const productsRoute = require('./Routes/Products');
const usersRoute = require('./Routes/Users');
//const ordersRoute = require('./Routes/Orders');

app.use('/api/v1/categories', productsRoute);
app.use('/api/v1/users', usersRoute);
//app.use('/users/:userId/orders', ordersRoute);
 
app.get('/', (req, res)=>{
   //console.log(req.user);
   res.send('We are on home'); 
});

mongoose.connect( process.env.DB_CONNECTION , { useNewUrlParser: true} ,
() => console.log("Connected to DB")
);

//app.listen(port); 
module.exports = app;
