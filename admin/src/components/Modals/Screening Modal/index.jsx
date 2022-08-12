import React, { useState } from 'react';
import Modal from 'styled-react-modal';
import { Button, TextField, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { toast } from 'react-toastify';
import { addNewScreening } from '../../../redux/actions/screenings';
// import './styles.sass';

const ScreeningModal = ({ isOpen, setIsOpen }) => {
    const [movie, setMovie] = useState({});
    const [hall, setHall] = useState('');
    const [date, setDate] = useState(new Date());
    const movies = useSelector(state => state.movies);
    const halls = useSelector(state => state.halls);
    const dispatch = useDispatch();

    const handleClose = () => {
        setIsOpen(false);
        setMovie({});
        setHall('');
        setDate(new Date());
    }

    const handleDateChange = (newDate) => {
        setDate(newDate);
    }

    const onAddNewScreening = (event) => {
        event.preventDefault();
        const seats = {};
        const newScreening = {
            hall: hall,
            movie: JSON.parse(movie),
            date: date
        };
        const index = halls.findIndex((item) => item.number === hall);
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
                toast('The screening has been added successfully');
                handleClose();
            });
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
                    >
                        {movies.map((movie) => {
                            return (
                                <MenuItem
                                    key={movie._id}
                                    value={JSON.stringify({
                                        id: movie.tmdbID,
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
                    >
                        {halls.map((hall) => {
                            return (
                                <MenuItem
                                    key={hall._id}
                                    value={hall.number}
                                >
                                    {hall.number}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <DateTimePicker
                    label="Date&Time picker"
                    value={date}
                    inputFormat="DD/MM/YY HH:mm"
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