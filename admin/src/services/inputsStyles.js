import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    input: {
        "& input::placeholder": {
            color: 'rgba(255, 255, 255, 0.55)'
        }
    }
});

export { useStyles };