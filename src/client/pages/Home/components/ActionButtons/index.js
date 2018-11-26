import React from 'react';
import {Button} from "react-bootstrap";

// export default function ActionButtons({buttons}) {
//   console.log('ActionButtons rerender');
//   const buttonsTemplate = buttons
//     .filter(btn => btn.enabled)
//     .map((btn, index) => {
//       return <li key={index}><Button onClick={btn.callback}>{btn.text}</Button></li>;
//     });
//   return (
//     <ul className="action-buttons">{buttonsTemplate}</ul>
//   );
// }

const ActionButtons = React.memo(function({buttons}) {
  console.log('ActionButtons rerender');
  const buttonsTemplate = buttons
    .filter(btn => btn.enabled)
    .map((btn, index) => {
      return <li key={index}><Button onClick={btn.callback}>{btn.text}</Button></li>;
    });
  return (
    <ul className="action-buttons">{buttonsTemplate}</ul>
  );
});

export default ActionButtons;