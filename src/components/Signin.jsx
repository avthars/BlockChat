// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file SignIn.jsx
    \brief Login Screen, shown to a user who has not logged into the application
*/

import React, { Component } from 'react';
import { isUserSignedIn } from 'blockstack';

export default class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="panel-landing text-center" id="section-1">
        <h1 className="landing-heading text-center">Welcome to BlockChat!</h1>
        <p className="lead">
          <button
            className="text-center btn btn-primary btn-lg"
            id="signin-button"
            onClick={ handleSignIn.bind(this) }
          >
            Sign In with BlockstackId
          </button>
        </p>
        <p>BlockChat is an encrypted messaging platform secured by the bitcoin blockchain to help people reclaim their privacy and data on the internet.</p>
      </div>
    );
  }
}
