import { useExpenseContext } from '../contexts/ExpenseContext.jsx'
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { Group, Paper, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import classes from '../css/StatGridIcons.module.css';





function StatsGridIcons() {

  const { totalExpenseAmount, grossPayout, monthlyExpenseAmount, monthlyPayout} = useExpenseContext()

  const netPayout = (grossPayout - totalExpenseAmount);
  const netMonthlyPayout = (monthlyPayout - monthlyExpenseAmount);


  const data = [
    { title: 'Annual Profit', value: `$${netPayout.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, diff: 1 },
    { title: 'Annual Expenses', value: `$${totalExpenseAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, diff: -1 },
    { title: 'Monthly Profit', value: `$${netMonthlyPayout.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, diff: 1 },
    { title: 'Monthly Expenses', value: `$${monthlyExpenseAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, diff: -1 },
  ];



  const stats = data.map((stat) => {
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="apart">
          <div>
            <Text c="dimmed" tt="uppercase" fw={700} fz="xs" className={classes.label}>
              {stat.title}
            </Text>
            <Text fw={700} fz="xl">
              {stat.value}
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            style={{
              color: stat.diff > 0 ? 'var(--mantine-color-teal-6)' : 'var(--mantine-color-red-6)',
            }}
            size={38}
            radius="md"
          >
            <DiffIcon size={28} stroke={1.5} />
          </ThemeIcon>
        </Group>
        <Text c="dimmed" fz="sm" mt="md">
          <Text component="span" c={stat.diff > 0 ? 'teal' : 'red'} fw={700}>
          </Text>
        </Text>
      </Paper>
    );
  });

  return (
    <div className={classes.root}>
      <SimpleGrid cols={{ base: 1, sm: 4 }}>{stats}</SimpleGrid>
    </div>
  );
}

export default StatsGridIcons