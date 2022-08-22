import React from 'react';
import { Typography } from '@mui/material';
import './styles.sass';

const TabTitle = ({ title }) => {
    return (
        <div className='title-container'>
            <Typography variant='h5' className='title'>{title}</Typography>
        </div>
    )
}

export default TabTitle;