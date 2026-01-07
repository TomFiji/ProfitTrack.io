import { Select } from "@mantine/core";
import { useState } from "react";

function YearSelect()  {

    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear)

    return(
    <>
         <Select
            placeholder = "Pick a year"
            data={[String(currentYear-3), String(currentYear-2), String(currentYear-1), String(currentYear)]}
            onChange={setSelectedYear}
        />
    </>
    )    
}

export default YearSelect