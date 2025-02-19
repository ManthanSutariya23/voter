import { useState, useEffect } from "react";
import validator from 'validator';
import axios from 'axios'
import { useHistory, Navigate, Link } from 'react-router-dom';


function Register() {

    let [isAction, setIsAction] = useState(false);
    let [isLoading, setLoading] = useState(true);
    let [resend, setResend] = useState(false);
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [fname, setFname] = useState('');
    let [lname, setLname] = useState('');
    let [cnfPassword, setCnfPassword] = useState('');
    let [gender, setGender] = useState('');
    let [postcode, setPostCode] = useState('');
    let [address, setAddress] = useState('');
    let [addressProof, setAddressProof] = useState('');
    let [nameProof, setNameProof] = useState('');
    let [photo, setPhoto] = useState('');
    let [nameApprove, setNameApprove] = useState();
    let [addressApprove, setAddressApprove] = useState();
    const t = require("tesseract.js");

    let [error, setError] = useState();
    let [passCri, setPassCri] = useState(false);
    let [passError, setPassError] = useState('');
    let [otp, setOtp] = useState('');
    let [genotp, setGenotp] = useState();
    let [isIdentity, setIsIdentity] = useState('');
    let [isAddress, setIsAddress] = useState();
    let [data, setData] = useState();
    let [clientData, setClientData] = useState();


    const queryParams = window.location.pathname;
    const clId = queryParams.split('/')[2];

    function handleGender(e) {
        const { value, checked } = e.target;

        console.log(`value: ${value} checked: ${checked}`)

        if (checked) {
            setGender(value)
        }
    }

    function getClientDetail() {
        setLoading(true)
        axios.post("http://localhost:8080/client/getdetail", {
            'id': clId
        }).then((data) => {
            // console.log(data.data)
            setClientData(data.data)
            if (clientData !== null && clientData !== '') { setLoading(false) }
        })
            .catch(err => console.log(err))
    }

    function checkEmail(e) {
        e.preventDefault();
        console.log('in')
        axios.post("http://localhost:8080/voter/checkemail", {
            "email": email,
        }).then((data) => { sendOTP(); })
            .catch(err => setPassError('Email is Already Exist !'))
    }

    function handlePostOTP() {
        let oottpp = Math.floor(100000 + Math.random() * 900000);
        setGenotp(oottpp);
        axios.post("http://localhost:8080/sendotp", {
            "email": email,
            "otp": oottpp
        })
            .catch(err => console.log(err))
    }

    function sendOTP() {
        setPassError('');
        if (passCri) {
            handlePostOTP();
            setIsAction(isAction = !isAction);
            restartTimer();
        }
    }

    const [seconds, setSeconds] = useState(20);
    let intervalId;

    function startTimer() {
        setSeconds(20);
        setResend(false);
        intervalId = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
            setSeconds(20);
            setResend(true);
        }, 20000); // 20 seconds in milliseconds
    };

    function restartTimer() {
        clearInterval(intervalId); // Clear the previous interval
        startTimer(); // Start the timer again
    };

    const [errorMessage, setErrorMessage] = useState('')

    const validate = (value) => {

        if (validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1,
        })) {
            setErrorMessage('Password Is Strong ');
            setPassCri(true);
        } else {
            setErrorMessage('Password Is Not Strong ');
            setPassCri(false);
        }
    }

    function verifyOTP() {
        if (genotp === Number(otp)) {
            setResend(false);
            axios.post("http://localhost:8080/voter", {
                client_id: clId,
                email: email,
                password: btoa(password),
                fname: fname,
                lname: lname,
                photo: photo,
                address: address,
                postcode: postcode,
                gender: gender,
                identity_proof: nameProof,
                address_proof: addressProof,
                approved: nameApprove && addressApprove ? 1 : 0,
                approved_date: new Date().toISOString().split('T')[0],
            }).then((data) => {
                setData(data);
                localStorage.setItem("voter_id", data.data._id);
                window.location.href = '/';
            })
                .catch(err => console.log(err))
        }
    }

    function covertToBase64(e) {
        setPhoto('');
        var reader = new FileReader();
        if (e.target.files.length > 0) {
            setError('');
            if ((e.target.files[0].size / 1024) < 1024) {
                setError('');
                reader.readAsDataURL(e.target.files[0])
                reader.onload = () => {
                    // console.log(reader.result);
                    setPhoto(reader.result);
                }
                reader.onerror = error => console.log("Error: ", error);
            } else {
                setError('Image is too large')
            }
        } else {
            setPhoto('');
            setError('Please Select Image')
        }
    }

    function handleIdentityProof(e) {
        setNameApprove(false)
        if ((fname !== null && fname !== '') && (lname !== null && lname !== '')) {
            setIsIdentity('Please Wait, System is processing...')
            e.preventDefault();
            var reader = new FileReader();
            if (e.target.files.length > 0) {
                if ((e.target.files[0].size / 1024) < 1024) {
                    setError('');
                    reader.readAsDataURL(e.target.files[0])
                    reader.onload = () => {
                        // console.log(reader.result);
                        setNameProof(reader.result);
                    }
                    reader.onerror = error => console.log("Error: ", error);

                    t.recognize(e.target.files[0], 'eng', { logger: e => console.log(e) }).then(out => {
                        if (out.data.text.toString().toLowerCase().search(fname.toString().toLowerCase().trim()) > 0 && out.data.text.toString().toLowerCase().search(lname.toString().toLowerCase().trim()) > 0) {
                            setNameApprove(true)
                            setIsIdentity('Your proof of identity is veryfied')
                        } else {
                            setIsIdentity('We can\'t verify your proof of identity. If you register without verify it, you have to tell to your election commission to approve you as a voter.')
                        }
                    })
                } else {
                    setError('Image is too large')
                }
            } else {
                setError('Please Select Image')
            }
        } else {
            setIsIdentity('Please Enter First Name and Last Name')
        }
    }

    function handleAddressProof(e) {
        setAddressApprove(false)
        if ((address !== null && address !== '') && (postcode !== null && postcode !== '')) {
            setIsAddress('Please Wait, System is processing...')
            e.preventDefault();
            var reader = new FileReader();
            if (e.target.files.length > 0) {
                if ((e.target.files[0].size / 1024) < 1024) {
                    setError('');
                    reader.readAsDataURL(e.target.files[0])
                    reader.onload = () => {
                        // console.log(reader.result);
                        setAddressProof(reader.result);
                    }
                    reader.onerror = error => console.log("Error: ", error);
                    t.recognize(e.target.files[0], 'eng', { logger: e => console.log(e) }).then(out => {
                        if (out.data.text.toString().toLowerCase().search(address.toString().toLowerCase().trim()) > 0 && out.data.text.toString().toLowerCase().search(postcode.toString().toLowerCase().trim()) > 0) {
                            setAddressApprove(true)
                            setIsAddress('Your proof of address is veryfied')
                        } else {
                            setIsAddress('We can\'t verify your proof of address. If you register without verify it, you have to tell to your election commission to approve you as a voter.')
                        }
                    })
                } else {
                    setError('Image is too large')
                }
            } else {
                setIsAddress('Please Select Image')
            }
        } else {
            setIsAddress('Please Enter Address and Postcode')
        }
    }

    useEffect(() => {
        getClientDetail()
    }, [])

    return (
        <div style={{ background: '#343A40' }}>
            <div>

                <div className="row col-md-12">
                    {isLoading
                        ? (<p className="text-center">Loading...</p>)
                        : (<div style={{ background: '#' }}>
                            <div>
                                <div className="row" style={{ marginTop: '50px' }}>
                                    <div className="col-md-3"></div>
                                    <div className="col-md-6">
                                        <div className="card mb-5" style={{ background: '#EEEEEE' }}>

                                            {isAction ? (<>
                                                <div className="card m-0">
                                                    <div className="card-body">
                                                        <div className="text-center pt-3 pb-3">
                                                            <span className="db"><img src="../assets/images/logo-text.png" alt="logo" /></span>
                                                        </div>
                                                        <div className="row pb-4">
                                                            <div className="col-3"></div>
                                                            <div className="col-6">
                                                                <p className="fs-4 text-center">OTP will be Sent to your email</p>
                                                                <div className="input-group mb-3">
                                                                    <div className="input-group-prepend">
                                                                        <span className="input-group-text bg-success text-white h-100" id="basic-addon2"><i className="mdi mdi-cellphone-settings fs-4" /></span>
                                                                    </div>
                                                                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="form-control form-control-lg" placeholder="Enter OTP" aria-label="Password" aria-describedby="basic-addon1" required />
                                                                </div>
                                                                {resend
                                                                    ? (<p className="fs-4 m-0 text-center" style={{ cursor: 'pointer' }} onClick={() => { restartTimer(); checkEmail(); }}>Resend OTP</p>)
                                                                    : (<p className="fs-4 text-center m-0">Resend OTP after 00:{seconds} Seconds</p>)
                                                                }

                                                                <div className="form-group border-top border-secondary mt-3">
                                                                    <div className="pt-3 d-grid">
                                                                        <button className="btn btn-block btn-lg btn-info" onClick={() => verifyOTP()} >
                                                                            Sign up
                                                                        </button>
                                                                        <br />
                                                                        <button className="btn btn-block btn-lg btn-success text-white" type="button" onClick={() => { setIsAction(isAction = !isAction); clearInterval(intervalId); }} >
                                                                            Back
                                                                        </button>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>) : (<>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="card m-0">
                                                            <form className="form-horizontal" onSubmit={checkEmail}>
                                                                <div className="card-body">
                                                                    <div className="text-center pt-3 pb-3">
                                                                        <span className="db"><img src="../assets/images/logo-text.png" alt="logo" /></span>
                                                                    </div>
                                                                    <h3 className="text-center mb-4 mt-3">Voter Registration of {clientData.title}</h3>

                                                                    <div className="input-group mb-3">
                                                                        <div className="input-group-prepend">
                                                                            <span className="input-group-text bg-success text-white h-100" id="basic-addon1"><i className="mdi mdi-account fs-4" /></span>
                                                                        </div>
                                                                        <input type="text" value={fname} onChange={(e) => setFname(e.target.value)} className="form-control form-control-lg" placeholder="First Name" aria-label="First Name" aria-describedby="basic-addon1" required />
                                                                    </div>

                                                                    <div className="input-group mb-3">
                                                                        <div className="input-group-prepend">
                                                                            <span className="input-group-text bg-primary text-white h-100" id="basic-addon1"><i className="mdi mdi-account fs-4" /></span>
                                                                        </div>
                                                                        <input type="text" value={lname} onChange={(e) => setLname(e.target.value)} className="form-control form-control-lg" placeholder="Last Name" aria-label="Last Name" aria-describedby="basic-addon1" required />
                                                                    </div>

                                                                    <div className="input-group mb-1">
                                                                        <div className="input-group-prepend">
                                                                            <span className="input-group-text bg-secondary text-white h-100" id="basic-addon1"><i className="mdi mdi-email fs-4" /></span>
                                                                        </div>
                                                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control form-control-lg" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1" required />
                                                                    </div>
                                                                    <p className="mb-3">Please enter correct email because we will send you otp in your email.</p>

                                                                    <div className="input-group mb-3">
                                                                        <div className="input-group-prepend">
                                                                            <span className="input-group-text bg-info text-white h-100" id="basic-addon1"><i className="mdi mdi-gender-male fs-4" /></span>
                                                                        </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                        <div className="form-check fs-4 m-1">
                                                                            <input type="radio" className="form-check-input" style={{ marginTop: '6px' }} id="customControlValidation1" onChange={handleGender} value='Male' name="radio-stacked" required />
                                                                            <label className="form-check-label mb-0" htmlFor="customControlValidation1">Male</label>
                                                                        </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                        <div className="form-check fs-4 m-1">
                                                                            <input type="radio" className="form-check-input" style={{ marginTop: '6px' }} id="customControlValidation2" onChange={handleGender} value='Female' name="radio-stacked" required />
                                                                            <label className="form-check-label mb-0" htmlFor="customControlValidation2">Female</label>
                                                                        </div>

                                                                    </div>

                                                                    <div className="input-group mb-3">
                                                                        <div className="input-group-prepend">
                                                                            <span className="input-group-text bg-danger text-white h-100" id="basic-addon2"><i className="mdi mdi-map-marker fs-4" /></span>
                                                                        </div>
                                                                        <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="form-control form-control-lg" placeholder="Address" aria-label="Address" aria-describedby="basic-addon1" required></textarea>
                                                                    </div>

                                                                    <div className="input-group mb-3">
                                                                        <div className="input-group-prepend">
                                                                            <span className="input-group-text bg-success text-white h-100" id="basic-addon1"><i className="mdi mdi-map-marker-radius fs-4" /></span>
                                                                        </div>
                                                                        <input type="text" value={postcode} onChange={(e) => setPostCode(e.target.value)} className="form-control form-control-lg" placeholder="Enter Postcode" aria-label="Enter Postcode" aria-describedby="basic-addon1" required />
                                                                    </div>

                                                                    <label className="mb-3 mt-2">Upload Your Photo</label>
                                                                    <div className="input-group mb-3">
                                                                        <div className="input-group-prepend">
                                                                            <span className="input-group-text bg-warning text-white h-100" id="nameprrof"><i className="mdi mdi-lock fs-4" /></span>
                                                                        </div>
                                                                        <input type="file" onChange={covertToBase64} className="form-control form-control-lg" accept="image/*" />
                                                                    </div>

                                                                    {photo ? <><img src={photo} className="" alt="Profile" width={150} height={150} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => { setPhoto('') }}>remove</span><br /> </> : ''}

                                                                    <label className="mt-2">Upload Proof of Identity</label><br />
                                                                    <p className="mb-2">Your first name and last name must be mentioned in the proof, which you upload, otherwise you will get error</p>
                                                                    <div className="input-group mb-3">
                                                                        <div className="input-group-prepend">
                                                                            <span className="input-group-text bg-info text-white h-100" id="nameprrof"><i className="mdi mdi-account-card-details fs-4" /></span>
                                                                        </div>
                                                                        <input type="file" onChange={handleIdentityProof} className="form-control form-control-lg" accept="image/*" />
                                                                    </div>
                                                                    {isIdentity === 'Please Wait, System is processing...'
                                                                        ? (<p className="text-warning">{isIdentity}</p>)
                                                                        : isIdentity === 'We can\'t verify your proof of identity. If you register without verify it, you have to tell to your election commission to approve you as a voter.' || isIdentity === 'Please Enter First Name and Last Name'
                                                                            ? (<p className="text-danger">{isIdentity}</p>)
                                                                            : isIdentity === 'Your proof of identity is veryfied'
                                                                                ? (<p className="text-success">{isIdentity}</p>)
                                                                                : (<></>)}
                                                                    {nameProof ? <><img src={nameProof} className="" alt="Profile" width={400} /><br /> </> : ''}

                                                                    <label className="mt-2">Upload Proof of Address</label>
                                                                    <p className="mb-2">Your address must be mentioned in the proof, which you upload, otherwise you will get error</p>
                                                                    <div className="input-group mb-3">
                                                                        <div className="input-group-prepend">
                                                                            <span className="input-group-text bg-dark text-white h-100" id="addressprrof"><i className="mdi mdi-home-map-marker fs-4" /></span>
                                                                        </div>
                                                                        <input type="file" onChange={handleAddressProof} className="form-control form-control-lg" accept="image/*" />
                                                                    </div>

                                                                    {isAddress === 'Please Wait, System is processing...'
                                                                        ? (<p className="text-warning">{isAddress}</p>)
                                                                        : isAddress === 'We can\'t verify your proof of address. If you register without verify it, you have to tell to your election commission to approve you as a voter.' || isAddress === 'Please Enter Address and Postcode'
                                                                            ? (<p className="text-danger">{isAddress}</p>)
                                                                            : isAddress === 'Your proof of address is veryfied'
                                                                                ? (<p className="text-success">{isAddress}</p>)
                                                                                : (<></>)}
                                                                    {addressProof ? <><img src={addressProof} className="" alt="Profile" width={400} /><br /><br /> </> : ''}

                                                                    <div className="input-group mb-3">
                                                                        <div className="input-group-prepend">
                                                                            <span className="input-group-text bg-danger text-white h-100" id="basic-addon2"><i className="mdi mdi-lock fs-4" /></span>
                                                                        </div>
                                                                        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); validate(e.target.value); }} className="form-control form-control-lg" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" required />
                                                                    </div>

                                                                    {errorMessage === '' ? null :
                                                                        <p className="text-center" style={{
                                                                            fontWeight: 'bold',
                                                                        }}>
                                                                            {errorMessage}
                                                                        </p>}
                                                                    <p className="">NOTE: Password must contain following letters:
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
                                                                            <span className="input-group-text bg-primary text-white h-100" id="basic-addon2"><i className="mdi mdi-lock fs-4" /></span>
                                                                        </div>
                                                                        <input type="password" value={cnfPassword} onChange={(e) => { setCnfPassword(e.target.value); }} className="form-control form-control-lg" placeholder=" Confirm Password" aria-label="Password" aria-describedby="basic-addon1" required />
                                                                    </div>
                                                                    <h4 className="m-4 text-center error">{passError}</h4>

                                                                    <div className="border-top border-secondary">
                                                                        <div className="form-group">
                                                                            <div className="pt-3">
                                                                                <button className="form-control form-control-lg btn btn-success text-white" type="submit">
                                                                                    Register
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)

                    }
                </div>
            </div>
        </div>
    );
}

export default Register;
