import StatsGridIcons from "../components/StatGridHome.jsx";
import MonthlyLineChart from '../components/MonthlyLineChart.jsx'
import YearSelect from "../components/YearSelect.jsx";
import Piechart from "../components/Piechart.jsx";
import { Flex } from '@mantine/core'



function Home() {
    

   

    return (
        <>
            <YearSelect/>
            <StatsGridIcons />
            <Flex
                gap="xl"
                align="flex-start"
                direction={{ base: 'column', md: 'row' }}
            >
                <MonthlyLineChart />
                <Piechart />
            </Flex>
        </>
    )
}

export default Home