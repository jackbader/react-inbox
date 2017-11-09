import React from 'react'

const Message = ({message, selectedMessage, starredMessage}) => {

  function classes() {
    let classes = `row message ${message.read ? 'read' : 'unread'} ${message.selected ? 'selected' : ""}`
    return classes
  }

  function starClasses() {
    let classes = `star fa ${message.starred ? 'fa-star' : 'fa-star-o'}`
    return classes
  }

  const Label = ({label}) => {
    return (
      <span className="label label-warning">{label}</span>
    )
  }

  const starMessage = (e) => {
   e.stopPropagation()
   starredMessage(message)
 }

  return (
    < div onClick={() => selectedMessage(message, 'selected')} className = { classes() } >
    <div className="col-xs-1">
      <div className="row">
        <div className="col-xs-2">
          <input readOnly={ true } checked={ !!message.selected } type="checkbox"/>
        </div>
        <div className="col-xs-2" onClick={ starMessage }>
          <i className = { starClasses() } ></i>
        </div>
      </div>
    </div> < div className = "col-xs-11" > <a href="#">
      {message.labels.map( (label, i) => <Label key={ i } label={ label } />)}
      {message.subject}
    </a> < /div>
    </div >
  )
}

export default Message
