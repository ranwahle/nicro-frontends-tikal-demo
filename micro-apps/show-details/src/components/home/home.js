import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import './home.css';
class Home extends Component {

    render() {
        return (
            <div className="page home">
                <header>
                    <div className="hero-unit">

                        <h1>Show Setails</h1>
                    </div>
                    <div className="hero-subunit">

                    </div>

                </header>
                <main>


                </main>
            </div>
        );
    }
}

export default (inject('store')) (observer(Home));