import React from 'react';
import FileImg from './file-icon.png';

export default function FileView({item, onItemEdit}) {
  return (
    <li className="list-view__item" key={item._id} onClick={onItemEdit.bind(null, item)}>
      <img src={FileImg} width="40" height="40" />
      <span className="list-view__item-name">{item.name}</span>
    </li>
  )
}
