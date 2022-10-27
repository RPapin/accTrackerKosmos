import axios from 'axios';
import { Component } from 'react';
import Navbar from './../Partials/Navbar';
import Footer from '../Partials/Footer';
import Base from './../../Modules/Base';
import ChartJS from './../../Modules/Chart';
import Loader from '../Partials/Loader';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

class Chart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            driverName: (((window.location.href).split("/")[5]).split("#")[0]).replaceAll("%20", " "),
            times: [""],
            avgSpeed: 0,
            bestTime: 0,
            bestDriverTime: 0,
        }
    }
    handleGoBack =  (url) => {
        this.props.history.push(url);
    }
    componentDidMount = () => {
        document.getElementById("normalPage").style.display = "none";
        window.scrollTo(0, 0);
        let sesId = (window.location.href).split("/")[4];
        let driverId = (window.location.href).split("/")[5];

        axios.post(`http://${Base.getIp()}:${Base.getPort()}/session/${sesId}/${driverId}`)
            .then((res) => {
                this.setState({ times: res.data[0], avgSpeed: res.data[1], bestTime: res.data[2], bestDriverTime: res.data[3] });
                ChartJS.lineChartAvg("laps", this.state.times);
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
                <div id="normalPage">
                    <section id="sessionDetailSection">
                        <Navbar />
                        <div className="row goBackRow">
                            <div className="col-12">
                                <span className="goBackBtn" onClick={() => this.handleGoBack('/')}></span>
                            </div>
                        </div>
                        <div id="sessionTitle">
                            <h1>{this.props.t('sessionDetail.lapsOf')} <span className="baseEle">{this.state.driverName}</span></h1>
                        </div>
                        <div id="sessionContainer">
                            <table id="sessionList">
                                <thead>
                                    <tr>
                                        <th>{this.props.t('home.sessionArray.laps')}</th>
                                        <th>S1</th>
                                        <th>S2</th>
                                        <th>S3</th>
                                        <th>{this.props.t('home.sessionArray.time')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {

                                        this.state.times.map((time, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{time.tim_sectorOne}</td>
                                                    <td>{time.tim_sectorTwo}</td>
                                                    <td>{time.tim_sectorTree}</td>
                                                    <td>{(time.tim_totalTime === this.state.bestDriverTime ? <span className="personalBestEle"> {Base.getFullTime((time.tim_totalTime * 1000))}</span> : Base.getFullTime((time.tim_totalTime * 1000)))}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
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
                    <section id="sessionDetailSection2">
                        <div id="sessionTitle">
                            <h1>{this.props.t('serverLeaderboard.stats')}</h1>
                        </div>
                        <div id="chartContainer">
                            <div className="row">
                                <div className="col col-lg-6">
                                    <i className="fas fa-flag-checkered"></i>
                                    <h3 className="only-desktop" id="statSession">{this.props.t('sessionDetail.avgSpeed')}</h3>
                                    <hr />
                                    <h2>{this.state.avgSpeed} KM/H</h2>
                                </div>
                                <div className="col col-lg-6">
                                    <i className="fas fa-road"></i>
                                    <h3 className="only-desktop" id="statSession">{this.props.t('sessionDetail.gapToFirst')}</h3>
                                    <hr />
                                    <h2 id="statSession">{Base.getGap((this.state.bestTime * 1000), (this.state.bestDriverTime * 1000))}</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-lg-12">
                                    <i className="far fa-chart-bar"></i>
                                    <h3>{this.props.t('sessionDetail.lapTrend')}:</h3>
                                    <canvas id="laps"></canvas>
                                    <hr />
                                    <span id="chartDescription">{this.props.t('sessionDetail.graphDriverPerf')}</span>
                                    <br />
                                    <span>{this.props.t('sessionDetail.whiteLine')}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                    <Footer />
                </div >
            </div>
        )
    }
}

export default withTranslation()(withRouter(Chart));