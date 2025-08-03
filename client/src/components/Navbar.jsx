// Navbar.jsx

import { Stack, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <Stack
      h={200}
      bg="var(--mantine-color-body)"
      align="stretch"
      justify="center"
      gap="sm"
      px="md"
    >
      <Button
        variant="outline"
        color="grey"
        size="md"
        onClick={() => navigate('/dashboard')}
      >
        Dashboard
      </Button>
      <Button
        variant="outline"
        color="grey"
        size="md"
        onClick={() => navigate('/entries/today')}
      >
        TodayJournal
      </Button>
      <Button
        variant="outline"
        color="grey"
        size="md"
        fullWidth
      >
        3
      </Button>
    </Stack>
  );
}