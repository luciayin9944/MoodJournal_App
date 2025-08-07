
// Dashboard.jsx

import { Box, Title, Text, Stack, Button, Flex, Pagination, Container, Paper } from '@mantine/core';
import MonthlyWordCloud from '../components/MonthlyWordCloud';
import dayjs from 'dayjs';
import MonthlyMoodScores from '../components/MonthlyMoodScores';

export default function Dashboard({ user }) {

  const currentYear = dayjs().year();
  // const currentMonth = dayjs().month() + 1;
  const lastMonth = dayjs().month()


  return (
    <Container>
      <Text mt={40} mb={30}>Welcome, {user.username}!</Text>

      <Stack>
        <Box>
          <Title order={2} mt={50} mb={30} ta="center">Your Recent Mood Keywords</Title>
          <MonthlyWordCloud year={currentYear} month={lastMonth} />
        </Box> 

        <Box>
           <Title order={2} mt={50} mb={30} ta="center">Your Mood Changing</Title>
           <MonthlyMoodScores year={currentYear} month={lastMonth} />
        </Box>  
      </Stack>
    </Container>
  );
}