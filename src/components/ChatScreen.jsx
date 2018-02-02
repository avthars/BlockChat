// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file ChatScreen.jsx
    \brief Main screen where messages are displayed, composed and sent.
*/
import React, { Component, Link } from 'react';
import { InputBar } from './InputBar.jsx';

export class ChatScreen extends Component {
    
      constructor(props) {
          super(props);
          this.state = {};
      }

      render() {
        return (
            <div>
                <h3> Chat Screen </h3>
                <InputBar/>
            </div>
        );
      }
}