const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to:email,
        from:'prasanth.iyer94@gmail.com',
        subject:'Welcome to the task app',
        text:`Hello ${name}, welcome to the task app. Ues this task app and be productive`

    })
}
const sendCancelMail = (email,name) =>{
    sgMail.send({
        to: email,
        from: 'prasanth.iyer94@gmail.com',
        subject: 'Welcome to the task app',
        text: `Bye-bye ${name}, it's always hard partig ways. Good luck with your future`
    })
}
module.exports = {
    sendWelcomeMail,
    sendCancelMail
}