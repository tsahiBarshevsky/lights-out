import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';
import './styles.sass';
import ScreeningModal from '../Modals/Screening Modal';

const Screenings = () => {
    const [isOpen, setIsOpen] = useState(false);
    const screenings = useSelector(state => state.screenings);
    const dispatch = useDispatch();

    return (
        <>
            <div className="screenings-container">
                <Button onClick={() => setIsOpen(true)} variant="contained">Add New Screening</Button>
                <table id="screenings">
                    <tr>
                        <th><h3>Movie</h3></th>
                        <th><h3>Hall</h3></th>
                        <th><h3>Date And Hour</h3></th>
                        <th><h3>Options</h3></th>
                    </tr>
                    {screenings.map((screening) => {
                        return (
                            <tr key={screening.id}>
                                <td><h3>{screening.movie.title}</h3></td>
                                <td><h3>{screening.hall}</h3></td>
                                <td><h3>{moment(screening.date).format('DD/MM/YYYY HH:mm')}</h3></td>
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
            <ScreeningModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    )
}

export default Screenings;