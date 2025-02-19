import axios from 'axios';


function sendemail(message, receiverEmail, subject, html) {
    axios.post("http://localhost:8080/sendmail", {
        message: message,
        receiverEmail: receiverEmail,
        subject: subject,
        html: html
    }).then((data) => {
        // return data
    }).catch(err => {
        // return err
    })
}

export default sendemail

