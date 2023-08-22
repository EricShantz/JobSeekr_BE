const express = require('express') //import express (node.js framework that makes setting up servers easy)
const cors = require('cors'); //import cors package
const bcrypt = require("bcrypt") //imports password hashing stuff
const app = express() //create an instance of the express framework for us to use
const port = process.env.PORT || 3001; //if port is configured use it, if not default to 3000
const mysql = require("mysql2")

//Middleware
app.use(cors()); //use cors middleware
app.use(express.json()); // tells express to make everything json in all routes

const dbConnection = mysql.createConnection({
    host: 'sql9.freemysqlhosting.net',
    user: 'sql9641671',
    password: 'vJ1gyPXkHx',
    database: 'sql9641671' 
})

dbConnection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database!');
  });


//defines a route
app.post('/register', async(req, res) => {
    try{

        //TODO: check if email already exists in DB, if so, throw error with new status to be used in the front end

        const {firstName, lastName, email, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        //TODO: create new user entry in db
        const newUser = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: hashedPassword
        }

        dbConnection.query("INSERT INTO users SET ?", newUser, (error, results) => {
            if (error) {
                console.error('Error inserting user:', error);
              } else {
                console.log('User inserted successfully');
            }
        }
        )

        res.status(200).json({message: "User successfully registered!"})
    } catch (err){
        console.error('Error hashing password:', err);
        res.status(500).json({ message: 'An error occurred' });
    }
})

app.get("/user", (req, res)=>{
    const data = {message: "hello from the Back end!"}
    res.json(data) //use res.json instead of res.send so we dont have to set the content header
})

//starts the server and listens for visitors/interactions on port 3001
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})