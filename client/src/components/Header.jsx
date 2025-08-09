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
      <Text
        component={Link}
        to="/dashboard"
        fw={900}
        size={36}
        c="darkgreen"
        ff="'Pacifico', cursive" // 改字体
      >
        MoodJournal
      </Text>

      <Group gap="sm">
        {user && <Text size="sm">{user.username}</Text>}

        <Button
          variant="light"
          size="xs"
          color="darkgreen"
          onClick={handleLogoutClick}
        >
          Logout
        </Button>
      </Group>
    </Flex>
  );
}