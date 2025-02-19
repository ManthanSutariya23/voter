import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";


function Client({ data }) {

    let [isDetail, setIsDetail] = useState(false);
    let [clientId, setClientId] = useState();

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="container-fluid row">
                    <div className="col-12 d-flex no-block align-items-center">
                        <h4 className="page-title"><u><Link className="text-dark" to={'/'}>Dashboard</Link></u> {'>'} Client List</h4>
                    </div>
                </div>

                {isDetail
                    ? (
                        <>{data.data.client.filter(client => client._id === clientId).map((client) => {
                            return <div className="container-fluid mt-3">
                                <div className="row">
                                    <div className="col-md-3"></div>
                                    <div className="col-md-6">
                                        <div className='card pt-3 pb-3'>
                                            <div className='text-center justify-content-center align-items-center'>
                                                <img src={client.logo === null ? client.logo : 'temp_profile.png'} alt="user" height="200" class="rounded-circle" />

                                                <div style={{ margin: '0px 50px' }}>
                                                    <table class="table table-bordered table-hover">
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row">Company Name</th>
                                                                <td>{client.client_name}</td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">Title</th>
                                                                <td>{client.title ? client.title : 'None'}</td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">Email of Company</th>
                                                                <td>{client.email}</td>
                                                            </tr>

                                                            <tr>
                                                                <th scope="row">Address</th>
                                                                <td>{client.address ? client.address : 'None'}</td>
                                                            </tr>

                                                            <tr>
                                                                <th scope="row">Election Date</th>
                                                                <td>{client.elec_date.split('T')[0]}</td>
                                                            </tr>

                                                            <tr>
                                                                <th scope="row">Election Time</th>
                                                                <td>{client.start_time} to {client.end_time}</td>
                                                            </tr>

                                                            <tr>
                                                                <th scope="row">Total Candidate</th>
                                                                <td>{data.data.candidate.filter(candidate => candidate.client_id === clientId).length}</td>
                                                            </tr>

                                                            <tr>
                                                                <th scope="row">Total Voters</th>
                                                                <td>{data.data.voter.filter(voter => voter.client_id === clientId).length}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className='card-body'>
                                                <span type="button" class="btn btn-primary text-white" onClick={() => { setIsDetail(isDetail = !isDetail) }}>
                                                    back
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3"></div>

                                </div>

                            </div>
                        })}</>
                    )
                    : (<div className="container-fluid mt-3">
                        <div className="row">
                            {data.data.client.map((client) => {
                                return <ClientDetail client={client} isDetail={isDetail} setIsDetail={setIsDetail} setClientId={setClientId} />
                            })}
                        </div>
                    </div>)}
            </div>
        </div>
    );
}

function ClientDetail({ client, isDetail, setIsDetail, setClientId }) {
    return <div className="col-md-6 col-lg-3 col-xlg-3">
        <div className="card card-hover">
            <div className="box p-4 text-center justify-content-center align-items-center">
                <img src={client.logo === null ? client.logo : 'temp_profile.png'} alt="user" width="100" class="rounded-circle" />

                <h3 className="pt-3">{client.client_name}</h3>
                <h3 className="pt-3">{client.review}</h3>

                <div className="align-self-center mt-3">
                    <button type="button" class="btn btn-primary btn-lg text-white" onClick={() => { setIsDetail(isDetail = !isDetail); setClientId(client._id) }}>
                        View
                    </button>
                </div>
            </div>
        </div>
    </div>
}


export default Client;