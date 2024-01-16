import React from 'react';

function DisplayFileSize(props) {
  return (
    <div className={props?.className ? props?.className : ''}>
      {props?.displayText ? props?.displayText : 'JPG, PNG, PDF (max. 10 MB)'}
    </div>
  );
}

export default DisplayFileSize;
