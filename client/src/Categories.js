import React, { Component } from 'react';

import Popup from './Popup.js'
import './Popup.css'

import { useState } from 'react'
import PopupFunction from './PopupFunction'


class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
          data: [],
          IsCalled: false
        };
      }

      callBackendAPI = async () => {
       const response = await fetch('http://localhost:5000/api/v1/categories')
       .then((res) => {return res.json();})
       .then(res => this.setState( {data: res, IsCalled: true}))
       .catch(err => console.log(err));
       return response;
      };
    
      componentDidMount= async () => {
        await this.callBackendAPI()
      }

  render() {
    let f;
    if (this.state.IsCalled) {
      f = <p>{this.state.data[0].email}</p>;
    } else {
      f = <p>{"State was not set"}</p>
    }
    const token = sessionStorage.getItem('jwtToken')
    const list = this.state.data.map((data) => 
    <div>
    <div>
        <p>{data._id} </p>
        <p>{data.name} </p>
    </div>
    </div>
    )
    //const [buttonPopup, setButtonPopup] = useState(false)
    return (
        <div>
          <h2>Categories</h2>
          
          {list}
          <p>{token}</p>
         <PopupFunction>
         </PopupFunction>
        
        </div>
    );
  }
}

export default Categories;