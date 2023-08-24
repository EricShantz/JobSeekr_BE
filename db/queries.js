const { dbConnection } = require('./dbConnection');
const crypto = require('crypto');


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

const getUserByEmail = async(user_email, res) =>{
    try {
        const [results] = await dbConnection.promise().query(`SELECT * FROM users WHERE email = "${user_email}"`);
        return results
    } catch(err){
        console.error('Error retrieving user:', err);
        res.status(500).json({ message: 'Something went wrong.' });
    }
}

const updateResetToken = async(user) => {
  try {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);

    const userId = user[0].user_id;

    const result = await dbConnection.promise().query(`
      UPDATE users 
      SET reset_token = "${resetToken}", reset_token_expires = "${resetTokenExpires.toISOString()}"
      WHERE user_id = ${userId}
    `);

    if(result[0].affectedRows > 0){
      return resetToken
    } else {
      return null
    }
  } catch (error) {
    console.error('Error updating reset token:', error);
    return false;
  }
}


module.exports= {
    createNewUser,
    checkIfEmailExists,
    getUserByEmail,
    updateResetToken
}