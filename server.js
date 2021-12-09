const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')


const port = process.env.PORT || 5000;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport');
const session = require("express-session");

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
       { user_id: user._id, email, role: user.role },
       process.env.TOKEN_KEY,
       {
         expiresIn: "2h",
       }
     );
     user.token = token;
 
     res.status(201).json({Message: "User registered", token: token});
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
       
       res.status(200).json({Message: "User logged in", token: token});
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


 app.post("/changerole/:userId", auth, async (req, res) => {

  try {
    if (req.user.role === 'admin'){
    const { role } = req.body;

    if (!(role)) {
      res.status(400).send("Role is required");
    }

  
    const oldUser = await User.findOne({ _id: req.params.userId });

    if (!oldUser) {
      return res.status(409).send("User with this ID doesn't exist");
    }


    const updatedRole = await User.updateOne({ _id:req.params.userId}, {$set: {role: req.body.role}})

    
    res.status(201).json({message: "Role changed", info: updatedRole})
    } else{
      res.status(403).json({Message: "Only admin can change roles"});
    }
  } catch (err) {
    console.log(err);
  }
});




const productsRoute = require('./Routes/Products');
const usersRoute = require('./Routes/Users');
//const ordersRoute = require('./Routes/Orders');

app.use('/api/v1/categories', productsRoute);
app.use('/api/v1/users', usersRoute);
//app.use('/users/:userId/orders', ordersRoute);
 
app.get('/', (req, res)=>{
   //console.log(req.user);
   res.send({express: 'We are on home'}); 
});
/*
app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});*/

app.get('*', (req, res) =>{
  res.sendStatus(404);
})
mongoose.connect( process.env.DB_CONNECTION , { useNewUrlParser: true} ,
() => console.log("Connected to DB")
);

//app.listen(port); 
module.exports = app;
