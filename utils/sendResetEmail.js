const nodemailer = require('nodemailer');

const sendPasswordResetEmail = async(email, reset_token) => {
    console.log(reset_token)
  
    const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
            user: 'JobSeekrSoftware@gmail.com',
            pass: 'micvzxucjbeudiud',
        },
    });
    
    const resetTokenLink = `https://yourwebsite.com/password-reset/${reset_token}`;

    const mailOptions = {
      from: 'jobseekrsoftware@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Click on the following link to reset your password: ${resetTokenLink}`,
      html: `<p>Click on the following link to reset your password:</p><a href="${resetTokenLink}">${resetTokenLink}</a>`,
    };

   const wasMailSent = () => {
    try{
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return false
            } else {
                return true
            }
        });
    }catch(err){
        console.error("Something went wrong:", err)
    }   

    return wasMailSent
   }
}

module.exports= {
    sendPasswordResetEmail
}