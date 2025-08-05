
// Dashboard.jsx

import { Box, Title, Text, Stack, Button, Flex, Pagination, Container, Paper } from '@mantine/core';

export default function Dashboard({ user }) {
  return (
    <Container>
      <h1>Welcome, {user.username}!</h1>
      <p>This is your dashboard content.</p>
    </Container>
  );
}