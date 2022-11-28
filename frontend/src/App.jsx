import React, { useState } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from "./components/Login";
import Home from './components/Home';
import Footer from './components/Footer';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import EditPosts from './components/EditPosts';
import AlertMessage from "./components/AlertMessage";

function App() {

  const [message, setMessage] = useState(null);
  const [category, setCategory] = useState(null);
  const flashMessage = (message, category) => {
    setMessage(message);
    setCategory(category);
}

  const now = new Date();
  const [loggedIn, setLoggedIn] = useState((localStorage.getItem('token') && new Date(localStorage.getItem('tokenExp')) > now));

  const logUserIn = () => {
    setLoggedIn(true);
}

  const logUserOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExp');
    flashMessage('bai', 'info');
}
  
  return (
    <>
      <Navbar loggedIn={loggedIn} logUserOut={logUserOut}/>
      <div className="container">
      {message ? <AlertMessage message={message} category={category} flashMessage={flashMessage}/> : null}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login logUserIn={logUserIn}/>} />
          <Route path='/createpost' element={<CreatePost />} />
          <Route path='/editposts' element={<EditPosts />} />
          <Route path='/register' element={<Register flashMessage={flashMessage}/>} />
        </Routes>
      </div>
      <Footer/>
    </>
  );
}

export default App;
