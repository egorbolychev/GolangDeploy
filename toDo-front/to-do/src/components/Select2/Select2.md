Выпадающий список без контекстного поиска

```jsx
<Select2
  value={state.data}
  onChange={data => setState({ data: data })}
  options={[
    { label: 'ИРСО', value: 0 },
    { label: 'НГАВТ', value: 1 },
    { label: 'НГАУ', value: 3 },
    { label: 'НГМУ', value: 4 },
    { label: 'НГПУ', value: 5 },
    { label: 'НГТУ', value: 6 },
    { label: 'НГУ', value: 7 },
    { label: 'НГУЭУ', value: 8 },
    { label: 'НКИ', value: 9 },
    { label: 'НСИ', value: 10 },
    { label: 'НХК', value: 11 },
    { label: 'НГГТИ', value: 12 },
    { label: 'НЕТ', value: 13 },
  ]}
  placeholder="Выберите опцию"
  required
  status="success"
/>
```

Выпадающий список без контекстного поиска. Отключённое

```jsx
const initialState = { value: 0 };
<Select2
  value={state.data}
  onChange={data => setState({ data: data })}
  options={[
    { label: 'ИРСО', value: 0 },
    { label: 'НГАВТ', value: 1 },
    { label: 'НГАУ', value: 3 },
    { label: 'НГМУ', value: 4 },
    { label: 'НГПУ', value: 5 },
    { label: 'НГТУ', value: 6 },
    { label: 'НГУ', value: 7 },
    { label: 'НГУЭУ', value: 8 },
    { label: 'НКИ', value: 9 },
    { label: 'НСИ', value: 10 },
    { label: 'НХК', value: 11 },
    { label: 'НГГТИ', value: 12 },
    { label: 'НЕТ', value: 13 },
  ]}
  placeholder="Выберите опцию"
  required
  disabled
/>;
```

Выпадающий список без контекстного поиска с асинхронной загрузкой данных

```jsx
<Select2
  serializer={item => item}
  placeholder="Учебные заведения"
  value={state.data}
  onChange={data => setState({ data: data })}
  loader={() => {
    return new Promise(resolve => {
      const response = {
        data: [
          { label: 'ИРСО', value: 0 },
          { label: 'НГАВТ', value: 1 },
          { label: 'НГАУ', value: 3 },
          { label: 'НГМУ', value: 4 },
          { label: 'НГПУ', value: 5 },
          { label: 'НГТУ', value: 6 },
          { label: 'НГУ', value: 7 },
          { label: 'НГУЭУ', value: 8 },
          { label: 'НКИ', value: 9 },
          { label: 'НСИ', value: 10 },
          { label: 'НХК', value: 11 },
          { label: 'НГГТИ', value: 12 },
          { label: 'НЕТ', value: 13 },
        ],
      };
      resolve(response);
    });
  }}
/>
```

Выпадающий список c контекстным поиском и асинхронной загрузкой данных

```jsx
<Select2
  serializer={item => item}
  placeholder="Учебные заведения"
  searchable
  value={state.data}
  onChange={data => setState({ data: data })}
  loader={() => {
    return new Promise(resolve => {
      const response = {
        data: [
          { label: 'ИРСО', value: 0 },
          { label: 'НГАВТ', value: 1 },
          { label: 'НГАУ', value: 3 },
          { label: 'НГМУ', value: 4 },
          { label: 'НГПУ', value: 5 },
          { label: 'НГТУ', value: 6 },
          { label: 'НГУ', value: 7 },
          { label: 'НГУЭУ', value: 8 },
          { label: 'НКИ', value: 9 },
          { label: 'НСИ', value: 10 },
          { label: 'НХК', value: 11 },
          { label: 'НГГТИ', value: 12 },
          { label: 'НЕТ', value: 13 },
        ],
      };
      resolve(response);
    });
  }}
/>
```

Выпадающий список c контекстным поиском и асинхронной загрузкой данных, начиная после ввода 3 символа

```jsx
<Select2
  serializer={item => item}
  placeholder="Учебные заведения"
  searchable
  startValue={3}
  value={state.data}
  onChange={data => setState({ data: data })}
  loader={() => {
    return new Promise(resolve => {
      const response = {
        data: [
          { label: 'ИРСО', value: 0 },
          { label: 'НГАВТ', value: 1 },
          { label: 'НГАУ', value: 3 },
          { label: 'НГМУ', value: 4 },
          { label: 'НГПУ', value: 5 },
          { label: 'НГТУ', value: 6 },
          { label: 'НГУ', value: 7 },
          { label: 'НГУЭУ', value: 8 },
          { label: 'НКИ', value: 9 },
          { label: 'НСИ', value: 10 },
          { label: 'НХК', value: 11 },
          { label: 'НГГТИ', value: 12 },
          { label: 'НЕТ', value: 13 },
        ],
      };
      resolve(response);
    });
  }}
/>
```

Выпадающий список без контекстного поиска. Белый с бордером

```jsx
<Select2
  value={state.data}
  onChange={data => setState({ data: data })}
  options={[
    { label: 'ИРСО', value: 0 },
    { label: 'НГАВТ', value: 1 },
    { label: 'НГАУ', value: 3 },
    { label: 'НГМУ', value: 4 },
    { label: 'НГПУ', value: 5 },
    { label: 'НГТУ', value: 6 },
    { label: 'НГУ', value: 7 },
    { label: 'НГУЭУ', value: 8 },
    { label: 'НКИ', value: 9 },
    { label: 'НСИ', value: 10 },
    { label: 'НХК', value: 11 },
    { label: 'НГГТИ', value: 12 },
    { label: 'НЕТ', value: 13 },
  ]}
  placeholder="Выберите опцию"
  required
  theme="white-with-border"
/>
```

Выпадающий список c контекстным поиском. Белый с бордером

```jsx
<Select2
  serializer={item => item}
  searchable
  startValue={3}
  value={state.data}
  onChange={data => setState({ data: data })}
  loader={() => {
    return new Promise(resolve => {
      const response = {
        data: [
          { label: 'Не выбрано', value: 0 },
          { label: 'НГАВТ', value: 1 },
          { label: 'НГАУ', value: 3 },
          { label: 'НГМУ', value: 4 },
          { label: 'НГПУ', value: 5 },
          { label: 'НГТУ', value: 6 },
          { label: 'НГУ', value: 7 },
          { label: 'НГУЭУ', value: 8 },
          { label: 'НКИ', value: 9 },
          { label: 'НСИ', value: 10 },
          { label: 'НХК', value: 11 },
          { label: 'НГГТИ', value: 12 },
          { label: 'НЕТ', value: 13 },
        ],
      };
      resolve(response);
    });
  }}
  theme="white-with-border"
  status="error"
  error={'Ошибка'}
/>
```
