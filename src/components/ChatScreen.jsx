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

export class ChatScreen extends Component {
    
      constructor(props) {
          super(props);
          this.state = {};
      }

      render() {
        return (
            <div>
                <ChatHeader/>
                <MessageDisplay/>
                <InputBar/>
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