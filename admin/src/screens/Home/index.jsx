import React, { useState } from 'react';
import { Button, Input, Typography, InputAdornment } from '@mui/material';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import { useStyles } from '../../services/inputsStyles';
import './styles.sass';

// Firebase
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const HomeScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const classes = useStyles();

    const notify = (message) => {
        toast(message, {
            position: "bottom-center",
            type: 'error',
            autoClose: 5000,
            theme: 'dark',
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }

    const onSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email.trim(), password.trim())
            .catch((error) => notify(error.message));
    }

    return (
        <>
            <div className="homepage-container">
                <form onSubmit={onSignIn}>
                    <Typography variant='subtitle1' className="title">Email</Typography>
                    <Input
                        required
                        autoFocus
                        disableUnderline
                        placeholder="Admin's email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-input"
                        classes={{ root: classes.input }}
                    />
                    <Typography variant='subtitle1' className="title">Password</Typography>
                    <Input
                        required
                        disableUnderline
                        placeholder="Admin's password..."
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-input"
                        classes={{ root: classes.input }}
                        endAdornment=
                        {
                            <InputAdornment position="end"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ?
                                    <MdVisibilityOff size={20} className="eye" />
                                    :
                                    <MdVisibility size={20} className="eye" />
                                }
                            </InputAdornment>
                        }
                    />
                    <Button
                        variant="contained"
                        className="button"
                        type="submit"
                    >
                        Sign In
                    </Button>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}

export default HomeScreen;