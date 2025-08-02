// Navbar.jsx

import { Stack, Button } from '@mantine/core';

export default function Navbar() {
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
        fullWidth
      >
        Dashboard
      </Button>
      <Button
        variant="outline"
        color="grey"
        size="md"
        fullWidth
      >
        Journal
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