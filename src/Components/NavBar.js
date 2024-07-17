import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, TextField, Toolbar, Typography, } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './NavBar.css'

function NavBar() {

  //use state hooks to store relevant values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [occupation, setOccupation] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [occupationError, setOccupationError] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const navigate = useNavigate();

  //handles user login and registration
  //action stores "login" or "register"
  const onSubmit = (action) => {

    //checks for missing data
    setUsernameError(false);
    setPasswordError(false);
    setOccupationError(false);
    let flag = false;
    if (username === "") {
      setUsernameError(true);
      flag = true;
    }
    if (password === "") {
      setPasswordError(true);
      flag = true;
    }
    if (occupation === "") {
      setOccupationError(true);
      flag = true;
    }
    if (flag) {
      return;
    }

    const data = {
      username: username,
      password: password,
      occupation: occupation,
    };

    //sends a post request with user details to login or register the user
    axios.post(`http://20.6.129.171:8080/userauth/${action}`, data)
      .then((response) => {
        //unsuccessful 
        if (response.data.error) {
          alert(response.data.error);
          return;
        }
        //success and stores details in session storage
        sessionStorage.setItem("UserId", response.data);
        sessionStorage.setItem("Username", username);
        sessionStorage.setItem("Occupation", occupation);
        //closes the dialog
        setOpenRegister(false);
        navigate("home");
        //reloads the page
        window.location.reload();
      });
  }

  //content displayed within the dialog
  const dialogContent = () => {
    return (
      <>

        {/*username*/}
        <TextField
          variant="standard"
          required
          margin="normal"
          label="Username"
          error={usernameError}
          fullWidth
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
        ></TextField>

        {/*password*/}
        <TextField
          className="password-input"
          type="password"
          variant="standard"
          required
          margin="normal"
          label="Password"
          fullWidth
          error={passwordError}
          onChange={(e) => setPassword(e.target.value)}
        ></TextField>

        {/*occupation*/}
        <InputLabel required className="occupation-input" >
          Occupation
        </InputLabel>
        <Select
          fullWidth
          error={occupationError}
          onChange={(e) => setOccupation(e.target.value)}
        >
          <MenuItem value="Student">Student</MenuItem>
          <MenuItem value="Instructor">Instructor</MenuItem>
        </Select>

      </>
    )
  }

  return (

    <AppBar position="static">
      {/*dialog for user login*/}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
        <DialogTitle className="login-header">
          <Typography className="login-title"><strong>Welcome back!</strong></Typography>
        </DialogTitle>
        <DialogContent>
          {dialogContent()}
        </DialogContent>
        <DialogActions className="login-action">
          <Button fullWidth onClick={() => { setOpenLogin(false); }} className="login-button">
            Cancel
          </Button>
          <Button fullWidth type="submit" onClick={() => onSubmit("login")} className="login-button">
            Log In
          </Button>
        </DialogActions>
      </Dialog>

      {/*dialog for user registration*/}
      <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
        <DialogTitle className="register-header">
          <Typography className="register-title"><strong>Hello there!</strong></Typography>
        </DialogTitle>
        <DialogContent>
          {dialogContent()}
        </DialogContent>
        <DialogActions className="register-action">
          <Button fullWidth onClick={() => { setOpenRegister(false) }} className="register-button">
            Cancel
          </Button>
          <Button fullWidth type="submit" onClick={() => onSubmit("register")} className="register-button">
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/*contents of navigation bar*/}
      <Toolbar className="toolbar-container">
        <Typography
          onClick={() => { navigate("/home"); }}
          variant="h6"
          className="toolbar-title"
        >
          Singapore Polytechnic
        </Typography>

        {/*displays username if the user is logged in*/}
        {sessionStorage.getItem("UserId") && (
          <Typography className="toolbar-username">
            {sessionStorage.getItem("Username")}
          </Typography>
        )}

        {/*displays login button if the user is not logged in*/}
        {/*opens the login dialog box*/}
        {!sessionStorage.getItem("UserId") && (
          <Button disableRipple onClick={() => setOpenLogin(true)} color="inherit" className="toolbar-login">
            Login
          </Button>
        )}

        {/*displays login button if the user is not logged in*/}
        {/*opens the register dialog box*/}
        {!sessionStorage.getItem("UserId") && (
          <Button disableRipple onClick={() => setOpenRegister(true)} color="inherit" className="toolbar-register">
            Register
          </Button>
        )}

        {/*displays logout button if the user is logged in*/}
        {/*clears out local and session storage, redirects the user to the home page*/}
        {sessionStorage.getItem("UserId") && (
          <Button disableRipple
            onClick={() => { sessionStorage.clear(); localStorage.clear(); navigate("/"); }}
            color="inherit" className="toolbar-logout"
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
