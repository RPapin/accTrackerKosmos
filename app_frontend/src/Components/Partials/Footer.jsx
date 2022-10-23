import { Component } from 'react';

class Footer extends Component {
    render = () => {
        return (
            <footer>
                <div className="container">
                    <div className="footer-cta pt-3 pb-3">
                        <div className="row">
                            <div className="col-xl-6 col-md-6 mb-30">
                                <div className="single-cta">
                                    <i className="fas fa-crown"></i>
                                    <div className="cta-text">
                                        <h4>Author</h4>
                                        <span>Kosmos x Rémi PAPIN</span>
                                    </div>
                                </div>
                            </div>
                            <hr className="only-mobile"/>
                            <div className="col-xl-6 col-md-6 mb-30">
                                <div className="single-cta">
                                    <i className="fas fa-gamepad"></i>
                                    <div className="cta-text">
                                        <h4>Game</h4>
                                        <span>Assetto Corsa Competizione</span>
                                    </div>
                                </div>
                            </div>
                            <hr className="only-mobile"/>
                            {/* <div className="col-xl-4 col-md-4 mb-30">
                                <div className="single-cta">
                                    <i className="fab fa-paypal"></i>
                                    <div className="cta-text">
                                        <a href="https://paypal.me/mattiadevigus?locale.x=it_IT">
                                            <h4>Donate me</h4>
                                            <span>I would really appreciate it :)</span>
                                        </a>
                                    </div>
                                </div>
                            </div> */}
                            {/* <hr className="only-mobile"/> */}
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer;