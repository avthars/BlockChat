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

        var alreadyContact = false;
        for(var i = 0; i < this.state.contactList.length; i++){
            if (this.state.contactList[i].id == name){
                alreadyContact = true
            }
        }

        if (!alreadyContact){
            lookupProfile(name, "https://core.blockstack.org/v1/names/")
            .then((profile) => {
                var newContact = {
                    id: name, 
                    contactName: profile.name, 
                    picture: profile.image[0].contentUrl,
                    lastSeen: 0,
                };
                // Add it to the object.
                this.props.addContact(newContact);
                //console.log("I got here");
                console.log(profile.image[0].contentUrl);
            })
            .catch((error) => {
                console.log('BlockChat ERROR: could not find contact with id: ' + name)
            }) 


            // Add it to the object.
            this.props.addContact(newContact);
        }

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
