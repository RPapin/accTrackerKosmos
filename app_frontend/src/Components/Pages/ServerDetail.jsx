import axios from 'axios';
import { Component } from 'react';
import Navbar from './../Partials/Navbar';
import Footer from '../Partials/Footer';
import Loader from '../Partials/Loader';
import Base from './../../Modules/Base';
import ChartJS from './../../Modules/Chart';
import { VALID_LAPS_TARGET } from '../../constant';

class ServerDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            trackInfo: "trackname",
            times: [],
            bestDriverTime: 0,
            bestTime: 0,
            avgSpeed: 0,
            totalLaps: 0,
            bestSectors: []
        }
    }
    displayAll = () => {
        document.getElementById("loader").style.display = "none";
        document.getElementById("normalPage").style.display = "block";
    }
    componentDidMount = () => {
        window.scrollTo(0, 0);

        const serverName = window.location.href.split("/")[4];
        const track = window.location.href.split("/")[5];
        const driverName = window.location.href.split("/")[6];

        document.getElementById("normalPage").style.display = "none";
        console.log('call to' +  `http://${Base.getIp()}:${Base.getPort()}/serverDetail/${serverName}/${track}/${driverName}`);
        axios.post(`http://${Base.getIp()}:${Base.getPort()}/serverDetail/${serverName}/${track}/${driverName}`)
            .then(res => {
                console.log('res')
                this.setState({ bestDriverTime: res.data[0], bestTime: res.data[1], times: res.data[2], avgSpeed: res.data[3], totalLaps: res.data[4], bestSectors: res.data[5] },
                    this.displayAll)
                ChartJS.lineChartAvg("laps", this.state.times);
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
                    <section id="sessionDetailSection">
                        <div className="card animate__animated animate__fadeIn">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-3"></div>
                                            <div className="col-6 col-md-3">
                                                <img src="/img/v_icon.png" alt="" />
                                            </div>
                                            <div className="col-6 col-md-3">
                                                {<img src={this.state.bestDriverTime.car_img} alt="" />}
                                            </div>
                                            <div className="col-md-3"></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3"></div>
                                            <div className="col-6 col-md-3 ">
                                                <span id="drivername">{(((window.location.href).split("/")[6]).replace("%20", " ")).split("#")[0]}</span>
                                                <hr />
                                                <span className="baseEle">Driver Name</span>
                                            </div>
                                            <div className="col-6 col-md-3">
                                                <span id="drivername">{Base.getGap((this.state.bestDriverTime.tim_totalTime * 1000), (this.state.bestTime.tim_totalTime * 1000))}</span>
                                                <hr />
                                                <span className="baseEle">Gap to best time</span>
                                            </div>
                                            <div className="col-md-3"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12 col-md-4">
                                                <h3>PB TIME: {this.state.bestDriverTime.tim_totalTime === this.state.bestTime.tim_totalTime ? <span className="bestEle">{Base.getFullTime(this.state.bestDriverTime.tim_totalTime * 1000)}</span> : <span>{Base.getFullTime(this.state.bestDriverTime.tim_totalTime * 1000)}</span>}</h3>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <h3>AVG SPEED: <span>{this.state.avgSpeed}</span> Km/h</h3>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <h3>TOTAL LAPS: {this.state.totalLaps.tim_driverCount >= VALID_LAPS_TARGET ? <span className="baseEle">{this.state.totalLaps.tim_driverCount}</span> : <span className="personalBestEle">{this.state.totalLaps.tim_driverCount}</span>} / {VALID_LAPS_TARGET}</h3>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-12 col-md-4">
                                                <h1>S1: {((this.state.bestDriverTime.tim_sectorOne === this.state.bestSectors.bestSectorOne ? <span className="bestEle">{this.state.bestDriverTime.tim_sectorOne}</span> : <span className="personalBestEle">{this.state.bestDriverTime.tim_sectorOne}</span>))}</h1>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <h1>S2: {((this.state.bestDriverTime.tim_sectorTwo === this.state.bestSectors.bestSectorTwo ? <span className="bestEle">{this.state.bestDriverTime.tim_sectorTwo}</span> : <span className="personalBestEle">{this.state.bestDriverTime.tim_sectorTwo}</span>))}</h1>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <h1>S3: {((this.state.bestDriverTime.tim_sectorTree === this.state.bestSectors.bestSectorTree ? <span className="bestEle">{this.state.bestDriverTime.tim_sectorTree}</span> : <span className="personalBestEle">{this.state.bestDriverTime.tim_sectorTree}</span>))}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <a name="2"></a>
                    <section id="sessionDetailSection">
                        <div id="sessionTitle">
                            <i className="fas fa-poll-h"></i>
                            <hr />
                            <h1>LAPS OF <span className="baseEle">{(((window.location.href).split("/")[6]).replaceAll("%20", " ")).split("#")[0]}</span></h1>
                        </div>
                        <div id="sessionContainer">
                            <table id="sessionList">
                                <thead>
                                    <tr>
                                        <th>Lap</th>
                                        <th className="only-desktop">S1</th>
                                        <th className="only-desktop">S2</th>
                                        <th className="only-desktop">S3</th>
                                        <th>Time</th>
                                        <th>Valid</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {

                                        this.state.times.map((time, i) => {
                                            return (
                                                <tr className={(time.tim_totalTime === this.state.bestDriverTime.tim_totalTime ? "bestTr" : "")} key={i}>
                                                    <td id="lapCount">{i + 1}</td>
                                                    <td className="only-desktop">{time.tim_sectorOne}</td>
                                                    <td className="only-desktop">{time.tim_sectorTwo}</td>
                                                    <td className="only-desktop">{time.tim_sectorTree}</td>
                                                    <td><span className={(time.tim_isValid === 0 ? "baseEle" : "")}>{Base.getFullTime((time.tim_totalTime * 1000))}</span></td>
                                                    <td>{(time.tim_aciValid === -1 ? <i class="fa-solid fa-circle-check bestEle"></i> : <i class="fa-solid fa-circle-xmark baseEle"></i>)}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </section>
                    <section id="sessionDetailSection2">
                        <div id="sessionTitle">
                            <i className="far fa-chart-bar"></i>
                            <hr />
                            <h3>LAP TREND:</h3>
                        </div>
                        <div id="chartContainer">
                            <div className="row">
                                <div className="col-12 col-lg-12">
                                    <canvas id="laps"></canvas>
                                    <hr />
                                    <span id="chartDescription">Graphical representation of the performance of the driver's laps during server sessions.</span>
                                    <br />
                                    <span>The white line represents the average of the previous laps</span>
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

export default ServerDetail;