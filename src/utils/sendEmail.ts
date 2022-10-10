import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, html: string) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'FastMail',
    auth: {
      user: 'testingmyapp@fastmail.com',
      pass: 'dqbyexd6zz52c42a',
    },
  });

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else if (success) {
      console.log('Server is ready to take our messages');
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'testingmyapp@fastmail.com', // sender address
    to: to, // list of receivers
    subject: 'Change password', // Subject line
    html,
  });

  console.log(info);

  console.log('Message sent: %s', info.messageId);
}
