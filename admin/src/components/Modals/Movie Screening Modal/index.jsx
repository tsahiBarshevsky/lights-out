import React from 'react';
import Modal from 'styled-react-modal';
import moment from 'moment';
import './styles.sass';

const MovieScreeningModal = ({ isOpen, handleClose, selectedScreening }) => {
    const countAvailableSeats = () => {
        var available = 0, unavailable = 0;
        Object.keys(selectedScreening.seats).forEach((line) => {
            const length = selectedScreening.seats[line].length;
            const availableLength = selectedScreening.seats[line].filter((seat) => seat.available).length;
            available += availableLength;
            unavailable += length - availableLength
        });
        return (
            <>
                <h3>Available seats: {available}</h3>
                <h3>Booked seats: {unavailable}</h3>
            </>
        )
    }

    return Object.keys(selectedScreening).length > 0 && (
        <StyledModal
            isOpen={isOpen}
            onBackgroundClick={handleClose}
            onEscapeKeydown={handleClose}
        >
            <h1>{selectedScreening.movie.title}</h1>
            <h3>Hall {selectedScreening.hall.number}</h3>
            <h3>{moment(selectedScreening.date).format('DD/MM/YYYY HH:mm')}</h3>
            {countAvailableSeats()}
            <div className="hall">
                <div className="screen">
                    <div className="screen-line" />
                    <h4>Screen</h4>
                </div>
                {Object.keys(selectedScreening.seats).map((line) => {
                    return (
                        <div className="line" key={line}>
                            <h4>{line}</h4>
                            <div className="seats">
                                {selectedScreening.seats[line].map((e) => {
                                    return (
                                        <div
                                            key={e.number}
                                            className={e.available ? "seat available" : "seat unavailable"}
                                        >
                                            <p>{e.number + 1}</p>
                                        </div>
                                    )
                                })}
                            </div>
                            <h4>{line}</h4>
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
    background-color: #ffffff;
    cursor: default;
    padding: 20px;
`;

export default MovieScreeningModal;