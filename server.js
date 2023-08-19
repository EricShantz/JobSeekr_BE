const express = require('express') //import express (node.js framework that makes setting up servers easy)
const cors = require('cors') //import cors package
const bcrypt = require("bcrypt")// import password hashing stuff
const app = express() //create an instance of the express framework for us to use
const port = process.env.PORT || 3001; //if port is configured use it, if not default to 3000

//Middleware
app.use(cors()); //use cors middleware
app.use(express.json()); // tells express to make everything json in all routes


//defines a route at root URL level
app.post('/register', async(req, res) =>{
    // const {firstName, lastName, password, email} = req.body
     const {password} = req.body
    try{
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(`PASSWORD ${hashedPassword}`)
        //TODO: create new user entry in db
        res.status(200).json({message: "User successfully registered!"})
    } catch (err){
        console.error('Error hashing password:', err);
        res.status(500).json({ message: 'An error occurred' });
    }
})

app.get("/data", (req, res)=>{
    const data = {message: "hello from the Back end!"}
    res.json(data) //use res.json instead of res.send so we dont have to set the content header
})

//starts the server and listens for visitors/interactions on port 3001
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})