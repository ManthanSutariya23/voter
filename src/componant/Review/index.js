import { useEffect, useState, useMemo } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import axios from 'axios';
import { Link } from 'react-router-dom'


function Review({ data, fetchData }) {
    const [loading, setLoading] = useState();
    // const createUsers = (numUsers = voterData.length) => new Array(numUsers).fill(undefined).map(voterData);
    // const voters = createUsers(voterData.length);

    const columns = [
        {
            name: 'Client Name',
            selector: row => row.client_name,

        },
        {
            name: 'Title',
            selector: row => row.client_title,

        },
        {
            name: 'Review',
            selector: row => row.review,

        },
        {
            name: '',
            selector: row => {
                return row.status ? <button onClick={() => handleReviewStatus(false, row._id)} type="button" className="btn btn-outline-danger">
                    Unvisible
                </button>
                    : <button type="button" onClick={() => handleReviewStatus(true, row._id)} className="btn btn-outline-primary">
                        Visible
                    </button>
            },
        }
    ];

    async function handleReviewStatus(status, id) {
        setLoading(true);
        axios.put("http://localhost:8080/review", {
            id: id,
            status: status
        }).then((data) => {
            console.log(data.data);
            fetchData();
            setLoading(false);
        })
            .catch(err => {
                console.log(err)
                // setError(err.response.data.error);
            })
    }

    const tableStyle = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: defaultThemes.default.divider.default,
            },
        },
        headCells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                },
            },
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                },
            },
        },
    };

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="container-fluid row">
                    <div className="col-12 d-flex no-block align-items-center">
                        <h4 className="page-title"><u><Link className="text-dark" to={'/'}>Dashboard</Link></u> {'>'} Review</h4>
                    </div>
                </div>
                <br />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card p-3">
                                <DataTable
                                    //title="Data"
                                    columns={columns}
                                    data={data.data.review}
                                    style={{ fontSize: "30px" }}
                                    progressPending={loading}
                                    highlightOnHover
                                    pointerOnHover
                                    pagination
                                    // paginationResetDefaultPage={resetPaginationToggle}
                                    // fixedHeader={true}
                                    // fixedHeaderScrollHeight={'74vh'}
                                    // subHeaderComponent={subHeaderComponentMemo}
                                    // subHeader
                                    customStyles={tableStyle}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Review;
