import MonthlyLineChart from "../components/MonthlyLineChart.jsx"
import Piechart from "../components/Piechart.jsx"
import { Flex } from '@mantine/core'


function Analytics() {
    return (
        <>
            <Flex gap="xl" align="flex-start">
                <MonthlyLineChart />
                <Piechart />
            </Flex>
        </>
    )
}

export default Analytics