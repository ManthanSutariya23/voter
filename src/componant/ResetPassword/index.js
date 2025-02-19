import { useEffect, useState } from "react";
import validator from 'validator';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function ResetPassword() {

    let [password, setPassword] = useState('');
    let [cnfPassword, setCnfPassword] = useState('');
    let [passError, setPassError] = useState('');
    let [passCri, setPassCri] = useState(false);
    let [isToken, setIsToken] = useState();
    let [isPassUpdate, setIsPassUpdate] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const queryParams = window.location.pathname;
    const token = queryParams.split('/')[2]
    const id = queryParams.split('/')[3]

    function handleReset(e) {
        e.preventDefault();
        if (password === cnfPassword) {
            setPassError('');
            if (passCri) {
                resetPassword()
            } else {
                setPassError('Please Enter Strong Password');
            }
        } else {
            setPassError('Your Password is not match');
        }
    }

    function resetPassword() {
        axios.put("http://localhost:8080/voter/password", {
            "id": id,
            "password": btoa(password)
        }).then((data) => {
            removeToken()
        })
            .catch(err => console.log(err))
    }

    function removeToken() {
        axios.put("http://localhost:8080/token/removetoken", {
            "token": token
        }).then((data) => {
            setIsPassUpdate(true)
        })
            .catch(err => console.log(err))
    }

    function getToken() {
        axios.post("http://localhost:8080/token/gettoken", {
            "token": token
        }).then((data) => {
            setIsToken(data.data.status)
        })
            .catch(err => console.log(err))
    }

    const validate = (value) => {

        if (validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1,
        })) {
            setErrorMessage('Is Strong Password');
            setPassCri(true);
        } else {
            setErrorMessage('Is Not Strong Password');
            setPassCri(false);
        }
    }

    useEffect(() => {
        getToken()
    }, [])

    return (
        <div style={{ background: '#343A40' }}>
            <div className="page-breadcrumb full-height">
                <div className="row" style={{ marginTop: '50px' }}>
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <div className="card" style={{ background: '#EEEEEE' }}>
                            {isToken ? (<form className="form-horizontal" onSubmit={handleReset}>
                                <div className="card-body">
                                    <div className="text-center pt-3 pb-3">
                                        <span className="db"><img src="../../assets/images/logo-text.png" alt="logo" /></span>
                                    </div>
                                    <h3 className="text-center">Reset Password</h3>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-danger text-white h-100" id="basic-addon2"><i className="mdi mdi-lock fs-4" /></span>
                                        </div>
                                        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); validate(e.target.value) }} className="form-control form-control-lg" placeholder="New Password" aria-label="Password" aria-describedby="basic-addon1" required />
                                    </div>

                                    {errorMessage === '' ? null :
                                        <p className="text-center" style={{
                                            fontWeight: 'bold',
                                            color: 'black',
                                        }}>
                                            {errorMessage}
                                        </p>}
                                    <p>NOTE: Password must contain following letters:
                                        <ul>
                                            <li>one digit from 1 to 9</li>
                                            <li>one lowercase letter</li>
                                            <li>one uppercase letter</li>
                                            <li>one special character</li>
                                            <li>it must be 8-16 characters long.</li>
                                        </ul>
                                    </p>

                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-info text-white h-100" id="basic-addon2"><i className="mdi mdi-lock fs-4" /></span>
                                        </div>
                                        <input type="password" value={cnfPassword} onChange={(e) => { setCnfPassword(e.target.value); }} className="form-control form-control-lg" placeholder=" Confirm Password" aria-label="Password" aria-describedby="basic-addon1" required />
                                    </div>

                                    <p className="m-0 text-white">{passError}</p>
                                    {isPassUpdate ? (<div className="alert alert-success" role="alert">
                                        Password has been Updated
                                    </div>) : (<></>)}

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
                            </form>)
                                : (
                                    <div className="card-body">
                                        <div className="text-center pt-3 pb-3">
                                            <span className="db"><img src="../../assets/images/logo-text.png" alt="logo" /></span>
                                        </div>
                                        <h3 className="text-center">Reset Password</h3>
                                        <div className="alert alert-danger" role="alert">
                                            Your Link has been Expired
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ResetPassword;
