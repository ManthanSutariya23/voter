import { useState } from "react";
import { Link } from 'react-router-dom';
import DataTable, { defaultThemes } from "react-data-table-component";

function Contact({ data }) {

    let [isLoding, setIsLoding] = useState('');

    const columns = [
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Subject',
            selector: row => row.subject,
        },
        {
            name: 'Message',
            selector: row => row.message,
        }
    ];

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
                        <h4 className="page-title"><u><Link className="text-dark" to={'/'}>Dashboard</Link></u> {'>'} Contact</h4>
                    </div>
                </div>
                <br />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card  p-3">
                                <DataTable
                                    //title="Data"
                                    columns={columns}
                                    data={data.data.contact}
                                    style={{ fontSize: "30px" }}
                                    progressPending={isLoding}
                                    highlightOnHover
                                    pointerOnHover
                                    pagination
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

export default Contact;
