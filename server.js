const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')

const port = process.env.PORT || 3000;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

app.use(cors());
app.use(express.json());

const User = require("./Models/User");

// Register
app.post("/register", async (req, res) => {

   // Our register logic starts here
   try {
     // Get user input
     const { first_name, last_name, email, password } = req.body;
 
     // Validate user input
     if (!(email && password && first_name && last_name)) {
       res.status(400).send("All input is required");
     }
 
     // check if user already exist
     // Validate if user exist in our database
     const oldUser = await User.findOne({ email });
 
     if (oldUser) {
       return res.status(409).send("User Already Exist. Please Login");
     }
 
     //Encrypt user password
     encryptedPassword = await bcrypt.hash(password, 10);
 
     // Create user in our database
     const user = await User.create({
       first_name,
       last_name,
       email: email.toLowerCase(), // sanitize: convert email to lowercase
       password: encryptedPassword,
     });
 
     // Create token
     const token = jwt.sign(
       { user_id: user._id, email },
       process.env.TOKEN_KEY,
       {
         expiresIn: "2h",
       }
     );
     // save user token
     user.token = token;
 
     // return new user
     res.status(201).json(user);
   } catch (err) {
     console.log(err);
   }
   // Our register logic ends here
 });
 
 // ...
 
 app.post("/login", async (req, res) => {

   // Our login logic starts here
   try {
     // Get user input
     const { email, password } = req.body;
 
     // Validate user input
     if (!(email && password)) {
       res.status(400).send("All input is required");
     }
     // Validate if user exist in our database
     const user = await User.findOne({ email: email });
     //console.log(password);
     //console.log(user);
 
     if (user && (await bcrypt.compare(password, user.password))) {
       // Create token
       const token = jwt.sign(
         { user_id: user._id, email },
         process.env.TOKEN_KEY,
         {
           expiresIn: "2h",
         }
       );
 
       // save user token
       user.token = token;
 
       // user
       res.status(200).json(user);
     }
     res.status(400).send("Invalid Credentials");
   } catch (err) {
     console.log(err);
   }
   // Our register logic ends here
 });

 const auth = require("./Middleware/auth");

 app.get("/welcome", auth, (req, res) => {
   res.status(200).send("Welcome 🙌 ");
 });


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