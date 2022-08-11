import React, { useState } from 'react';
import { Button, Input, Typography, InputAdornment } from '@mui/material';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import './styles.sass';

// Firebase
import { auth } from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const HomeScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const onRegister = () => {
        createUserWithEmailAndPassword(auth, email.trim(), password.trim())
            .catch((error) => alert(error.message));
    }

    return (
        <div className="homepage-container">
            <div style={{ backgroundColor: 'lightgreen', padding: 20 }}>
                <Typography variant='subtitle1'>Email</Typography>
                <div className="input-wrapper">
                    <Input
                        required
                        autoFocus
                        disableUnderline
                        placeholder="What's your email?"
                        value={email}
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <Typography variant='subtitle1'>Password</Typography>
                <div className="input-wrapper">
                    <Input
                        required
                        disableUnderline
                        placeholder="6 chars at least"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment=
                        {
                            <InputAdornment position="end"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ?
                                    <MdVisibilityOff />
                                    :
                                    <MdVisibility />
                                }
                            </InputAdornment>
                        }
                    />
                </div>
                <Button onClick={onRegister} variant="contained">Sign In</Button>
            </div>
        </div>
    )
}

export default HomeScreen;