import React, { useEffect, useState } from 'react';
import { addDays } from 'date-fns';

export const WeekContext = React.createContext();

export const WeekProvider = ({ children }) => {
    const [week, setWeek] = useState([]);

    useEffect(() => {
        const res = [new Date()];
        for (var i = 1; i < 10; i++)
            res.push(addDays(new Date(), i));
        setWeek(res);
    }, []);

    return (
        <WeekContext.Provider value={{ week }}>
            {children}
        </WeekContext.Provider>
    )
}