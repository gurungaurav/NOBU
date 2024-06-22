const nodemailer = require("nodemailer");
require("dotenv").config();

//!So you have to generate a app password for the mail sender cuz gmail wont let it do it for security prupose
//!So i have generated the password from the mail on two way authentication
//!This is for sending mail from admin only like from my account only from nobu hotel
const sendMail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      // host:"smtp.forwardemail.net",
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: subject,
      text: text,
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

//!For custom mail send like the sender or receiver could be any one
const customMailSender = async (
  sender_email,
  receiver_email,
  subject,
  text
) => {
  console.log(sender_email, receiver_email, "jaaj");
  try {
    const transporter = nodemailer.createTransport({
      // host:"smtp.forwardemail.net",
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mailOptions = {
      from: sender_email,
      to: receiver_email,
      subject: subject,
      text: text,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { sendMail, customMailSender };
