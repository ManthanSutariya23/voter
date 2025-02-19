import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

function Result() {
    let [isLoding, setIsLoding] = useState(true);
    let [ballot, setBallot] = useState('');
    let [candidate, setCandidate] = useState('');

    function getBallot() {
        setIsLoding(true);
        axios.post("http://localhost:8080/ballot/getballot", {
            "client_id": localStorage.getItem('clid'),
        }).then((data) => {
            setBallot(data.data);
            console.log(ballot);
            getCandidate()
        }).catch(err => console.log())
    }

    function getCandidate() {
        setIsLoding(true);
        axios.post("http://localhost:8080/candidate/getcandidate", {
            "client_id": localStorage.getItem('clid'),
        }).then((data) => {
            setCandidate(data.data)
            console.log("Candidate: " + candidate)
            setIsLoding(false)
        }).catch(err => console.log())
    }

    useEffect(() => {
        getBallot()
    }, [])

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="container-fluid row">
                    <div className="col-12 d-flex no-block align-items-center">
                        <h4 className="page-title"><u><Link className="text-dark" to={'/'}>Dashboard</Link></u> {'>'} Result</h4>
                    </div>
                </div>
                <br />
                <div className="container-fluid">
                    <div class="row">
                        {isLoding ? (<>Loading...</>) : (ballot.map((item) => {
                            return <div class="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between flex-row">
                                            <h4 className="card-title mb-0">{item.ballot_name}</h4>
                                        </div>

                                    </div>
                                    <div className="comment-widgets scrollable ps-container ps-theme-default border-top" data-ps-id="d41e73ef-9f47-7f71-f902-5df5ba122492">

                                        {candidate.map((candid) => {
                                            if (item._id === candid.ballot_id) {
                                                return <Candidate candid={candid}>
                                                </Candidate>
                                            } else {
                                                return <></>
                                            }
                                        })}

                                        <div className="ps-scrollbar-x-rail" style={{ left: '0px', bottom: '0px' }}><div className="ps-scrollbar-x" tabIndex={0} style={{ left: '0px', width: '0px' }} /></div><div className="ps-scrollbar-y-rail" style={{ top: '0px', right: '3px' }}><div className="ps-scrollbar-y" tabIndex={0} style={{ top: '0px', height: '0px' }} /></div></div>
                                </div>
                            </div>
                        }))}
                    </div>
                </div>
            </div>
        </div>
    );
}


function Candidate({ candid }) {
    return <div className="d-flex flex-row comment-row mt-0 border-bottom">
        <div className="p-2">
            <img src={candid.photo ? candid.photo : 'temp_profile.png'} alt="user" width={150} className="rounded-circle" />
        </div>
        <div className="align-self-center comment-text w-100">
            <h2 className="font-medium">{candid.fname || candid.lname ? candid.fname + " " + candid.lname : candid.email}</h2>
            <h3 className="font-medium">Vote: 150</h3>
        </div>
    </div>
}

export default Result;
