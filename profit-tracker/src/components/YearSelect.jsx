import { Select } from "@mantine/core";
import { useExpenseContext } from "../contexts/ExpenseContext";

function YearSelect()  {
    const { selectedYear, setSelectedYear } = useExpenseContext();
    console.log('Current selected year ', selectedYear)
    const currentYear = new Date().getFullYear();

    return(
    <>
         <Select
            placeholder = "Pick a year"
            value={String(selectedYear)}
            data={[String(currentYear-3), String(currentYear-2), String(currentYear-1), String(currentYear)]}
            onChange={setSelectedYear}
        />
    </>
    )
}

export default YearSelect