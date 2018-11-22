import React from 'react';
import FileImg from './file-icon.png';
import TagView from 'Components/TagView';

export default function FileView({item, onItemEdit}) {
  return (
    <li className="list-item" key={item._id} onClick={onItemEdit.bind(null, item)}>
      <img src={FileImg} width="45" height="45" />
      <div className="list-item-info">
        <span className="list-item__name">{item.name}</span>
        <TagView tags={item.tags} />
      </div>
    </li>
  )
}
