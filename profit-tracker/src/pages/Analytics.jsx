import MonthlyLineChart from "../components/MonthlyLineChart.jsx"
import Piechart from "../components/Piechart.jsx"
import { Flex } from '@mantine/core'


function Analytics() {
    return (
        <>
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

export default Analytics