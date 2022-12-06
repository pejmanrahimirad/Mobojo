import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import axios from 'axios'
import GetToken from './context/auth/GetToken'
const token=GetToken();

axios.defaults.baseURL="http://localhost:4000/graphql"
axios.defaults.headers.post['Accept']='application/json'
axios.defaults.headers.post['token']=token
import { Provider } from 'react-redux'
import store from './store'
import * as ReactDomClient from 'react-dom/client'
const root = ReactDomClient.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
// ReactDOM.render(
// ,
//   document.getElementById('root'),
// )

reportWebVitals()
