import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import findIndex from 'lodash/findIndex';
import classNames from 'classnames';
import Icon from '../Icon/Icon.jsx';
import SearchableSelect from './components/SearchableSelect.jsx';
import SimpleSelect from './components/SimpleSelect.jsx';
import OptionsList from './components/OptionsList.jsx';

import './Select2.pcss';

class Select2 extends React.Component {
  constructor(props) {
    super(props);

    this.changeOption = this.changeOption.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleInputSearchChange = this.handleInputSearchChange.bind(this);
    this.toggleShowOptions = this.toggleShowOptions.bind(this);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.optionsMap = this.optionsMap.bind(this);
    this.propsToState = this.propsToState.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.searchIndex = this.searchIndex.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.handleCloseOptions = this.handleCloseOptions.bind(this);

    this.state = {
      isOpen: false,
      selectValue: '',
      inputSearchValue: '',
      options: '',
      pending: false,
      cursor: 0,
      error: null,
      status: null,
    };
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({
        selectValue: this.props.value.label,
      });
    }
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('keydown', this.onKeyDownHandler);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({
        selectValue: nextProps.value.label,
        error: nextProps.error,
        status: nextProps.status === 'error' ? nextProps.status : null,
      });
      if (nextProps.value.label === nextProps.emptyValue) {
        this.setState({ selectValue: '' });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('keydown', this.onKeyDownHandler);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  showOptions() {
    if (this.props.disabled) return false;
    this.setState({
      isOpen: true,
      inputSearchValue: this.state.selectValue,
      error: null,
      status: null,
    });
  }

  toggleShowOptions() {
    if (this.props.disabled) return false;

    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    } else {
      if (this.props.options) {
        this.setState({ options: this.props.options });
        this.searchIndex(this.props.options);
      } else {
        this.loadOptions('');
      }
    }
  }

  changeOption(option, escape) {
    if (escape === true) {
      this.setState({ selectValue: option.label, inputSearchValue: option.label });
    } else {
      this.setState({ selectValue: option.label, isOpen: false, inputSearchValue: '' });
    }
    this.propsToState();
    if (
      option.label === undefined ||
      option.label === null ||
      option.label === this.props.emptyValue
    ) {
      this.setState({ selectValue: '', inputSearchValue: '' });
      this.props.onChange(option);
    } else {
      this.props.onChange(option);
    }
  }

  handleCloseOptions(e) {
    e.stopPropagation();
    this.setState({ isOpen: false, options: '', selectValue: '', inputSearchValue: '' });
  }

  handleClickOutside(e) {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.setState({ isOpen: false });
    }
  }

  handleInputSearchChange(e) {
    const query = e.target.value;

    this.setState({
      isOpen: true,
      selectValue: '',
      inputSearchValue: '',
      error: null,
      status: null,
    });

    if (this.props.options) {
      this.setState({ options: this.props.options });
      return;
    }

    if (this.props.startValue && query.length > this.props.startValue) {
      this.loadOptions(query);
    }

    if (!this.props.startValue) {
      this.loadOptions(query);
    }

    this.setState({ inputSearchValue: query });
  }

  handleBlur() {
    if (!this.state.isOpen) {
      this.propsToState();
      if (!this.state.selectValue && this.state.inputSearchValue) {
        let option = { label: this.state.inputSearchValue, selectable: false, isDirty: true };
        this.changeOption(option);
      } else if (
        this.state.inputSearchValue !== undefined &&
        this.state.inputSearchValue.length === 0
      ) {
        this.changeOption({
          label: this.props.emptyValue || ' ',
          selectable: false,
          isClear: true,
        });
      }

      this.setState({ pending: false });
    }
  }

  onKeyDownHandler(e) {
    if (this.state.isOpen) {
      const { cursor, options } = this.state;
      switch (e.keyCode) {
        case 38:
          e.preventDefault();
          if (cursor === 0) {
            this.setState({
              cursor: options.length - 1,
            });
          } else {
            this.setState(prevState => ({
              cursor: prevState.cursor - 1,
            }));
          }
          this.optionsMap(options, cursor - 1);
          break;
        case 40:
          e.preventDefault();
          if (cursor === options.length - 1) {
            this.setState({
              cursor: 0,
            });
          } else {
            this.setState(prevState => ({
              cursor: prevState.cursor + 1,
            }));
          }
          this.optionsMap(options, cursor + 1);
          break;
        case 13:
          options.map((optionItem, index) => {
            if (cursor === index) {
              this.changeOption(optionItem, true);
              this.setState({ isOpen: false });
            }
          });
          break;
        case 32:
        case 18:
          this.setState({ cursor: null });
          break;
        case 9:
          this.setState({ isOpen: false });
          break;
      }
    }
  }

  optionsMap(options, cursor) {
    options.map((optionItem, index) => {
      if (cursor === index) {
        this.setState({
          selectValue: optionItem.label,
          inputSearchValue: optionItem.label,
        });
      }
    });
  }

  loadOptions = debounce(query => {
    if (this.props.pending) {
      this.setState({ pending: true });
    }
    this.props.loader(query || '').then(response => {
      const options = this.props.serializer(response.data);
      if (!this.props.searchable) {
        this.searchIndex(options);
      }
      this.setState({
        options: options,
      });
      if (this.state.pending) {
        this.setState({
          pending: false,
        });
      }
    });
  }, 300);

  propsToState() {
    this.setState({
      error: this.props.error,
      status: this.props.status === 'error' ? this.props.status : null,
    });
  }

  searchIndex(options) {
    let index = findIndex(options, item => {
      return item.label === this.state.selectValue;
    });
    this.setState({ cursor: index, isOpen: true });
  }

  onFocus(event) {
    if (
      event.target.className !== 'select2__option' &&
      event.target.className !== 'select2__option select2__option_active'
    ) {
      if (this.state.selectValue === '') {
        this.setState({ selectValue: this.state.inputSearchValue, options: '' });
      }
      this.loadOptions(this.state.selectValue);
    }
  }

  render() {
    return (
      <div
        ref={this.setWrapperRef}
        onBlur={this.handleBlur}
        onFocus={!this.props.disabled && this.onFocus}
        className={classNames('select2', this.props.className, {
          select2_open: this.state.isOpen,
          select2_selected: this.state.selectValue,
          select2_required: this.props.required,
          select2_disabled: this.props.disabled,
          select2_success: this.props.status === 'success',
          select2_error: this.state.status === 'error',
          select2_loading: this.state.pending,
          select2_searchable: this.props.searchable,
          'select2_white-with-border': this.props.theme === 'white-with-border',
          'select2_small-gray': this.props.theme === 'small-gray',
        })}>
        <div className="select2__btn">
          {this.props.searchable ? (
            <SearchableSelect
              onChange={this.handleInputSearchChange}
              showOptions={this.showOptions.bind(this)}
              inputSearchValue={this.state.inputSearchValue || ''}
              selectValue={this.state.selectValue || ''}
              placeholder={this.props.placeholder || ''}
              disabled={this.props.disabled || false}
            />
          ) : (
            <SimpleSelect
              value={this.state.selectValue}
              placeholder={this.props.placeholder || ''}
              toggleShowOptions={this.toggleShowOptions}
            />
          )}
          <Icon className="select2__btn-icon" type="dropdown" width="9" height="8" />
          {this.props.status === 'success' && (
            <Icon
              className="select2__icon select2__icon_success"
              type="mail-check"
              width="14"
              height="14"
            />
          )}
          {this.state.pending && <div className="select2__loading" />}
        </div>

        {this.state.isOpen &&
          this.state.options && (
            <OptionsList
              options={this.state.options}
              changeOption={this.changeOption}
              searchPromptText={this.props.searchPromptText}
              cursor={this.state.cursor}
              close={this.handleCloseOptions}
            />
          )}
        {this.state.error && (
          <div
            className="input__error error"
            dangerouslySetInnerHTML={{ __html: this.state.error }}
          />
        )}
      </div>
    );
  }
}

Select2.propTypes = {
  /** Дополнительный класс */
  className: PropTypes.string,

  /** Кастомный placeholder  */
  placeholder: PropTypes.string,

  /** Возможность вводить поисковый запрос */
  searchable: PropTypes.bool,

  /** Обязательное поле */
  required: PropTypes.bool,

  /** Заблокированное состояние */
  disabled: PropTypes.bool,

  /** Статус */
  status: PropTypes.oneOf(['error', 'success', null]),

  /** Тема */
  theme: PropTypes.oneOf(['white-with-border', 'small-gray']),
};

export default Select2;
