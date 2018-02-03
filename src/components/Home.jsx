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

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const username = 'Felix Madutsa';
const blockStackId = 'felix.id';
const status = 'This us just a sample status for a start. I am going high ritht now so that I can leave';

export class Home extends Component {
    
      constructor(props) {
          super(props);
          this.state = {}; 
      }

      render() {
        return (
            <div className="container-fluid">
                <div className="row flex-xl-nowrap home">

                    <div className="col-12 col-lg-3 col-md-4 col-xl-2 bd-sidebar">
                        <div class="row profile-sidebar">
                            <div class="row profile-userpic">
                                <img src={avatarFallbackImage} className="img-rounded avatar"/>
                            </div>

                            <div className="row text-center">
                                <div className="row user-name-id">
                                    <p className="font-weight-bold">{username + ' | ' + blockStackId} </p>
                                </div>
                                <div>
                                    <p className="row user-status">{status} </p>
                                </div>
                            </div>

                            <div className="row search-bar col-lg-offset-0 col-md-offset-0 col-lg-12 col-md-12">
                                <form>
                                    <div className="input-group">
                                        <div className="input-group-addon"><i className="fa fa-search"></i></div>
                                        <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search BlockChat"/>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>

                    <div className="col-lg-9">
                        <ChatScreen/>
                    </div>
                </div>
            </div>
        );
      }
}
    