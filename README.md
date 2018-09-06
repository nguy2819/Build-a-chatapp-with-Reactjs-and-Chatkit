## Learning how to build a Chat App with React.js and ChatKit through Scrimba's tutorial
- If you want to learn this tutorial, here is [the Scrimba's link](https://scrimba.com/g/greactchatkit).
- They teach us about how to organize the components, named [Component architecture](https://scrimba.com/p/pbNpTv/cm2a6f9), which is very helpful for developers' vision. 

## Below, I noted down all the steps as I went through the tutorial
### Step 1: Create components and import components in app.js
- In app.js
```
import React from 'react'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm'

class App extends React.Component {
    render() {
        return (
            <div className="app">
                <RoomList />
                <MessageList />
                <SendMessageForm />
                <NewRoomForm />
            </div>
        );
    }
}

export default App
```

### Step 2: Build a basic MessageList.js
```
import React from 'react'

//We const DUMMY_DATA as a test in rendering message-list to make sure the Message-List will work
const DUMMY_DATA = [
    {
        senderId: 'perborgen',
        text: 'Hey, how is it going?'
    },
    {
        senderId: 'janedoe',
        text: 'Great! How about you?'
    },
    {
        senderId: 'perborgen',
        text: 'Good to hear! I am great as well'
    }
]

class MessageList extends React.Component {
    render() {
        return (
            <div className="message-list"> 
            //This is JSX index and to write between JSX <div className="message-list"></div> (we cannot write JS) => we need to break it by curlybrackets {}
                {DUMMY_DATA.map((message, index) => {
                    return (
                        <div key={index} className="message"> //each child needs to have a unique "key" prop
                            <div className="message-username">{message.senderId}</div>
                            <div className="message-text">{message.text}</div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default MessageList
```
> // We cannot render 2 JSX div tags next to each other without a BIG div surrounding those 2 JSX because it will report error: Adjacent JSX elements must be wrapped in an enclosing tag => that is why we have div key={index} className="message" and /div wrapped around div className="message-username" and div className="message-text"

### Step 3: How to use ChatKit and connect to ChatKit's API to fetch out messages from a given room
- Go to https://pusher.com/
- Product -> ChatKit -> Sign Up for the Public Beta
- Create ChatKit with a name "SCRIMBA-CHATKIT-COURSE"
- Then, we install [@pusher/chatkit](https://www.npmjs.com/package/@pusher/chatkit) in the terminal
```
yarn add @pusher/chatkit
```
- We import chatkit into app.js
```
import Chatkit from '@pusher/chatkit'
```
- To hookup a React.Component with an API by using lifecycle method, called componentDidMount(), we create chatManager 
```
componentDidMount() {
        const chatManager = new Chatkit.ChatManager({})
}
```
>![screen shot 2018-09-06 at 3 24 03 pm](https://user-images.githubusercontent.com/36870689/45185892-f70aa880-b1e8-11e8-84d8-772c10d2b3d6.png)
>![screen shot 2018-09-06 at 3 26 05 pm](https://user-images.githubusercontent.com/36870689/45185985-4224bb80-b1e9-11e8-8f9b-5bbf5fa4b657.png)
> After you create a thing with ChatKit, they will provide Instance Locator and Token, which we will need to copy those information and pass them into config.js.
- My config.js looks like this after I copy the Token and Instance Locator info that they provided from their ChatKit's website
```
const tokenUrl = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/4ed9ba1e-a897-48dc-ba84-f57c5668e0fa/token";
const instanceLocator = "v1:us1:4ed9ba1e-a897-48dc-ba84-f57c5668e0fa";

exports.tokenUrl = tokenUrl;
exports.instanceLocator = instanceLocator;
```
- Obviously, after getting the config.js ready, we need to import the config.js into app.js
```
import { tokenUrl, instanceLocator } from './config'
```
```
componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator,
            userId: 'tienborland',
            tokenProvider: new Chatkit.TokenProvider({
                url: tokenUrl
            })
        })
        
        chatManager.connect()
        .then(currentUser => {
            currentUser.subscribeToRoom({
                roomId: 15580895,
                hooks: {
                    onNewMessage: message => {
                        console.log('message.text: ', message.text);
                    }
                }
            })
        })
    }
```
- This is what is look like after I played around with create users and add message to the room, named Random, that I created
>![screen shot 2018-09-06 at 3 47 56 pm](https://user-images.githubusercontent.com/36870689/45186926-51593880-b1ec-11e8-9ae2-688947d16eba.png)
