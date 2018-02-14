// Copyright (c) 2018 BlockChat

// Author:
// Maintainer:

/*! \file App.jsx
    \brief Parent component for app. Handles all interactions with blockstack storage.
           Houses state for use in child components.
*/

import React, { Component, Link } from 'react';
import { connect } from 'react-redux';
import Signin from './Signin.jsx';
import Home from './Home.jsx';
import * as blockstack from 'blockstack';

import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
  getFile,
  putFile,
  isLaterVersion,
  Person,
  loadUserData,
  lookupProfile,
} from 'blockstack';

import {
  addContacts,
  logInUser,
  updateLoadingStatus 
} from '../actions/Actions'

//! Link the depatcher for actions we want
function mapAppDispatchToProps(dispatch) {
  return {
      logInUser: (usrProfile, userData, usrName, userPic, userBio) => dispatch(logInUser(usrProfile, userData, usrName, userPic, userBio)),
      updateLoadingStatus: (status) => dispatch(updateLoadingStatus(status)),
      addContacts: (contacts) => dispatch(addContacts(contacts)),
  };
}

function mapAppStateToProps(state) {
    return {
        isSignedIn: state.allReducers.isSignedIn,
        contactList: state.allReducers.contactList
    };
  }

//**************************************************************
// App component: handles main app state and interacts with
// blockstack storage
//**************************************************************
class App extends Component {

  constructor() {
    super();

    //bind this to refer to App component for callback
    this.putDataInStorage  = this.putDataInStorage.bind(this);
    this.fetchContacts = this.fetchContacts.bind(this);
  }

  //checks if user is signed in for app state
  checkSignedInStatus() {
    if (blockstack.isUserSignedIn()) {
      return true;
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then(function(userData) {
        window.location = window.location.origin
      })
      return false;
    }
  }

  //puts contact data into users blockstack storage
  putDataInStorage(data) {
    //debugging:
    console.log('In putData()');
    console.log("Data to be put in storage");
    console.log(data);
    //determine what kind of data to store and in which file
    var STORAGE_FILE_PATH = 'contacts.json';

    // TODO: change this and hava callbacks for the updated list
    this.props.addContacts(data);

    //update: set options for MR file storage
    var options = {encrypt: false,};
    let success = blockstack.putFile(STORAGE_FILE_PATH, JSON.stringify(data), options);
    if (!success){
      console.log("ERROR: Could not put file in storage");
    }
    else {
      console.log("SUCCESS: PUT FILE IN USER STORAGE");
    }
  }

  //load user profile
  loadPerson() {
    let profile = blockstack.loadUserData().profile
    return new blockstack.Person(profile)
  }

  loadUserData() {
    let userData = blockstack.loadUserData();
    return userData;
  }

  //check for login on start, then set state to reflect info from profile
  componentWillMount(){
    let userIsSignedIn = this.checkSignedInStatus();
    
    //if user is signed in, get data and call the reduce to save the data
    if(userIsSignedIn){
      let person = this.loadPerson();
      let loadedData = this.loadUserData();
      this.props.logInUser(person,
                           loadedData,
                           person.name(),
                           person.avatarUrl(),
                           person.description())
    }
  }

  //fetch data from user profile and set it as app state
  componentDidMount(){  
    if(isUserSignedIn()){

      //enable encryption in v2
      //var options = {decrypt: false, user: this.state.userId, app: 'http://localhost:8080'};
      var FILE_NAME = 'contacts.json';
      this.fetchContacts(FILE_NAME);
    }
  }

  //fetch contact data
  fetchContacts(FILE_NAME) {

    this.props.updateLoadingStatus(true);

    getFile(FILE_NAME).then((file) => {
        var contacts = JSON.parse(file || '[]')
        this.props.addContacts(contacts);
      }).then(() => {
        this.props.updateLoadingStatus(false);
      })
  }

  // Event handler for signing in, which asks for permissions to publish data
  // of the users so that other users can read to this user's storage
  handleSignIn(e) {
    e.preventDefault();
    const origin = window.location.origin
    redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
  }

  render() {

    if (isUserSignedIn()) {
      return (
        <Home putContact  = {this.putDataInStorage}/>
      );

    } else {
      return (
        <div className="site-wrapper">
            <div className="site-wrapper-inner">
              <Signin handleSignIn={ this.handleSignIn } />
            </div>
          </div>
      );
    }    
  }
}

// export the class
export default connect(mapAppStateToProps, mapAppDispatchToProps)(App);