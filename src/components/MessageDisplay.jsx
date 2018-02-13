// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file MessageDisplayScreen.jsx
    \brief Display messages for a particulat chat
*/
import React, { Component, Link } from 'react';
import { connect } from 'react-redux';
import InputBar from './InputBar.jsx';
import MessageList from './MessageList.jsx'


function mapMessageDisplayStateToProps(state) {
    return {
        isSignedIn: state.allReducers.isSignedIn,
        messageList: state.allReducers.messageList
    };
}

//! Link the depatcher for actions we want
function mapMessageDisplayDispatchToProps(dispatch) {
    return {
    };
}


//**************************************************************
//InputBox component: Box that displays messages for current chat
//Props: messageList - list of messages for current chat
//       userProfilePic
//       currContactProfilePic
//       currContactName - name of contact currently chatting with
//**************************************************************
class MessageDisplay extends Component {
    
      constructor() {
          super();
      }

      render() {
        return (
            <MessageList/>
        );
      }
}

// export the class
export default connect(mapMessageDisplayStateToProps, null)(MessageDisplay);
