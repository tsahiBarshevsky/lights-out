import React from 'react';
import { IconButton } from '@mui/material';
import { BsPlusLg } from 'react-icons/bs';
import './styles.sass';

const FloatingButton = ({ onClick }) => {
    return (
        <IconButton
            onClick={onClick}
            aria-label="add"
            className='button-container'
        >
            <BsPlusLg
                color='#222329'
                size={20}
            />
        </IconButton>
    )
}

export default FloatingButton;