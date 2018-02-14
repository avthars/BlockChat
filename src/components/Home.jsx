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
            contactListMessages: {},
            contactListLM: {},
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

        console.log("test")
        console.log(this.state.contactListMessages)
        console.log("done")
        
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
                                    {/*time_sent.getHours() + ":" + time_sent.getMinutes() + ":" + time_sent.getSeconds()*/}</span>
                                </p>
                                 <p className="message-snippet">{"Hey there!  Whats"}</p> 
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
            msgHistory: [],
            receivedMsgs: [],
            inTransitMessages:[],
            isLoading: false,
            selected: '',
            currentLamportClock: 0,
          }; 
        this.putDataInStorage  = this.putDataInStorage.bind(this);
        this.fetchMessageData  = this.fetchMessageData.bind(this);
        this.clickedMessageTile = this.clickedMessageTile.bind(this);
        this.getContactMsgs = this.getContactMsgs.bind(this);
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
        // Before you put any data in storage, you first try to determine which of you two has the most up to date information.
        // You add to the person who has the most updated.
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

        // Might have to change this.
        this.setState({messageList: data}, () => {
        console.log('updating state after putting msg in storage');
        console.log(this.state.messageList);});
        if (!success){
        console.log("ERROR: Could not put file in storage");
        }
        else {
        console.log("SUCCESS: PUT FILE IN USER STORAGE");}
    }

    putInTemp(data, contactName) {
        var rawContact = contactName.replace('.id','');
        var STORAGE_FILE_PATH = rawContact + '_temp.json';
        var options = {encrypt: false};
        let success = blockstack.putFile(STORAGE_FILE_PATH, JSON.stringify(data), options);
    }

    // Gets new messages contact has sent to user.
    getContactMsgs(contact){
        const options = {username:contact};
        const FILE_NAME = this.state.userId.replace('.id','') + '_temp.json';
        var messages = []
        getFile(FILE_NAME, options)
                .then((file) => {
                  messages = JSON.parse(file || '[]')
                  this.setState({
                    receivedMsgs: msgs,
                  }, () => {
                    console.log('Messages I have received');
                    console.log(this.state.receivedMsgs);
                    })
                })
                .catch((error) => {
                  return messages;
                })
    }

    // Get messages user has sent to contact.
    getSentMsg(contact){
        const options = { username: this.state.userId  };
        const FILE_NAME = contact.replace('.id','') + '_temp.json';
        getFile(FILE_NAME, options)
                .then((file) => {
                  var msgs = JSON.parse(file || '[]')
                  this.setState({
                    inTransitMessages: msgs,
                  }, () => {
                      console.log('Messages in transit');
                      console.log(this.state.inTransitMessages);
                  })
                })
                .catch((error) => {
                    this.setState({inTransitMessages: []});
                })
    }

    // Writing message to temp file.
    writeMessageToTemp(data, contact){
        this.state.inTransitMessages.concat(data);
        this.putInTemp(this.state.inTransitMessages, contact);
    }

    // Checks for updates from the contact
    checkForUpdate(contact) {
        // Retrieve new messages the contact has sent.
        
        this.setState({isLoading: true},() => {
            this.getContactMsgs(contact);
        });

        // Retrieve list of messages you have sent.
        this.setState({isLoading: true},() => {
            this.getSentMsg(contact);
        });

        // Retrieve message history between you and the contact.
        this.setState({isLoading: true},() => {
            this.getMsgHistory(contact);
        });

        console.log(this.state.msgHistory)
        console.log(this.state.inTransitMessages)
        console.log(this.state.receivedMsgs)
        
        var msgHistoryLen = this.state.msgHistory.length 

        // Lamport time clock for checking which messages are new.
        var lamportTimeClock = 0;
        if (msgHistoryLen > 0) {
            var lastMessage = this.state.msgHistory[msgHistoryLen - 1]
            lamportTimeClock = lastMessage.clock
        }

        var isUpdate = false;
        // Go through the received messages list and add the messages that are new to the message history..
        for (var i = 0; i < this.state.receivedMsgs.length; i++){
            if (this.state.receivedMsgs[i].clock >= lamportTimeClock) {
                lamportTimeClock = this.state.receivedMsgs[i].clock;
                if (this.state.receivedMsgs[i].type == "msg"){
                    this.state.msgHistory.concat(this.state.receivedMsgs[i]);
                    isUpdate = true;
                    if (contact == this.state.currContact){
                        this.state.messageList.concat(this.state.receivedMsgs[i])
                    }
                }
            }
        }

        if (contact == this.state.currContact){
            if (lamportTimeClock > this.state.currentLamportClock){
                this.setState({currentLamportClock: lamportTimeClock,})
            }
        }

        if (isUpdate){

            // Write the new updated messages to storage.
            putDataInStorage(msgHistory, contact);


            // Remove all messages with clock value less that lamportTimeClock from inTransitMessages.
            var newInTransitmsgs = [];

            var largestLamportClock = lamportTimeClock;
            for (var i = 0; i < this.state.inTransitMessages; i++) {
                if (this.state.inTransitMessages[i].clock > lamportTimeClock){
                    newInTransitmsgs.concat(this.state.inTransitMessages[i])
                    if (this.state.inTransitMessages[i].clock > largestLamportClock){
                        largestLamportClock = this.state.inTransitMessages[i].clock;
                    }
                }
            }

            largestLamportClock++;
            // Write an acknowledgement message to your temp file.
            // Create a message of type ack and clock number equal to the highest lamport clock you have seen.
            var ackMessage = {
                id: 0, 
                text: "", 
                by: this.state.userId, 
                date: Date.now(),
                read: false,
                delivered: false,
                deleted: true,
                clock: largestLamportClock + 1,// I have to figure out what to put here.
                type: "ack",
            }

            newInTransitmsgs.concat(ackMessage);

            this.setState({inTransitMessages: newInTransitmsgs,})

            putInTemp(this.state.inTransitMessages, contact);

        }

    }

    // Get history of conversation between the user and the contact.
    getMsgHistory(contactId) {
        const options = { username: this.state.userId };
        const FILE_NAME = contactId.replace('.id','') + '.json';
        console.log(FILE_NAME);
        var msgs = [];
        getFile(FILE_NAME, options)
                .then((file) => {
                  msgs = JSON.parse(file || '[]')
                  this.setState({
                    msgHistory: msgs,
                  },() => {
                    console.log('Messages History');
                    console.log(this.state.msgHistory);
                    })
                })
                .catch((error) => {
                  console.log('could not fetch messages from ' + contactId)
                  //reset state back to before load
                  // Have to figure out to alert the system so that I do not over write messages.
                })
    }




    //messages conversation from contactId
    fetchMessageData(contactId){
        this.checkForUpdate(contactId)
        this.setState({isLoading: true});
        const options = { username:  this.state.userId };
        const FILE_NAME = contactId.replace('.id','') + '.json';
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
                                    messageList = {this.state.messageList}
                                    userName = {this.state.userName}
                                    currentLamportClock = {this.state.currentLamportClock}
                                    clickedMessageTile = {this.clickedMessageTile.bind(this)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9 col-md-9">
                        <ChatScreen
                            putData = {this.putDataInStorage}
                            checkForUpdate = {this.checkForUpdate.bind(this)}
                            writeMessageToTemp = {this.writeMessageToTemp.bind(this)}
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
    