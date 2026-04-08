import { createContext, useState, useContext } from "react";

const YearContext = createContext();

export const useYearContext = () => useContext(YearContext);

export const YearProvider = ({ children }) => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    return (
        <YearContext.Provider value={{ selectedYear, setSelectedYear, currentYear }}>
            {children}
        </YearContext.Provider>
    );
};
