const express = require('express') //import express (node.js framework that makes setting up servers easy)
const cors = require('cors') //import cors package
const app = express() //create an instance of the express framework for us to use
const port = process.env.PORT || 3001; //if port is configured use it, if not default to 3000
app.use(cors()); //use cors middleware


//defines a route at root URL level
app.get('/', (req, res) =>{
    res.send('Hello Express!')
})

app.get("/data", (req, res)=>{
    const data = {message: "hello from the Back end!"}
    res.json(data) //use res.json instead of res.send so we dont have to set the content header
})

//starts the server and listens for visitors/interactions on port 3001
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})