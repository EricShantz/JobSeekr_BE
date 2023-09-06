const mysql = require("mysql2")

const dbConnection = mysql.createConnection({
    host: 'sql9.freemysqlhosting.net',
    user: 'sql9641671',
    password: 'vJ1gyPXkHx',
    database: 'sql9641671' 
})

const connectToDB = () => {
    dbConnection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }
        console.log('Connected to the database!');
    });
}

module.exports = {
    dbConnection,
    connectToDB
  };