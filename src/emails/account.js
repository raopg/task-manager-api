const sgMail =  require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'raopg@uci.edu',
        subject: 'Welcome to the Task App',
        text: `Welcome to the Task app, ${name}!. Let me know how you like the app!`,
        //html:'' -> Can be used to supply HTML, CSS etc.
    })
}

const sendCancellationEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'raopg@uci.edu',
        subject: 'We\'re sorry to see you go!',
        text: `We are sorry to see you leave, ${name}. Please let us know if there is anything we can improve on in the future.`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}