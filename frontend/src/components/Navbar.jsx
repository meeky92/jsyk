import React, { useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';

export default function Navbar(props) {
  const [showBasic, setShowBasic] = useState(false);

  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='#'>JSYK</MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>

            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' className='nav-link' href='/'>
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBNavbarLink href='#'>About Us</MDBNavbarLink>
            </MDBNavbarItem>

            <MDBNavbarItem>
                  <MDBDropdown>
                    <>
                    <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                      More
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      {props.loggedIn ? (
                        <>
                        <MDBDropdownItem link href='/createpost'>Add Salary</MDBDropdownItem>
                        <MDBDropdownItem link href='/editposts'>Manage Your Submissions</MDBDropdownItem>
                        <MDBDropdownItem link href='/' onClick={props.logUserOut}>Logout</MDBDropdownItem>
                        </>
                      ): (
                        <>  
                        <MDBDropdownItem link>Contact Us</MDBDropdownItem>
                        </>
                      )}
                    </MDBDropdownMenu>
                    </>
                  </MDBDropdown>
            </MDBNavbarItem>
              
          </MDBNavbarNav>
          {props.loggedIn ? (
            <>Hello {localStorage.getItem('full_name')}</>
          ): (
            <>
            <MDBNavbarLink 
                className='btn btn-light' 
                href='/register'
                role='button'>
                    Register
            </MDBNavbarLink>
            <MDBNavbarLink 
                className='btn btn-dark'
                href='/login' 
                role='button'>
                    Login
            </MDBNavbarLink>
            </>)}      
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}