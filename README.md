## Learning how to build a Chat App with React.js and ChatKit through Scrimba's tutorial
- If you want to learn this tutorial, here is [the Scrimba's link](https://scrimba.com/g/greactchatkit).
- They teach us about how to organize the components, named [Component architecture](https://scrimba.com/p/pbNpTv/cm2a6f9), which is very helpful for developers' vision. 

# Below, I noted down all the steps as I went through the tutorial
## Step 1: Create components and import components in app.js
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

## Step 2: Build a basic MessageList.js
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

## Step 3: How to use ChatKit and connect to ChatKit's API to fetch out messages from a given room
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

## Step 4: State and Props
- State is private for component (ex: it is only be state of the App component)
- Prop is not private, is shared between components - and we cannot changed the props
```
constructor() {
        super() //when we call super() -> we call the constructor function in the React.Component class
        this.state = {
            messages: []
        }
    } 
```
- Now we can add this.setState inside the function .then
```
this.setState({
    messages: [...this.state.messages, message]
})
```
- Then we pass the prop -> because when we pass state from the top to render, it will turn into prop
```
<MessageList messages={this.state.messages} />
```
- The app.js will look like this: 
```
class App extends React.Component {
    
    constructor() {
        super()
        this.state = {
            messages: []
        }
    } 
    
    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator,
            userId: 'perborgen',
            tokenProvider: new Chatkit.TokenProvider({
                url: tokenUrl
            })
        })
        
        chatManager.connect()
        .then(currentUser => {
            currentUser.subscribeToRoom({
                roomId: 9434230,
                hooks: {
                    onNewMessage: message => {
                        this.setState({
                            messages: [...this.state.messages, message]
                        })
                    }
                }
            })
        })
    }
    
    render() {
        return (
            <div className="app">
                <RoomList />
                <MessageList messages={this.state.messages} />
                <SendMessageForm />
                <NewRoomForm />
            </div>
        );
    }
}
```
- And obviously, we need to pass the prop inside MessageList.js so that everytime the message changes, they will rerender the MessageList.js, so the MessageList.js will look like this (no longer passing the DUMMY_DATA)
```
class MessageList extends React.Component {
    render() {
        return (
            <div className="message-list">
                {this.props.messages.map((message, index) => {
                    return (
                        <div key={index} className="message">
                            <div className="message-username">{message.senderId}</div>
                            <div className="message-text">{message.text}</div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
```
- What we changed in the MessageList.js is DUMMY_DATA.map to this.props.messages.map
```
                {DUMMY_DATA.map((message, index) => {
                    return (
                        <div key={index} className="message"> //each child needs to have a unique "key" prop
                            <div className="message-username">{message.senderId}</div>
                            <div className="message-text">{message.text}</div>
                        </div>
                    )
                })}
```

## Step 5: Create the Message component (Message.js)
- Because we will need to move some contents from MessageList.js into Message.js. For example: 
```
<div key={index} className="message">
    <div className="message-username">{message.senderId}</div>
    <div className="message-text">{message.text}</div>
</div>
```
- But first, don't forget to import Message.js into MessageList.js and render <Message /> outto MessageList.js
- So literally, we replace the whole div contents above with <Message />
- So the MessageList.js will look like this:
```
import React from 'react'
import Message from './Message'

class MessageList extends React.Component {
    render() {
        return (
            <div className="message-list">
                {this.props.messages.map((message, index) => {
                    return (
                        <Message key={index} username={message.senderId} text={message.text} />
                    )
                })}
            </div>
        )
    }
}

export default MessageList
```
- So when we moved the div contents for message.senderID and message.text from MessageList.js over to Message.js, we will need to change to this.props.username (which is linked to MessageList.js) and this.props.text
- And the Message.js will look like this:
```
import React from 'react'

class Message extends React.Component {  
    render() {
        return (
            <div className="message">
                <div className="message-username">{this.props.username}</div>
                <div className="message-text">{this.props.text}</div>
            </div>
        )
    }
}

export default Message
```
- Check out this link to learn about [FUNCTIONAL COMPONENT](https://reactjs.org/docs/components-and-props.html)
- We can also change the "Class Component" into "Functional Component" and the Message.js under Functional Component will look like this:
```
import React from 'react'

function Message(props) {  
    return (
        <div className="message">
            <div className="message-username">{props.username}</div>
            <div className="message-text">{props.text}</div>
        </div>
    )
}

export default Message
```
- To change a Class Component into a Functional Component, we will no longer need "extends React.Component" and "render()". We also do not need the this.

## Step 6: SendMessageForm component (SendMessageForm.js)
- The basic SendMessageForm.js should look like this at first:
```
import React from 'react'

class SendMessageForm extends React.Component {
    render() {
        return (
            <form className="send-message-form">
                <input
                    placeholder="Type your message and hit ENTER"
                    type="text" />
            </form>
        )
    }
}

export default SendMessageForm
```
- We will need to add onChange and value inside the input and onSubmit in the form
```
    onChange={this.handleChange}
    value={this.state.message}
```
- After all, we will need to add handleChange and handleSubmit and binding them
```
import React from 'react'

class SendMessageForm extends React.Component {
    
    constructor() {
        super()
        this.state = {
            message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    handleChange(e) {
        this.setState({
            message: e.target.value
        })
    }
    
    handleSubmit(e) {
        e.preventDefault()
        console.log(this.state.message)
        /** send off the message */
    }
    
    render() {
        return (
            <form
                onSubmit={this.handleSubmit}
                className="send-message-form">
                <input
                    onChange={this.handleChange}
                    value={this.state.message}
                    placeholder="Type your message and hit ENTER"
                    type="text" />
            </form>
        )
    }
}

export default SendMessageForm
```