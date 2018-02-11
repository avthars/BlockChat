// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file Home.jsx
    \brief HomePage component which houses SideBar and ChatScreen components
*/
import React, { Component, Link } from 'react';
import {SideBar} from './SideBar.jsx';
import {ChatScreen} from './ChatScreen.jsx';
import {Profile} from './Profile.jsx';
import {ContactSearch} from './ContactSearch.jsx';

import {
    isSignInPending,
    loadUserData,
    Person,
    getFile,
    putFile,
    lookupProfile,
  } from 'blockstack';
import * as blockstack from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const username = 'Felix Madutsa';
const sendername = 'Sender Name';
//const blockStackId = 'f.id';
//const status = 'This us just a sample status for a start. I am going high right now so that I can leave';
const message_text = 'this is my message to the world, and it is this that I am writing because I feel like it and I';
const time_sent = new Date(Date.UTC(2013, 1, 1, 14, 0, 0));;

//dummy messages to display in table
const MESSAGES = []

//**************************************************************
// MessageTile component: helper component
// unit for contact display
//**************************************************************
class MessageTile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //user info  
            currContact: '',
          }; 
    }

    //update component when parent state changes
    componentWillReceiveProps(nextProps) {
        this.setState({
            currContact: nextProps.currContact,
        }, () => {
            console.log(this.state);
        });
    }

    render() {

        return (

        <table className="table table-hover">
            <tbody>
            {
                this.props.contactList.map((contact) => {  
                    return (
                        <tr onClick={(e) => this.props.clickedMessageTile(contact.id, e)} 
                            className ={(this.state.currContact == contact.id) ? 'success' : 'none'}>
                        
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

//**************************************************************
// Home component: manages state of messages and
//**************************************************************
export class Home extends Component {
    
      constructor(props) {
          super(props);
          this.state = {
            //user info  
            userName: this.props.userName,
            userId: this.props.userId,
            userBio: this.props.userBio,
            contactList: this.props.contactList,
            //contact currently chatting to -- hard coded rn
            // change to radjei.id or avthar.id, depending desired test
            currContact: '',
            //messages for current chat
            messageList: [],
            isLoading: false,
            selected: '',
          }; 
        this.putDataInStorage  = this.putDataInStorage.bind(this);
        this.fetchMessageData  = this.fetchMessageData.bind(this);
        this.clickedMessageTile = this.clickedMessageTile.bind(this);
      }

      //update component when parent state changes
      componentWillReceiveProps(nextProps) {
          this.setState({
              userName: nextProps.userName,
              userId:nextProps.userId,
              userBio: nextProps.userBio,
              contactList: nextProps.contactList,
          }, () => {
              console.log('Home state:');
              console.log(this.state);
          });
      }

    //puts contact data into users blockstack storage
    putDataInStorage(data, contactName) {
        //debugging:
        console.log('In putData()');
        console.log("Data to be put in storage");
        console.log(data);
        //TO DO: strip contact name of .id
        var rawContact = contactName.replace('.id','');
        var STORAGE_FILE_PATH = rawContact + '.json';
        console.log('Filename: ' + STORAGE_FILE_PATH);
        var options = {encrypt: false};
        let success = blockstack.putFile(STORAGE_FILE_PATH, JSON.stringify(data), options);
        this.setState({messageList: data}, () => {
        console.log('updating state after putting msg in storage');
        console.log(this.state.messageList);});
        if (!success){
        console.log("ERROR: Could not put file in storage");
        }
        else {
        console.log("SUCCESS: PUT FILE IN USER STORAGE");}
    }

    //messages conversation from contactId
    fetchMessageData(contactId){
        this.setState({isLoading: true});
        const options = { username: contactId  };
        const FILE_NAME = this.state.userId.replace('.id','') + '.json';
        console.log(FILE_NAME);
        var oldMessages = this.state.messageList;
        getFile(FILE_NAME, options)
                .then((file) => {
                  var msgs = JSON.parse(file || '[]')
                  this.setState({
                    messageList: msgs,
                  }, () => {
                      console.log('Messages after fetching messages from contact ' + contactId);
                      console.log(this.state.messageList);
                  })
                })
                .catch((error) => {
                  console.log('could not fetch messages from ' + contactId)
                  //reset state back to before load
                  this.setState({messageList: []});
                })
                .finally(() => {
                  this.setState({isLoading: false});
                })
    }

    clickedMessageTile(data, e) {
        // prevent the default
        this.setState({
            currContact: data,
        });
        this.setState({isLoading: true},() => {
            this.fetchMessageData(this.state.currContact);
        });
        e.preventDefault();
    }

    //TEMPORARY: Assume there was a message while you were offline, pull data from currContact
    componentDidMount(){
        this.setState({isLoading: true},() => {
            this.fetchMessageData(this.state.currContact);
        });

        this.setState({isLoading:false}, () => {
            console.log('state after component mount: ');
            console.log(this.state);
        });
    }

    //Function to add new message to list
    addContact(newContact){
        console.log('in add Contact mode');
        
          //add to local list of tweets
          this.setState((prevState, props) => {
          //concat new item onto list of old items
         return {contactList: prevState.contactList.concat(newContact)};
          }, 
          () => {
            //call parent func to put in blockstack storage
            this.props.putContact(this.state.contactList);
            console.log('state in ChatScreen after calling parent func');
            console.log(this.contactList);
          });
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
                                <img src={this.props.userPic} onClick={(e) => this.clickedMessageTile("Felix", e)} className="img-rounded avatar"/>
                            </div>

                            <div className="text-center username-id">
                                <p className="font-weight-bold">{this.props.userName + ' | ' + this.props.userId} </p>
                            </div>

                            <div className="text-center user-status">
                                <p>{this.props.userBio} </p>
                            </div>
                        </div>

                        <div className="message-and-search-box">
                            <div className="search-bar">
                                <ContactSearch 
                                contactList = {this.state.contactList}
                                addContact = {this.addContact.bind(this)}/>
                            </div>

                            <div className="messages-sidebar">
                                <MessageTile
                                    contactList={this.state.contactList} 
                                    currContact = {this.state.currContact} 
                                    clickedMessageTile = {this.clickedMessageTile.bind(this)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9 col-md-9">
                        <ChatScreen
                            putData = {this.putDataInStorage}
                            messageList = {this.state.messageList}
                            currContact = {this.state.currContact}
                            userId = {this.state.userId}
                        />
                    </div> 
                </div>
            </div>
        );
      }
}
    