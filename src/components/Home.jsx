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
const time_sent = new Date();

const MESSAGES = [
    {id: 1, sender: username, message: message_text, time_received: time_sent.getDate()},
    {id: 2, sender: username, message: message_text, time_received: time_sent.getDate() + 1},
    {id: 3, sender: username, message: message_text, time_received: time_sent.getDate() + 2},
    {id: 4, sender: username, message: message_text, time_received: time_sent.getDate() + 3},
    {id: 5, sender: username, message: message_text, time_received: time_sent.getDate() + 4},
    {id: 6, sender: username, message: message_text, time_received: time_sent.getDate() + 5},
    {id: 7, sender: username, message: message_text, time_received: time_sent.getDate() + 6},
    {id: 8, sender: username, message: message_text, time_received: time_sent.getDate() + 7}
  ];


class MessageTile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}; 
    }

    render() {

        return (

        <table className="table table-hover">
            <tbody>
            {
                this.props.messages.map((message) => {  
                    return (
                        <tr><td className="table-row">
                        <div className="sidebar-message-tile" key={message.id}> 
                            <div className="other-user-pic"> 
                                <img src={avatarFallbackImage} className="img-rounded message-pic"/>
                            </div>

                            <div className="message-preview">
                                <p> 
                                    <span className="sender-name">{message.sender}</span>
                                    <span className="message-time">{message.time_received}</span> 
                                </p>
                                    <p className="message-snippet">{message.message}</p>
                            </div>
                        </div>
                        </td></tr>
                    );
                })
            }       
            </tbody>
        </table>
        );
    }
}

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
                                <MessageTile messages={MESSAGES}/>
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
    