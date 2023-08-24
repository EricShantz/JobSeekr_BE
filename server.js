const express = require('express') //import express (node.js framework that makes setting up servers easy)
const cors = require('cors'); //import cors package
const bcrypt = require("bcrypt"); //imports password hashing stuff
const { connectToDB, dbConnection } = require('./db/dbConnection');
const { createNewUser, checkIfEmailExists, getUserByEmail, updateResetToken, validateResetToken, updateUserPassword } = require('./db/queries');
const {sendPasswordResetEmail} = require('./utils/sendResetEmail')
const app = express() //create an instance of the express framework for us to use
const port = process.env.PORT || 3001; //if port is configured use it, if not default to 3000

connectToDB();

//Middleware
app.use(cors()); //use cors middleware
app.use(express.json()); // tells express to make everything json in all routes


//Register new user
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
                res.status(200).json({message: "User successfully registered!", user: newUser})
            }
        } else {
            res.status(409).json({ message: "A user with that email already exists." });
        }

    } catch (err){
        console.error('Error hashing password:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
})

//Log in current user
app.post('/loginUser', async(req,res) => {
    try {
        const { email, password } = req.body;
    
        const results = await getUserByEmail(email, res); 
    
        if (results.length === 0) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
    
        const storedHashedPassword = results[0].password; 
    
        bcrypt.compare(password, storedHashedPassword, function (err, result) {
          if (err) {
            return res.status(500).json({ success: false, message: 'An error occurred during password comparison' });
          }
          if (result) {
            // Passwords match, proceed with login
            return res.json({ success: true, message: 'Login successful', user: results[0]});
          } else {
            // Passwords do not match
            return res.status(401).json({ success: false, message: 'Passwords do not match' });
          }
        });
    
      } catch (err) {
        // Handle any errors that occur during the process
        console.error(err); // Log the error for debugging
        return res.status(500).json({ success: false, message: 'An error occurred' });
      }
})

//Forgot Password
app.post('/forgotPassword', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await getUserByEmail(email);

        if (!user.length) {
            return res.status(401).json({ success: false, message: 'No user exists with that email' });
        }

        const reset_token = await updateResetToken(user);

        if (reset_token) {
            const emailSent = await sendPasswordResetEmail(email, reset_token);
            if (emailSent) {
                return res.json({ success: true, message: 'Email Link sent' });
            } else {
                console.log("res.status(500)");
                return res.status(500).json({ success: false, message: 'Failed to send reset email' });
            }
        } else {
            console.log("res.status(500)");
            return res.status(500).json({ success: false, message: 'Failed to update reset token' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

//Reset Password
app.post('/resetPassword', async (req, res)=>{
    try{
        const {reset_token, password, confirm_password} = req.body;

        const validateToken = await validateResetToken(reset_token)

        if(validateToken){

            if(password !== confirm_password){
                return res.status(500).json({ success: false, message: 'Passwords do not match' });
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const updateResult = await updateUserPassword(hashedPassword, reset_token)

            if(updateResult){
                return res.status(200).json({success: true, message: 'Password reset successful'})
            } else {
                return res.status(500).json({ success: false, message: 'Password reset failed' });
            }
            
        } else {
            console.error("Invalid token");
            return res.status(500).json({ success: false, message: 'An error occurred' });
        }

    }catch (err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
})




//starts the server and listens for visitors/interactions on port 3001
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})