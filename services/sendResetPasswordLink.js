const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // Use true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const sendResetLink = async(email, user, resetLink) => {
  console.log(resetLink)
    try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Reset Password",
          html: `<p>Hi ${user},You requested a password reset. Click the link below to reset your password:</p>
                 <h1>${resetLink}</h1>`,
        };
    
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
      } catch (error) {
        console.error("Error sending email:", error);
      }
}

module.exports = sendResetLink

///we stopped at asking chat gpt if we are using the parameters correctly