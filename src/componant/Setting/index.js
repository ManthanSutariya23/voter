import { useEffect, useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import { Link } from 'react-router-dom';

function Setting({ data, clientData, fetchData }) {

    let [oldPassword, setOldPassword] = useState();
    let [newPassword, setNewPassword] = useState();
    let [showPassword, setShowPassword] = useState(false);

    let [error, setError] = useState();
    let [passMsg, setPassMsg] = useState();
    let [passUpdate, setPassUpdate] = useState(false);
    let [passCri, setPassCri] = useState(false);

    // console.log(clientData)

    const validate = (value) => {

        if (validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1,
        })) {
            setPassMsg('Is Strong Password');
            setPassCri(true);
        } else {
            setPassMsg('Is Not Strong Password');
            setPassCri(false);
        }
    }

    function handleUpdatePassword(e) {
        e.preventDefault();
        if (data.password === oldPassword) {
            if (oldPassword !== newPassword) {
                if (passCri) {
                    axios.put("http://localhost:8080/voter/password", {
                        id: data._id,
                        password: btoa(newPassword)
                    }).then((data) => {
                        setError('');
                        setNewPassword('')
                        setOldPassword('')
                        setPassMsg('')
                        fetchData();
                        setPassUpdate(true);
                    })
                        .catch(err => {
                            console.log(err.response.data.error);
                        })
                } else {
                    setError('New Password is not Match with Password Criteria')
                }
            } else {
                setError('Current Password and New Password is same')
            }
        } else {
            console.log(newPassword)
            setError('Please Enter Correct Current Password')
        }
    }

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="container-fluid row">
                    <div className="col-12 d-flex no-block align-items-center">
                        <h4 className="page-title">Profile</h4>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <div className="card pt-2">
                                {data.approved
                                    ? <></>
                                    : <div className="alert alert-danger mt-3 mb-0" style={{ marginRight: '20px', marginLeft: '20px' }} role="alert">
                                        <h4 className="alert-heading">Sorry, You cannot give vote of {clientData.title}</h4>
                                        <p>
                                            Your Election commission denied you as a voter of {clientData.title}. So you have to ask your election commission about that.
                                        </p>
                                        <hr />
                                    </div>}
                                <div className='text-center justify-content-center align-items-center mt-3'>
                                    <img src={data.photo !== null ? data.photo : 'temp_profile.png'} alt="user" height="200" width='200' class="rounded-circle" />

                                    <div style={{ margin: '40px 50px' }}>
                                        <table class="table table-bordered table-hover">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">First Name</th>
                                                    <td>{data.fname}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Last Name</th>
                                                    <td>{data.lname}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Email</th>
                                                    <td>{data.email}</td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">Address</th>
                                                    <td>{data.address}</td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">Postcode</th>
                                                    <td>{data.postcode}</td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">Gender</th>
                                                    <td>{data.gender}</td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">Status</th>
                                                    <td>{data.approved ? (<>Active</>) : (<span className='error'>Deactive</span>)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <div className="card">
                                <form className="form-horizontal" method="post" onSubmit={handleUpdatePassword}>
                                    <div className="card-body">
                                        <h4 className="card-title">Reset Password</h4>
                                        <div className="form-group row">
                                            <div className="col-md-12">
                                                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="form-control" id="cpassword" placeholder="Current Password" />
                                            </div>
                                        </div>

                                        <div className="form-group row mb-0">
                                            <div className="col-md-12">
                                                <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); validate(e.target.value) }} className="form-control" id="npassword" placeholder="New Password" />
                                            </div>
                                            <div className="col-md-12">
                                                <p className="m-0 mt-2" onClick={() => setShowPassword(showPassword = !showPassword)} style={{ color: '#6352ca', cursor: 'pointer' }}>{showPassword ? 'Hide' : 'Show'} password</p>
                                                {showPassword ? <span>{newPassword}</span> : ''} <br />
                                            </div>
                                            {passMsg === '' ? null :
                                                <p className="mt-1 mb-1" style={{
                                                    fontWeight: 'bold',
                                                }}>
                                                    {passMsg}
                                                </p>}
                                            <p className="m-0">NOTE: Password must contain following letters:
                                                <ul>
                                                    <li>one digit from 1 to 9</li>
                                                    <li>one lowercase letter</li>
                                                    <li>one uppercase letter</li>
                                                    <li>one special character</li>
                                                    <li>it must be 8-16 characters long.</li>
                                                </ul>
                                            </p>
                                            <span className="error">{error}</span>
                                            {passUpdate && (<div className="alert alert-success" role="alert">
                                                Password has been updated
                                            </div>)}

                                        </div>

                                    </div>
                                    <div className="border-top">
                                        <div className="card-body">
                                            <button type="submit" className="btn btn-primary">
                                                Update
                                            </button> &nbsp;&nbsp;&nbsp;

                                            {data.approved
                                                ? <Link to={'/'}>
                                                    <span className="btn btn-outline-success">
                                                        back
                                                    </span>
                                                </Link>
                                                : <></>}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Setting;
