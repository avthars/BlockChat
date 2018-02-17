// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file ChatScreen.jsx
    \brief Main screen where messages are displayed, composed and sent.
    Chat screen houses the chat header, message display box and message input bar,
*/
import React, { Component, Link } from 'react';
import { InputBar } from './InputBar.jsx';
import {MessageDisplay} from './MessageDisplay.jsx';

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
//InputBox component: User enters a new message and is 
//displayed in chat screen
//Props: messageList - list of messages for current chat
//       userProfilePic
//       userId - blockstackId of user
//       currContactProfilePic
//       currContactName - name of contact currently chatting with
//       currContactId - blockstackId of contact
//**************************************************************
export class ChatScreen extends Component {
    
      constructor(props) {
          super(props);
          this.state = {
              messageList: this.props.messageList,
              currContact: this.props.currContact,
              userId: this.props.userId,
              currentLamportClock: this.props.currentLamportClock,
        };
      }

    componentWillReceiveProps(nextProps) {
        this.setState({
            messageList: nextProps.messageList,
            currContact: nextProps.currContact,
            currentLamportClock: nextProps.currentLamportClock,
        });
    }

    //Function to add new message to list
    addMessage(newMsg) {
    
        this.props.updateLastMessage(newMsg, this.props.currentContact)
        this.props.checkForUpdate(this.state.currContact)
        this.setState((prevState, props) => {
        return {messageList: prevState.messageList.concat(newMsg)};
        
        }, () => {
            //call parent func to put in blockstack storage
            this.props.putData(this.state.messageList, this.state.currContact);
            this.props.writeMessageToTemp(newMsg, this.state.currContact);
      });
    }

      render() {
        return (
            <div>
                <ChatHeader currContact = {this.state.currContact}/>
                <div id="message-display">
                    <MessageDisplay 
                        messageList = {this.state.messageList}
                        userId = {this.state.userId}
                        currContact = {this.state.currContact}
                    />
                    </div>
                    <InputBar 
                        addMessage = {this.addMessage.bind(this)}
                        messageList = {this.state.messageList}
                        userId = {this.state.userId}
                        contactList = {this.props.contactList}
                        currContact = {this.state.currContact}
                        currentLamportClock = {this.props.currentLamportClock}
                        checkForUpdate = {this.props.checkForUpdate}
                    />
            </div>
        );
      }
}


export class ChatHeader extends Component {
    
      constructor(props) {
          super(props);
          this.state = {
            currContact: this.props.currContact,
            currContactName: "",
          };
      }

      render() {

        // TODO: get this as props that changes
        const contactName = this.state.currContact;
    
        //wastful, pass this from state
        lookupProfile(this.props.currContact, "https://core.blockstack.org/v1/names/")
            .then((profile) => {
                this.state.currContactName = profile.name
            })
            .catch((error) => {
                console.log('could not find contact with id: ' + name)
            }) 

        return (
            <div className="row" id="chat-header">
                <div className="col-lg-10 col-sm-10 col-md-10 col-*-offset-0" id="chat-header-name"> 
                    <h4 className= "current-chat-label">{this.state.currContactName}</h4>
                </div >
                <div className="col-lg-2 col-sm-2 col-md-2 col-*-offset-10">
                    <div id="search-audio-video">
                        <button><i className="fa fa-search"></i></button>
                        <button><i className="fa fa-phone"></i></button>
                        <button><i className="fa fa-video-camera"></i></button>
                    </div>
                </div>
            </div>
        );
      }
}