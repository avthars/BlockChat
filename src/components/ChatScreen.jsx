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
          this.state = {messageList: [],};
      }

    //Function to add new message to list
    addMessage(newMsg){
    console.log('in add message');
      //add to local list of tweets
      this.setState((prevState, props) => {
      //concat new item onto list of old items
     return {messageList: prevState.messageList.concat(newMsg)};
      }, 
      () => {
        //call parent func to put in blockstack storage
        console.log('state in ChatScreen after calling parent func');
        console.log(this.state.messageList);
      });
    }

      render() {
        return (
            <div>
                <ChatHeader/>
                <MessageDisplay messageList = {this.state.messageList}/>
                <InputBar 
                addMessage = {this.addMessage.bind(this)}
                messageList = {this.state.messageList}/>
            </div>
        );
      }
}

export class ChatHeader extends Component {
    
      constructor(props) {
          super(props);
          this.state = {};
      }

      render() {

        const contactName = "Satoshi Nakamoto";



        return (
            <div>
                <header className = "Chat-header">
                    <h2 className= "current-chat-label">{contactName}</h2>
                    <div>
                        <button>Search</button>
                        <button>Call</button>
                        <button>Video</button>
                    </div>
                </header>
            </div>
        );
      }
}