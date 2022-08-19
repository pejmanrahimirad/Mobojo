import React, { useReducer } from "react";
import {createBrowserHistory} from 'history'
const history=createBrowserHistory();
export const AuthContext = React.createContext();
const authReducer = (state, action) => {
  switch (action.type) {
    case "login": {
      const token = action.payload;
      localStorage.setItem("token", token);
      return { state: token };
    }
    case "check": {
      const token = localStorage.getItem("token");
      if(!token){
       history.replace('/',{some:'state'})
        // window.location.href='http://127.0.0.1:3000/'
      }
      break;
    }
    default:
      return state;
  }
};
const AuthContextProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, "");
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
