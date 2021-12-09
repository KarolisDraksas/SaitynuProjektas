import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';




class users extends Component {

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
    let f;
    if (this.state.IsCalled) {
      f = <p>{this.state.data[0].email}</p>;
    } else {
      f = <p>{"State was not set"}</p>
    }
    const list = (
    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>First Name</TableCell>
          <TableCell align="right">Last Name</TableCell>
          <TableCell align="right">Email</TableCell>
          <TableCell align="right">Role</TableCell>
        </TableRow>
      </TableHead>
      {this.state.data.map((data) =>
      <TableBody>
          <TableRow>
            <TableCell>{data.first_name}</TableCell>
            <TableCell align="right">{data.last_name}</TableCell>
            <TableCell align="right">{data.email}</TableCell>
            <TableCell align="right">{data.role}</TableCell>
          </TableRow>
      </TableBody>)}
    </Table>
  </TableContainer>
  
    )
    return (
        <div>
          
          {list}
        </div>
    );
  }
}

export default users;