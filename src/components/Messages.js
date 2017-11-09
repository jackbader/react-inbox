import React from 'react'

import Message from '../components/Message'

const Messages = ({messages, selectedMessage, starredMessage}) => {
  return (
    <div>
      { messages.slice(0).reverse().map((message, i) => <Message key={ i }  message={ message } selectedMessage={ selectedMessage } starredMessage={ starredMessage } />) }
    </div>
  )
}

export default Messages
