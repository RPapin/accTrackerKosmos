import { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Navbar from './../Partials/Navbar';
import Footer from './../Partials/Footer';
import Loader from '../Partials/Loader';
import Base from '../../Modules/Base';
import axios from 'axios';
import Update from '../Private/Modals/Update';
import { withTranslation } from 'react-i18next';
import { DateTime } from "luxon";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            servers: [],
            data: [],
            tracks: []
        }
    }
    handleRowClick = (url) => {
        this.props.history.push(url);
      }  

    componentDidMount = () => {
        window.scrollTo(0, 0);
        document.getElementById("normalPage").style.display = "none";
        axios.post(`http://${Base.getIp()}:${Base.getPort()}`)
            .then((res) => {
                this.setState({ servers: res.data.servers, data: res.data.sessions, tracks: res.data.tracks });
                document.getElementById("loader").style.display = "none";
                document.getElementById("normalPage").style.display = "block";
            });
    }

    render = () => {
        return (
            <div>
                <div id="loader">
                    <Loader />
                </div>
                <div id="normalPage">
                    <Navbar />
                    {/* <section id="homeSection" className="animate__animated animate__fadeIn">
                        <div id="homeContainer">
                            <img src="/img/icon.png" alt="" />
                            <hr />
                            <p id="homeDesc">Car session timing system. Powered by Assetto Corsa Competizione Server <br /> Created by Mattia Devigus</p>
                          <Link data-bs-toggle="modal" data-bs-target="#update">
                                <button className="btn btn-danger">What's new</button>
                            </Link> 
                        </div>
                        <div id="arrowCont">
                            <a href="#2">
                                <div className="arrow">
                                    <span></span>
                                    <span></span>
                                </div>
                            </a>
                            <a name="2"></a>
                        </div>
                    </section> */}
                    <section id="homeSection2">
                        <div id="homeTitle">
                            <h1>{this.props.t('home.serverList')}</h1>
                        </div>
                        <div id="homeContainer2">
                            <div className="container">
                                <div className="row">
                                    {this.state.servers.map((server, i) => {
                                        return (
                                            <div className="col-12 serverCol" key={i}>
                                                <Link id="trackLink" to={"/serverLeaderboard/" + server.ses_serverName + "/" + server.tra_nameCode}>
                                                    <div className="row">
                                                        <div className="col-12 col-md-4">
                                                            <i className="fas fa-server fa-2x"></i>
                                                        </div>
                                                        <div className="col-6 col-md-4">
                                                            <img src={server.tra_track} alt="track" />
                                                        </div>
                                                        <div className="col-6 col-md-4">
                                                            <img src={server.tra_flag} alt="flag" />
                                                        </div>
                                                    </div>
                                                    <h5>{server.ses_serverName}</h5>

                                                </Link>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id="homeSection2">
                        <div id="homeTitle">
                            <h1>{this.props.t('home.totalResultPerTrack')}</h1>
                        </div>
                        <div id="homeContainer2">
                            <div className="container">
                                <div className="row">
                                    {this.state.tracks.map((track, i) => {
                                        return (
                                            <div className="col-6 col-lg-4 trackCol" key={i}>
                                                <Link id="trackLink" to={"/fullLeaderboard/" + track.tra_nameCode}>
                                                    <img id="flagCol" src={track.tra_track} alt="track" />
                                                    <h5>{track.tra_name}</h5>
                                                </Link>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id="homeSection2" className="animate__animated animate__fadeIn">
                        <div id="homeTitle">
                            <h1>{this.props.t('home.sessionList')}</h1>
                        </div>
                        <div id="homeContainer2">
                            <table id="sessionList">
                                <thead>
                                    <tr>
                                        <th>{this.props.t('home.sessionArray.name')}</th>
                                        <th>{this.props.t('home.sessionArray.date')}</th>
                                        <th>{this.props.t('home.sessionArray.track')}</th>
                                        <th className="only-desktop">{this.props.t('home.sessionArray.weather')}</th>
                                        <th className="only-desktop">{this.props.t('home.sessionArray.type')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.data.map((session, i) => {
                                            const dt = DateTime.fromMillis(session.ses_creation)
                                            const dateToDisplay = dt.toLocaleString(DateTime.DATETIME_MED);
                                            return (
                                                <tr className="linkTable" onClick={()=> this.handleRowClick(`session/${session.ses_id}`)} key={i}>
                                                    
                                                    <td>{session.ses_serverName}</td>
                                                    <td>{dateToDisplay}</td>
                                                    <td><span className="only-desktop">{session.tra_name}</span> <img className='only-mobile' src={session.tra_track} /></td>
                                                    <td className="only-desktop"> {(session.ses_weather < 0.1 ? <i className="fas fa-sun"></i> : <i className="fas fa-cloud-rain"></i>)} </td>
                                                    <td className="only-desktop">{session.ses_type}</td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                    <Footer />
                </div >
                <Update />
            </div>
        )
    }
}

export default withTranslation()(withRouter(App));