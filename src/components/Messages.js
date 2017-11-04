import React from 'react'

import Message from '../components/Message'

const Messages = ({messages, selectedMessage}) => {
  return (
    <div>
      { messages.map((message, i) => <Message key={ i } message={ message } selectedMessage={ selectedMessage } />) }
    </div>
  )
}

export default Messages
