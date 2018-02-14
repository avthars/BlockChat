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

          this.state = {
            messageList: '',
            currContact: '',
            userId: '',
        };

        this.addMessage = this.addMessage.bind(this);
      }

    //Function to add new message to list
    addMessage(newMsg) {
    
      this.props.addMessage(newMsg);
      
      // add to storage
      //this.props.putData(this.props.messageList, this.props.currentContact);

        if (this.props.currentContact in this.props.lastMessage) {
        if (newMsg.date > this.props.lastMessage[this.props.currentContact].date) {
            this.props.updateLastMessage(this.props.currentContact, newMsg)
            
            }
        } else {
            this.props.updateLastMessage(this.props.currentContact, newMsg)
        }

       this.setState((prevState, props) => {
        //return { messageList: prevState.messageList.concat(newMsg)};
        }, () => {
          //call parent func to put in blockstack storage
          this.props.putData(this.props.messageList, this.props.currentContact);
        });

    }

    render() {
        if (!this.props.isSignedIn) {
            return null
        }
        else {
            return (
                <div>
                    <ChatHeader/>
                    <div id="message-display">
                        <MessageDisplay />
                    </div>
                    
                    <InputBar addMessage = {this.addMessage.bind(this)}/>
                </div>
            );
        } 
      }
}

// export the class
export default connect(mapChatScreenStateToProps, mapChatScreenDispatchToProps)(ChatScreen);
