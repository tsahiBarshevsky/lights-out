import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import HallsModal from '../Modals/Hall Modal';
import 'react-toastify/dist/ReactToastify.css';
import './styles.sass';

const Halls = () => {
    const [isOpen, setIsOpen] = useState(false);
    const halls = useSelector(state => state.halls);
    const dispatch = useDispatch();

    const calculateNumberOfSeats = (seats) => {
        let sum = 0;
        Object.keys(seats).forEach((line) => {
            sum += seats[line].numberOfSeats;
        });
        return sum;
    }

    return (
        <>
            <div className="halls-container">
                <Button onClick={() => setIsOpen(true)} variant="contained">Add New Hall</Button>
                <table id="halls">
                    <tr>
                        <th><h3>Hall</h3></th>
                        <th><h3>Type</h3></th>
                        <th><h3>Number Of Lines</h3></th>
                        <th><h3>Number Of Seats</h3></th>
                        <th><h3>Options</h3></th>
                    </tr>
                    {halls.map((hall) => {
                        return (
                            <tr key={hall.id}>
                                <td><h3>#{hall.number}</h3></td>
                                <td><h3>{hall.type}</h3></td>
                                <td><h3>{Object.keys(hall.seats).length}</h3></td>
                                <td><h3>{calculateNumberOfSeats(hall.seats)}</h3></td>
                                <td>
                                    <Button
                                        variant="contained"
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                </table>
            </div>
            <HallsModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    )
}

export default Halls;