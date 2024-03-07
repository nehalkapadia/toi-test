import React from 'react';
import '../styles/index.css';
import { Spin } from 'antd';

const CustomSpinner = () => {
  return (
    <div className='spinner-overlay' onClick={(e) => e.stopPropagation()}>
      <Spin fullscreen />
    </div>
  );
};

export default CustomSpinner;
