const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = await nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: 'smtp.office365.com',
        port: '587',
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        },
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text,
      };

    transporter.sendMail(mailOptions, function(err, info){
        err? console.log(err) : console.log(info);
    });
}



module.exports = sendEmail;