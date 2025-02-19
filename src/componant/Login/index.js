import { Link } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import sendemail from '../Comman/sendemail'

function Login() {

    let [email, setEmail] = useState('');
    let [resetEmail, setResetEmail] = useState('');

    let [password, setPassword] = useState('');
    let [isError, setIsError] = useState(false);
    let [isSend, setIsSend] = useState(false);
    let [error, setError] = useState('');

    function login(e) {
        console.log('login')
        e.preventDefault();
        axios.post("http://localhost:8080/voter/login", {
            "email": email,
            "password": btoa(password)
        }).then((data) => {
            console.log(data)
            // if (data.data.approved) {
            setIsError('');
            localStorage.setItem("voter_id", data.data._id);
            window.location.href = "/";
            // } else {
            //     setIsError('Sorry, You are disabled by your admin. So you cannot login.Please contact to your election commision');
            // }
        })
            .catch(err => setIsError('Email id and password is incorrect'))
    }

    function handleReset(e) {
        e.preventDefault();
        console.log('rese')
        console.log(resetEmail)
        axios.post("http://localhost:8080/voter/login", {
            "email": resetEmail
        }).then((data) => {
            console.log(data)
            createToken(data.data._id)
        })
            .catch(err => { setError('Email is not Exist'); setIsSend(false); })
    }

    function createToken(id) {
        setIsSend(false);
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
            sendEmail(token, id)
            setIsError(false);
            setError('')
            setIsSend(true)
        }).catch(err => console.log(err))
    }

    function sendEmail(token, id) {
        const message = ''
        const receiverEmail = resetEmail
        const subject = 'Reset Password from E-Vote Hub'
        const html = `<a href="http://localhost:3002/resetpassword/${token}/${id}">Click Here<a/> to reset your password <br/> <br/>Thank you`
        sendemail(message, receiverEmail, subject, html)
    }

    return (
        <div style={{ background: '#343A40' }}>
            <div className="page-breadcrumb full-height">
                <div className="row" style={{ marginTop: '50px' }}>
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <div className="card" style={{ background: '#EEEEEE' }}>
                            <form className="form-horizontal" onSubmit={login}>
                                <div className="card-body">
                                    <div className="text-center pt-3 pb-3">
                                        <span className="db"><img src="../assets/images/logo-text.png" alt="logo" /></span>
                                    </div>
                                    <h3 className="text-center">Voter Login</h3>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-success text-white h-100" id="basic-addon1"><i className="mdi mdi-email fs-4" /></span>
                                        </div>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control form-control-lg" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1" required />
                                    </div>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-warning text-white h-100" id="basic-addon2"><i className="mdi mdi-lock fs-4" /></span>
                                        </div>
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control form-control-lg" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" required />
                                    </div>
                                    {isError ? <p className="alert alert-danger" role="alert">{isError}</p> : <></>}
                                    <div className="border-top border-secondary">
                                        <div className="form-group">
                                            <div className="pt-3">
                                                <button className="form-control form-control-lg btn btn-success text-white" type="submit">
                                                    Login
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div id="recoverform">
                                <div className="text-center">
                                    <span className="">Enter your e-mail address below and we will send you instructions how to recover a password.</span>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-1"></div>
                                    <form className="col-10" action="post" onSubmit={handleReset}>
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-danger text-white h-100" id="basic-addon1"><i className="mdi mdi-email fs-4" /></span>
                                            </div>
                                            <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="form-control form-control-lg" placeholder="Email Address" aria-label="Username" aria-describedby="basic-addon1" required />
                                            <button className="btn btn-info float-end" type="submit" name="action">
                                                Send Mail
                                            </button>
                                        </div>
                                        {error ? (<div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>) : (<></>)}
                                        {isSend ? (<div className="alert alert-success" role="alert">
                                            Reset password link has been sent to your email
                                        </div>) : (<></>)}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Login;
