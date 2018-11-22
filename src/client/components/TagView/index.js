import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

export default function({tags}) {
  if (!tags) return null;
  const tagsArray = tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length)
    .map((tag, index) => <li key={index} className="tag-item">{tag}</li>);
  return <ul className="tag-view">
    {tagsArray}
  </ul>;
}
