import React, { useEffect, useState } from "react";
import Axios from "axios";
//import "../App.css";

export default function Registration() {
  //const [usernameReg, setUsernameReg] = useState("");
  const [fnameReg, setfnameReg] = useState("");
  const [lnameReg, setlnameReg] = useState("");
  const [emailReg, setemailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  Axios.defaults.withCredentials = false;

  const register = () => {
    Axios.post("http://localhost:3000/register", {
      first_name: fnameReg,
      last_name: lnameReg,
      email: emailReg,
      password: passwordReg,
    }).then((response) => {
      console.log(response);
      sessionStorage.setItem('jwtToken', response.data[1].token);
    }).catch(error => {
        console.log(error.response)
    });
  };
/*
  const login = () => {
    Axios.post("http://localhost:3000/login", {
      email: email,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus(response.data[0].username);
      }
    });
  };*/

  useEffect(() => {
    Axios.get("http://localhost:3000/login").then((response) => {
      if (response.data.loggedIn == true) {
        setLoginStatus(response.data.user[0].username);
      }
    });
  }, []);

  return (
    <div className="App">
      <div className="registration">
        <h1>Registration</h1>
        <label>First name</label>
        <input
          type="text"
          onChange={(e) => {
            setfnameReg(e.target.value);
          }}
        />
        <label>Last name</label>
        <input
          type="text"
          onChange={(e) => {
            setlnameReg(e.target.value);
          }}
        />
        <label>Email</label>
        <input
          type="text"
          onChange={(e) => {
            setemailReg(e.target.value);
          }}
        />
        <label>Password</label>
        <input
          type="text"
          onChange={(e) => {
            setPasswordReg(e.target.value);
          }}
        />
        <button onClick={register}> Register </button>
      </div>
    </div>
  );
}
