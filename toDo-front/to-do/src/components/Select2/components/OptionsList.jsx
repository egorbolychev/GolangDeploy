import React from 'react';

const OptionsList = ({ options, changeOption, cursor, searchPromptText, close }) => (
  <div className="select2__dropdown">
    <div className="select2__option-list">
      {options && options.length !== 0 ? (
        options.map((optionItem, index) => (
          <div key={index}>
            <div
              className={
                cursor === index ? 'select2__option select2__option_active' : 'select2__option'
              }
              key={index}
              onClick={changeOption.bind(this, optionItem)}>
              {optionItem.label}
            </div>
            {options.length === 1 && !optionItem.value && (
              <span className="select2__placeholder" onClick={close}>
                {searchPromptText}
              </span>
            )}
          </div>
        ))
      ) : (
        <span className="select2__placeholder">{searchPromptText}</span>
      )}
    </div>
  </div>
);

export default OptionsList;
