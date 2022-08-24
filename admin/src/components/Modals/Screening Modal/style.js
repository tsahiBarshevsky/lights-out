import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    text: {
        '&&': {
            fontFamily: `'Poppins', sans-serif`
        }
    },
    title: {
        '&&': {
            fontFamily: `'Poppins', sans-serif`,
            color: 'white'
        }
    },
    paper: {
        '&&': {
            backgroundColor: '#2a2d38 !important',
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.1)'
        }
    },
    placeholder: {
        color: 'rgba(255, 255, 255, 0.35)'
    },
    formControl: {
        width: '23vw'
    },
    select: {
        width: '100%',
        height: 50,
        marginBottom: 15,
        '&&': {
            backgroundColor: '#2a2d38',
            padding: '0 20px'
        },
        "& .MuiSelect-icon": {
            color: 'rgba(255, 255, 255, 0.35)',
            marginRight: 10
        },
        "& .MuiSelect-select:focus": {
            fontFamily: `'Poppins', sans-serif`,
            backgroundColor: 'transparent',
            color: 'white !important',
        }
    },
    menuItem: {
        '&&': {
            fontFamily: `'Varela Round', sans-serif`,
            color: 'white',
            backgroundColor: '#2a2d38 !important'
        },
        '&:hover': {
            backgroundColor: '#2a2d38 !important'
        },
        '&:focus': {
            backgroundColor: '#2a2d38 !important'
        },
        '&:selcted': {
            backgroundColor: '#2a2d38 !important'
        }
    },
    button: {
        '&&': {
            fontFamily: `'Varela Round', sans-serif`,
            margin: '0 5px',
            width: 85,
            height: 45,
            fontSize: 17,
            letterSpacing: 1,
            zIndex: 1
        }
    },
});

export { useStyles };