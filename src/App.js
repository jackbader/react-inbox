import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Toolbar from './components/Toolbar';
import Messages from './components/Messages'
import Compose from './components/Compose'

class App extends Component {

  state = {
    messages: [],
    isComposing: false
  }

  async componentDidMount() {
    const itemsResponse = await fetch(`/api/messages`)
    const itemsJson = await itemsResponse.json()
    this.setState({
      ...this.state,
      messages: itemsJson._embedded.messages
    })
  }

  starredMessage = async (message) => {

    const newobj = {
      messageIds: [message.id],
      star: !message.starred,
      command: 'star'
    }

    const response = await fetch(`/api/messages`, {
      method: 'PATCH',
      body: JSON.stringify(newobj),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })

    if (response.status === 200) {
      const itemsResponse = await fetch(`/api/messages`)
      const itemsJson = await itemsResponse.json()

      let beforemessages = this.state.messages
      let beforemessage = beforemessages[message.id-1]
      let aftermessages = itemsJson._embedded.messages
      let aftermessage = aftermessages[message.id-1]

      //because selected state is not pushed to backend
      //selected is only stored in local state
      aftermessage.selected = beforemessage.selected

      let index = (message.id-1)

      this.setState({
        messages: [
          ...this.state.messages.slice(0, index),
          {
            ...aftermessage,
            ['starred']: aftermessage.starred
          },
          ...this.state.messages.slice(index + 1),
        ]
      })
    }

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

  markAsRead = async () => {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "read",
      "read": true
    })

    this.setState({
      messages: this.state.messages.map(message => (
        message.selected ? { ...message, read: true } : message
      ))
    })
  }

  markAsUnread = async () => {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "read",
      "read": false
    })

    this.setState({
      messages: this.state.messages.map(message => (
        message.selected ? { ...message, read: false } : message
      ))
    })
  }

  applyLabel = async (label) => {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "addLabel",
      "label": label
    })

    const messages = this.state.messages.map(message => (
      message.selected && !message.labels.includes(label) ?
        { ...message, labels: [...message.labels, label].sort() } :
        message
    ))
    this.setState({ messages })
  }

  removeLabel = async (label) => {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "removeLabel",
      "label": label
    })

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

    toggleCompose = () => {
      this.setState({isComposing: !this.state.isComposing})
    }

    createMessage = async (message) => {

      const response = await fetch(`/api/messages`, {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })

      const newMessage = await response.json()

      const messages = [...this.state.messages, newMessage]

      this.setState({
        messages,
        isComposing: false,
      })

    }

  deleteMessages = async () => {
    await this.updateMessages({
      "messageIds": this.state.messages.filter(message => message.selected).map(message => message.id),
      "command": "delete"
    })

    const messages = this.state.messages.filter(message => !message.selected)
    this.setState({ messages })
  }

  updateMessages = async (payload) => {
    await this.request('/api/messages', 'PATCH', payload)
  }

  async request(path, method = 'GET', body = null) {
    if (body) body = JSON.stringify(body)
    return await fetch(`${path}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body
    })
  }

  render() {
    return (
      <div className='container'>
        <Toolbar toggleCompose={ this.toggleCompose } toggleSelectAll={ this.toggleSelectAll } removeLabel={ this.removeLabel } applyLabel={ this.applyLabel } messages={this.state.messages} markAsRead={ this.markAsRead } markAsUnread={ this.markAsUnread } deleteMessages={ this.deleteMessages } />
          {
            this.state.isComposing ? <Compose createMessage={ this.createMessage }/> : null
          }
        <Messages starredMessage={ this.starredMessage } messages={ this.state.messages } selectedMessage={ this.selectedMessage } />
      </div>
    );
  }
}

export default App;
