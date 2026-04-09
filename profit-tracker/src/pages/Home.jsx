import StatsGridIcons from "../components/StatGridHome.jsx";
import MonthlyLineChart from '../components/MonthlyLineChart.jsx'
import YearSelect from "../components/YearSelect.jsx";
import Piechart from "../components/Piechart.jsx";
import PlatformSelect from "../components/PlatformSelect.jsx";
import { Flex } from '@mantine/core'



function Home() {
    

   

    return (
        <>
            <Flex justify="center" gap="xl" align="center" mb="md">
                <YearSelect />
                <PlatformSelect />
            </Flex>
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