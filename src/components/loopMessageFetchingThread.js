

//var contactList = {};
//var userName;

 /* // Get history of conversation between the user and the contact.
 getMsgHistory(contactId, userId) {
    const options = { username: userId };
    const FILE_NAME = contactId.replace('.id','') + '.json';
    getFile(FILE_NAME, options).then((file) => {
       return JSON.parse(file || '[]')
    }).catch((error) => {
        console.log('could not fetch messages from ' + contactId);
    })
}

//puts contact data into users blockstack storage
putDataInStorage(data, contactName) {
    //TO DO: strip contact name of .id
    var rawContact = contactName.replace('.id','');
    var STORAGE_FILE_PATH = rawContact + '.json';

    var options = {encrypt: false};
    let success = blockstack.putFile(STORAGE_FILE_PATH, JSON.stringify(data), options);

    if (!success){
        console.log("ERROR: Could not put file in storage");
    }
    else {
        console.log("SUCCESS: PUT FILE IN USER STORAGE");
    }
}

// Gets new messages contact has sent to user.
getContactMsgs(contact, name) {
    const CONTACT_MSGS_OPTIONS = {username:contact};
    const CONTACT_MSGS_FILE_NAME =  name.replace(".id", "") + '_temp.json';

    // messages contact sent you.
    getFile(CONTACT_MSGS_FILE_NAME, CONTACT_MSGS_OPTIONS).then((file) => {
        var msgs = JSON.parse(file || '[]')

        // Go through the messages and remove those you have already seen.
        var i = msgs.length - 1;
        var found_unseen = false;
        while(i >= 0) {
            if (msgs[i].id > contact.lastSeen) {
                found_unseen = true;
                i--;
            } else {
                break;
            }
        }

        // read the messages from this storage and append the ones we have not seen
        if (found_unseen) {
            var msgsHistory = getMsgHistory(contact, name);
            msgsHistory = msgsHistory.concat(msgs.slice(i, msgs.length));
            putDataInStorage(msgsHistory, contact)
        }
    }).catch((error) => {
        console.log("No new messages.")
        console.log(error)
    })
} */


function fetchNewMessages() {
    console.log("Started worker")
    // get the contact data that is passed from the caller
    // the passed-in data is available via e.data
    /* self.addEventListener("message", function(e) {

        if (e.data.type == "username") {
            userName = e.data.content; 
        }

        if (e.data.type == "contacts") {
            for(var i = 0; i < e.data.content.length; i++) {
                if (!(e.data.content[i] in contactList) ) {
                    contactList[e.data.content[i].id] = e.data.content[i];
                }
            }
        }
        else if (e.data.type == "change_active") {
            if (!(e.data.content.active in contactList) ) {
                contactList[e.data.content.active] = e.data.content.active;
            }

            if (!(e.data.content.inactive in contactList) ) {
                contactList[e.data.content.inactive] = e.data.content.inactive;
            }

            contactList[e.data.content.active][active] = 1;
            contactList[e.data.content.inactive][active] = 0;
        }

    }, false);

    // loop through the message to see if are new messages that are being sent
    for (var contact in contactList) {
        getContactMsgs(contact, userName);
    }
 */
    // call the function that does the looping 
    setTimeout("fetchNewMessages()", 500);
}

fetchNewMessages();