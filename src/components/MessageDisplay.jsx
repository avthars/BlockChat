// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file MessageDisplayScreen.jsx
    \brief Display messages for a particulat chat
*/
import React, { Component, Link } from 'react';
import { InputBar } from './InputBar.jsx';

const avatarImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const date = new Date(Date.UTC(2013, 1, 1, 14, 0, 0));


import {
    isSignInPending,
    loadUserData,
    Person,
    getFile,
    putFile,
    lookupProfile,
  } from 'blockstack';
import * as blockstack from 'blockstack';


//**************************************************************
//InputBox component: Box that displays messages for current chat
//Props: messageList - list of messages for current chat
//       userProfilePic
//       currContactProfilePic
//       currContactName - name of contact currently chatting with
//**************************************************************
export class MessageDisplay extends Component {
    
      constructor(props) {
          super(props);
          this.state = {
              messageList: this.props.messageList, 
              currContactName: '',
            };
      }

      componentWillReceiveProps(nextProps){
          this.setState({
              messageList: nextProps.messageList,
              currContactName: nextProps.currContactName,
              currContactProfilePic: nextProps.currContactProfilePic,
              currContact: nextProps.currContact,
          }, () => {console.log("Updated props in Message Display")});
      }
    

      render() {
        return (
            <MessageList messageList = {this.state.messageList}
             userId={this.props.userId}
             currContact = {this.props.currContact}/>
        );
      }
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
    constructor(props) {
        super(props);
        this.state = {};
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.userPhotoUrl  = ""
        this.currContactPhoto = ""
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
        lookupProfile(this.props.userId, "https://core.blockstack.org/v1/names/")
            .then((profile) => {
                this.state.userPhotoUrl = profile.image[0].contentUrl
            })
            .catch((error) => {
                console.log('could not find contact with id: ' + name)
            }) 

        lookupProfile(this.props.currContact, "https://core.blockstack.org/v1/names/")
            .then((profile) => {
                this.state.currContactPhoto = profile.image[0].contentUrl
            })
            .catch((error) => {
                console.log('could not find contact with id: ' + name)
            }) 
        return(
            <div>
                <div>
                    <ul className = "list-group">
                        <div className="borderless">
                            {this.props.messageList.map(message => (
                                <MessageInstance message={message} 
                                userId = {this.props.userId} 
                                userPhotoUrl = {this.state.userPhotoUrl}
                                currContactPhoto = {this.state.currContactPhoto}/>
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


class MessageInstance extends Component {
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
                            <div className="message-timstamp"> {} </div>
                            <div className="my-message-body"> 
                                <p>{this.props.message.text} </p>
                             </div>
                        </div>
                        <div className="sender-message-photo">
                            <img src={this.props.userPhotoUrl} className="img-rounded message-photo"/>
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
                            <img src={this.props.currContactPhoto} className="img-rounded message-photo"/>
                        </div>
                        <div className="message-text">
                            <div className="message-timstamp"> {} </div>
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