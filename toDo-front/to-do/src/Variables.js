let API_SERVER_VAL = ''
let WS_URL_VAL = ''
let CLIENT_ID_VAL = ''
// export const WS_SERVER = 'ws' + API_SERVER_VAL.replace("http", "");
API_SERVER_VAL = window.location.origin === "http://localhost:3000"? "http://127.0.0.1:8000": "htttp://server:8000";
WS_URL_VAL = window.location.origin === "http://localhost:3000"? "ws://127.0.0.1:8000": 'wss' + window.location.origin.replaceAll('https', '');
CLIENT_ID_VAL = '1074239857194-20fm5dbadp52q2gdb78gosl8k5mcrcj4.apps.googleusercontent.com'
export const API_SERVER = API_SERVER_VAL;
export const WS_URL = WS_URL_VAL;
export const CLIENT_ID = CLIENT_ID_VAL;