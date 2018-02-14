// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file Home.jsx
    \brief HomePage component which houses SideBar and ChatScreen components
*/
import React, { Component, Link } from 'react';
import { connect } from 'react-redux';

import {SideBar} from './SideBar.jsx';
import ChatScreen from './ChatScreen.jsx';
import {Profile} from './Profile.jsx';
import ContactSearch from './ContactSearch.jsx';
import MessageTile from './MessageTile.jsx';

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
    addMessage,
    setMessageArray,
    updateLoadingStatus,
    addContacts,
    setCurrentContact,
    updateLastMessage
  } from '../actions/Actions'

// Get the props from state
function mapHomeStateToProps(state) {
    //console.log("State Changed");
    //console.log(state.allReducers);
    return {
        isSignedIn: state.allReducers.isSignedIn,
        currentContact: state.allReducers.currentContact,
        contactList: state.allReducers.contactList,
        userProfile: state.allReducers.userProfile,
        fullUserData: state.allReducers.fullUserData,
        userName: state.allReducers.userName,
        userPic: state.allReducers.userPic,
        userBio: state.allReducers.userBio,
        lastMessage: state.allReducers.lastMessage
    };
}

//! Link the depatcher for actions we want
function mapHomeDispatchToProps(dispatch) {
    return {
        addMessage: (message) => dispatch(addMessage(message)),
        setMessageArray: (message) => dispatch(setMessageArray(message)),
        updateLoadingStatus: (status) => dispatch(updateLoadingStatus(status)),
        updateLastMessage: (userID, newMessage) => dispatch(updateLastMessage(userID, newMessage)),
        addContacts: (contacts) => dispatch(addContacts(contacts)),
        setCurrentContact: (currentContact) => dispatch(setCurrentContact(currentContact)),
    };
}

//**************************************************************
// Home component: manages state of messages and
//**************************************************************
class Home extends Component {
    
      constructor() {
        super();
        this.putDataInStorage  = this.putDataInStorage.bind(this);
        this.fetchMessageData  = this.fetchMessageData.bind(this);
        this.clickedMessageTile = this.clickedMessageTile.bind(this);
      }

    //puts contact data into users blockstack storage
    putDataInStorage(data, contactName) {

        //TO DO: strip contact name of .id
        var rawContact = contactName.replace('.id','');
        var STORAGE_FILE_PATH = rawContact + '.json';
        var options = {encrypt: false};
        let success = blockstack.putFile(STORAGE_FILE_PATH, JSON.stringify(data), options);
        if (!success) {
            console.log("ERROR: Could not put file in storage");
        } 
        else {
            console.log("SUCCESS: PUT FILE IN USER STORAGE");
        }

        //console.log('Call Add message');
        this.props.addMessage(data);
    }

    //messages conversation from contactId
    fetchMessageData(contactId){
        this.props.updateLoadingStatus(true);
        const options = { username: contactId  };
        const FILE_NAME = this.props.fullUserData.username.replace('.id','') + '.json';
        var oldMessages = this.props.messageList;

        getFile(FILE_NAME, options).then((file) => {
            var msgs = JSON.parse(file || '[]')
            this.props.addMessage(msgs);

            // add the last message if we have not seen it
            var lastMessage = msgs[msgs.length - 1];
            if (contactId in this.props.lastMessage) {
                if (lastMessage.date > this.props.lastMessage[contactId].date) {
                    this.props.updateLastMessage(contactId, lastMessage)
                   
                }
            } else {
                this.props.updateLastMessage(contactId, lastMessage)
            }
            

        }).catch((error) => {
            this.props.setMessageArray([]);
        }).finally(() => {
            this.props.updateLoadingStatus(false);
        })
    }

    //TEMPORARY: Assume there was a message while you were offline, pull data from currContact
    componentDidMount(){
        this.props.updateLoadingStatus(false, () => {
            //this.fetchMessageData(this.props.currentContact);
        });
        //this.fetchMessageData(this.props.currentContact);
        this.props.updateLoadingStatus(false, () => {
        });
    }

    //! Function to add new message to list
    //! calls parent func to put in blockstack storage, after adding contact to the list
    addContact(newContact){
        console.log('contact added')
        console.log(newContact)
        this.props.addContacts(newContact)
        this.props.putContact(this.props.contactList);
    }

    clickedMessageTile(data, e) {

        if (this.props.currentContact != data) {
            this.props.setCurrentContact(data);
            this.props.updateLoadingStatus(false, () => {
                //this.fetchMessageData(this.props.currentContact);
            });
            this.fetchMessageData(data);
            e.preventDefault();
        }
    }

    // Event handler for signing out
    handleSignOut(e) {
        e.preventDefault();
        signUserOut(window.location.origin);
    }

    render() {
        return (
            <div className="container-fluid homep">
                <div className="row flex-xl-nowrap home">

                    <div className="col-12 col-lg-3 col-md-4 col-xl-2 bd-sidebar">
                        <div className="profile-sidebar">
                            <div className="profile-userpic">
                                <img src={this.props.userPic} className="img-rounded avatar"/>
                            </div>

                            <div className="text-center username-id">
                                <p className="font-weight-bold">{this.props.fullUserData.userName + ' | ' + this.props.fullUserData.username} </p>
                            </div>

                            <div className="text-center user-status">
                                <p>{this.props.userBio} </p>
                            </div>
                        </div>

                        <div className="message-and-search-box">
                            <div className="search-bar">
                                <ContactSearch />
                            </div>

                            <div className="messages-sidebar">
                                <MessageTile clickedMessageTile = {this.clickedMessageTile.bind(this)}/>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9 col-md-9">
                        <ChatScreen putData = {this.putDataInStorage}/>
                    </div> 
                </div>
            </div>
        );
      }
}

// export the class
export default connect(mapHomeStateToProps, mapHomeDispatchToProps)(Home);