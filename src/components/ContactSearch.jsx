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
export class ContactSearch extends Component {
    
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

        var newContact = this.state.text;

        // Add it to the object.
        this.props.addContact(newContact);

        //set text in box back to empty after message saved
        this.setState({text: ''});
      }

    render(){
        return(
            <form>
                <div className="input-group">
                    <div className="input-group-addon" onClick = {(event) => this.onSendMessage(event)} ><i className="fa fa-search"></i></div>
                    <input type="text" className="form-control"
                        id="inlineFormInputGroup"
                        placeholder="Search BlockChat"
                        onChange={(event) => this.handleChange(event)}
                        value={this.state.text}/>
                </div>
            </form>
        );

    }

}
