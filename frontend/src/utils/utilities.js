const localhost = '10.0.0.15:5000';

const convertMinutesToHours = (minutes) => {
    const m = minutes % 60;
    const h = (minutes - m) / 60;
    return `${h.toString()}h ${(m < 10 ? "0" : "")}${m.toString()}m`;
}

export { localhost, convertMinutesToHours };