import React from 'react';
import {Modal} from "react-bootstrap";

const Heading = React.memo(function({parentFolder, onLogout}) {
  return (
    <div className="home-heading">
      <h3>{parentFolder ? parentFolder.name : 'Your workspace'}</h3>
      <a href="#" onClick={onLogout}>Logout</a>
    </div>
  );
});

export default Heading;