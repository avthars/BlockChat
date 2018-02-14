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
              currentLamportClock: this.props.currentLamportClock + 1,
          };
      }

      //listen for props updates in parent
      componentWillReceiveProps(nextProps){
        this.setState({currLamportClock: nextProps.currLamportClock+1});
      }

      handleChange(event) {
        //gets value entered into target and set it to
        // 'text' state field
        //event.target = input field
        //value = current value of it
        this.setState({text: event.target.value});
      }

      handleKeyPress(event){
        // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
        if ((event.which == 13)  && !event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          this.onSendMessage(event);
        }
        //console.log("here now 1");
      }

      onSendMessage(event){
        event.preventDefault();
        
        //console.log("here now");

        if (!this.state.text.length) {
          return;
        }
        
        //create the message object
        console.log(this.state.text);

        //this.props.checkForUpdate(this.props.currContact);

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
          type:"msg",
          clock: this.state.currLamportClock,
        };

        console.log(newMessage);

        

        //callback to Chatscreen to display message on screen + put message in user storage
        this.props.addMessage(newMessage);
        console.log("Sent to add message")

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
                onKeyPress={(event) => this.handleKeyPress(event)}
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
