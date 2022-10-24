import { Component } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './languageSwitcher/languageSwitcher';
import { withTranslation } from 'react-i18next';

class Navbar extends Component {
    render = () => {
        return (
            <nav className="navbar fixed-top">
                <Link to="/">
                    {/* <img className="navbar-brand" src="/img/helmet.png" alt="logo" /> */}
                    Kosmos Racing Team
                </Link>
                <div>
                    <LanguageSwitcher />
                </div>
                <div className="navbar-right justify-content-end">
                    <Link to="/dashboard">
                        <h5><i className="fas fa-user-lock"></i>{this.props.t('header.admin')}</h5>
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

export default withTranslation()(Navbar);