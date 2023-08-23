const { dbConnection } = require('./dbConnection');

const createNewUser = async (newUser, res) => {
    try {
      return await dbConnection.promise().query('INSERT INTO users SET ?', newUser);
    } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ message: 'Something went wrong.' });
    }
};

const checkIfEmailExists = async (email, res) => {
    try {
      const [results] = await dbConnection.promise().query('SELECT user_id FROM users WHERE email = ?', email);
      return results
    } catch (error) {
      console.error('Error retrieving email:', error);
      res.status(500).json({ message: 'Something went wrong.' });
    }
};
  
module.exports= {
    createNewUser,
    checkIfEmailExists
}