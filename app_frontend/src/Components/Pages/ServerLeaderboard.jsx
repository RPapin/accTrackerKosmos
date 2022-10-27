import { Component } from 'react';
import Base from '../../Modules/Base';
import Navbar from '../Partials/Navbar';
import Footer from '../Partials/Footer';
import Loader from '../Partials/Loader';
import Chart from './../../Modules/Chart';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

class ServerLeaderboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            times: [],
            totalDrivers: 0,
            bestTime: "",
            bestSessions: [],
            trackInfo: "",
            usedCars: [],
            bestCarAvg: [],
            avgCars: [],
            validCount: [],
            notValidTimes: [],
            allLapsCount: []
        }
    }
    handleGoBack =  (url) => {
        this.props.history.push(url);
    }
    handleRowClick = (url) => {
        this.props.history.push(url);
    }  
    
    toogleDisplay = (hide) => {
        document.getElementById("loader").style.display = hide ? "block" : "none";
        document.getElementById("normalPage").style.display = hide ?  "none" : "block";
    }
    componentDidMount = () => {
        window.scrollTo(0, 0);

        let id = (window.location.href).split("/");
        let server = id[4];
        let track = id[5];

        document.getElementById("normalPage").style.display = "none";
        axios.post(`http://${Base.getIp()}:${Base.getPort()}/serverLeaderboard/${server}/${track}`)
            .then((res) => {
                
                this.setState({ times: res.data[0], bestTime: res.data[1].tim_totalTime, totalDrivers: res.data[2].tim_driverCount, 
                    bestSessions: res.data[3], trackInfo: res.data[4], usedCars: res.data[5], bestCarAvg: res.data[6], avgCars: res.data[7], 
                    validCount: res.data[8], notValidTimes: res.data[9], allLapsCount: res.data[10] }, () => {
                        this.toogleDisplay(false);
                    });

                Chart.lineChart("gapFirst", this.state.times);
                Chart.doughnutChart("carUsed", this.state.usedCars);

            })
    }

    render = () => {
        return (
            <div>
                <div id="loader">
                    <Loader />
                </div>
                <div id="normalPage">
                    <Navbar />
                    <section id="serverSection">
                        <div className="row goBackRow">
                            <div className="col-12">
                                <span className="goBackBtn" onClick={() => this.handleGoBack('/')}></span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="row">
     
                                    <div className="col-12 col-md-6">
                                        <h3 id="serverInfo"> {this.state.trackInfo.tra_name}</h3>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <h3 id="serverInfo"> {this.state.trackInfo.ses_serverName}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 only-desktop">
                                <img id="trackTitle" src={this.state.trackInfo.tra_track} alt="" />
                            </div>
                            <div className="col-md-3 only-desktop">
                                <img id="flagTitle" src={this.state.trackInfo.tra_flag} alt="" />
                            </div>
                        </div>
                        <div id="sessionContainer">
                            <table id="sessionList">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>{this.props.t('home.sessionArray.name')}</th>
                                        {/* <th className="only-desktop">Logo</th> */}
                                        <th className="only-desktop">{this.props.t('home.sessionArray.car')}</th>
                                        <th className="only-desktop">S1</th>
                                        <th className="only-desktop">S2</th>
                                        <th className="only-desktop">S3</th>
                                        <th>{this.props.t('home.sessionArray.type')}</th>
                                        <th className="only-desktop">{this.props.t('home.sessionArray.laps')}</th>
                                        <th>{this.props.t('home.sessionArray.gap')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.times.map((time, i) => {

                                            let serverName = (window.location.href).split("/")[4];
                                            let track = (window.location.href).split("/")[5];
                                            serverName = serverName.split("#")[0];
                                            track = track.split("#")[0];
                                            let driverLink = "/serverDetail/" + serverName + "/" + track + "/" + time.tim_driverName;
                                            return (
                                                <tr className="linkTable clickable" onClick={()=> this.handleRowClick(driverLink)} key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{time.tim_driverName}</td>
                                                    {/* <td className="only-desktop"><img src={time.car_img} /></td> */}
                                                    <td className="only-desktop">{time.car_name}</td>
                                                    <td className="only-desktop">{((time.tim_sectorOne === this.state.bestSessions.bestSectorOne ? <span className="bestEle">{time.tim_sectorOne}</span> : time.tim_sectorOne))}</td>
                                                    <td className="only-desktop">{(time.tim_sectorTwo === this.state.bestSessions.bestSectorTwo ? <span className="bestEle">{time.tim_sectorTwo}</span> : time.tim_sectorTwo)}</td>
                                                    <td className="only-desktop">{(time.tim_sectorTree === this.state.bestSessions.bestSectorTree ? <span className="bestEle">{time.tim_sectorTree}</span> : time.tim_sectorTree)}</td>
                                                    <td>{(time.tim_totalTime === this.state.bestDriverTime ? <span className="personalBestEle"> {Base.getFullTime((time.tim_totalTime * 1000))}</span> : Base.getFullTime((time.tim_totalTime * 1000)))}</td>
                                                    <td className="only-desktop">{this.state.validCount.map(count => {
                                                        
                                                        if (count.tim_driverName === time.tim_driverName) {
                                                            const allLaps = this.state.allLapsCount.find(x => x.tim_driverName === count.tim_driverName)
                                                            return <><span className="personalBestEle">{count.tim_validCount}</span> / {allLaps.tim_totalCount}</>;
                                                        }
                                                    })}</td>
                                                    <td>{Base.getGap((this.state.bestTime * 1000), (time.tim_totalTime * 1000))}</td>
                                                </tr>
                                            )
                                        })
                                    }

                                    {
                                        this.state.notValidTimes.map((time, i) => {
                                            let serverName = (window.location.href).split("/")[4];
                                            let track = (window.location.href).split("/")[5];
                                            serverName = serverName.split("#")[0];
                                            track = track.split("#")[0];
                                            let driverLink = "/serverDetail/" + serverName + "/" + track + "/" + time.tim_driverName;
                                            return (
                                                <tr className="linkTable"  key={i}>
                                                    <td><span className="baseEle">-</span></td>
                                                    <td><span className="baseEle">{time.tim_driverName}</span></td>
                                                    {/* <td className="only-desktop"><img src={time.car_img} /></td> */}
                                                    <td className="only-desktop"><span className="baseEle">{time.car_name}</span></td>
                                                    <td className="only-desktop"><span className="baseEle">{time.tim_sectorOne}</span></td>
                                                    <td className="only-desktop"><span className="baseEle">{time.tim_sectorTwo}</span></td>
                                                    <td className="only-desktop"><span className="baseEle">{time.tim_sectorTree}</span></td>
                                                    <td><span className="baseEle"> {Base.getFullTime((time.tim_totalTime * 1000))}</span></td>
                                                    <td className="only-desktop">{this.state.validCount.map(count => {
                                                        if (count.tim_driverName === time.tim_driverName) {
                                                            return count.tim_validCount < 40 ? <span className="personalBestEle">{count.tim_validCount}</span> : <span className="baseEle">{count.tim_validCount}</span>;
                                                        }
                                                    })}</td>
                                                    <td><span className="baseEle">-</span>{/* {Base.getGap((this.state.bestTime * 1000), (time.tim_totalTime * 1000))} */}</td>
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
                    <section id="serverSection">
                        <div id="sessionTitle">
                            <div className="row">
                                <div className="col-12">
                                    <h1>{this.props.t('fullLeaderboad.details')}</h1>
                                </div>
                            </div>
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
                            {/*                             <br /><br />
                            <div className="row">
                                <div className="col-lg-3"></div>
                                <div className="col-12col-lg-6">
                                    <h1>{this.state.bestCarAvg.car_name}</h1>
                                    <hr />
                                    <h3 id="statSession">BEST CAR</h3>
                                </div>
                                <div className="col-lg-3"></div>
                            </div> */}
                        </div>
                    </section>
                    <section id="chartSection">
                        <div id="sessionTitle">
                            <i className="fas fa-poll-h"></i>
                            <hr />
                            <h1>{this.props.t('serverLeaderboard.stats')}</h1>
                        </div>
                        <div id="chartContainer">
                            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <canvas id="gapFirst"></canvas>
                                        <hr />
                                        <h5>{this.props.t('serverLeaderboard.gapToFirst')}</h5>
                                        <span id="chartDescription">{this.props.t('serverLeaderboard.graphicalRepresentation')}</span>
                                    </div>
                                    <div className="carousel-item">
                                        <canvas id="carUsed"></canvas>
                                        <hr />
                                        <h5>{this.props.t('serverLeaderboard.usedCars')}</h5>
                                        <span id="chartDescription">{this.props.t('serverLeaderboard.graphicalRepresentationNumbersCars')}</span>
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">{this.props.t('previous')}</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">{this.props.t('next')}</span>
                                </button>
                            </div>
                        </div>
                    </section>
                    <Footer />
                </div>
            </div >
        )
    }
}

export default withTranslation()(withRouter(ServerLeaderboard));