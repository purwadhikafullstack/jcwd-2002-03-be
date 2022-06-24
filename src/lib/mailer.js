const nodemailer = require("nodemailer")

const mailer = async ({ subject, to, text, html }) => {
    const transport = nodemailer.createTransport({
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
            // user: testAccount.user,
            // pass: testAccount.pass
        },
        host: "smtp.gmail.com",
        port: 465,

        // host: "smtp.etheral.email",
    })
    await transport.sendMail({
        subject: subject || "test subject",
        to: to || "monpai732@gmail.com",
        text: text || "test nodemailer",
        html: html || "<h1> This is sent from my Express API</h1>"
    })
}

module.exports = mailer