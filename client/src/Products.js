import React, { Component } from 'react';





class Products extends Component {

    constructor(props) { 
        super(props);
        this.state = {
          data: [],
          IsCalled: false
        };
      }

      callBackendAPI = async () => {
       const response = await fetch('http://localhost:5000/api/v1/products')
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
    const list = this.state.data.map((data) => 
    <div>
        <p>{data.price} </p>
        <p>{data.name} </p>
    </div>
 
  
    )
    return (
        <div>
          <h2>Products</h2>
          
          {list}
        </div>
    );
  }
}

export default Products;