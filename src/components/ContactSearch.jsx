// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file InputBar.jsx
    \brief Bar to author and send messages.
*/
import React, { Component, Link } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';

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
              results: [],
              showModal: false,
          };

          this.handleOpenModal = this.handleOpenModal.bind(this);
          this.handleCloseModal = this.handleCloseModal.bind(this);
      }

      handleOpenModal () {
        this.setState({ showModal: true });
      }
      
      handleCloseModal () {
        this.setState({ 
            showModal: false,
            results: [],
            text: ''
        });
      }

      handleClear(){
          this.setState({results: [],
            text: '',
        });
      }

      //add new contact when user clicks on search result
      clickedContactTile(username, profile) {
        // prevent the default
        this.handleCloseModal();
        var newContact = {
            id: username, 
            contactName: profile.name, 
            picture: profile.image[0].contentUrl,
            lastSeen: 0,};
            //add this person to our contact list
            this.props.addContact(newContact);       
    }

      handleChange(event) {
        //gets value entered into target and set it to
        // 'text' state field
        //event.target = input field
        //value = current value of it
        //event.preventDefault();
        
        console.log('search query: ' + event.target.value);

        this.setState({text: event.target.value}, ()=> {
            //search for all profiles from what user entered
            let link = 'https://core.blockstack.org/v1/search?query=';
            axios
                .get(
                    link + this.state.text
                  )
                  .then(res => {
                    this.setState({ results: res.data.results}, ()=> {
                        console.log('results for: ' + this.state.text);
                        console.log(res.data.results);
                    });
                  })
                  .catch(error => {
                    console.log('BlockChat error: in Contact Search')
                    console.log(error);
                  });
              
        });
      }

    render(){
        return(
            <div>

                

                <div className="input-group-addon" id ="new-chat-icon" onClick={this.handleOpenModal} >
                <i class="fa fa-search"></i></div>

                <ReactModal 
                    isOpen={this.state.showModal}
                    shouldCloseOnEsc={true}
                    contentLabel="Minimal Modal Example"
                >
            <button className = "btn btn-danger" onClick={this.handleCloseModal}>Close</button>
            <form className = "inline-form center-block text-center">
                <h2 className = "current-chat-label mb-3">New Message</h2>
                <div className="col-lg-9 input-group center-block text-center">
                    <input type="text" className="form-control"
                        id="inlineFormInputGroup"
                        placeholder="Enter a contact name (e.g muneeb.id)"
                        onChange={(event) => this.handleChange(event)}
                        value={this.state.text}/>
                </div>
            </form>
            <button className = "btn btn-secondary" onClick = {this.handleClear}>Clear</button>
            <div center-block text-center>
                <h2 className = "text-left current-chat-label">Search Results</h2>
                <div className = "center-block list-group col-lg-6">
                     {this.state.results.map(result => (
                      <button type = "button" onClick = {(event) => {this.clickedContactTile(result.username, result.profile)}} 
                          className = "list-group-item list-group-item-action" key={result.username}>
                      <h5 className = "current-chat-label">{result.profile.name}</h5>
                      <p> {result.username}</p>
                      </button>
                      ))}
                </div>
            </div>
            </ReactModal>
            </div>
        );

    }

}

