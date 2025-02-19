import axios from 'axios';
import sendemail from '../Comman/sendemail'

function createToken(email, password) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 18; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        token += charset[randomIndex];
    }
    axios.post("http://localhost:8080/token", {
        "token": token,
        "status": true
    }).then((data) => {
        sendEmail(email, password)
    }).catch(err => console.log(err))
}


function sendEmail(email, password) {
    const message = ''
    const receiverEmail = email
    const subject = 'Login Creadential from E-Vote Hub'
    const html = `Your Email and Password is mention below: <br/><br/>Email: ${email} <br/> Password: ${password} <br/><br/>If You want to chnage password then <a href='https://www.google.com/'>Click Here</a>`
    sendemail(message, receiverEmail, subject, html)
}

export default createToken

