import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Products from './Products'
import Users from './users'
import Categories from './Categories';
//import Register from './Register';
import Reg from './reg'
//var hashHistory = require('react-router-redux')
import Header from './Header'
import Login from './signin'
import Logout from './logout'


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      IsCalled: false
    };
  }

  callBackendAPI = async () => {
   const response = await fetch('http://localhost:5000/api/v1/users')
   .then((res) => {return res.json();})
   .then(res => this.setState( {data: res, IsCalled: true}))
   .catch(err => console.log(err));
   return response;
  };

  componentDidMount= async () => {
    await this.callBackendAPI()
  }


     
  render() {
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto">
            <li><Link to={'/users'} className="nav-link">Users</Link></li>
            <li><Link to={'/products'} className="nav-link">Products</Link></li>
            <li><Link to={'/categories'} className="nav-link">Categories</Link></li>
            <li><Link to={'/register'} className="nav-link">Register</Link></li>
            <li><Link to={'/header'} className="nav-link">header</Link></li>
            <li><Link to={'/login'} className="nav-link">Log in</Link></li>
            <li><Link to={'/logout'} className="nav-link">Log out</Link></li>

          </ul>
          </nav>
          <hr />
          <Routes>
              <Route path='/products' element={<Products/>} />
              <Route path='/users' element={<Users/>} />
              <Route path='/categories' element={<Categories/>} />
              <Route path='/header' element={<Header/>} />
              <Route path="/register" element={ <Reg />} />
              <Route path="/login" element={ <Login />} />
              <Route path="/logout" element={ <Logout />} />

          </Routes>
        </div>
      </Router>
  
    ); 
  }
}



export default App;