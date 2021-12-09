import React, { useEffect, useState } from "react";
import Axios from "axios";
//import "../App.css";

export default function Registration() {
  //const [usernameReg, setUsernameReg] = useState("");
  /*const [fnameReg, setfnameReg] = useState("");
  const [lnameReg, setlnameReg] = useState("");
  const [emailReg, setemailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");*/ 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  Axios.defaults.withCredentials = true;

  /*const register = () => {
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
  };*/

  const login = () => {
    Axios.post("http://localhost:3000/login", {
      email: email,
      password: password,
    }).then((response) => {
      /*if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus(response.data[0].username);
      }*/
      console.log(response.data.token);
      sessionStorage.setItem('jwtToken', response.data.token);


    }).catch(error => {
        console.log(error.response)
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:3000/login").then((response) => {
      if (response.data.loggedIn == true) {
        setLoginStatus(response.data.user[0].first_name);
      }
    });
  }, []);

  return (
    <div className="App">
      <div className="registration">
        <h1>Log in</h1>
        <label>Email</label>
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <label>Password</label>
        <input
          type="text"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button onClick={login}> Log in </button>
      </div>
    </div>
  );
}
