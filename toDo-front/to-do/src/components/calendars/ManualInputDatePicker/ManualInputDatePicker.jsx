import React, {useState, useEffect} from 'react';
import './ManualInputDatePicker.pcss'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
require('dayjs/locale/ru')
import dayjs from 'dayjs'

import DatePicker, { registerLocale } from 'react-datepicker';
import { Icon, SqrButton, Select2 } from '/src/components';
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

const MIN_DATE = dayjs("1900-01-01");
const MAX_DATE = dayjs(`${(new Date()).getFullYear() + 1}-12-31`);

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

const ManualInputDatePickerCustomHeader = ({
  date,
  changeMonth,
  changeYear,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => (
  <div className="date-picker-header">
    <SqrButton
      className="date-picker-header__prev-month-arrow"
      icon="arrow-back"
      size="xs"
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
    />
    <div className="date-picker-header__current-month">
    <Select2
        className='date-picker-header__first-header'
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
      className="date-picker-header__next-month-arrow"
      icon="arrow-back"
      size="xs"
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
    />
  </div>
);

const ManualInputDatePicker = ({className, startDate, setDate}) => {

  const [currentDate, setCurrentDate] = useState(dayjs(startDate));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if(currentDate !== '' && currentDate.isValid() && !checkIsDateEqual(currentDate.toDate(), startDate)){
      let date = currentDate.toDate();

      if (date >= MIN_DATE && date <= MAX_DATE){
        setDate(date)
      } else {
        setCurrentDate( date > MAX_DATE ? MAX_DATE : MIN_DATE)
      }
    }
  }, [currentDate])

  const checkIsDateEqual = (firstDate, secondDate) => {
   
    if (firstDate.getDate() === secondDate.getDate() && 
        firstDate.getMonth() === secondDate.getMonth() && 
        firstDate.getFullYear() === secondDate.getFullYear()){

      return true;
    } else {
      
      return false;
    }
  }

  const checkIsDateNull = (date) => {
    if (date !== null) {
      setCurrentDate(date);
    } else {
      setCurrentDate('');
    }
  }

  const checkIsDateValid = (date) => {

    if (date === '' || !date.isValid()){
      return startDate;
    }

    return date.toDate();
  }

  const handleChange = (date) => {
    setCurrentDate(dayjs(date));
    toggleCalendar();
  }

  const toggleCalendar = (e) => {
    e && e.preventDefault();
    setIsOpen(!isOpen);
  }

  const handleClickOutside = (e) => {
    e && e.preventDefault();
    setIsOpen(false);
  }

  return (
    <div className='manual-input-datepicker-wrapper'>
      <div className='manual-input-datepicker-wrapper__row'>
        <LocalizationProvider adapterLocale={"ru"} dateAdapter={AdapterDayjs}>
            <DateField 
                className={className}
                value={currentDate}
                onChange={(newValue) => checkIsDateNull(newValue)}
                maxDate={MAX_DATE}
                minDate={MIN_DATE}
            />
        </LocalizationProvider>

        <Icon type="calendar" width="16" height="16" onClick={toggleCalendar}/>
      </div>

    {isOpen && 
      <DatePicker
            locale="ru"
            inline
            selected={checkIsDateValid(currentDate)}
            //startDate={startDate}
            onChange={(date) => handleChange(date)}
            minDate={MIN_DATE.toDate()}
            maxDate={MAX_DATE.toDate()}
            onClickOutside={handleClickOutside}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              changeYear,
              changeMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <ManualInputDatePickerCustomHeader
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
    }
    </div>

  );
}

export default ManualInputDatePicker