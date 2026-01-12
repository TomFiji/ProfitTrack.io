import { Select } from "@mantine/core";
import { useExpenseContext } from "../contexts/ExpenseContext";

function YearSelect()  {
    const { selectedYear, setSelectedYear } = useExpenseContext();
    const currentYear = new Date().getFullYear();

    const handleYearChange = (value) => {
        setSelectedYear(parseInt(value, 10));
    };

    return(
    <>
         <Select
            placeholder = "Pick a year"
            value={String(selectedYear)}
            data={[String(currentYear-3), String(currentYear-2), String(currentYear-1), String(currentYear)]}
            onChange={handleYearChange}
        />
    </>
    )
}

export default YearSelect