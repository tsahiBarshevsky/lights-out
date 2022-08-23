import React from 'react';
import { Typography } from '@mui/material';
import Modal from 'styled-react-modal';
import moment from 'moment';
import { modalBackground } from '../../../services/theme';
import './styles.sass';

const MovieScreeningModal = ({ isOpen, handleClose, selectedScreening }) => {
    const countAvailableSeats = () => {
        var available = 0, unavailable = 0;
        Object.keys(selectedScreening.seats).forEach((line) => {
            const length = selectedScreening.seats[line].length;
            const availableLength = selectedScreening.seats[line].filter((seat) => seat.available).length;
            available += availableLength;
            unavailable += length - availableLength;
        });
        return (
            <>
                <Typography variant='title1' className="text">
                    Available seats: {available}
                </Typography>
                <Typography variant='title1' className="text">
                    Booked seats: {unavailable}
                </Typography>
            </>
        )
    }

    return Object.keys(selectedScreening).length > 0 && (
        <StyledModal
            isOpen={isOpen}
            onBackgroundClick={handleClose}
            onEscapeKeydown={handleClose}
        >
            <Typography variant='h4' className="text">
                {selectedScreening.movie.title}
            </Typography>
            <Typography variant='title1' className="text">
                Hall {selectedScreening.hall.number}
            </Typography>
            <Typography variant='title1' className="text">
                {moment(selectedScreening.date).format('DD/MM/YYYY HH:mm')}
            </Typography>
            {countAvailableSeats()}
            <div className="hall">
                <div className="screen">
                    <div className="screen-line" />
                    <Typography variant="h6" className="text">Screen</Typography>
                </div>
                {Object.keys(selectedScreening.seats).map((line) => {
                    return (
                        <div className="line" key={line}>
                            <Typography variant='caption' className='line-text'>{line}</Typography>
                            <div className="seats">
                                {selectedScreening.seats[line].map((e) => {
                                    return (
                                        <div
                                            key={e.number}
                                            className={e.available ? "seat available" : "seat unavailable"}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                className="caption"
                                            >
                                                {e.number + 1}
                                            </Typography>
                                        </div>
                                    )
                                })}
                            </div>
                            <Typography variant='caption' className='line-text'>{line}</Typography>
                        </div>
                    )
                })}
            </div>
        </StyledModal>
    )
}

const StyledModal = Modal.styled`
    width: 30%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: 25px;
    background-color: ${modalBackground};
    cursor: default;
    padding: 20px;
`;

export default MovieScreeningModal;