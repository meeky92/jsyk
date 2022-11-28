import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

export default class Register extends Component {
  
  constructor(props){
    super(props);
      this.state = {
        redirect: false,
        to: '/'
        }
  }

  handleRegister = event => {
    event.preventDefault();

    let password = event.target.password.value;
    let confirmPass = event.target.confirmPass.value;
    if (password !== confirmPass){
        this.props.flashMessage('Oops, passwords do not match!', 'danger');
    } else {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        let formData = JSON.stringify({
            full_name: event.target.full_name.value,
            email: event.target.email.value,
            password: event.target.password.value
        })

        fetch("http://127.0.0.1:5000/create_user", {
            method: 'POST',
            headers: myHeaders,
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.error){
                    this.props.flashMessage(data.error, 'danger')
                } else {
                    console.log(data)
                    this.props.flashMessage('Account has been created', 'success')
                    this.setState({
                        redirect: true
                    })
                }
            })
            .catch(err => console.error(err))
        };
    };

  render() {
    // navigate to '/register'
    return (
      <>
        {this.state.redirect ? <Navigate to='/' /> :  (
          <>
            <h3 className="text-center mt-4">Register</h3>
            <div class="d-flex justify-content-center" >
              <form onSubmit={this.handleRegister}>
                <div className="form-group" style={{ width: '30rem'}}>
                  <label htmlFor="full_name">Full Name</label>
                  <input type="text" className='form-control' placeholder='Enter Full Name' name='full_name' />
                  <label htmlFor="email">Email</label>
                  <input type="text" className='form-control' placeholder='Enter Email' name='email' />
                  <label htmlFor="password">Password</label>
                  <input type="password" className='form-control' placeholder='Enter Password' name='password' />
                  <label htmlFor="confirmPass">Confirm Password</label>
                  <input type="password" className='form-control' placeholder='Re-Enter Password' name='confirmPass' />
                  <input type="submit" value="Register" className='btn btn-dark w-100 mt-3' />
                </div>
              </form>
            </div>  
          </>
        )}
      </>
    )
  }
}