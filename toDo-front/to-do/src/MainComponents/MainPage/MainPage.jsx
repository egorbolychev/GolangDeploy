import React, { useEffect, useState } from 'react';
import ManualInputDatePicker from '/src/components/calendars/ManualInputDatePicker/ManualInputDatePicker.jsx';
import './MainPage.pcss'
import {Select2, SqrButton} from '/src/components'
import NewOpt from './NewOpt.jsx'
import Option from './Option.jsx'
import axios from "axios";
import {API_SERVER} from "/src/Variables"
import { useSelector } from 'react-redux';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';

const MainPage = () => {
  const [date, setDate] = useState(new Date())
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState({value: '', label: ''})
  const [isNew, setIsNew] = useState(false)
  const user = useSelector(state => state.user)
  const [list, setList] = useState({value: ''})
  const [listItems, setListItems] = useState([])

  const addNew = () => {
    setSelectedOption({value: '', label: ''})
    setIsNew(true)
  }

  const refreshOptions = () => {
    let params = ''
    let url = API_SERVER + '/api/get-lists'
    params += '?date=' + date.getFullYear() + '-' + String(date.getMonth() + 1) + '-' + date.getDate()
    params += '&&userId=' + user.id
    axios.get(url + params,
       {
        headers: {
            'Content-Type': 'application/json',
            Token: user.token
        }
        }).then(data => {
          if (data.data.length !== 0) {
            setOptions(data.data)
            setSelectedOption(data.data[0])
          } else {
            setOptions([])
            setSelectedOption({value: '', label: ''})
            setList({value: ''})
          }
        }).catch(error => {
        console.log(error)
        });
  }

  const refreshList = () => {
    if (selectedOption.value) {
      let params = ''
      let url = API_SERVER + '/api/get-list'
      params += '?listId=' + selectedOption.value
      axios.get(url + params,
        {
          headers: {
              'Content-Type': 'application/json',
              Token: user.token
          }
          }).then(data => {
            console.log(data.data)
            setList(data.data)
            setListItems(data.data.items)
          }).catch(error => {
          console.log(error)
          });
    }
  }


  useEffect(() => {
    refreshOptions()
    setIsNew(false)
  },[date])

  useEffect(() => {
    refreshList()
  },[selectedOption])

  useEffect(() => {
    setIsNew(false)
  },[list])


  return (
    <div className='main-page-wrapper'>
      <div className='flex-head'>
        <div className='main-datepicker'  >
          <ManualInputDatePicker startDate={date} setDate={setDate}/>
        </div>
        <div className='main-select2'>
          <Select2 
          placeholder='Список'
          options={options}
          value={selectedOption}
          onChange={data => setSelectedOption(data)}/>
        </div>
        <SqrButton
            onClick={addNew}
            icon="plus"
            size="m"
            theme='blue'
          />
      </div>
      {isNew ? 
      <NewOpt setIsNew={setIsNew}/>
      : <div>{list.value !== '' && <Option list={list} listItems={listItems} setListItems={setListItems}/>}</div>
      }
    </div>
    );
  };

  export default MainPage;