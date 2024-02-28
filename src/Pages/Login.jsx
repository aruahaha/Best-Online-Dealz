import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, multiFactor, PhoneAuthProvider , RecaptchaVerifier } from "firebase/auth";
import { signInWithPopup } from "firebase/auth"; // Import signInWithPopup
import { auth, googleProvider } from "../firebase"; // Import googleProvider from firebase.js

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';

const defaultTheme = createTheme();

export default function SignIn() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');
        const pathName = '/management';

        try {
            const authInstance = getAuth();
            const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
            navigate(pathName);
        } catch (error) {
            setError('Invalid email or password');
            console.error("Error signing in:", error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            if (user.email === import.meta.env.VITE_ADMIN_USER_MAIL) {
                // if (!user.emailVerified) {
                //     await sendEmailVerification(auth.currentUser);
                //     alert('Please verify your email before signing in.');
                //     return;
                // }
                navigate('/management');
            } else {
                await user.delete();
                navigate('/denied');
            }
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme} >
            <Container component="main" maxWidth="xs" sx={{
                marginTop: "50px",
                marginBottom: "100px"
            }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}></Avatar>
                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>

                        <Button
                            onClick={handleGoogleSignIn}
                            fullWidth
                            variant="contained"
                            sx={{ mt: 1, mb: 2, backgroundColor: '#DB4437', color: '#fff' }} // Google's Red color
                        >
                            <div style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                paddingBlock: "5px"
                            }}>
                                <GoogleIcon />
                                Sign in with Google
                            </div>
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
