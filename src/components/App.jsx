// Copyright (c) 2018 BlockChat

// Author:
// Maintainer:

/*! \file App.jsx
    \brief Parent component for app. Handles all interactions with blockstack storage.
           Houses state for use in child components.
*/

import React, { Component, Link } from 'react';
import Signin from './Signin.jsx';
import {Home} from './Home.jsx';
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
} from 'blockstack';

//**************************************************************
// App component: handles main app state and interacts with
// blockstack storage
//**************************************************************
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      //user profile Object
      user: null,
      //Blockstack user data object
      bsUserData: null,
      //list of blockstack IDs for contacts
      userName: 'Nameless',
      userId: 'name_less',
      userBio: '',
      contactList: [],
      contactIndex: 0,
      isLoading: 'false',
    };

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
    this.setState({contactList: data}, () => { 
        console.log('updating state in putDataInStorage');
        console.log(this.state.contactList);});
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
    //if user is signed in
    if(userIsSignedIn){
      let person = this.loadPerson();
      console.log(person);
      let loadedData = this.loadUserData();
      console.log("User data object");
      console.log(loadedData);
      console.log(loadedData.username);

      this.setState({
          isSignedIn: true,
          user: person,
          bsUserData: loadedData,
          userName: person.name(),
          userId: loadedData.username,
          userBio: person.description(),
        });
    }
  }

  //fetch data from user profile and set it as app state
  componentDidMount(){  
    if(this.state.isSignedIn){
      console.log("In didMount");
      //enable encryption in v2
      //var options = {decrypt: false, user: this.state.userId, app: 'http://localhost:8080'};
      var FILE_NAME = 'contacts.json';
      this.fetchContacts(FILE_NAME);
    }
  }

  //fetch contact data
  fetchContacts(FILE_NAME) {
    this.setState({ isLoading: true })
    getFile(FILE_NAME)
      .then((file) => {
        var contacts = JSON.parse(file || '[]')
        console.log('users contact');
        console.log(contacts);
        //change state
        this.setState({
          contactList: contacts,
          contactIndex: contactList.length,
        })
      })
      .finally(() => {
        this.setState({ isLoading: false })
      })
  }

  // Event handler for signing in, which asks for permissions to publish data
  // of the users so that other users can read to this user's storage
  handleSignIn(e) {
    e.preventDefault();
    const origin = window.location.origin
    redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
  }
  // Event handler for signing out
  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  render() {
    //if (!isUserSignedIn()) {
      return (
        <div className="site-wrapper">
          <div className="site-wrapper-inner">
            { !isUserSignedIn() ?
              <Signin handleSignIn={ this.handleSignIn } />
              : <Home 
              handleSignOut={ this.handleSignOut }
              userName = {this.state.userName}
              userId = {this.state.userId}
              userBio = {this.state.userBio}
              contactList = {this.state.contactList}
              />
            }
          </div>
        </div>
      );
      
    //} 
    /*else {
     return (<Home
      handleSignOut={ this.handleSignOut }
      userName = {'Naval Ravikant'}
      userId = {'naval.id'}
      userBio = {'AngelList'}
      contactList = {[]}     
     />);
    } */
    
  }

 
}
