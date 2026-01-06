import { useState } from "react";
import { Select } from '@mantine/core'
import StatsGridIcons from "../components/StatGridHome.jsx";
import MonthlyLineChart from '../components/MonthlyLineChart.jsx'



function Home() {

    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear)

   

    return (
        <>
         <Select
            placeholder = "Pick a year"
            data={[currentYear-3, currentYear-2, currentYear-1, currentYear]}
            onChange={setSelectedYear}
        />
            <StatsGridIcons />
            <MonthlyLineChart/>
        </>
    )
}

export default Home