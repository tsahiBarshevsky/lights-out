import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    stack: {
        marginTop: 20,
        alignSelf: 'center'
    },
    pagination: {
        "& .MuiPaginationItem-root": {
            fontFamily: `'Poppins', sans-serif`,
            color: 'white',
            '&.Mui-selected': {
                backgroundColor: '#FFB43A',
                color: 'black',
                '&:hover': {
                    backgroundColor: '#FFB43A'
                }
            }
        }
    },
});

export { useStyles };