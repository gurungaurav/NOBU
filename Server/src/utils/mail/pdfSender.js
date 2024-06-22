const nodemailer = require('nodemailer')
require('dotenv').config()

//!So this is for sending results of booking details to the user or generating different pdf's
const pdfSender=async(email,subject,pdfBuffer)=>{

    try{
        const transporter = nodemailer.createTransport({
            // host:"smtp.forwardemail.net",
            service:'Gmail',
            port:465,
            secure:true,
            auth:{
                
                user: process.env.MY_EMAIL,
                pass:process.env.MY_PASSWORD
            }
        })

        const mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: subject,
            // text: text,
            attachments: [
                {
                    filename: 'booking_details.pdf', // Name of the attachment
                    content: pdfBuffer // PDF content as a buffer
                }
            ]
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log(`Email sent: ${info.response}`);
            }
        });

    }catch(e){
        console.log(e)
    }

}

module.exports = pdfSender