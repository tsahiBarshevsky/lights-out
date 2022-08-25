import React, { useState } from 'react';
import Modal from 'styled-react-modal';
import { Button, Input, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import update from 'immutability-helper';
import { addNewHall } from '../../../redux/actions/halls';
import { useStyles } from '../../../services/inputsStyles';
import { modalBackground } from '../../../services/theme';
import './styles.sass';

const HallModal = ({ isOpen, setIsOpen }) => {
    const [number, setNumber] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState(1);
    const [numberOfLines, setNumberOfLines] = useState(1);
    const [seats, setSeats] = useState({
        "1": { numberOfSeats: 1 }
    });
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleClose = () => {
        setIsOpen(false);
        setNumber('');
        setType('');
        setPrice(1);
        setNumberOfLines(1);
        setSeats({ "1": { numberOfSeats: 1 } });
    }

    const handleChangeNumberOfLines = (event) => {
        const value = event.target.value;
        let newData;
        setNumberOfLines(Number(value));
        if (value > numberOfLines) // increment value
            newData = update(seats, {
                [value.toString()]: {
                    $set: { numberOfSeats: 1 }
                }
            });
        else { // decremnt value 
            const hash = Number(value) + 1;
            newData = update(seats, { $unset: [hash.toString()] });
        }
        setSeats(newData);
    }

    const handleChangeNumberOfSeats = (event, line) => {
        const newData = update(seats, {
            [line]: {
                $merge: {
                    numberOfSeats: Number(event.target.value)
                }
            }
        });
        setSeats(newData);
    }

    const onAddNewHall = (e) => {
        e.preventDefault();
        const newHall = {
            number: number,
            type: type,
            ticketPrice: price,
            seats: seats
        };
        fetch('add-new-hall',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newHall: newHall
                })
            })
            .then((res) => res.json())
            .then((res) => {
                newHall._id = res;
                dispatch(addNewHall(newHall));
                handleClose();
                toast('The hall has been added successfully', {
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

    return (
        <StyledModal
            isOpen={isOpen}
            onBackgroundClick={handleClose}
            onEscapeKeydown={handleClose}
        >
            <form id="form" onSubmit={onAddNewHall}>
                <div className="scrollable">
                    <Typography variant='subtitle1' className="title">Hall Number</Typography>
                    <Input
                        required
                        autoFocus
                        disableUnderline
                        placeholder="Number..."
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="text-input"
                        classes={{ root: classes.input }}
                    />
                    <Typography variant='subtitle1' className="title">Ticket Type</Typography>
                    <Input
                        required
                        disableUnderline
                        placeholder="Type..."
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="text-input"
                        classes={{ root: classes.input }}
                    />
                    <Typography variant='subtitle1' className="title">Ticket Price</Typography>
                    <Input
                        required
                        disableUnderline
                        placeholder="Ticket price..."
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                        inputProps={{ min: 1 }}
                        className="text-input"
                        classes={{ root: classes.input }}
                    />
                    <Typography variant='subtitle1' className="title">Number Of Lines</Typography>
                    <Input
                        required
                        disableUnderline
                        placeholder="Number of lines..."
                        value={numberOfLines}
                        onChange={handleChangeNumberOfLines}
                        type="number"
                        inputProps={{ min: 1, max: 20 }}
                        className="text-input"
                        classes={{ root: classes.input }}
                    />
                    {Object.keys(seats).map((line) => {
                        return (
                            <div key={line}>
                                <Typography variant='h6' className="title">line {line}</Typography>
                                <Typography variant='subtitle1' className="title">Number Of Seats</Typography>
                                <Input
                                    required
                                    disableUnderline
                                    placeholder="Number of lines..."
                                    value={seats[line].numberOfSeats}
                                    onChange={(e) => handleChangeNumberOfSeats(e, line)}
                                    type="number"
                                    inputProps={{ min: 1 }}
                                    className="text-input"
                                    classes={{ root: classes.input }}
                                />
                            </div>
                        )
                    })}
                </div>
                <Button
                    variant="contained"
                    className="button"
                    type="submit"
                >
                    Add Hall
                </Button>
            </form>
        </StyledModal>
    )
}

const StyledModal = Modal.styled`
    width: 25vw;
    height: 50vh;
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

export default HallModal;