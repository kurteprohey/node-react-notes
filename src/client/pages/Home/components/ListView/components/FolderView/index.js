import React from 'react';
import FolderImg from './ios-folder-icon.jpg';
import {Button} from "react-bootstrap";

export default function ListView({item, onItemView, onItemEdit}) {
  return (
    <li className="list-view__item" key={item._id} >
      <img onClick={onItemView.bind(null, item)} src={FolderImg} width="40" height="40" />
      <span className="list-view__item-name">{item.name}</span>
      <Button onClick={onItemEdit.bind(null, item)} className="pull-right" bsStyle="info"><i className="glyphicon glyphicon-pencil"></i></Button>
    </li>
  );
}
