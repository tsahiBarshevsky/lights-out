import React, { useState } from 'react';
import Modal from 'styled-react-modal';
import { Button, TextField, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { toast } from 'react-toastify';
import moment from 'moment';
import { addNewScreening } from '../../../redux/actions/screenings';
// import './styles.sass';

const format = 'DD/MM/YY HH:mm';

const ScreeningModal = ({ isOpen, setIsOpen }) => {
    const [movie, setMovie] = useState('');
    const [hall, setHall] = useState('');
    const [date, setDate] = useState(new Date());
    const movies = useSelector(state => state.movies);
    const halls = useSelector(state => state.halls);
    const screenings = useSelector(state => state.screenings);
    const dispatch = useDispatch();

    const handleClose = () => {
        setIsOpen(false);
        setMovie('');
        setHall('');
        setDate(new Date());
    }

    const handleDateChange = (newDate) => {
        setDate(newDate);
    }

    const onAddNewScreening = (event) => {
        event.preventDefault();
        var canSchedule = true;
        // Check if hall is available
        screenings.forEach((screening) => {
            if (screening.hall === hall && moment(screening.date).format(format) === moment(date).format(format))
                canSchedule = false;
        });
        if (!canSchedule)
            toast("Can't schedule at this time, there's another movie showing already", {
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
        else {
            const seats = {};
            const newScreening = {
                hall: JSON.parse(hall),
                movie: JSON.parse(movie),
                date: date
            };
            newScreening.hall.ticketPrice = Number(newScreening.hall.ticketPrice);
            const index = halls.findIndex((item) => item.number === JSON.parse(hall).number);
            Object.keys(halls[index].seats).forEach((line) => {
                const seatsArray = [];
                [...Array(halls[index].seats[line].numberOfSeats).keys()].forEach((_, index) => {
                    seatsArray.push({ number: index, available: true });
                });
                seats[line] = seatsArray;
            });
            newScreening.seats = seats;
            fetch('/add-new-screening',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        newScreening: newScreening
                    })
                })
                .then((res) => res.json())
                .then((res) => {
                    newScreening._id = res;
                    dispatch(addNewScreening(newScreening));
                    handleClose();
                    toast('The screening has been added successfully', {
                        position: "bottom-center",
                        type: 'success',
                        autoClose: 5000,
                        theme: 'dark',
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    });
                });
        }
    }

    return (
        <StyledModal
            isOpen={isOpen}
            onBackgroundClick={handleClose}
            onEscapeKeydown={handleClose}
        >
            <form>
                <FormControl fullWidth>
                    <InputLabel id="movie-label">Movie</InputLabel>
                    <Select
                        labelId="movie-label"
                        id="movie-select"
                        value={movie}
                        label="Movie"
                        onChange={(e) => setMovie(e.target.value)}
                        required
                    >
                        {movies.map((movie) => {
                            return (
                                <MenuItem
                                    key={movie._id}
                                    value={JSON.stringify({
                                        id: movie.tmdbID.toString(),
                                        title: movie.title
                                    })}
                                >
                                    {movie.title}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="hall-label">Hall</InputLabel>
                    <Select
                        labelId="hall-label"
                        id="hall-select"
                        value={hall}
                        label="Hall"
                        onChange={(e) => setHall(e.target.value)}
                        required
                    >
                        {halls.map((hall) => {
                            return (
                                <MenuItem
                                    key={hall._id}
                                    value={JSON.stringify({
                                        number: hall.number,
                                        ticketPrice: hall.ticketPrice,
                                        type: hall.type
                                    })}
                                >
                                    {hall.number} ({hall.type})
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <DateTimePicker
                    label="Screening date and time"
                    value={date}
                    inputFormat="DD/MM/YY HH:mm"
                    ampm={false}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                />
                <Button
                    variant="contained"
                    onClick={onAddNewScreening}
                >
                    Add
                </Button>
            </form>
        </StyledModal>
    )
}

const StyledModal = Modal.styled`
    width: 50vw;
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: 25px;
    background-color: #ffffff;
    cursor: default;
    padding: 20px;

    @media (max-width: 400px) {
        width: 100%;
    }
`;

export default ScreeningModal;