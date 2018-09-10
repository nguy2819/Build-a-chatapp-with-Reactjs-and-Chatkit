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

## Step 7: Broadcasting Messages
- As we noticed, in app.js, the interaction with ChatKit API - happens through this "currentUser" object - which we got access through the "componentDidMount" method and after we got connect with the "chatManager".
- However, it is only available in the "currentUser" scope and that's not good => because we want it to be available in entire "componentDidMount" instance. 
```
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
```
- In the future, we will do the "currentUser.sendMessage" - in order to sendMessage. To do that, we need to type: (Simply, we hooke the currentUser with the component itself)
```
this.currentUser = currentUser
```
- After that we can create a new Method, called sendMessage(){}: (It's only possible when when we hooke the currentUser with itself component)
```
sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roodId: 9434230
        })
    }
```
- Obviously, we cannot forget to bind them under constructor
```
this.sendMessage = this.sendMessage.bind(this)
```
- Finally, we need to link the child component with its parents. sendMessageForm will get access through the sendMessage(text){}
```
<SendMessageForm sendMessage={this.sendMessage} />
```
- In SendMessageForm.js, we ned to add under handleSubmit(e)
```
this.props.sendMessage(this.state.message)
this.setState({
            message: ''
        })
```
- The SendMessageForm.js needs to look like this: 
```import React from 'react'

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
        this.props.sendMessage(this.state.message)
        this.setState({
            message: ''
        })
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
- And App.js needs to look like this:
```
class App extends React.Component {
    
    constructor() {
        super()
        this.state = {
            messages: []
        }
        this.sendMessage = this.sendMessage.bind(this)
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
            this.currentUser = currentUser
            this.currentUser.subscribeToRoom({
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
    
    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: 9434230
        })
    }
    
    render() {
        return (
            <div className="app">
                <RoomList />
                <MessageList messages={this.state.messages} />
                <SendMessageForm sendMessage={this.sendMessage} />
                <NewRoomForm />
            </div>
        );
    }
}
```

## Step 8: RoomList Component (RoomList.js)
```
this.currentUser.getJoinableRooms()
```
- This will return a promise, all under chatManager.connect
```
.then(joinableRooms => {
                this.setState({
                    joinableRooms,
                    joinedRooms: this.currentUser.rooms
                })
            })
            .catch(err => console.log('error on joinableRooms: ', errr))
```
- We cannot forget to add joinableRooms and joinedRooms in constructor:
```
constructor() {
        super()
        this.state = {
            messages: [],
            joinableRooms: [],
            joinedRooms: []
        }
        this.sendMessage = this.sendMessage.bind(this)
    } 
```
- And edit RoomList under render
```
<RoomList rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
```
- App.js will look like this now:
```
class App extends React.Component {
    
    constructor() {
        super()
        this.state = {
            messages: [],
            joinableRooms: [],
            joinedRooms: []
        }
        this.sendMessage = this.sendMessage.bind(this)
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
            this.currentUser = currentUser
            
            this.currentUser.getJoinableRooms()
            .then(joinableRooms => {
                this.setState({
                    joinableRooms,
                    joinedRooms: this.currentUser.rooms
                })
            })
            .catch(err => console.log('error on joinableRooms: ', errr))
            
            this.currentUser.subscribeToRoom({
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
        .catch(err => console.log('error on connecting: ', errr))

    }
    
    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: 9434230
        })
    }
    
    render() {
        return (
            <div className="app">
                <RoomList rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
                <MessageList messages={this.state.messages} />
                <SendMessageForm sendMessage={this.sendMessage} />
                <NewRoomForm />
            </div>
        );
    }
}
```
- RoomList.js will look like this:
```
import React from 'react'

class RoomList extends React.Component {
    render () {
        return (
            <div className="rooms-list">
                <ul>
                <h3>Your rooms:</h3>
                    {this.props.rooms.map(room => {
                        return (
                            <li key={room.id} className="room">
                                <a href="#"># {room.name}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default RoomList
```
> ![screen shot 2018-09-10 at 10 23 12 am](https://user-images.githubusercontent.com/36870689/45310489-9b3f6880-b4e3-11e8-9c71-076f90ed7eb9.png)

## Step 9: Subcribe to rooms
- So in the past, we're still subscribe to a specific room (ex: roomId: 9434230)
- To able to clikc on the room we want, we will create a subscribeToRoom and bind them with the constructor
```
subscribeToRoom() {
        this.currentUser.subscribeToRoom({
            roomId: 9434230,
            hooks: {
                onNewMessage: message => {
                    this.setState({
                        messages: [...this.state.messages, message]
                    })
                }
            }
        })
    }
```
```
        this.subscribeToRoom = this.subscribeToRoom.bind(this)
```
- Also make the getRoom() by pulling this.currentUser.getJoinableRooms() into it
```
getRooms() {
        this.currentUser.getJoinableRooms()
        .then(joinableRooms => {
            this.setState({
                joinableRooms,
                joinedRooms: this.currentUser.rooms
            })
        })
        .catch(err => console.log('error on joinableRooms: ', errr))
    }
```
- Also, don't forget to bind the getRoom() with constructor
```
        this.getRooms = this.getRooms.bind(this)
```
- The "componentDidMount" will be really organized after we pull subscribeToRoom() and getRooms() out as seperate and also changed the roomID inside "subscribeToRoom()". Plus, also delete this.subscribeToRoom() out of "chatManager.connect()"
```
class App extends React.Component {
    
    constructor() {
        super()
        this.state = {
            roomId: null,
            messages: [],
            joinableRooms: [],
            joinedRooms: []
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.subscribeToRoom = this.subscribeToRoom.bind(this)
        this.getRooms = this.getRooms.bind(this)
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
            this.currentUser = currentUser
            this.getRooms()
            //this.subscribeToRoom() //delete this line
        })
        .catch(err => console.log('error on connecting: ', errr))
    }
    
    getRooms() {
        this.currentUser.getJoinableRooms()
        .then(joinableRooms => {
            this.setState({
                joinableRooms,
                joinedRooms: this.currentUser.rooms
            })
        })
        .catch(err => console.log('error on joinableRooms: ', errr))
    }
    
    subscribeToRoom(roomID) {
        this.setState({ messages: [] }) //added this line to clean up the state
        this.currentUser.subscribeToRoom({
            roomId: roomID,
            hooks: {
                onNewMessage: message => {
                    this.setState({
                        messages: [...this.state.messages, message]
                    })
                }
            }
        })
       .then(room => {
            this.setState({
                roomId: room.id
            })
            this.getRooms()
        })
        .catch(err => console.log('error on subscribing to room: ', err))
    }
    
    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: this.state.roomId
        })
    }
    
    render() {
        return (
            <div className="app">
                <RoomList
                    subscribeToRoom={this.subscribeToRoom}
                    rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
                <MessageList messages={this.state.messages} />
                <SendMessageForm sendMessage={this.sendMessage} />
                <NewRoomForm />
            </div>
        );
    }
}
```
- The code above did edit the RoomList under render by adding subscribeToRoom in it. 
- The RoomList.js will look like this after added the "onClick" with this.props.subscribeToRoom(room.id)
```
class RoomList extends React.Component {
    render () {
        return (
            <div className="rooms-list">
                <ul>
                <h3>Your rooms:</h3>
                    {this.props.rooms.map(room => {
                        return (
                            <li key={room.id} className="room">
                                <a
                                    onClick={() => this.props.subscribeToRoom(room.id)}
                                    href="#">
                                    # {room.name}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
```