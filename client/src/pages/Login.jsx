// Login.jsx

import { useState } from "react";
import { Box, Container, Title, Text, Button, Divider, Stack, Paper } from "@mantine/core";
import SignupForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";


export default function Login({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <Container size="xs" mt={80}>
      <Stack spacing="md" align="center">
        <Box w="100%">
          <Stack spacing="xs" align="center">
            <Title order={1} ta="center">
                Mood Journal
            </Title>

            <Text ta="center" c="dimmed" size="sm">
                Track your MOOD everyday.
            </Text>

            {showLogin ? (
                <LoginForm onLogin={onLogin} />
            ) : (
                <SignupForm onLogin={onLogin} />
            )}
          </Stack>

          <Divider label="OR" labelPosition="center" my="sm" />

          <Text size="sm" ta="center">
            {showLogin ? (
                <>
                Don't have an account?&nbsp;
                <Button
                    variant="subtle"
                    size="xs"
                    color="blue"
                    onClick={() => setShowLogin(false)}
                >
                    Sign Up
                </Button>
                </>
            ) : (
                <>
                Already have an account?&nbsp;
                <Button
                    variant="subtle"
                    size="xs"
                    color="blue"
                    onClick={() => setShowLogin(true)}
                >
                    Log In
                </Button>
                </>
            )}
          </Text>
        </Box>
      </Stack>
    </Container>
);
}