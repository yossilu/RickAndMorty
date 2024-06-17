import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Button, TextField, IconButton, Container, Typography, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from '../../api/axios';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const LOGIN_URL = '/auth/login';

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['jwt']);
    const location = useLocation();
    const { width } = useWindowDimensions();
    const [isPwdVisible, setIsPwdVisible] = useState(false);
    const from = location.state?.from?.pathname || "/";

    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, password }),
                {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    withCredentials: true
                }
            );
            const user = response.data.user;
            localStorage.setItem('user', JSON.stringify(user));
            setCookie('jwt', response?.data?.user.refreshToken, {
                path: '/',
            });
            setAuth(user);

            setPwd('');
            setEmail('');
            navigate('/homepage')
        } catch (err) {
            if (err?.response) {
                setErrMsg(err.response.data.message);
            }
            errRef.current.focus();
        }
    }

    return (
        <Container maxWidth="sm">
            <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                mt={8}
            >
                <Typography component="h1" variant="h5">
                    Sign in to Your Account
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
                        onChange={(e) => setEmail(e.target.value)}
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
                        onChange={(e) => setPwd(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setIsPwdVisible(!isPwdVisible)}
                                >
                                    {isPwdVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                    <Box className='terms-section'>
                        <Typography variant='body1' className='terms-text'>
                            Dont have an account?
                            <span className="line">
                                <Link to='/register'>
                                    {' Sign Up'}
                                </Link>
                            </span>
                        </Typography>
                    </Box>
                    <Typography component="p" variant="body2" color="error" ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;
