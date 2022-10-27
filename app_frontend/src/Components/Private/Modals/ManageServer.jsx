import { Component } from 'react';
import axios from 'axios';
import Base from './../../../Modules/Base';
import { Link } from 'react-router-dom';
import EditServer from './EditServer';

class ManageServer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            arrayPath: [],
        }
    }

    componentDidMount = () => {
        axios.post(`http://${Base.getIp()}:${Base.getPort()}/manageServer`)
            .then(res => {
                this.setState({ arrayPath: res.data });
            })
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render = () => {
        return (
            <div data-dismiss="modal" data-toggle="modal" className="modal animate_animated animate__bounceIn" id="manageServer">
                <div className="modal-dialog modal-dialog-w-85 modal-dialog-centered text-center">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5>Manage ACC's Server</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {this.state.arrayPath.map((path, i) => {
                                return (
                                    <div className="row">
                                        <div className="col-lg-4 col-md-4 only-desktop"><i className="fas fa-server fa-2x"></i></div>
                                        <div className="col 12 col-md-4 col-lg-4">{path.replace("\\SteamLibrary\\steamapps\\common", "\\...")}</div>
                                        <div className="col 12 col-md-4 col-lg-4">
                                            <div className="dropdown">
                                                <button className="btn btn-danger dropdown-toggle" type="button" id="dropDown" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Actions
                                                </button>
                                                <ul className="dropdown-menu w3-animate-opacity" aria-labelledby="dropDown">
                                                    <li><Link data-bs-toggle="modal" data-bs-target="#editServer"  className="dropdown-item">Edit</Link></li>
                                                    <li><Link onClick={function () {
                                                        if (confirm("are you sure?")) {
                                                            axios.post(`http://${Base.getIp()}:${Base.getPort()}/deleteServer`, {server: path})
                                                                .then(res => {
                                                                    window.location.replace("/dashboard");
                                                                })
                                                        }
                                                        
                                                    }} className="dropdown-item">Delete</Link></li>
                                                </ul>
                                                
                                            </div>
                                        </div>
                                        <EditServer id="2" sPath={path} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default ManageServer;