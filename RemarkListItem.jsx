import React from 'react'

const RemarkListItem = ({item, handleClick}) => {

  return (
    <li onClick={() => handleClick(item)}>{item[0]}: {item[1]}</li>
  )
}

export default RemarkListItem