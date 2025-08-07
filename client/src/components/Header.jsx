// Header.jsx

import { Link, useNavigate } from "react-router-dom";
import { Button, Group, Flex, Text } from '@mantine/core';

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogoutClick() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  }

  return (
    <Flex justify="space-between" align="center" h="100%" px="md">
      <Text component={Link} to="/dashboard" fw={700} size="lg" c="blue">
        MoodJournal
      </Text>

      <Group gap="sm">
        {user && <Text size="sm">{user.username}</Text>}

        <Button
          variant="light"
          size="xs"
          color="blue"
          onClick={handleLogoutClick}
        >
          Logout
        </Button>
      </Group>
    </Flex>
  );
}