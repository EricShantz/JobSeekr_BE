const express = require('express') //import express (node.js framework that makes setting up servers easy)
const cors = require('cors'); //import cors package
const bcrypt = require("bcrypt"); //imports password hashing stuff
const { connectToDB, dbConnection } = require('./db/dbConnection');
const { createNewUser, checkIfEmailExists } = require('./db/queries');
const app = express() //create an instance of the express framework for us to use
const port = process.env.PORT || 3001; //if port is configured use it, if not default to 3000

connectToDB();

//Middleware
app.use(cors()); //use cors middleware
app.use(express.json()); // tells express to make everything json in all routes


//defines a route
app.post('/register', async(req, res) => {
    try{
        const {firstName, lastName, email, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        //TODO:: verify newUser object on backend
        const newUser = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: hashedPassword
        }
        
        const emailExists = await checkIfEmailExists(email, res)
        if(emailExists.length === 0){
            if(await createNewUser(newUser, res)){
                res.status(200).json({message: "User successfully registered!"})
            }
        } else {
            res.status(409).json({ message: "A user with that email already exists." });
        }

    } catch (err){
        console.error('Error hashing password:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
})



//starts the server and listens for visitors/interactions on port 3001
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})