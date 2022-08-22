import React, { useState, useEffect } from 'react';
import { Button, Pagination, Stack, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import MovieScreeningModal from '../Modals/Movie Screening Modal';
import ScreeningModal from '../Modals/Screening Modal';
import FloatingButton from '../Floating Button';
import TabTitle from '../Tab Title';
import usePagination from "../../services/pagination";
import { deleteScreening } from '../../redux/actions/screenings';
import { useStyles } from '../../services/paginationStyle';
import 'react-toastify/dist/ReactToastify.css';
import './styles.sass';

const Screenings = () => {
    const screenings = useSelector(state => state.screenings);
    const ENTRIES_PER_PAGE = 10;
    const [isOpen, setIsOpen] = useState(false);
    const [count, setCount] = useState(Math.ceil(screenings.length / ENTRIES_PER_PAGE));
    const [chosenScreening, setChosenScreening] = useState({});
    const [showScreening, setShowScreening] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();

    // Pagination
    const [page, setPage] = useState(1);
    const _DATA = usePagination(screenings, ENTRIES_PER_PAGE);

    const handlePageChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    }

    const handleClose = () => {
        setShowScreening(false);
        setChosenScreening({});
    }

    const onOpenScreening = (screening) => {
        setShowScreening(true);
        setChosenScreening(screening);
    }

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

    useEffect(() => {
        setCount(Math.ceil(screenings.length / ENTRIES_PER_PAGE))
    }, [screenings]);

    return (
        <>
            <FloatingButton onClick={() => setIsOpen(true)} />
            <div className="screenings-container">
                <TabTitle title="Screenings" />
                <table id="screenings">
                    <thead>
                        <tr>
                            <th style={{ width: 450 }}>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Movie
                                </Typography>
                            </th>
                            <th>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Hall
                                </Typography>
                            </th>
                            <th style={{ width: 300 }}>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Date & Hour
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
                        {_DATA.currentData().map((screening, index) => {
                            return (
                                <tr key={screening._id}>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            {screening.movie.title}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            {screening.hall.number}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            {moment(screening.date).format('DD/MM/YYYY HH:mm')}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => onDeleteScreening(screening._id, index)}
                                            variant="contained"
                                            className="button delete"
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            onClick={() => onOpenScreening(screening)}
                                            variant="contained"
                                            className="button view"
                                        >
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className='pagination-container'>
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
            </div>
            <ScreeningModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
            <MovieScreeningModal
                isOpen={showScreening}
                handleClose={handleClose}
                selectedScreening={chosenScreening}
            />
        </>
    )
}

export default Screenings;