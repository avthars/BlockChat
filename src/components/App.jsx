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
import {
  isSignInPending,
  isUserSignedIn,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
} from 'blockstack';

//! The app component
export default class App extends Component {

  constructor(props) {
  	super(props);
  }

  // Event handler for signing in, which asks for permissions to publish data
  // of the users so that other users can read to this user's storage
  // TODO: ask if someone can also write to another user's storage, and then add
  // that to the scope array
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
    if (!isUserSignedIn()) {
      return (
        <div className="site-wrapper">
          <div className="site-wrapper-inner">
            { !isUserSignedIn() ?
              <Signin handleSignIn={ this.handleSignIn } />
              : <Home handleSignOut={ this.handleSignOut } />
            }
          </div>
        </div>
      );
      
    } else {
     return (<Home/>);
    }
    
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then((userData) => {
        window.location = window.location.origin;
      });
    }
  }
}
