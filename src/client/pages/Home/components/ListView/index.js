import React from 'react';
import {Button} from "react-bootstrap";
import {TYPE_FILE, TYPE_FOLDER} from 'Constants/misc';
// import local components
import FileView from './components/FileView';
import FolderView from './components/FolderView';

export default function ListView({items, onItemView, onItemEdit, onItemRemove}) {
  const itemsTemplate = items.map((item, index) =>
    <React.Fragment key={index}>
      {item.type === TYPE_FILE && <FileView item={item} onItemEdit={onItemEdit} onItemRemove={onItemRemove} />}
      {item.type === TYPE_FOLDER && <FolderView item={item} onItemView={onItemView} onItemEdit={onItemEdit} onItemRemove={onItemRemove} />}
    </React.Fragment>
  );
  return (
    <ul className="list-view">{itemsTemplate}</ul>
  );
}
