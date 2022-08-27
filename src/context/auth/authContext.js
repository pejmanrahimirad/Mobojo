import React, { useReducer } from "react";
import history from "./history";
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

      if (!token) {
        history.push("/", { some: "state" });
        history.go();
      }
      break;
    }

    case "logout": {
      localStorage.removeItem("token");
      history.push("/");
      history.go();
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
