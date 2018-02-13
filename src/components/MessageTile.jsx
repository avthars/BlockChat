/// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file  MessageTile.jsx
    \brief 
*/

import React, { Component, Link } from 'react';
import { connect } from 'react-redux';

import {
    addMessage,
    setMessageArray,
    updateLoadingStatus,
    addContacts,
    setCurrentContact
  } from '../actions/Actions'

const message_text = 'I am here now';
const time_sent = new Date();

// Get the props from state
function mapMessageTileStateToProps(state) {
    console.log(state.allReducers.contactList)
    return {
        isSignedIn: state.allReducers.isSignedIn,
        currentContact: state.allReducers.currentContact,
        contactList: state.allReducers.contactList
    };
}

//! Link the depatcher for actions we want
function mapMessageTileDispatchToProps(dispatch) {
    return {
        updateLoadingStatus: (status) => dispatch(updateLoadingStatus(status)),
        setCurrentContact: (currentContact) => dispatch(setCurrentContact(currentContact)),
    };
}

//**************************************************************
// MessageTile component: helper component
// unit for contact display
//**************************************************************
class MessageTile extends React.Component {

    constructor() {
        super();
    }

    render() {

        if (!this.props.isSignedIn) {
            return null
        }
        else {
            return (
                <table className="table table-hover">
                    <tbody>
                    {
                        this.props.contactList.map((contact) => {  
                            return (
                                <tr onClick={(e) => this.props.clickedMessageTile(contact.id, e)} 
                                    className ={(this.props.currentContact == contact.id) ? 'success' : 'none'}>
                                
                                <td className="table-row">
                                <div className="sidebar-message-tile" key={contact.contactName}> 
                                    <div className="other-user-pic"> 
                                        <img src={contact.picture} className="img-rounded message-pic"/>
                                    </div>
        
                                    <div className="message-preview">
                                        <p> 
                                            <span className="sender-name">{contact.contactName}</span>
                                            <span className="message-time">
                                            {time_sent.getHours() + ":" + time_sent.getMinutes() + ":" + time_sent.getSeconds()}</span>
                                        </p>
                                         <p className="message-snippet">{message_text}</p>
                                    </div>
                                </div>
                                </td></tr>
                            );
                        })
                    }       
                    </tbody>
                </table>
            );
        }
    }
}

// export the class
export default connect(mapMessageTileStateToProps, null)(MessageTile);