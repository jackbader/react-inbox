import React from 'react'

const Toolbar = ({messages, markAsRead, markAsUnread, deleteMessages, applyLabel, removeLabel, toggleSelectAll}) => {

  const unreadCount = messages.filter(message => !message.read).length
  const selectedCount = messages.filter(message => message.selected).length

  let selectAllClass

  switch(selectedCount) {
    case 0:
      selectAllClass = 'fa-square-o'
      break;
    case messages.length:
      selectAllClass = 'fa-check-square-o'
      break;
    default:
      selectAllClass = 'fa-minus-square-o'
  }

  return (

    <div className="row toolbar">
      <div className="col-md-12">
        <p className="pull-right">
          <span className="badge badge">{unreadCount}</span>
           unread {unreadCount === 1 ? 'message' : 'messages'}
        </p>

        <a className="btn btn-danger">
          <i className="fa fa-plus"></i>
        </a>

        <button className="btn btn-default" onClick={toggleSelectAll}>
          <i className={`fa ${selectAllClass}`}></i>
        </button>

        <button onClick={markAsRead} className="btn btn-default">Mark As Read</button>

        <button onClick={markAsUnread} className="btn btn-default">Mark As Unread</button>

        <select onChange={(e) => {applyLabel(e.target.value); e.target.selectedIndex = 0}} className="form-control label-select">
          <option>Apply label</option>
          <option value="dev">dev</option>
          <option value="personal">personal</option>
          <option value="gschool">gschool</option>
        </select>

        <select onChange={(e) => {removeLabel(e.target.value); e.target.selectedIndex = 0}} className="form-control label-select">
          <option>Remove label</option>
          <option value="dev">dev</option>
          <option value="personal">personal</option>
          <option value="gschool">gschool</option>
        </select>

        <button onClick={deleteMessages} className="btn btn-default">
          <i className="fa fa-trash-o"></i>
        </button>
      </div>
    </div>

    

  )
}

export default Toolbar
