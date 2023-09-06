const nodemailer = require('nodemailer');
const base_url = "http://localhost:3000"

const sendPasswordResetEmail = async (email, reset_token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'JobSeekrSoftware@gmail.com',
                pass: 'micvzxucjbeudiud',
            },
            //debug: true, // Enable debug mode
        });

            const resetTokenLink = `${base_url}/password-reset/${reset_token}`;

 
        const mailOptions = {
            from: 'jobseekrsoftware@gmail.com',
            to: `${email}`,
            subject: 'JobSeekrPassword Reset',
            text: `Click on the following link to reset your password: ${resetTokenLink}`,
            html: `<p>Click on the following link to reset your password:</p><a href="${resetTokenLink}">${resetTokenLink}</a>`,
          };
 
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
 };
 


module.exports= {
    sendPasswordResetEmail
}