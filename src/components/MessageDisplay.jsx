// Copyright (c) 2018 BlockChat

// Author: Avthar
// Maintainer:

/*! \file MessageDisplayScreen.jsx
    \brief Display messages for a particulat chat
*/
import React, { Component, Link } from 'react';
import { InputBar } from './InputBar.jsx';

//**************************************************************
//InputBox component: Box that displays messages for current chat
//Props: messageList - list of messages for current chat
//       userProfilePic
//       currContactProfilePic
//       currContactName - name of contact currently chatting with
//**************************************************************
export class MessageDisplay extends Component {
    
      constructor(props) {
          super(props);
          this.state = {
              messageList: this.props.messageList, 
              currContactName: '',
              currContactProfilePic: '',
              currContact: '',
            };
      }

      componentWillReceiveProps(nextProps){
          this.setState({
              messageList: nextProps.messageList,
              currContactName: nextProps.currContactName,
              currContactProfilePic: nextProps.currContactProfilePic,
              currContact: nextProps.currContact,
          }, () => {console.log("Updated props in Message Display")});
      }
    

      render() {
        return (
            <div className = 'container'>
                <div className = "row bg-success"> 
                    <MessageList messageList = {this.state.messageList}/>
                </div>
            </div>
        );
      }
}

//**************************************************************
//InputBox component: Box that displays messages for current chat
//Props: messageList - list of messages for current chat
//       userProfilePic
//       currContactProfilePic
//       currContactName - name of contact currently chatting with
// custome bootstrap: https://v4-alpha.getbootstrap.com/components/list-group/#custom-content
//**************************************************************
class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return(
            <div>
                <ul className = "list-group">
                     {this.props.messageList.map(message => (
                        <li className = "list-group-item text-right" key={message.id}>{message.text}</li>
                    ))}
                </ul>
            </div>
        );
    }
}