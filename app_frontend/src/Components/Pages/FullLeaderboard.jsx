import { Component } from 'react';
import Navbar from './../Partials/Navbar';
import Footer from './../Partials/Footer';
import Loader from '../Partials/Loader';
import axios from 'axios';
import Base from './../../Modules/Base';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

class FullLeaderboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            totalDrivers: 0,
            bestTime: "",
            bestSessions: [],
            trackInfo: ""
        }
    }
    handleGoBack =  (url) => {
        this.props.history.push(url);
    }
    componentDidMount = () => {
        window.scrollTo(0, 0);

        const track = window.location.href.split("/");

        document.getElementById("normalPage").style.display = "none";
        axios.post(`http://${Base.getIp()}:${Base.getPort()}/fullLeaderboard/${track[4]}`)
            .then((res) => {
                this.setState({ data: res.data[0], bestTime: res.data[1].tim_totalTime, totalDrivers: res.data[2].tim_driverCount, bestSessions: res.data[3], trackInfo: res.data[4] }, () => {
                    document.getElementById("loader").style.display = "none";
                    document.getElementById("normalPage").style.display = "block";
                });

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
                        <div className="row goBackRow">
                            <div className="col-12">
                                <span className="goBackBtn" onClick={() => this.handleGoBack('/')}></span>
                            </div>
                        </div>
                        <div id="sessionTitle">
                            <h1>{this.props.t('fullLeaderboad.title')} - {this.state.trackInfo.tra_name}</h1>
                        </div>
                        <div id="sessionContainer">
                            <table id="sessionList">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>{this.props.t('home.sessionArray.name')}</th>
                                        <th className="only-desktop">S1</th>
                                        <th className="only-desktop">S2</th>
                                        <th className="only-desktop">S3</th>
                                        <th>{this.props.t('home.sessionArray.time')}</th>
                                        {/* <th>{this.props.t('home.sessionArray.laps')}</th> */}
                                        <th>{this.props.t('home.sessionArray.gap')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.data.map((time, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{time.tim_driverName}</td>
                                                    <td className="only-desktop">{((time.tim_sectorOne === this.state.bestSessions.bestSectorOne ? <span className="bestEle">{time.tim_sectorOne}</span> : time.tim_sectorOne))}</td>
                                                    <td className="only-desktop">{(time.tim_sectorTwo === this.state.bestSessions.bestSectorTwo ? <span className="bestEle">{time.tim_sectorTwo}</span> : time.tim_sectorTwo)}</td>
                                                    <td className="only-desktop">{(time.tim_sectorTree === this.state.bestSessions.bestSectorTree ? <span className="bestEle">{time.tim_sectorTree}</span> : time.tim_sectorTree)}</td>
                                                    <td>{(time.tim_totalTime === this.state.bestDriverTime ? <span className="personalBestEle"> {Base.getFullTime((time.tim_totalTime * 1000))}</span> : Base.getFullTime((time.tim_totalTime * 1000)))}</td>
                                                    {/* <td className="only-desktop">6/40</td> */}
                                                    <td>{Base.getGap((this.state.bestTime * 1000), (time.tim_totalTime * 1000))}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <div className="only-full-desktop" id="tableFooter">
                                <h5>{this.props.t('fullLeaderboad.optimalTime')}: <span className="bestEle"> {Base.getFullTime((this.state.bestSessions.bestSectorOne * 1000) + (this.state.bestSessions.bestSectorTwo * 1000) + (this.state.bestSessions.bestSectorTree * 1000))} </span> </h5>
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
                            <h1>{this.props.t('fullLeaderboad.details')}</h1>
                        </div>
                        <div id="sessionContainer">
                            <div className="row">
                                <div className="col-lg-1"></div>
                                <div className="col-6 col-lg-5">
                                    <h1 id="statSession" className="bestEle">{Base.getFullTime((this.state.bestTime * 1000))}</h1>
                                    <hr />
                                    <h3 id="statSession">{this.props.t('fullLeaderboad.bestTime')}</h3>
                                </div>
                                <div className="col-6 col-lg-5">
                                    <h1 id="statSession">{this.state.totalDrivers}</h1>
                                    <hr />
                                    <h3 id="statSession">{this.props.t('fullLeaderboad.totalDrivers')}</h3>
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

export default withTranslation()(withRouter(FullLeaderboard));