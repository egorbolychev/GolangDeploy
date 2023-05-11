import React from 'react';

const SimpleSelect = ({ value, toggleShowOptions, placeholder }) => (
  <div className="select2__value" onClick={toggleShowOptions.bind(this)}>
    {value ? value : placeholder && <span className="select2__placeholder">{placeholder}</span>}
  </div>
);

export default SimpleSelect;
