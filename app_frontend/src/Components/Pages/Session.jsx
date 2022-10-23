import { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Navbar from './../Partials/Navbar';
import Footer from '../Partials/Footer';
import Loader from '../Partials/Loader';
import Base from '../../Modules/Base';


class Session extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            serverName: "",
            weatherValue: "",
            totalDrivers: 0,
            bestTime: "",
            bestSessions: []
        }
    }

    handleRowClick = (url) => {
        this.props.history.push(url);
      }  

    componentDidMount = () => {
        window.scrollTo(0, 0);
        let id = (window.location.href).split("/")[4];
        id = id.split("#")[0];
        document.title = `Session detail: ${id}`;
        document.getElementById("normalPage").style.display = "none";
        axios.post(`http://${Base.getIp()}:${Base.getPort()}/session/${id}`)
            .then(res => {
                this.setState({ data: res.data[0], serverName: res.data[1][0].ses_serverName, weatherValue: res.data[1][0].ses_weather, totalDrivers: res.data[1][1].tim_driverCount, bestTime: res.data[1][2].tim_totalTime, bestSessions: res.data[1][3] });
                setTimeout(() => {
                    document.getElementById("loader").style.display = "none";
                    document.getElementById("normalPage").style.display = "block";
                }, 1000);
            })

    }

    render = () => {
        return (
            <div>
                <div id="loader">
                    <Loader />
                </div>
                <div id="normalPage" className="animate__animated animate__fadeIn">
                    <Navbar />
                    <section id="sessionSection">
                        <div id="sessionTitle">
                            <h1>TIMETABLE</h1>
                        </div>
                        <div id="sessionContainer">
                            <table id="sessionList">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Full Name</th>
                                        <th className="only-desktop">S1</th>
                                        <th className="only-desktop">S2</th>
                                        <th className="only-desktop">S3</th>
                                        <th>Time</th>
                                        <th className="only-desktop">Gap</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.data.map((time, i) => {
                                            let sesId = (window.location.href).split("/")[4];
                                            sesId = sesId.split("#")[0];
                                            let driverLink = "/session/" + sesId + "/" + time.tim_driverName;
                                            return (
                                                    <tr className="linkTable" onClick={()=> this.handleRowClick(driverLink)} key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{time.tim_driverName}</td>
                                                        <td className="only-desktop">{((time.tim_sectorOne === this.state.bestSessions.bestSectorOne ? <span className="bestEle">{time.tim_sectorOne}</span> : time.tim_sectorOne))}</td>
                                                        <td className="only-desktop">{(time.tim_sectorTwo === this.state.bestSessions.bestSectorTwo ? <span className="bestEle">{time.tim_sectorTwo}</span> : time.tim_sectorTwo)}</td>
                                                        <td className="only-desktop">{(time.tim_sectorTree === this.state.bestSessions.bestSectorTree ? <span className="bestEle">{time.tim_sectorTree}</span> : time.tim_sectorTree)}</td>
                                                        <td>{Base.getFullTime((time.tim_totalTime * 1000))}</td>
                                                        <td className="only-desktop">{Base.getGap((this.state.bestTime * 1000), (time.tim_totalTime * 1000))}</td>
                                                    </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <div className="only-desktop" id="tableFooter">
                                <h5>OPTIMAL TIME: <span className="bestEle"> {Base.getFullTime((this.state.bestSessions.bestSectorOne * 1000) + (this.state.bestSessions.bestSectorTwo * 1000) + (this.state.bestSessions.bestSectorTree * 1000))} </span> </h5>
                            </div>
                        </div>
                        <div id="arrowCont">
                            <a href="#2">
                                <div className="arrow">
                                    <span></span>
                                    <span></span>
                                </div>
                            </a>
                        </div>
                    </section>
                    <a name="2"></a>
                    <section id="sessionSection2">
                        <div id="sessionTitle">
                            <h1>DETAILS</h1>
                        </div>
                        <div id="sessionContainer">
                            <div className="row">
                                <div className="col-lg-1"></div>
                                <div className="col-6 col-lg-5">
                                    <h1 id="statSession"><i className="fas fa-server"></i></h1>
                                    <hr />
                                    <h3 id="statSession">{this.state.serverName}</h3>
                                </div>
                                <div className="col-6 col-lg-5">
                                    <h1 id="statSession" className="bestEle">{Base.getFullTime((this.state.bestTime * 1000))}</h1>
                                    <hr />
                                    <h3 id="statSession">BEST TIME SESSION</h3>
                                </div>
                                <div className="col-lg-1"></div>
                            </div>
                            <div className="row">
                                <div className="col-lg-1"></div>
                                <div className="col-6 col-lg-5">
                                    <h1 id="statSession"> {this.state.totalDrivers}</h1>
                                    <hr />
                                    <h3 id="statSession">TOTAL DRIVERS</h3>
                                </div>
                                <div className="col-6 col-lg-5">
                                    <h1 className="rotate" id="statSession"> {(this.state.weatherValue <= 0 ? <i className="fas fa-sun fa-spin"></i> : <i className="fas fa-cloud-rain"></i>)} </h1>
                                    <hr />
                                    <h3 id="statSession">WEATHER TYPE</h3>
                                </div>
                                <div className="col-lg-1"></div>
                            </div>
                        </div>
                    </section>
                    <Footer />
                </div>
            </div>
        )
    }
}

export default withRouter(Session);