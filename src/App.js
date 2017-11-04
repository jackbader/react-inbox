import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Toolbar from './components/Toolbar';
import Messages from './components/Messages'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { messages: props.messages }
  }

  selectedMessage = (message, property) => {
    const index = this.state.messages.indexOf(message)

    this.setState({
      messages: [
        ...this.state.messages.slice(0, index),
        {
          ...message,
          [property]: !message[property]
        },
        ...this.state.messages.slice(index + 1),
      ]
    })
  }

  markAsRead = () => {
    console.log('test')
   this.setState({
     messages: this.state.messages.map(message => (
       message.selected ? { ...message, read: true } : message
     ))
   })
  }

  markAsUnread = () => {
    console.log('test')
   this.setState({
     messages: this.state.messages.map(message => (
       message.selected ? { ...message, read: false } : message
     ))
   })
  }

  applyLabel = (label) => {
    const messages = this.state.messages.map(message => (
      message.selected && !message.labels.includes(label) ?
        { ...message, labels: [...message.labels, label].sort() } :
        message
    ))
    this.setState({ messages })
  }

  removeLabel = (label) => {
      const messages = this.state.messages.map(message => {
        const index = message.labels.indexOf(label)
        if (message.selected && index > -1) {
          return {
            ...message,
            labels: [
              ...message.labels.slice(0, index),
              ...message.labels.slice(index + 1)
            ]
          }
        }
        return message
      })
      this.setState({ messages })
    }

    toggleSelectAll = () => {
      const selectedMessages = this.state.messages.filter(message => message.selected)
      const selected = selectedMessages.length !== this.state.messages.length
      this.setState({
        messages: this.state.messages.map(message => (
          message.selected !== selected ? { ...message, selected } : message
        ))
      })
    }

    deleteMessages = () => {
      const messages = this.state.messages.filter(message => !message.selected)
      this.setState({ messages })
    }


  render() {
    return (
      <div className='container'>
        <Toolbar toggleSelectAll={ this.toggleSelectAll } removeLabel={ this.removeLabel } applyLabel={ this.applyLabel } messages={this.state.messages} markAsRead={ this.markAsRead } markAsUnread={ this.markAsUnread } deleteMessages={ this.deleteMessages } />
        <Messages messages={ this.state.messages } selectedMessage={ this.selectedMessage }  />
      </div>
    );
  }
}

export default App;
