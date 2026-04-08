import { createContext, useContext } from "react";
import { useYearContext } from './YearContext.jsx';

const PoshmarkContext = createContext();

export const usePoshmarkContext = () => useContext(PoshmarkContext);

export const PoshmarkProvider = ({ children }) => {
    const { selectedYear } = useYearContext();

    const value = {
        selectedYear,
    };

    return (
        <PoshmarkContext.Provider value={value}>
            {children}
        </PoshmarkContext.Provider>
    );
}