import { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
    render = () => {
        return (
            <nav className="navbar fixed-top">
                <Link to="/">
                    {/* <img className="navbar-brand" src="/img/helmet.png" alt="logo" /> */}
                    Kosmos Racing Team
                </Link>
                <div className="navbar-right justify-content-end">
                    <Link to="/dashboard">
                        <h5><i className="fas fa-user-lock"></i> ADMIN AREA </h5>
                    </Link>
                </div>
            </nav>
            /* <nav className="navbar fixed-bottom">
                <div className="row">
                    <div className="col-6">
                        <Link to="/"><i className="fas fa-home fa-2x"></i></Link>
                    </div>
                    <div className="col-6">
                        <Link to="/login"><i className="fas fa-user-lock fa-2x"></i></Link>
                    </div>
                </div>
            </nav> */
        )
    }
}

export default Navbar;