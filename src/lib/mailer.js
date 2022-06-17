const nodemailer = require("nodemailer")

const mailer = async ({ subject, to, text, html }) => {
    const transport = nodemailer.createTransport({
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        },
        host: "smtp.gmail.com"
    })
    await transport.sendMail({
        subject: subject || "test subject",
        to: to || "rahman.adhitya23@gmail.com",
        text: text || "test nodemailer",
        html: html || "<h1> This is sent from my Express API</h1>"
    })
}

module.exports = mailer