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
              text: '',
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

        //create new message
        var idnum = this.props.messageList.length;
        // id, text, creator, date
        //Note: redux would be useful here to get the current chat partner's userId as well
        var newMessage = {
          id: idnum, 
          text: this.state.text, 
          by: this.props.userId, 
          date: Date.now(),
          read: false,
          delivered: false,
          deleted: true,
        };

        //callback to Chatscreen to display message on screen + put message in user storage
        this.props.addMessage(newMessage);

        //set text in box back to empty after message saved
        this.setState({text: ''});
      }

    render(){
        return(
          <div className="row" id = "new-message-footer">
          <form className = "form-inline" onSubmit={this.handleSubmit}>
            <div className = "form-group col-lg-11 col-md-11">
              <textarea className = 'form-control' id="input-box"
                placeholder = 'Write a message here'
                onChange={(event) => this.handleChange(event)}
                value={this.state.text}
              />
            </div>

            <div className="form-group">
            <button 
                className = 'btn btn-default btn-lg'
                id = "input-button"
                onClick = {(event) => this.onSendMessage(event)}>
                Send
              </button>
            </div>
          </form>
          </div>
        );
    }
}
