// Navbar.jsx

import { Stack, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
// import isoWeek from 'dayjs/plugin/isoWeek';

export default function Navbar() {
  const navigate = useNavigate();

  const currentYear = dayjs().year();
  const currentWeek = dayjs().isoWeek();

  return (
    <Stack
      h={200}
      bg="var(--mantine-color-body)"
      align="stretch"
      justify="center"
      gap="xl"
      px="md"
      mt={50}
    >
      <Button
        variant="outline"
        color="grey"
        size="xl"
        onClick={() => navigate('/dashboard')}
      >
        Dashboard
      </Button>
      <Button
        variant="outline"
        color="grey"
        size="xl"
        onClick={() => navigate('/entries/today')}
      >
        Current Journal
      </Button>
      <Button
        variant="outline"
        color="grey"
        size="xl"
        onClick={() => navigate(`/journals/${currentYear}/${currentWeek}/summary`)}
      >
        Weekly Summary
      </Button>
      <Button
        variant="outline"
        color="grey"
        size="xl"
        onClick={() => navigate('/journals')}
      >
        All Journals
      </Button>
    </Stack>
  );
}