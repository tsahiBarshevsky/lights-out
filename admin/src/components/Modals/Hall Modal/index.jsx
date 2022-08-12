import React, { useState, useEffect } from 'react';
import Modal from 'styled-react-modal';
import { Button, Input, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import update from 'immutability-helper';
import { addNewHall } from '../../../redux/actions/halls';
import './styles.sass';

const HallModal = ({ isOpen, setIsOpen }) => {
    const [number, setNumber] = useState('');
    const [type, setType] = useState('');
    const [numberOfLines, setNumberOfLines] = useState(1);
    const [seats, setSeats] = useState({
        "1": { numberOfSeats: 1 }
    });
    const dispatch = useDispatch();

    const handleClose = () => {
        setIsOpen(false);
        setNumber('');
        setType('');
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

    const onAddNewHall = () => {
        const newHall = {
            number: number,
            type: type,
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
                toast('The hall has been added successfully');
            });
    }

    return (
        <StyledModal
            isOpen={isOpen}
            onBackgroundClick={handleClose}
            onEscapeKeydown={handleClose}
        >
            <form>
                <Input
                    required
                    autoFocus
                    disableUnderline
                    placeholder="Number..."
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                />
                <Input
                    required
                    disableUnderline
                    placeholder="Type..."
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />
                <Input
                    required
                    disableUnderline
                    placeholder="Number of lines..."
                    value={numberOfLines}
                    onChange={handleChangeNumberOfLines}
                    type="number"
                    inputProps={{ min: 1, max: 10 }}
                />
                {Object.keys(seats).map((line) => {
                    return (
                        <div>
                            <h1>line {line}</h1>
                            <h3>{seats[line].numberOfSeats} seats</h3>
                            <Input
                                required
                                disableUnderline
                                placeholder="Number of lines..."
                                value={seats[line].numberOfSeats}
                                onChange={(e) => handleChangeNumberOfSeats(e, line)}
                                type="number"
                                inputProps={{ min: 1 }}
                            />
                        </div>
                    )
                })}
                <Button
                    variant="contained"
                    onClick={onAddNewHall}
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

export default HallModal;