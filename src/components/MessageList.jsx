// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file MessageDisplayScreen.jsx
    \brief Display messages for a particulat chat
*/

import React, { Component, Link } from 'react';
import { connect } from 'react-redux';
import InputBar from './InputBar.jsx';

const avatarImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const date = new Date(Date.UTC(2013, 1, 1, 14, 0, 0));

function mapMessageListStateToProps(state) {
    //console.log("in mapMessageListStateToProps")
    console.log(state.allReducers.contactPictures)
    return {
        isSignedIn: state.allReducers.isSignedIn,
        messageList: state.allReducers.messageList,
        fullUserData: state.allReducers.fullUserData,
        userPic: state.allReducers.userPic,
        contactPictures: state.allReducers.contactPictures
    };
}

//! Link the depatcher for actions we want
function mapMessageListDispatchToProps(dispatch) {
    return {
    };
}
//**************************************************************
//InputBox component: Box that displays messages for current chat
//Props: messageList - list of messages for current chat
//       userProfilePic
//       currContactProfilePic
//       currContactName - name of contact currently chatting with
// custome bootstrap: https://v4-alpha.getbootstrap.com/components/list-group/#custom-content
//**************************************************************
class MessageList extends Component {
    constructor() {
        super();
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    scrollToBottom(){
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        return(
            <div>
                <div>
                    <ul className = "list-group">
                        <div className="borderless">
                            {this.props.messageList.map(message => (
                                <MessageInstance message={message}
                                userId = {this.props.fullUserData.username} 
                                contactPictures = {this.props.contactPictures}
                                />
                            ))}
                        </div>
                    </ul>
                </div>

                <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </div>
        );
    }
}
// export the class
export default connect(mapMessageListStateToProps, null)(MessageList);



export class MessageInstance extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                            <img src={this.props.userPic} className="img-rounded message-photo"/>
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
                            <img src={this.props.contactPictures[this.props.message.by]} className="img-rounded message-photo"/>
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