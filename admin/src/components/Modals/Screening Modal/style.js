import { makeStyles } from '@mui/styles';
import { primary } from '../../../services/theme';

const popper = {
    "& .MuiPickersDay-dayWithMargin": {
        fontFamily: "Poppins",
        color: "white",
        backgroundColor: "transparent"
    },
    "& .Mui-disabled": {
        color: "rgba(255, 255, 255, 0.6)",
        backgroundColor: '#222329'
    },
    "& .css-1v994a0": {
        fontFamily: "Poppins",
        color: 'white'
    },
    "& .PrivatePickersYear-yearButton": {
        fontFamily: "Poppins",
        color: 'white'
    },
    "& .PrivatePickersYear-yearButton.Mui-selected": {
        backgroundColor: `${primary} !important`,
        color: 'black'
    },
    "& .MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-i4bv87-MuiSvgIcon-root": {
        color: 'rgba(255, 255, 255, 0.35)'
    }
};

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
            backgroundColor: '#222329 !important',
            borderRadius: 10,
            border: '2px solid rgba(255, 255, 255, 0.1)'
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
            backgroundColor: '#222329',
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
            backgroundColor: '#222329 !important'
        },
        '&:hover': {
            backgroundColor: '#222329 !important'
        },
        '&:focus': {
            backgroundColor: '#222329 !important'
        },
        '&:selcted': {
            backgroundColor: '#222329 !important'
        }
    },
    picker: {
        '&&': {
            paddingTop: 10
        }
    },
    calendar: {
        '&&': {
            backgroundColor: '#222329',
            borderRadius: 15,
            border: '2px solid rgba(255, 255, 255, 0.1)'
        }
    },
    button: {
        '&&': {
            fontFamily: `'Poppins', sans-serif`,
            margin: '0 5px',
            width: 85,
            height: 45,
            fontSize: 17,
            letterSpacing: 1,
            zIndex: 1
        }
    },
});

export { useStyles, popper };