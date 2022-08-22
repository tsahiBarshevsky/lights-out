import React, { useState } from 'react';
import { Button, Pagination, Stack, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import HallsModal from '../Modals/Hall Modal';
import FloatingButton from '../Floating Button';
import TabTitle from '../Tab Title';
import usePagination from "../../services/pagination";
import { deleteHall } from '../../redux/actions/halls';
import { useStyles } from '../../services/paginationStyle';
import 'react-toastify/dist/ReactToastify.css';
import './styles.sass';

const Halls = () => {
    const [isOpen, setIsOpen] = useState(false);
    const halls = useSelector(state => state.halls);
    const dispatch = useDispatch();
    const classes = useStyles();

    // Pagination
    const [page, setPage] = useState(1);
    const ENTRIES_PER_PAGE = 10;

    const count = Math.ceil(halls.length / ENTRIES_PER_PAGE);
    const _DATA = usePagination(halls, ENTRIES_PER_PAGE);

    const handlePageChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    }

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
                            <th>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Hall
                                </Typography>
                            </th>
                            <th>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Type
                                </Typography>
                            </th>
                            <th>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Ticket Price
                                </Typography>
                            </th>
                            <th>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Number Of Lines
                                </Typography>
                            </th>
                            <th>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Number Of Seats
                                </Typography>
                            </th>
                            <th>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Options
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {_DATA.currentData().map((hall, index) => {
                            return (
                                <tr key={hall._id}>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            #{hall.number}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            {hall.type}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            {hall.ticketPrice}₪
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            {Object.keys(hall.seats).length}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            {calculateNumberOfSeats(hall.seats)}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => onDeleteHall(hall._id, index)}
                                            variant="contained"
                                            className="button"
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <Stack spacing={2} className={classes.stack}>
                    <Pagination
                        count={count}
                        page={page}
                        onChange={handlePageChange}
                        showLastButton
                        showFirstButton
                        classes={{
                            root: classes.pagination
                        }}
                    />
                </Stack>
            </div>
            <HallsModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    )
}

export default Halls;