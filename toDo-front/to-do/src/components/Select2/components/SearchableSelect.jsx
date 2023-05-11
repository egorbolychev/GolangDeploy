import React from 'react';

const SearchableSelect = ({
  onChange,
  showOptions,
  inputSearchValue,
  placeholder,
  selectValue,
  disabled,
}) => (
  <div className="select2__input">
    <input
      type="text"
      className="select2__input-field"
      onChange={onChange}
      onFocus={showOptions}
      value={inputSearchValue}
      disabled={disabled}
      autoComplete="off"
    />
    {placeholder && <span className="select2__placeholder">{placeholder}</span>}
    {selectValue && !inputSearchValue && (
      <span className="select2__input-value">{selectValue}</span>
    )}
  </div>
);

export default SearchableSelect;
