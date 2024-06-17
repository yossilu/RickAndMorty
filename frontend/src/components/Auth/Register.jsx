import { useRef, useState, useEffect } from "react";
import axios from '../../api/axios';
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, TextField, IconButton, Container, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff, Warning } from '@mui/icons-material';
import useAuth from "../../hooks/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^.{4,24}$/;
const REGISTER_URL = '/auth/register';

const Register = () => {
    const location = useLocation();
    const { width } = useWindowDimensions();
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();

    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [matchPwd, setMatchPwd] = useState('');
    const [isPwdVisible, setIsPwdVisible] = useState(false);
    const [isConfirmPwdVisible, setIsConfirmPwdVisible] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPwdError, setConfirmPwdError] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [role, setRole] = useState('User'); // Default role is 'User'

    const validateEmail = (email) => {
        EMAIL_REGEX.test(email) ? setEmailError('') : setEmailError('Please enter a valid email');
    };

    const validatePassword = (password) => {
        PASSWORD_REGEX.test(password) ? setPasswordError('') : setPasswordError('Password must be between 4 and 24 characters');
    };

    const validateConfirmPass = (confirmPass) => {
        confirmPass !== password ? setConfirmPwdError('Passwords do not match') : setConfirmPwdError('');
    };

    useEffect(() => {
        setMatchPwd(password === confirmPwd);
    }, [password, confirmPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailError && !passwordError && password === confirmPwd) {
            try {
                const response = await axios.post(REGISTER_URL,
                    JSON.stringify({ email: email.toLowerCase(), password, role }),
                    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
                );
                // const user = response.data.user;
                // localStorage.setItem('user', JSON.stringify(user));
                // setAuth(user);
                setEmail('');
                setPassword('');
                setConfirmPwd('');
                setFullName('');
                navigate('/login');
            } catch (err) {
                const errorMessage = err?.response?.data?.message || 'An unexpected error occurred';
                setErrMsg(errorMessage);
            }
        } else {
            setErrMsg('Passwords do not match or invalid input');
        }
    };

    const togglePwdVisibility = () => setIsPwdVisible(prev => !prev);
    const toggleConfirmPwdVisibility = () => setIsConfirmPwdVisible(prev => !prev);

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mt={8}
            >
                <Typography component="h1" variant="h5">
                    Create Your Account
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
                        error={!!emailError}
                        helperText={emailError && (
                            <Box display="flex" alignItems="center">
                                <Warning fontSize="small" /> {emailError}
                            </Box>
                        )}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={isPwdVisible ? "text" : "password"}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }}
                        error={!!passwordError}
                        helperText={passwordError && (
                            <Box display="flex" alignItems="center">
                                <Warning fontSize="small" /> {passwordError}
                            </Box>
                        )}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={togglePwdVisibility}
                                >
                                    {isPwdVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirm_pwd"
                        label="Confirm Password"
                        type={isConfirmPwdVisible ? "text" : "password"}
                        id="confirm_pwd"
                        autoComplete="current-password"
                        value={confirmPwd}
                        onChange={(e) => { setConfirmPwd(e.target.value); validateConfirmPass(e.target.value); }}
                        error={!!confirmPwdError}
                        helperText={confirmPwdError && (
                            <Box display="flex" alignItems="center">
                                <Warning fontSize="small" /> {confirmPwdError}
                            </Box>
                        )}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    aria-label="toggle confirm password visibility"
                                    onClick={toggleConfirmPwdVisibility}
                                >
                                    {isConfirmPwdVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={role === 'Admin'}
                                onChange={(e) => setRole(e.target.checked ? 'Admin' : 'User')}
                                color="primary"
                            />
                        }
                        label="Admin"
                    />
                    <Box className='terms-section'>
                        <Typography variant='body1' className='terms-text'>
                            Already have an account?
                            <span className="line">
                                <Link to='/login'>
                                    {' Sign In'}
                                </Link>
                            </span>
                        </Typography>
                    </Box>
                    {errMsg && <Typography component="p" variant="body2" color="error" ref={errRef} aria-live="assertive">{errMsg}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
