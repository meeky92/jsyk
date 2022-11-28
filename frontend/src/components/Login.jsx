import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login(props) {

    const navigate = useNavigate();

    const handleSubmit = async event => {
        event.preventDefault();
        let email = event.target.email.value;
        let password = event.target.password.value;
        let stringToEncode = `${email}:${password}`;

        let myHeaders = new Headers();
        myHeaders.append('Authorization', `Basic ${btoa(stringToEncode)}`)
        myHeaders.append('Content-Type', 'application/json')

        let response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                email: email,
                password: password
              }) 
        })

        if (response.ok){
            let data = await response.json()
            let token = data.token;
            let expiration = data.token_expiration;
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExp', expiration);
            localStorage.setItem('user_id', data.id)
            localStorage.setItem('full_name', data.full_name)
            props.logUserIn();
            navigate('/');
        } 
    }

    return (
        <>
            <h3 className="text-center mt-4">Login</h3>
            <div className="d-flex justify-content-center" >
            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ width: '30rem' }}>
                    <input type="text" className='form-control mt-4' placeholder='Enter Email' name='email' />
                    <input type="password" className='form-control mt-4' placeholder='Enter Password' name='password' />
                    <input type="submit" id="button" value="Login" className='btn btn-dark w-100 mt-4' />
                </div>
            </form>
            </div>
        </>
    )
}