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
          this.state = {
              messageList: this.props.messageList,
              currContact: this.props.currContact,
              userId: this.props.userId,
        };
      }

    componentWillReceiveProps(nextProps) {
        this.setState({
            messageList: nextProps.messageList,
            currContact: nextProps.currContact,
        });
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
        this.props.putData(this.state.messageList, this.state.currContact);
        console.log('state in ChatScreen after calling parent func');
        console.log(this.state.messageList);
      });
    }

      render() {
        return (
            <div>
                <ChatHeader/>
                <MessageDisplay 
                    messageList = {this.state.messageList}
                    userId = {this.state.userId}
                />
                <InputBar 
                    addMessage = {this.addMessage.bind(this)}
                    messageList = {this.state.messageList}
                    userId = {this.state.userId}
                />
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

        // TODO: get this as props that changes
        const contactName = "Satoshi Nakamoto";

        return (
            <div className="row">
                    <div className="col-lg-2 col-sm-2 col-md-2 col-*-offset-0 search-audio-video">
                        <button><i className="fa fa-search"></i></button>
                        <button><i className="fa fa-phone"></i></button>
                        <button><i className="fa fa-video-camera"></i></button>
                    </div>
                    <div className="col-lg-10 col-sm-10 col-md-10 col-*-offset-2"> 
                        <h4 className= "current-chat-label">{contactName}</h4>
                    </div >
            </div>
        );
      }
}