// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file InputBar.jsx
    \brief Bar to author and send messages.
*/
import React, { Component, Link } from 'react';

//**************************************************************
//InputBox component: User enters a new message and is 
//displayed in chat screen
//**************************************************************
export class InputBar extends Component {
    
      constructor(props) {
          super(props);
          this.state = {
              text: 'Enter your Message Here',
          };
      }

      handleChange(event) {
        //gets value entered into target and set it to
        // 'text' state field
        //event.target = input field
        //value = current value of it
        this.setState({text: event.target.value});
      }

      //When user submits tweet
      onSendMessage(event){
        event.preventDefault();
        
        if (!this.state.text.length) {
          return;
        }
        
        //create the message object
        console.log(this.state.text);

        //callback to Chatscreen to display message on screen
        //callback to parent to put message in user storage

        //set text in box back to empty after message saved
        this.setState({text: ''});
      }

      //<button onClick = {this.props.addTweet}>Input</button>
    render(){
        return(
            <div className = 'input-bar'>
            <form
             onSubmit={this.handleSubmit}>
              <textarea className = 'text-entry-box'
                onChange={(event) => this.handleChange(event)}
                value={this.state.text}
              />
              <button className = 'button'
              onClick = {(event) => this.onSendMessage(event)}>
              Send
              </button>
            </form>
          </div>
        );

    }

}
