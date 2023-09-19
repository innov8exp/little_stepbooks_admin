import { createContext, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { message } from "antd";
import HttpStatus from "http-status-codes";
import { Routes } from "./config";

const emptyUser = () => {
  const user = {
    id: "",
    email: "",
    roles: [],
  };
  return user;
};

const UserContext = createContext([emptyUser(), () => {}]);

export const useSession = () => {
  const [session, setSession] = useContext(UserContext);
  const history = useHistory();
  const login = (userTmp) => {
    setSession(userTmp);
    history.push("/");
  };
  const getUserInfo = () => {
    return new Promise((resolve, reject) => {
      Axios.get("/api/admin/auth/user-info")
        .then((res) => {
          if (res && res.status === HttpStatus.OK) {
            console.log("xss", res);
            resolve(res.data);
          }
        })
        .catch((err) => reject(err));
    });
  };

  const logout = () => {
    Axios.post("/api/admin/auth/logout")
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          setSession(emptyUser());
          localStorage.removeItem("sat_current");
          history.push(Routes.signIn.path);
        } else {
          message.error("logout failed.");
        }
      })
      .catch((err) => {
        message.error("logout failed, error: ", err.message);
      });
  };
  return { login, logout, getUserInfo, session };
};

// eslint-disable-next-line react/prop-types
const UserContextProvider = ({ children }) => {
  const history = useHistory();
  let theUser = emptyUser();
  const current = localStorage.getItem("sat_current");
  if (current) {
    try {
      theUser = JSON.parse(decodeURIComponent(escape(atob(current))));
    } catch (err) {
      history.push(Routes.signIn.path);
    }
  }
  const [currentUser, setCurrentUser] = useState(theUser);
  useEffect(() => {
    if (currentUser.email) {
      localStorage.setItem(
        "sat_current",
        btoa(unescape(encodeURIComponent(JSON.stringify(currentUser))))
      );
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
