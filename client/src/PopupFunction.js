import React, { Component } from 'react';

import Popup from './Popup.js'
import './Popup.css'

import { useState, useEffect } from 'react'
import Axios from "axios";


function PopupFunction() {
    const [buttonPopup, setButtonPopup] = useState(false)
    const [name, setName] = useState("");
    const create = () => {
        //console.log(sessionStorage.getItem('jwtToken'));

        Axios.post("http://localhost:3000/api/v1/categories", {
          name: name
        }, {
            headers:{
                'authorization': sessionStorage.getItem('jwtToken')
            }
        }).then((response) => {
          /*if (response.data.message) {
            setLoginStatus(response.data.message);
          } else {
            setLoginStatus(response.data[0].username);
          }*/
          console.log(response);
         // sessionStorage.setItem('jwtToken', response.data.token);
    
    
        }).catch(error => {
            console.log(error.response)
        });
      };
    return (
        <div>
          <button onClick={() => setButtonPopup(true)}>Add category</button>
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <h3>Add category</h3>
            <div className="App">
            <div className="registration">
                <label>Category name</label>
                <input
                type="text"
                onChange={(e) => {
                    setName(e.target.value);
                }}
                />
                <button onClick={create}> Create category </button>
            </div>
            </div>
          </Popup>
        </div>
    );
}

export default PopupFunction;