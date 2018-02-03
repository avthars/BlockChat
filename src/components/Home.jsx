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
const sendername = 'Sender Name';
const blockStackId = 'felix.id';
const status = 'This us just a sample status for a start. I am going high right now so that I can leave';
const message_text = 'this is my message to the world, and it is this that I am writing because I feel like it and I';

export class Home extends Component {
    
      constructor(props) {
          super(props);
          this.state = {}; 
      }

      render() {
        return (
            <div className="container-fluid homep">
                <div className="row flex-xl-nowrap home">

                    <div className="col-12 col-lg-3 col-md-4 col-xl-2 bd-sidebar">
                        <div className="profile-sidebar">
                            <div className="profile-userpic">
                                <img src={avatarFallbackImage} className="img-rounded avatar"/>
                            </div>

                            <div className="text-center username-id">
                                <p className="font-weight-bold">{username + ' | ' + blockStackId} </p>
                            </div>

                            <div className="text-center user-status">
                                <p>{status} </p>
                            </div>
                        </div>

                        <div className="message-and-search-box">
                            <div className="search-bar">
                                <form>
                                    <div className="input-group">
                                        <div className="input-group-addon"><i className="fa fa-search"></i></div>
                                        <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search BlockChat"/>
                                    </div>
                                </form>
                            </div>

                            <div className="messages-sidebar"> 
                                <div className="sidebar-message-tile"> 
                                    <div className="other-user-pic">
                                        <img src={avatarFallbackImage} className="img-rounded message-pic"/>
                                    </div>

                                    <div className="message-preview">
                                        <p className="font-weight-bold sender-name">{sendername}</p>
                                        <p className="message-snippet">{message_text}</p>
                                    </div>
                                </div>
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
    