import React, { useState } from 'react';
import { Button, Pagination, Stack, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import SearchModal from '../Modals/Search Modal';
import FloatingButton from '../Floating Button';
import TabTitle from '../Tab Title';
import usePagination from "../../services/pagination";
import { deleteMovie } from '../../redux/actions/movies';
import { useStyles } from '../../services/paginationStyle';
import 'react-toastify/dist/ReactToastify.css';
import './styles.sass';

const Movies = () => {
    const [isOpen, setIsOpen] = useState(false);
    const movies = useSelector(state => state.movies);
    const dispatch = useDispatch();
    const classes = useStyles();

    // Pagination
    const [page, setPage] = useState(1);
    const ENTRIES_PER_PAGE = 5;

    const count = Math.ceil(movies.length / ENTRIES_PER_PAGE);
    const _DATA = usePagination(movies, ENTRIES_PER_PAGE);

    const handlePageChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    }

    const convertMinutesToHours = (minutes) => {
        const m = minutes % 60;
        const h = (minutes - m) / 60;
        return `${h.toString()}h ${(m < 10 ? "0" : "")}${m.toString()}m`;
    }

    const onDeleteMovie = (id, index) => {
        fetch(`/delete-movie?id=${id}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => res.json())
            .then((res) => {
                dispatch(deleteMovie(index));
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
            <div className="movies-container">
                <TabTitle title="Movies" />
                <table id="movies">
                    <thead>
                        <tr>
                            <th style={{ width: 130 }}>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Poster
                                </Typography>
                            </th>
                            <th>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Title
                                </Typography>
                            </th>
                            <th>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Language
                                </Typography>
                            </th>
                            <th>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Genre
                                </Typography>
                            </th>
                            <th>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Duration
                                </Typography>
                            </th>
                            <th>
                                <Typography
                                    variant='h6'
                                    className='title'
                                >
                                    Release Date
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
                        {_DATA.currentData().map((movie, index) => {
                            return (
                                <tr key={movie._id}>
                                    <td>
                                        <img
                                            src={`https://image.tmdb.org/t/p/original/${movie.posterPath}`}
                                            alt={movie.title}
                                            style={{ width: 90, height: '100%', borderRadius: 15 }}
                                        />
                                    </td>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            {movie.title}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            {movie.language}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            {movie.genre}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            {movie.duration ? convertMinutesToHours(movie.duration) : "N/A"}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography
                                            variant='body1'
                                            className='caption'
                                        >
                                            {moment(movie.releaseDate).format('DD/MM/YYYY')}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => onDeleteMovie(movie._id, index)}
                                            variant="contained"
                                            className='button'
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
            <SearchModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    )
}

export default Movies;