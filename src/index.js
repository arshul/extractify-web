import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4, validate } from 'uuid';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import * as serviceWorker from './serviceWorker';
import App from './App';

function createNewUser() {
  const newId = uuidv4().toString();
  window.localStorage.setItem('user', JSON.stringify({ id: newId }));
  return newId;
}

function getUser() {
  const user = window.localStorage.getItem('user');
  if (user) {
    const userId = JSON.parse(user).id;
    if (!validate(userId)) {
      return createNewUser();
    }
    return userId;
  }
  return createNewUser();
}
const user = getUser();

ReactDOM.render(
  <React.StrictMode>
    <App user={user} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
