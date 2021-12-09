//import React, { Component } from "react";
import React, { Component, useEffect, useState } from "react";

import LoginModal from "react-login-modal";
import Axios from "axios";
 
class Register extends Component {
  /*const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");*/

  //Axios.defaults.withCredentials = true;

  handleSignup = (f_name,l_name, email, password) => {
      /*console.log(username)*/
      Axios.post("http://localhost:3000/register", {
            first_name: f_name,
            last_name: l_name,
            email: email,
            password: password
      }).then((response) => {
          console.log(response)
      });
  };
  handleLogin = (username, password) => {}

 /*Register = () => {
      Axios.post("http://localhost:3000/register", {
            first_name: username,
            last_name: username,
            email: email,
            password: password
      }).then((response) => {
          console.log(response)
      }); 
  };*/
 
  render() {
    return (
       <div></div>
    );
  }
}
export default Register;