// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file InputBar.jsx
    \brief Bar to author and send messages.
*/
import React, { Component, Link } from 'react';

import {
    isSignInPending,
    loadUserData,
    Person,
    getFile,
    putFile,
    lookupProfile,
  } from 'blockstack';
import * as blockstack from 'blockstack';


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

        var name = this.state.text;

        console.log(name);

        lookupProfile(name, "https://core.blockstack.org/v1/names/")
            .then((profile) => {
                var newContact = {
                    id: name, 
                    contactName: profile.name, 
                    picture: profile.image[0].contentUrl,
                };
                // Add it to the object.
                this.props.addContact(newContact);
                console.log("I got here");
                console.log(profile.image[0].contentUrl);
            })
            .catch((error) => {
                console.log('could not find contact with id: ' + name)
            }) 


        // Add it to the object.
        this.props.addContact(newContact);

        //set text in box back to empty after message saved
        this.setState({text: ''});
      }

    render(){
        return(
            <div className="input-group-addon" id ="new-chat-icon" onClick={this.handleOpenModal} >
                <i class="fa fa-search"></i></div>
        );

    }

}
