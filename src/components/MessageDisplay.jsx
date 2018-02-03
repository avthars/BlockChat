// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file MessageDisplayScreen.jsx
    \brief Display messages for a particulat chat
*/
import React, { Component, Link } from 'react';
import { InputBar } from './InputBar.jsx';

export class MessageDisplay extends Component {
    
      constructor(props) {
          super(props);
          this.state = {};
      }

      render() {
        return (
            <div className = 'container'>
                <div className = "row bg-success"> 
                    <h1>Secret messages here</h1>
                    <h1>Secret messages here</h1>
                    <h1>Secret messages here</h1>
                </div>
            </div>
        );
      }
}