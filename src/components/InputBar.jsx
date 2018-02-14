// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file InputBar.jsx
    \brief Bar to author and send messages.
*/
import React, { Component, Link } from 'react';
import { connect } from 'react-redux';

import {
  setInputBarText
} from '../actions/Actions';

// Get the props from state
function mapInputBarStateToProps(state) {
  //console.log("State Changed");
  //console.log(state.allReducers);
  return {
      inputBarText: state.allReducers.inputBarText,
      messageList: state.allReducers.messageList,
      fullUserData: state.allReducers.fullUserData
  };
}

//! Link the depatcher for actions we want
function mapInputBarDispatchToProps(dispatch) {
  return {
      setInputBarText: (text) => dispatch(setInputBarText(text))
  };
}

//**************************************************************
//InputBox component: User enters a new message and is 
//displayed in chat screen
//**************************************************************
class InputBar extends Component {
    
      constructor() {
          super();

          this.handleSubmit = this.handleSubmit.bind(this)
      }

      handleChange(event) {
        //gets value entered into target and set it to
        // 'text' state field
        //event.target = input field
        //value = current value of it
        this.props.setInputBarText(event.target.value);
      }

      handleKeyPress(event){
        // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
        if ((event.which == 13)  && !event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          this.onSendMessage(event);
        }
      }

      handleSubmit(event) {
        this.props.setInputBarText(" ");
          event.preventDefault();
          event.stopPropagation();
          this.onSendMessage(event);
      }

      
      //When user submits tweet
      onSendMessage(event){
        event.preventDefault();

        if (!this.props.inputBarText.length) {
          return;
        }

        var idnum = this.props.messageList.length;
        // id, text, creator, date
        //Note: redux would be useful here to get the current chat partner's userId as well
        var newMessage = {
          id: idnum, 
          text: this.props.inputBarText, 
          by: this.props.fullUserData.username, 
          date: Date.now(),
          read: false,
          delivered: false,
          deleted: true,
        };

        console.log(idnum)

        //callback to Chatscreen to display message on screen + put message in user storage
        this.props.addMessage(newMessage);
        this.props.setInputBarText(' ');
      }

    render(){

      console.log(this.props.inputBarText)
        return(
          <div className="row" id = "new-message-footer">
          <form className = "form-inline" onSubmit={(event) => this.handleSubmit(event)}>
            <div className = "form-group col-lg-11 col-md-11">
              <textarea className = 'form-control' id="input-box"
                placeholder = 'Write a message here'
                onChange={(event) => this.handleChange(event)}
                onKeyPress={(event) => this.handleKeyPress(event)}
                value={this.props.inputBarText}
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

// export the class
export default connect(mapInputBarStateToProps, mapInputBarDispatchToProps)(InputBar);