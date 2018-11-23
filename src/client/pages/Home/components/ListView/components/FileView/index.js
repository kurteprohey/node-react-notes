import React from 'react';
import {Button} from "react-bootstrap";
import FileImg from './file-icon.png';
import TagView from 'Components/TagView';

export default function FileView({item, onItemEdit, onItemRemove}) {
  return (
    <li className="list-item" key={item._id} onClick={onItemEdit.bind(null, item)}>
      <img src={FileImg} width="45" height="45" />
      <div className="list-item-info">
        <span className="list-item__name">{item.name}</span>
        <TagView tags={item.tags} />
      </div>
      <Button onClick={onItemRemove.bind(null, item)} bsStyle="danger"><i className="glyphicon glyphicon-remove"></i></Button>
    </li>
  )
}
