import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Login from './componant/Login';
import Setting from './componant/Setting';
import Footer from './componant/Footer';
import Menu from './componant/Menu';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Client from './componant/Client';
import Result from './componant/Result';
import Review from './componant/Review';
import Contact from './componant/Contact';
import Payment from './componant/Payments';
import Register from './componant/Register';
import Vote from './componant/Vote';
import ResetPassword from './componant/ResetPassword';
import Done from './componant/Done';


function App() {

  const [login, setLogin] = useState(false);
  const [clientData, setClientData] = useState();
  const [voterData, setVoterData] = useState();
  const [voteDone, setVoteDone] = useState(false);
  const [vote, setVote] = useState();

  const loginCheck = () => {
    const userId = localStorage.getItem("voter_id")
    try {
      // api call
      if (userId) {
        fetchData();
      }
    } catch (error) {

    }
  }

  function fetchData() {
    const userId = localStorage.getItem("voter_id");
    // console.log('fetch data' + userId)

    axios.post("http://localhost:8080/voter/voterdetail", {
      id: userId,
    }).then((data) => {
      getClientDetail(data.data.client_id, data.data._id)
      setVoterData(data.data)
    })
      .catch(err => console.log(err))
  }

  function getClientDetail(clId, voterId) {
    // console.log("client Id: " + clId)
    axios.post("http://localhost:8080/client/getdetail", {
      'id': clId
    }).then((data) => {
      getVote(voterId)
      setClientData(data.data)
    })
      .catch(err => console.log(err))
  }

  function getVote(voterId) {
    axios.post("http://localhost:8080/vote/getvote", {
      voter_id: voterId
    }).then((data) => {
      console.log(data.data)
      setVote(data.data)
      if (data.data.length > 0) {
        setVoteDone(true)
      }
      setLogin(true);
    })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    loginCheck()
  }, [])

  return (
    login && voteDone
      ? <Router>
        <div id="main-wrapper" data-layout="vertical" data-navbarbg="skin5" data-sidebar-position="absolute" data-header-position="absolute" data-boxed-layout="full">
          <Menu />
          <Routes>
            <Route path="/" element={<Done data={voterData} fetchData={fetchData} clientData={clientData} vote={vote} />} />
            <Route path="/profile" element={<Setting data={voterData} fetchData={fetchData} />} />
            <Route path="/*" element={<Navigate from="/*" to={'/'} />} />
          </Routes>
          <Footer />
        </div>
      </Router>
      : login && voterData.approved ?
        <>
          <Router>
            <div id="main-wrapper" data-layout="vertical" data-navbarbg="skin5" data-sidebar-position="absolute" data-header-position="absolute" data-boxed-layout="full">
              <Menu />
              <Routes>
                <Route path="/" element={<Vote data={voterData} fetchData={fetchData} clientData={clientData} />} />
                <Route path="/profile" element={<Setting data={voterData} fetchData={fetchData} />} />
                <Route path="/review" element={<Review data={clientData} fetchData={fetchData} />} />
                <Route path="/result" element={<Result />} />
                <Route path="/contact" element={<Contact data={clientData} />} />
                <Route path="/client" element={<Client data={clientData} />} />
                <Route path="/payment" element={<Payment data={clientData} />} />
                <Route path="/*" element={<Navigate from="/*" to={'/'} />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </>

        : login && !voterData.approved
          ? (<Router>
            <div id="main-wrapper" data-layout="vertical" data-navbarbg="skin5" data-sidebar-position="absolute" data-header-position="absolute" data-boxed-layout="full">
              <Menu />
              <Routes>
                <Route path="/" element={<Setting data={voterData} fetchData={fetchData} clientData={clientData} />} />
                <Route path="/*" element={<Navigate from="/*" to={'/'} />} />
              </Routes>
              <Footer />
            </div>
          </Router>)
          : <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              < Route path="/register/:id" element={<Register />} />
              < Route path="/resetpassword/:token/:id" element={< ResetPassword />} />
              < Route path="/*" element={< Navigate from="/*" to={'/'} />} />
            </Routes >
          </Router >
  );
}

export default App;
