// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file MessageInstance.jsx
    \brief
*/

import React, { Component, Link } from 'react';
import { connect } from 'react-redux';

const avatarImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

function mapMessageInstanceStateToProps(state) {
    //console.log("State Changed");
    //console.log(state.allReducers);
    return {
        isSignedIn: state.allReducers.isSignedIn,
        userPic: state.allReducers.userPic,
        contactPictures: state.allReducers.contactPictures
    };
}

class MessageInstance extends Component {
    constructor() {
        super();
    }

    render() {

        var displayTime = date.getHours() + ":";
        if (date.getMinutes() < 10) {
            displayTime = displayTime + 0 + date.getMinutes() + ":";
        } 
        else {
            displayTime = displayTime + date.getMinutes() + ":";
        }
        
        if (date.getSeconds() < 10) {
            displayTime = displayTime + 0 + date.getSeconds();
        } 
        else {
            displayTime = displayTime + date.getSeconds();
        }


        if (this.props.message.by == this.props.userId) {
            return (
                <li className = "list-group-item text-right" key={this.props.message.id}>
                    <div>
                        <div className="my-message-text">
                            <div className="message-timstamp"> {displayTime} </div>
                            <div className="my-message-body"> 
                                <p>{this.props.message.text} </p>
                             </div>
                        </div>
                        <div className="sender-message-photo">
                            <img src={avatarImage} className="img-rounded message-photo"/>
                        </div>
                        
                    </div>
                
                </li>
            );
        }
        else {
            return (
                <li className = "list-group-item text-left" key={this.props.message.id}>
                    <div>
                        <div className="sender-message-photo">
                            <img src={avatarImage} className="img-rounded message-photo"/>
                        </div>
                        <div className="message-text">
                            <div className="message-timstamp"> {displayTime} </div>
                            <div className="message-body"> 
                                <p>{this.props.message.text} </p>
                             </div>
                        </div>
                        
                    </div>
                </li>
            );
        }
    }
}

// export the class
export default connect(mapMessageInstanceStateToProps, null)(MessageInstance);