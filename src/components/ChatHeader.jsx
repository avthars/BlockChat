
// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file ChatHeader.jsx
    \brief
*/

import React, { Component, Link } from 'react';
import { connect } from 'react-redux';

// Get the props from state
function mapChatHeaderStateToProps(state) {
    return {
        currentContact: state.allReducers.currentContact
    };
}

//! Link the depatcher for actions we want
function mapChatHeaderDispatchToProps(dispatch) {
    return {
    };
}

class ChatHeader extends Component {
    
      constructor() {
          super();
      }

      render() {
        return (
            <div className="row" id="chat-header">
                <div className="col-lg-10 col-sm-10 col-md-10 col-*-offset-0" id="chat-header-name"> 
                    <h4 className= "current-chat-label">{this.props.currentContact}</h4>
                </div >
                <div className="col-lg-2 col-sm-2 col-md-2 col-*-offset-10">
                    <div id="search-audio-video">
                        <button><i className="fa fa-search"></i></button>
                        <button><i className="fa fa-phone"></i></button>
                        <button><i className="fa fa-video-camera"></i></button>
                    </div>
                </div>
            </div>
        );
      }
}

// export the class
export default connect(mapChatHeaderStateToProps, null)(ChatHeader);