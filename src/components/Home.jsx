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
    getPublicKeyFromPrivate,
    encryptECIES,
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
            lastMessage: this.props.lastMessage,
          }; 
    }

    //update component when parent state changes
    componentWillReceiveProps(nextProps) {
        this.setState({
            currContact: nextProps.currContact,
            lastMessage: nextProps.lastMessage,
        }, () => {
        });
    }

    render() {
        
        return (

        <table className="table table-hover">
            <tbody>
            {
                this.props.contactList.map((contact) => { 

                    var lastMessage = {text: ''}

                    var time_sent = new Date()
                    if (contact.id in this.state.lastMessage) {
                        lastMessage = this.state.lastMessage[contact.id]
                        time_sent = new Date(lastMessage.id);
                    }

                    // TODO: change this because it is dupicate code
                    var displayTime = time_sent.getHours() + ":";
                    if (time_sent.getMinutes() < 10) {
                        displayTime = displayTime + 0 + time_sent.getMinutes() + ":";
                    } 
                    else {
                        displayTime = displayTime + time_sent.getMinutes() + ":";
                    }
                    
                    if (time_sent.getSeconds() < 10) {
                        displayTime = displayTime + 0 + time_sent.getSeconds();
                    } 
                    else {
                        displayTime = displayTime + time_sent.getSeconds();
                    }


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
                                    {displayTime} </span>
                                </p>
                                 <p className="message-snippet">{lastMessage.text}</p> 
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
            currContact: '',
            //messages for current chat
            messageList: [],
            msgHistory: {},
            receivedMsgs: {},
            inTransitMessages:{},
            isLoading: false,
            selected: '',
            currentLamportClock: 0,
            lastMessage: {},
            pubKey: 'null',
          }; 
        this.putDataInStorage  = this.putDataInStorage.bind(this);
        this.fetchMessageData  = this.fetchMessageData.bind(this);
        this.clickedMessageTile = this.clickedMessageTile.bind(this);
        this.getContactMsgs = this.getContactMsgs.bind(this);
        this.updateLastMessage = this.updateLastMessage.bind(this);
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
              console.log(this.props.contactList)
               // var myVar = setInterval(this.messageUpdator(this.state.contactList), 1000);
          });
      }

      // Function to update last messages
      updateLastMessage(lastMessge, userId) {

        console.log("IN UPDATE MESSAGES")
        if (this.state.lastMessage.length > 0) {
            if (contactId in this.state.lastMessage) {
                console.log("IN CHECK")
                if (lastMessge.date <= this.state.lastMessage[contactId].date) {
                    return;
                }
            } 
        }
        console.log("AFTER CHECK")
        console.log(userId)
        console.log(lastMessge)

        this.setState((prevState, props) => {
            var lastMessages = prevState.lastMessage;
            lastMessages[userId] = lastMessge;
            return {lastMessage: lastMessages};
        }, () => {
            console.log("NEW ARRAY OF LAST MESSAGES")
            console.log(this.state.lastMessage)
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

        const options = { username: rawContact, zoneFileLookupURL: "https://core.blockstack.org/v1/names"}
        getFile('key.json', options)
          .then((file) => {
            this.setState({ pubKey: JSON.parse(file)})
            console.log("Step One: PubKey Loaded");
          })

        var STORAGE_FILE_PATH = rawContact + '.json';
        console.log('Filename: ' + STORAGE_FILE_PATH);
        var options1 = {encrypt: true};
        let success = blockstack.putFile(STORAGE_FILE_PATH, JSON.stringify(data), options1);

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
        const options = { username: rawContact, zoneFileLookupURL: "https://core.blockstack.org/v1/names"}
        getFile('key.json', options)
          .then((file) => {
            this.setState({ pubKey: JSON.parse(file)}, () => {
                console.log("Step One: PubKey Loaded");

                const publicKey = this.state.pubKey;
                      const encryptedData = JSON.stringify(encryptECIES(publicKey, JSON.stringify(data)));
                      var STORAGE_FILE_PATH = rawContact + '_temp.json';
                      putFile(STORAGE_FILE_PATH, encryptedData)
                        .then(() => {
                          console.log("Shared encrypted file " + STORAGE_FILE_PATH);
                        })
                        .catch(e => {
                          console.log(e);
                        });
            })
            
          })
    }

    // Gets new messages contact has sent to user.
    getContactMsgs(contact){
        
        //decrypt with users appPrivateKey
        const CONTACT_MSGS_OPTIONS = {decrypt: true, username: contact, 
            zoneFileLookupURL: "https://core.blockstack.org/v1/names",
        };

        var name = this.state.userId;
        const CONTACT_MSGS_FILE_NAME =  name.replace(".id", "") + '_temp.json';
        var messages = []

        getFile(CONTACT_MSGS_FILE_NAME, CONTACT_MSGS_OPTIONS).then((file) => {
            var msgs = JSON.parse(file || '[]')
            this.setState((prevState, props) => {
                var receivedMsg = prevState.receivedMsgs;
                receivedMsg[contact] = msgs;
                return {receivedMsgs: receivedMsg};
            }, () => {
                // Do everything involving messageHistory here.
                console.log("LETS GOOOOOOOOO 45 !!!!!")
                console.log(this.state.msgHistory)
                var msgHistoryLen = this.state.msgHistory[contact].length;
                var lastMessageId = 0;
                if (!msgHistoryLen){
                    console.log("LETS GOOOOOOOOO!!!!!")
                }

                // Getting the last message id which serves as the lamport clock.
                if (msgHistoryLen > 0) {
                    var lastMessage = this.state.msgHistory[contact][msgHistoryLen - 1]
                    lastMessageId = lastMessage.id
                    //set lamport clock to 0 if null
                    if(!lastMessageId){
                        lastMessageId = 0;
                    }
                }

                var contactObj = {}
                for(var i = 0; i < this.state.contactList.length; i++){
                    if (this.state.contactList[i].id == contact){
                        contactObj = this.state.contactList[i];
                    }
                    
                }

                console.log("LETS GOOOOOOOOO 2 !!!!!")

                var isUpdate = false;
                var newMessages = [];
                // Go through the messages and remove those you have already seen.
                if (!contactObj.lastSeen){
                    contactObj.lastSeen = 0;
                }

                console.log(contactObj.lastSeen)

                for (var i = 0; i < this.state.receivedMsgs[contact].length; i++) {
                    console.log(lastMessageId)
                    console.log(this.state.receivedMsgs[contact][i].id)
                    if (this.state.receivedMsgs[contact][i].id > contactObj.lastSeen) {
                        // Update lastMessageId as you go.
                        contactObj.lastSeen = this.state.receivedMsgs[contact][i].id;

                        // Append those you have not seen to the msg history.
                        if (this.state.receivedMsgs[contact][i].type == "msg") {
                            newMessages = newMessages.concat(this.state.receivedMsgs[contact][i]);
                        }
                    }
                }

                console.log("LETS GOOOOOOOOO 3 !!!!!")

                var lastSeenMessage  = 0;
                if (newMessages.length > 0){
                    for(var i = 0; i < this.state.contactList.length; i++){
                        if (this.state.contactList[i].id == contact){
                            this.state.contactList[i].lastSeen = newMessages[newMessages.length - 1].id;
                            lastSeenMessage = newMessages[newMessages.length - 1].lastSeen;
                        }
                    }

                    console.log("LETS GOOOOOOOOO 4 !!!!!")


                    if (!lastSeenMessage){
                        lastSeenMessage = 0;
                    }
                    this.props.putContact(this.state.contactList);


                    this.setState((prevState, props) => {
                        var msgHist = prevState.msgHistory;
                        console.log("Hello 1111")
                        msgHist[contact] = prevState.msgHistory[contact].concat(newMessages);
                        return {msgHistory: msgHist}
                    }, () => {
                        isUpdate = true;
                        // Write the new updated messages to storage.
                        this.putDataInStorage(this.state.msgHistory[contact], contact);
                    });

                    console.log("LETS GOOOOOOO 5")

                        if (contact == this.state.currContact){
                        this.setState((prevState, props) => {
                            return {messageList: prevState.messageList.concat(newMessages)};
                            });
                    }

                    this.getSentMsg(contact, lastSeenMessage);
                }
            })
        }).catch((error) => {
            // If this returns error, assume messages do not exist.
            // Have not decide what to do there.
            // Update: Do nothing
            console.log("No new messages.")
            console.log(error)
        })
    }

    // Get messages user has sent to contact.
    getSentMsg(contact, lastMessageId){
        const options = { decrypt: true, username: this.state.userId, zoneFileLookupURL: "https://core.blockstack.org/v1/names"};
        const FILE_NAME = contact.replace('.id','') + '_temp.json';
        getFile(FILE_NAME, options).then((file) => {
            var msgs = JSON.parse(file || '[]')
            this.setState((prevState, props) => {
                var inTransitMsg = prevState.inTransitMessages;
                inTransitMsg[contact] = msgs;
                return {inTransitMessages:inTransitMsg};
            }, () => {
                console.log('Messages in transit');
                console.log(this.state.inTransitMessages);
                // Remove all messages with clock value less that lamportTimeClock from inTransitMessages.
                var newInTransitmsgs = [];
        
                for (var i = 0; i < this.state.inTransitMessages[contact].length; i++) {
                    if (this.state.inTransitMessages[contact][i].id > lastMessageId){
                        newInTransitmsgs.concat(this.state.inTransitMessages[contact][i])
                    }
                }

                this.setState((prevState, props) => {

                    var inTransitMsg = prevState.inTransitMessages;
                    inTransitMsg[contact] = newInTransitmsgs;
                    return {inTransitMessages: inTransitMsg};
                }, () => {
                    this.putInTemp(this.state.inTransitMessages[contact], contact);
                })
            })
        }).catch((error) => {
            this.setState((prevState, props) => {
                var inTransitMsg = prevState.receivedMsgs;
                inTransitMsg[contact] = [];
                return {inTransitMessages: inTransitMsg};
            }, () =>{
                // Remove all messages with clock value less that lamportTimeClock from inTransitMessages.
                var newInTransitmsgs = [];
        
                for (var i = 0; i < this.state.inTransitMessages[contact].length; i++) {
                    if (this.state.inTransitMessages[contact][i].id > lastMessageId){
                        newInTransitmsgs.concat(this.state.inTransitMessages[contact][i])
                    }
                }

                this.setState((prevState, props) => {
                    var inTransitMsg = prevState.inTransitMessages;
                    inTransitMsg[contact] = newInTransitmsgs;
                    return {inTransitMessages: inTransitMsg};
                }, () => {
                    this.putInTemp(this.state.inTransitMessages[contact], contact);
                })   
            });
        })
    }

    // Writing message to temp file.
    writeMessageToTemp(data, contact) {
        this.setState((prevState, props) => {
            var inTransitMsg = prevState.inTransitMessages;
            inTransitMsg[contact] = prevState.inTransitMessages[contact].concat(data);
            return {inTransitMessages: inTransitMsg};
        }, () => {
            this.putInTemp(this.state.inTransitMessages[contact], contact);
          });
    }

    messageUpdator(contacts) {
        console.log("I AM THE ONE")
        console.log("Hello I got it here ")
        for (var i = 0; i < contacts.length; i++){
            var contact  = contacts[i].id;
            this.checkForUpdate(contact);
        }
    }

    // Checks for updates from the contact
    checkForUpdate(contact) {
        // Retrieve new messages the contact has sent.
        
            //this.getMsgHistory(contact);
        const MSG_HISTORY_OPTIONS = {decrypt:true, username: this.state.userId, zoneFileLookupURL: "https://core.blockstack.org/v1/names"};
        const MSG_HISTORY_FILE_NAME = contact.replace('.id','') + '.json';
        getFile(MSG_HISTORY_FILE_NAME, MSG_HISTORY_OPTIONS).then((file) => {
                  var msgs = JSON.parse(file || '[]')
                  this.setState((prevState, props) => {
                    var msgHist = prevState.msgHistory;
                    msgHist[contact] = msgs;
                    return {msgHistory: msgHist}
                },() => {
                    this.getContactMsgs(contact);
                    })
                }).catch((error) => {
                    this.getContactMsgs(contact);
                })
    }

    // Get history of conversation between the user and the contact.
    getMsgHistory(contactId) {
        const options = { decrypt: true, username: this.state.userId, zoneFileLookupURL: "https://core.blockstack.org/v1/names"};
        const FILE_NAME = contactId.replace('.id','') + '.json';
        console.log(FILE_NAME);
        var msgs = [];
        getFile(FILE_NAME, options)
                .then((file) => {
                  msgs = JSON.parse(file || '[]')
                  this.setState((prevState, props) => {
                    var msgHist = prevState.msgHistory;
                    msgHist[contact] = msgs;
                    return {msgHistory: msgHist}
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
        console.log('IN FETCH DATA FOR' + contactId);
        this.checkForUpdate(contactId)
        this.setState({isLoading: true});
        const options = {decrypt: true, zoneFileLookupURL: "https://core.blockstack.org/v1/names"};
        const FILE_NAME = contactId.replace('.id','') + '.json';
        console.log(FILE_NAME);
        var oldMessages = this.state.messageList;
        getFile(FILE_NAME, options).then((file) => {
            var msgs = JSON.parse(file || '[]')
            this.setState({
            messageList: msgs,
            }, () => {
                // add the last message if we have not seen it
                console.log("UPDATE MESSAGE")
                this.updateLastMessage(msgs[msgs.length - 1], contactId)
            })
        }).catch((error) => {
            //reset state back to before load
            this.setState({messageList: []});
        }).finally(() => {
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

        //get user's public key and make it pub file
        const publicKey = getPublicKeyFromPrivate(loadUserData().appPrivateKey)
        putFile('key.json', JSON.stringify(publicKey))
        .then(() => {
            console.log("Saved!");
            console.log(JSON.stringify(publicKey));
          })
          .catch(e => {
            console.log(e);
          });

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
                                <img src={this.props.userPic} className="img-rounded avatar"/>
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
                                addContact = {this.addContact.bind(this)}
                                handleSignOut = {this.props.handleSignOut}/>
                            </div>

                            <div className="messages-sidebar">
                                <MessageTile
                                    contactList={this.state.contactList} 
                                    currContact = {this.state.currContact} 
                                    messageList = {this.state.messageList}
                                    userName = {this.state.userName}
                                    lastMessage = {this.state.lastMessage}
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
                            contactList = {this.state.contactList}
                            messageList = {this.state.messageList}
                            currContact = {this.state.currContact}
                            userId = {this.state.userId}
                            updateLastMessage = {this.updateLastMessage}
                        />
                    </div> 
                </div>
            </div>
        );
      }
}
    