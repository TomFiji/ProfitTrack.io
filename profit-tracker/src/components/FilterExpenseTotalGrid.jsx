import { IconReceipt2 } from '@tabler/icons-react'
import { Group, Paper, SimpleGrid, Text, ThemeIcon, Card, Title } from '@mantine/core';

function FilterExpenseTotalGrid({ total = 0 }) {
    return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="bg-gray-50" w="20vw">
      <Title order={4}>Total Filtered Expenses</Title>
      <Text size="xl" fw={700} c="red.7">
        ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </Text>
    </Card>
  );
}

export default FilterExpenseTotalGrid