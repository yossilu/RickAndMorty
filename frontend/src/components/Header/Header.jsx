import React, { Fragment, useContext } from "react";
import { AppBar, Toolbar, Typography, InputBase, Button, Box } from "@mui/material";

import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthProvider";
import './Header.scss';

import logo from '../../assets/Rick_and_Morty.svg';

const Header = ({ logoPath, buttons }) => {
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies(['jwt']);
  const { auth, setAuth } = useContext(AuthContext);

  const logout = async () => {
    removeCookie('jwt');
    setAuth({});
    localStorage.setItem('user', JSON.stringify({}));
    sessionStorage.clear();
    navigate('/login');
  }

  const goHomePage = (e) => {
    e.preventDefault();
    navigate(auth?.email ? '/homepage' : '/login')
  }

  return (
    <Fragment>
      <AppBar position="static" className="header">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" className="logo">
            <img src={logo} alt="Logo" onClick={goHomePage}/>
          </Typography>
          {auth.email && <Box className="header-section">
            <Button color="inherit" onClick={() => navigate('/admin-homepage')}>Admin Dashboard</Button>
            <Button color="inherit" onClick={() => navigate('/homepage')}>User Dashboard</Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </Box>}
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}

export default Header;
