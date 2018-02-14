// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file ChatScreen.jsx
    \brief Main screen where messages are displayed, composed and sent.
    Chat screen houses the chat header, message display box and message input bar,
*/
import React, { Component, Link } from 'react';
import { connect } from 'react-redux';

import InputBar from './InputBar.jsx';
import MessageDisplay from './MessageDisplay.jsx';
import ChatHeader from './ChatHeader.jsx';

import {
    isSignInPending,
    loadUserData,
    Person,
    getFile,
    putFile,
    lookupProfile,
  } from 'blockstack';
import * as blockstack from 'blockstack';

import {
    addMessage,
    updateLastMessage
  } from '../actions/Actions'

// Get the props from state
function mapChatScreenStateToProps(state) {
    return {
        isSignedIn: state.allReducers.isSignedIn,
        currentContact: state.allReducers.currentContact,
        messageList: state.allReducers.messageList,
        lastMessage: state.allReducers.lastMessage
    };
}

//! Link the depatcher for actions we want
function mapChatScreenDispatchToProps(dispatch) {
    return {
        updateLastMessage: (userID, newMessage) => dispatch(updateLastMessage(userID, newMessage)),
        addMessage: (message) => dispatch(addMessage(message))
    };
}


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
class ChatScreen extends Component {
    
      constructor() {
          super();

        this.addMessage = this.addMessage.bind(this);
      }

    //Function to add new message to list
    addMessage(newMsg) {
        
        // add to storage
        //this.props.putData(this.props.messageList, this.props.currentContact);
        this.props.addMessage(newMsg);

        if (this.props.currentContact in this.props.lastMessage) {
        if (newMsg.date > this.props.lastMessage[this.props.currentContact].date) {
            this.props.updateLastMessage(this.props.currentContact, newMsg)
            }
        } else {
            this.props.updateLastMessage(this.props.currentContact, newMsg)
        }

        //add to local list of tweets
        this.props.writeMessageToTemp(newMsg, this.props.currentContact);

        //call parent func to put in blockstack storage
        this.props.putData(this.state.messageList, this.state.currContact);
    }

      render() {
        return (
            <div>
                <ChatHeader/>
                <div id="message-display">
                    <MessageDisplay />
                    </div>
                    <InputBar 
                        addMessage = {this.addMessage.bind(this)}
                        checkForUpdate = {this.props.checkForUpdate}
                    />
            </div>
        );
      }
}

// export the class
export default connect(mapChatScreenStateToProps, mapChatScreenDispatchToProps)(ChatScreen);
