import React from 'react';
import classNames from 'classnames';
import { Icon, SqrButton, Select2 } from '/src/components';

import format from 'date-fns/format';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.pcss';

import DatePicker, { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step))
const years = range(1900, (new Date()).getFullYear() + 1, 1).reverse();
const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const SingleDatePickerCustomHeader = ({
  date,
  changeMonth,
  changeYear,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => (
  <div className="date-picker__header">
    <SqrButton
      className="date-picker__prev-month-arrow"
      icon="arrow-back"
      size="xs"
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
    />
    <div className="date-picker__current-month">
    <Select2
        className='date-picker-first-header'
        value={{label: months[date.getMonth()], value: months[date.getMonth()]}}
        onChange={data =>
          {changeMonth(months.indexOf(data.value))}
        }
        options={
          months.map((option) => (
            {label: option.toString(), value: option}
          ))
        }
      />
      <Select2
        value={{label: date.getFullYear(), value: date.getFullYear()}}
        onChange={data =>
          {changeYear(data.value)}
        }
        options={
          years.map((option) => (
            {label: option, value: option}
          ))
        }
      />
      </div>
    <SqrButton
      className="date-picker__next-month-arrow"
      icon="arrow-back"
      size="xs"
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
    />
  </div>
);

class SingleDatePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: this.props.startDate ? this.props.startDate : '',
      title: this.props.title ? this.props.title : 'Дата',
      isOpen: false,
      dateFormat: 'dd MMM yyyy',
    };

    this.handleChange = this.handleChange.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
    if (this.props.setDate) this.props.setDate(date)
    this.toggleCalendar();
  }

  toggleCalendar(e) {
    e && e.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleClickOutside(e) {
    e && e.preventDefault();
    this.setState({ isOpen: false });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.clear !== this.props.clear) {
      this.setState({
        startDate: ''
      });
    }
  }
  

  render() {
    const { className, value } = this.props;
    const componentClassName = classNames('date-picker date-picker_single', className);

    return (
      <div className={componentClassName}>
        <div className="date-picker__input-wrapper">
          <div
            className={classNames('date-picker__input', {
              'date-picker__input_open': this.state.isOpen,
            })}
            onClick={this.toggleCalendar}>
            {/* <input
              type="text"
              value={this.state.startDate ? format(this.state.startDate, this.state.dateFormat, { locale: ru }) : this.state.title}
            /> */}
            {this.state.startDate ? format(this.state.startDate, this.state.dateFormat, { locale: ru }) : this.state.title}
            <Icon type="calendar" width="16" height="16" />
          </div>
        </div>
        {this.state.isOpen && (
          <DatePicker
            locale="ru"
            inline
            selected={this.state.startDate}
            startDate={this.state.startDate}
            onChange={this.handleChange}
            minDate={this.props.minDate ? this.props.minDate : null}
            maxDate={this.props.maxDate ? this.props.maxDate : null}
            onClickOutside={this.handleClickOutside}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              changeYear,
              changeMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <SingleDatePickerCustomHeader
                date={date}
                changeYear={changeYear}
                changeMonth={changeMonth}
                decreaseMonth={decreaseMonth}
                increaseMonth={increaseMonth}
                prevMonthButtonDisabled={prevMonthButtonDisabled}
                nextMonthButtonDisabled={nextMonthButtonDisabled}
              />
            )}
          />
        )}
      </div>
    );
  }
}

export default SingleDatePicker;
