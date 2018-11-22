import React from 'react';
import FolderImg from './ios-folder-icon.jpg';
import {Button} from "react-bootstrap";

export default function ListView({item, onItemView, onItemEdit}) {
  return (
    <li className="list-item" key={item._id} >
      <img onClick={onItemView.bind(null, item)} src={FolderImg} width="45" height="45" />
      <div className="list-item-info">
        <span className="list-item__name">{item.name}</span>
      </div>
      <Button onClick={onItemEdit.bind(null, item)} className="pull-right" bsStyle="info"><i className="glyphicon glyphicon-pencil"></i></Button>
    </li>
  );
}
