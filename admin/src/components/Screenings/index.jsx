import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import ScreeningModal from '../Modals/Screening Modal';
import { deleteScreening } from '../../redux/actions/screenings';
import 'react-toastify/dist/ReactToastify.css';
import './styles.sass';

const Screenings = () => {
    const [isOpen, setIsOpen] = useState(false);
    const screenings = useSelector(state => state.screenings);
    const dispatch = useDispatch();

    const onDeleteScreening = (id, index) => {
        fetch(`/delete-screening?id=${id}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => res.json())
            .then((res) => {
                dispatch(deleteScreening(index));
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
            <div className="screenings-container">
                <Button onClick={() => setIsOpen(true)} variant="contained">Add New Screening</Button>
                <table id="screenings">
                    <thead>
                        <tr>
                            <th><h3>Movie</h3></th>
                            <th><h3>Hall</h3></th>
                            <th><h3>Date And Hour</h3></th>
                            <th><h3>Options</h3></th>
                        </tr>
                    </thead>
                    <tbody>
                        {screenings.map((screening, index) => {
                            return (
                                <tr key={screening._id}>
                                    <td><h3>{screening.movie.title}</h3></td>
                                    <td><h3>{screening.hall}</h3></td>
                                    <td><h3>{moment(screening.date).format('DD/MM/YYYY HH:mm')}</h3></td>
                                    <td>
                                        <Button
                                            variant="contained"
                                            onClick={() => onDeleteScreening(screening._id, index)}
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
            <ScreeningModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    )
}

export default Screenings;