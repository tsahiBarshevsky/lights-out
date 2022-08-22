import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import HallsModal from '../Modals/Hall Modal';
import FloatingButton from '../Floating Button';
import TabTitle from '../Tab Title';
import { deleteHall } from '../../redux/actions/halls';
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

    const onDeleteHall = (id, index) => {
        fetch(`/delete-hall?id=${id}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => res.json())
            .then((res) => {
                dispatch(deleteHall(index));
                toast(res, {
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
            })
            .catch((error) => console.log(error));
    }

    return (
        <>
            <FloatingButton onClick={() => setIsOpen(true)} />
            <div className="halls-container">
                <TabTitle title="Halls" />
                <table id="halls">
                    <thead>
                        <tr>
                            <th><h3>Hall</h3></th>
                            <th><h3>Type</h3></th>
                            <th><h3>Ticket Price</h3></th>
                            <th><h3>Number Of Lines</h3></th>
                            <th><h3>Number Of Seats</h3></th>
                            <th><h3>Options</h3></th>
                        </tr>
                    </thead>
                    <tbody>
                        {halls.map((hall, index) => {
                            return (
                                <tr key={hall._id}>
                                    <td><h3>#{hall.number}</h3></td>
                                    <td><h3>{hall.type}</h3></td>
                                    <td><h3>{hall.ticketPrice}₪</h3></td>
                                    <td><h3>{Object.keys(hall.seats).length}</h3></td>
                                    <td><h3>{calculateNumberOfSeats(hall.seats)}</h3></td>
                                    <td>
                                        <Button
                                            variant="contained"
                                            onClick={() => onDeleteHall(hall._id, index)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
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