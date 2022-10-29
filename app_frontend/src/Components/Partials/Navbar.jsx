import { Component } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './languageSwitcher/languageSwitcher';
import { withTranslation } from 'react-i18next';

class Navbar extends Component {
    render = () => {
        return (
            <nav className="navbar fixed-top" id='custom-navbar'> 
                <Link to="/">
                    <img className="navbar-brand logo-img" src="/img/logo_KMR_blanc_crop.png" alt="logo" />
                </Link>
                <div className="navbar justify-content-center">
                    <LanguageSwitcher />
                </div>
                <div className="navbar-right justify-content-end">
                    <Link to="/dashboard">
                        <h5><i className="fas fa-user-lock icon-admin"></i>{this.props.t('header.admin')}</h5>
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