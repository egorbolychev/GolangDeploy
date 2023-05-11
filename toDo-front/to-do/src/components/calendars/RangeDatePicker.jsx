import React from 'react';
import classNames from 'classnames';
import { Icon, SqrButton } from '/src/components/ui';

import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import DatePicker, { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.pcss';
registerLocale('ru', ru);

const RangeDatePickerCustomHeader = ({
  date,
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
    <div className="date-picker__current-month">{format(date, 'LLLL yyyy', { locale: ru })}</div>
    <SqrButton
      className="date-picker__next-month-arrow"
      icon="arrow-back"
      size="xs"
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
    />
  </div>
);

class RangeDatePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: this.props.startDate ? this.props.startDate : new Date(),
      endDate: this.props.endDate ? this.props.endDate : addDays(new Date(), 1),
      isOpenStartCalendar: false,
      isOpenEndCalendar: false,
      dateFormat: 'dd MMM yyyy',
    };

    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
    this.toggleStartCalendar = this.toggleStartCalendar.bind(this);
    this.toggleEndCalendar = this.toggleEndCalendar.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleChangeStartDate(date) {
    this.setState({
      startDate: date,
    });

    this.toggleStartCalendar();
  }

  handleChangeEndDate(date) {
    this.setState({
      endDate: date,
    });

    this.toggleEndCalendar();
  }

  toggleStartCalendar(e) {
    e && e.preventDefault();
    this.setState({ isOpenStartCalendar: !this.state.isOpenStartCalendar });
  }

  toggleEndCalendar(e) {
    e && e.preventDefault();
    this.setState({ isOpenEndCalendar: !this.state.isOpenEndCalendar });
  }

  handleClickOutside(e) {
    e && e.preventDefault();
    this.setState({ isOpenStartCalendar: false, isOpenEndCalendar: false });
  }

  render() {
    const { className, startDateLabel, endDateLabel } = this.props;
    const componentClassName = classNames('date-picker date-picker_range', className);

    return (
      <div className={componentClassName}>
        <div className="date-picker__input-wrapper">
          <div
            className={classNames('date-picker__input', {
              'date-picker__input_open': this.state.isOpenStartCalendar,
            })}
            onClick={this.toggleStartCalendar}>
            <span className="date-picker__input-label">
              {startDateLabel ? startDateLabel : 'c'}
            </span>
            {format(this.state.startDate, this.state.dateFormat, { locale: ru })}
            <Icon type="calendar" width="16" height="16" />
          </div>
          <div
            className={classNames('date-picker__input', {
              'date-picker__input_open': this.state.isOpenEndCalendar,
            })}
            onClick={this.toggleEndCalendar}>
            <span className="date-picker__input-label">
              {endDateLabel ? endDateLabel : 'по'}
            </span>
            {format(this.state.endDate, this.state.dateFormat, { locale: ru })}
            <Icon type="calendar" width="16" height="16" />
          </div>
        </div>
        {this.state.isOpenStartCalendar && (
          <DatePicker
            locale="ru"
            inline
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStartDate}
            onClickOutside={this.handleClickOutside}
            maxDate={addDays(this.state.endDate, -1)}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <RangeDatePickerCustomHeader
                date={date}
                decreaseMonth={decreaseMonth}
                increaseMonth={increaseMonth}
                prevMonthButtonDisabled={prevMonthButtonDisabled}
                nextMonthButtonDisabled={nextMonthButtonDisabled}
              />
            )}
          />
        )}
        {this.state.isOpenEndCalendar && (
          <DatePicker
            locale="ru"
            inline
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEndDate}
            onClickOutside={this.handleClickOutside}
            minDate={addDays(this.state.startDate, 1)}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <RangeDatePickerCustomHeader
                date={date}
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

export default RangeDatePicker;
