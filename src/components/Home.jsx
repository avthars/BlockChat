// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file Home.jsx
    \brief HomePage component which houses SideBar and ChatScreen components
*/
import React, { Component, Link } from 'react';
import {SideBar} from './SideBar.jsx';
import {ChatScreen} from './ChatScreen.jsx';
import {Profile} from './Profile.jsx';

export class Home extends Component {
    
      constructor(props) {
          super(props);
          this.state = {};
      }

      render() {
        return (
            <div className="row">
                <div className="col-lg-offset-0 col-lg-3 col-md-offset-0 col-md-4">
                    <SideBar/>
                </div>

                <div className="col-lg-9">
                    <ChatScreen/>
                </div>
            </div>
        );
      }
}
    