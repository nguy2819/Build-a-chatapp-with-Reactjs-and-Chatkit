import React from 'react'

class Message extends React.Component {  
    render() {
        return (
            <div className="message">
                <div className="message-username">{this.props.user}</div>
                <div className="message-text">{this.props.text}</div>
            </div>
        )
    }
}

export default Message

//The component is stupid because only thing it does - are rendering the this.props.user and this.props.text
// Need to learn more about Functional Component because in case, the component does not have state or any life cycle component method like ComponentDidMount()
// People nowsaday prefer FUNCTIONAL COMPONENT rather than CLASS COMPONENT
//Check out this link to learn about FUNCTIONAL COMPONENT https://reactjs.org/docs/components-and-props.html

//This is how you change the whole Class Component above into Functional Component

// function Message(props) {  
//     return (
//         <div className="message">
//             <div className="message-username">{props.username}</div>
//             <div className="message-text">{props.text}</div>
//         </div>
//     )
// }

