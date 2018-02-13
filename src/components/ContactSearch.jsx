// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file InputBar.jsx
    \brief Bar to author and send messages.
*/
import React, { Component, Link } from 'react';
import { connect } from 'react-redux';

import {
    isSignInPending,
    loadUserData,
    Person,
    getFile,
    putFile,
    lookupProfile,
  } from 'blockstack';
import * as blockstack from 'blockstack';

import {
    addContacts,
    setSearchBarText
  } from '../actions/Actions'

// Get the props from state
function mapContactSearchStateToProps(state) {
    return {
        searchBarText: state.allReducers.searchBarText
    };
}

//! Link the depatcher for actions we want
function mapContactSearchDispatchToProps(dispatch) {
    return {
        addContacts: (contacts) => dispatch(addContacts(contacts)),
        setSearchBarText: (searchBarText) => dispatch(setSearchBarText(searchBarText))
    };
}

//**************************************************************
//InputBox component: User enters a new message and is 
//displayed in chat screen
//**************************************************************
class ContactSearch extends Component {
    
      constructor() {
          super();
        
          this.handleChange = this.handleChange.bind(this);
          this.onSendMessage = this.onSendMessage.bind(this);
      }

      handleChange(event) {
        this.props.setSearchBarText(event.target.value);
      }

      
      //When user submits tweet
      onSendMessage(event) {
        event.preventDefault();
        
        if (!this.props.searchBarText.length) {
          return;
        }
        
        var name = this.props.searchBarText;
        lookupProfile(name, "https://core.blockstack.org/v1/names/").then((profile) => {
                var newContact = {
                    id: name, 
                    contactName: profile.name, 
                    picture: profile.image[0].contentUrl,
                };
                // Add it to the object.
                this.props.addContacts(newContact);
            }).catch((error) => {
                console.log('could not find contact with id: ' + name)
            }) 

        // Add it to the object, and set the search bar text to null
        this.props.addContacts(newContact);
        this.this.props.setSearchBarText('');
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
                        value={this.props.searchBarText}/>
                </div>
            </form>
        );
    }
}

// export the class
export default connect(mapContactSearchStateToProps, mapContactSearchDispatchToProps)(ContactSearch);
