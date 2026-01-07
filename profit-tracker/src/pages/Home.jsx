import StatsGridIcons from "../components/StatGridHome.jsx";
import MonthlyLineChart from '../components/MonthlyLineChart.jsx'
import YearSelect from "../components/YearSelect.jsx";



function Home() {
    

   

    return (
        <>
            <YearSelect/>
            <StatsGridIcons />
            <MonthlyLineChart/>
        </>
    )
}

export default Home