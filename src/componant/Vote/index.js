import { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

function Vote({ data, fetchData, clientData }) {

    const date = new Date().toISOString();

    console.log(date)
    console.log("Start time: " + clientData.start_time)
    console.log("End time: " + clientData.end_time)
    console.log("Current time: " + date)

    if (date > clientData.start_time) {
        console.log('start date is lower then todate')
    } else {
        console.log('start date is greater then todate')
    }

    return (
        <div style={{ background: '#eeeeee' }}>
            {date > clientData.start_time && date < clientData.end_time
                ? (<VoteRegister data={data} clientData={clientData} fetchData={fetchData} />)
                : date < clientData.start_time
                    ? date > clientData.end_time
                        ? (<Result data={data} clientData={clientData} fetchData={fetchData} />)
                        : (<CommingSoon data={data} clientData={clientData} fetchData={fetchData} />)
                    : (<Result data={data} clientData={clientData} fetchData={fetchData} />)}
        </div>
    );
}

function CommingSoon({ data, clientData, fetchData }) {
    return <div className="container">
        <div className="row">
            <div className="col-md-12">
                <br />
                <br />
                <br />
                <div className="card">
                    <h2 className="text-center mb-3 mt-3">Your Election start at </h2>
                    <h2 className="text-center mb-3">{new Date(clientData.start_time).toString()}</h2>

                    <Ballot data={data} clientData={clientData} fetchData={fetchData} />
                </div>
                <br />
                <br />
                <br />
            </div>
        </div>
    </div>
}

function Result({ data, clientData, fetchData }) {

    let [isLoding, setIsLoding] = useState(true);
    let [ballot, setBallot] = useState('');
    let [candidate, setCandidate] = useState('');

    function getBallot() {
        setIsLoding(true);
        axios.post("http://localhost:8080/ballot/getballot", {
            "client_id": clientData._id,
        }).then((data) => {
            setBallot(data.data);
            console.log(ballot);
            getCandidate()
        }).catch(err => console.log())
    }

    function getCandidate() {
        setIsLoding(true);
        axios.post("http://localhost:8080/candidate/getcandidate", {
            "client_id": clientData._id,
        }).then((data) => {
            setCandidate(data.data)
            console.log("Candidate: " + candidate)
            setIsLoding(false)
        }).catch(err => console.log())
    }

    useEffect(() => {
        getBallot()
    }, [])

    return <div className="container">
        <div className="row">
            <div className="col-md-12">
                <br />
                <br />
                <h2 className="text-center">Result</h2>
                <br />
                <br />
            </div>
            {isLoding ? (<>Loading...</>) : (ballot.map((item) => {
                return <div class="col-md-6">
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
    </div>;
}

function Candidate({ candid }) {
    return <div className="d-flex flex-row comment-row mt-0 border-bottom">
        <div className="p-2">
            <img src={candid.photo ? candid.photo : 'temp_profile.png'} alt="user" width={130} className="rounded-circle" />
        </div>
        <div className="align-self-center comment-text w-100">
            <h3 className="font-medium">{candid.fname || candid.lname ? candid.fname + " " + candid.lname : candid.email}</h3>
            <h4 className="font-medium">Vote: 150</h4>
        </div>
    </div>
}

function Ballot({ data, clientData, fetchData }) {
    let [isLoding, setIsLoding] = useState(true);
    let [ballot, setBallot] = useState('');
    let [candidate, setCandidate] = useState('');

    function getBallot() {
        setIsLoding(true);
        axios.post("http://localhost:8080/ballot/getballot", {
            "client_id": clientData._id,
        }).then((data) => {
            setBallot(data.data);
            console.log(ballot);
            getCandidate()
        }).catch(err => console.log())
    }

    function getCandidate() {
        setIsLoding(true);
        axios.post("http://localhost:8080/candidate/getcandidate", {
            "client_id": clientData._id,
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
            <div className="page-breadcrumb p-0 pt-4">
                <div className="container-fluid p-0">
                    <div class="row">
                        {isLoding ? (<>Loading...</>) : (ballot.map((item) => {
                            return <div class="col-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between flex-row">
                                            <h4 className="card-title mb-0">{item.ballot_name}</h4>
                                        </div>

                                    </div>
                                    <div className="comment-widgets scrollable ps-container ps-theme-default border-top" data-ps-id="d41e73ef-9f47-7f71-f902-5df5ba122492">

                                        {candidate.map((candid) => {
                                            if (item._id === candid.ballot_id) {
                                                return <BallotCandidate candid={candid}>
                                                </BallotCandidate>
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

function BallotCandidate({ candid, children }) {
    return <div className="d-flex flex-row comment-row mt-0 border-bottom">
        <div className="p-2">
            <img src={candid.photo ? candid.photo : 'temp_profile.png'} alt="user" width={50} className="rounded-circle" />
        </div>
        <div className="comment-text w-100">
            <h6 className="font-medium">{candid.fname || candid.lname ? candid.fname + " " + candid.lname : candid.email}</h6>
            <span className="mb-3 d-block">
                {candid.description ? candid.description : 'No Description'}
            </span>
        </div>
        <div className="align-self-center">
            {children}
        </div>
    </div>
}

function VoteRegister({ data, clientData, fetchData }) {

    let [isLoding, setIsLoding] = useState(true);
    let [ballot, setBallot] = useState([]);
    let [candidate, setCandidate] = useState([]);

    function getBallot() {
        setIsLoding(true);
        axios.post("http://localhost:8080/ballot/getballot", {
            "client_id": clientData._id,
        }).then((data) => {
            setBallot(data.data);
            console.log(ballot);
            getCandidate()
        }).catch(err => console.log())
    }

    function getCandidate() {
        setIsLoding(true);
        axios.post("http://localhost:8080/candidate/getcandidate", {
            "client_id": clientData._id,
        }).then((data) => {
            setCandidate(data.data)
            console.log("Candidate: " + candidate)
            setIsLoding(false)
        }).catch(err => console.log())
    }

    useEffect(() => {
        getBallot()
    }, [])

    function handleSubmit(e) {
        e.preventDefault();
        console.log("ballot", ballot)
        console.log("checkVote()", checkVote())
        if (checkVote()) {
            const voting = [];
            ballot.forEach((e) => {
                e.vote.forEach((f) => {
                    voting.push({
                        ballot_id: e._id,
                        candidate_id: f,
                        voter_id: data._id,
                        client_id: e.client_id,
                        date_time: new Date().toISOString()
                    })
                })
            });
            axios.post("http://localhost:8080/vote/multiinsert", {
                voting: voting,
            }).then((data) => {
                window.location.href = '/';
            }).catch(err => console.log())
        }
    }


    function checkVote() {
        let isValid = true;
        ballot.forEach((e) => {
            if (e.max_vote < e.vote.length || e.min_vote > e.vote.length) {
                isValid = false;
            }
        });
        return isValid;
    }

    return <div className="container">
        <div className="row">
            <div className="col-md-12">
                <br />
                <br />
                <h2 className="text-center">Vote</h2>
                <br />
                <br />
            </div>
            <form method="post" onSubmit={handleSubmit}>
                {isLoding ? (<>Loading...</>) : (ballot.map((item) => {

                    return <VoteBallot item={item} candidate={candidate} />
                }))}
                <div className="border-top">
                    <div className="container row">
                        <button type="submit" className="btn btn-primary" >
                            Submit
                        </button> &nbsp;&nbsp;&nbsp;
                    </div>
                </div>
            </form>
        </div>
    </div>;
}

function VoteBallot({ item, candidate }) {

    let [vote, setVote] = useState([]);
    let [error, setError] = useState();

    function handleChange(e) {
        const { value } = e.target;
        if (vote.includes(value)) {
            setVote(vote.filter((s) => s !== value));
        } else {
            setVote([...vote, value]);
        }
    }

    useEffect(() => {
        item.vote = vote;
        checkVote()
    }, [vote])

    function checkVote() {
        if (item.max_vote < vote.length) {
            setError('Select Maximum vote')
        } else if (item.min_vote > vote.length) {
            setError('Select Minimum vote')
        } else {
            setError('')
        }
    }

    useEffect(() => {
        checkVote()
    }, [])
    return <div class="col-md-12">
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between flex-row">
                    <h4 className="card-title mb-0">{item.ballot_name}</h4>
                    <p>Max Vote: {item.max_vote} Min Vote: {item.min_vote}</p>
                </div>

            </div>
            <div className="comment-widgets scrollable ps-container ps-theme-default border-top" data-ps-id="d41e73ef-9f47-7f71-f902-5df5ba122492">
                {candidate.filter(candid => item._id === candid.ballot_id && candid.status).map((candid) => {
                    return <div className="container">
                        <div>
                            <div className={`form-check mr-sm-2 row d-flex align-items-center`} >
                                <input type="checkbox" className="form-check-input" name="vote" value={candid._id} id={candid._id} onChange={(e) => handleChange(e)} />
                                {/* <input type="checkbox" className="form-check-input" name="vote" id={candid._id} onChange={() => handleChange(candid._id)} /> */}
                                <label className="form-check-label mb-0 col-md-11" htmlFor={candid._id}>
                                    <div className="d-flex flex-row comment-row mt-0 border-bottom">
                                        <div className="p-2">
                                            <img src={candid.photo ? candid.photo : 'temp_profile.png'} alt="user" width={130} className="rounded-circle" />
                                        </div>
                                        <div className="align-self-center comment-text w-100">
                                            <h3 className="font-medium">{candid.fname || candid.lname ? candid.fname + " " + candid.lname : candid.email}</h3>
                                            <h4 className="font-medium">{candid.description}</h4>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                })}

                <p className="text-center error">{error}</p>

                <div className="ps-scrollbar-x-rail" style={{ left: '0px', bottom: '0px' }}><div className="ps-scrollbar-x" tabIndex={0} style={{ left: '0px', width: '0px' }} /></div><div className="ps-scrollbar-y-rail" style={{ top: '0px', right: '3px' }}><div className="ps-scrollbar-y" tabIndex={0} style={{ top: '0px', height: '0px' }} /></div></div>
        </div>

        {/* <App /> */}
    </div >
}

export default Vote;
