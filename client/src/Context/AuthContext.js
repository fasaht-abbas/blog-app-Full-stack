import React, { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { refreshing } from "../components/Utlis";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    accessToken: "",
  });

  // setting the default token...
  axios.defaults.headers.common["authorization"] = auth?.accessToken;

  // refreshing and the auth values on page refresh
  const refreshPage = async () => {
    try {
      const data = await refreshing();
      setAuth({
        ...auth,
        user: data?.user,
        accessToken: data?.accessToken,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!auth?.accessToken) refreshPage();
  }, [auth?.accessToken]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
