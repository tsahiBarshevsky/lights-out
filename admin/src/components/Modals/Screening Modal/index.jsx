import React, { useState } from 'react';
import Modal from 'styled-react-modal';
import { Button, TextField, MenuItem, FormControl, Select, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { toast } from 'react-toastify';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';
import clsx from 'clsx';
import { addNewScreening } from '../../../redux/actions/screenings';
import { modalBackground } from '../../../services/theme';
import { popper, useStyles } from './style';

const format = 'DD/MM/YY HH:mm';

const ScreeningModal = ({ isOpen, setIsOpen }) => {
    const [movie, setMovie] = useState('');
    const [hall, setHall] = useState('');
    const [date, setDate] = useState(new Date());
    const movies = useSelector(state => state.movies);
    const halls = useSelector(state => state.halls);
    const screenings = useSelector(state => state.screenings);
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleClose = () => {
        setIsOpen(false);
        setMovie('');
        setHall('');
        setDate(new Date());
    }

    const handleDateChange = (newDate) => {
        setDate(newDate);
    }

    const onAddNewScreening = (e) => {
        e.preventDefault();
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
            <form onSubmit={onAddNewScreening}>
                <FormControl className={classes.formControl}>
                    <Typography variant='subtitle1' className={classes.title}>Movie</Typography>
                    <Select
                        id="movie-select"
                        value={movie}
                        renderValue={movie !== '' ? undefined : () => <Placeholder>Select movie</Placeholder>}
                        onChange={(e) => setMovie(e.target.value)}
                        required
                        className={classes.select}
                        variant="standard"
                        disableUnderline
                        displayEmpty
                        MenuProps={{ classes: { paper: classes.paper } }}
                        style={{ borderRadius: 25, color: 'white' }}
                    >
                        {movies.map((movie) => {
                            return (
                                <MenuItem
                                    key={movie._id}
                                    className={classes.menuItem}
                                    value={JSON.stringify({
                                        id: movie.tmdbID.toString(),
                                        title: movie.title
                                    })}
                                >
                                    <Typography variant="subtitle1" className={classes.text}>
                                        {movie.title}
                                    </Typography>
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Typography variant='subtitle1' className={classes.title}>Hall</Typography>
                    <Select
                        id="hall-select"
                        value={hall}
                        renderValue={hall !== '' ? undefined : () => <Placeholder>Select hall</Placeholder>}
                        onChange={(e) => setHall(e.target.value)}
                        required
                        className={classes.select}
                        variant="standard"
                        disableUnderline
                        displayEmpty
                        MenuProps={{ classes: { paper: classes.paper } }}
                        style={{ borderRadius: 25, color: 'white' }}
                    >
                        {halls.map((hall) => {
                            return (
                                <MenuItem
                                    key={hall._id}
                                    className={classes.menuItem}
                                    value={JSON.stringify({
                                        number: hall.number,
                                        ticketPrice: hall.ticketPrice,
                                        type: hall.type
                                    })}
                                >
                                    <Typography variant="subtitle1" className={classes.text}>
                                        {hall.number} ({hall.type})
                                    </Typography>
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Typography variant='subtitle1' className={classes.title}>Date & hour</Typography>
                    <DateTimePicker
                        value={date}
                        inputFormat="DD/MM/YY HH:mm"
                        ampm={false}
                        onChange={handleDateChange}
                        InputProps={{ disableUnderline: true }}
                        className={classes.picker}
                        minDateTime={moment()}
                        components={{ OpenPickerIcon: CalendarMonthIcon }}
                        PaperProps={{ classes: { root: classes.calendar } }}
                        PopperProps={{ sx: popper }}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    variant="standard"
                                    className={clsx(classes.select, classes.picker)}
                                    style={{ borderRadius: 25 }}
                                    sx={{
                                        input: { color: 'white', fontFamily: 'Poppins' },
                                        svg: { color: 'rgba(255, 255, 255, 0.35)' },
                                        label: { color: 'red' }
                                    }}
                                    {...params}
                                />
                            )
                        }}
                    />
                </FormControl>
                {/* <Button
                    variant="contained"
                    type="submit"
                >
                    Add
                </Button> */}
            </form>
        </StyledModal>
    )
}

const Placeholder = ({ children }) => {
    const classes = useStyles();
    return (
        <div className={classes.placeholder}>
            <Typography variant='subtitle' className={classes.text}>{children}</Typography>
        </div>
    );
};

const StyledModal = Modal.styled`
    width: 25vw;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: 25px;
    background-color: ${modalBackground};
    cursor: default;
    padding: 20px;

    @media (max-width: 400px) {
        width: 100%;
    }
`;

export default ScreeningModal;