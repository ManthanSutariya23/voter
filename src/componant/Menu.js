import { Link } from "react-router-dom";



function Menu() {

    function logOut() {
        localStorage.removeItem('voter_id');
        window.location.href = '/';
    }

    return (
        <>
            <header className="topbar" data-navbarbg="skin5">
                <nav className="navbar top-navbar navbar-expand-md navbar-dark">
                    <div className="navbar-header" data-logobg="skin5">
                        <Link to={'/'}>
                            <span className="logo-text ms-2">
                                <img src="../assets/images/logo-text.png" alt="homepage" className="light-logo" />
                            </span>
                        </Link>
                    </div>
                    <div className="navbar-collapse collapse" style={{ paddingLeft: '20px' }} data-navbarbg="skin5">
                        <ul className="navbar-nav float-start me-auto"></ul>
                        <ul className="navbar-nav float-end">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle text-muted waves-effect waves-dark pro-pic" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src="../assets/images/users/1.jpg" alt="user" className="rounded-circle" width={31} />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end user-dd animated" aria-labelledby="navbarDropdown">
                                    <Link to={'/profile'}>
                                        <span className="dropdown-item"><i className="mdi mdi-account me-1 ms-1" /> My Profile</span>
                                    </Link>
                                    <span onClick={() => logOut()} className="dropdown-item"><i className="fa fa-power-off me-1 ms-1" /> Logout</span>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Menu;
