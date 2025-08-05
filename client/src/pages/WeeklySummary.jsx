// WeeklySummary.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Box, Title, Text, Stack, Button, Loader, Collapse, Flex, Paper} from '@mantine/core';
import AiSuggestionForm from "../components/AiSuggestionForm";

export default function WeeklySummary() {
    const [suggestion, setSuggestion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { year, week_number } = useParams();

    const fetchSuggestion = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`/journals/${year}/${week_number}/suggestion`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            setSuggestion(response.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setSuggestion(null); // No suggestion yet
            } else {
                setError('Failed to load suggestion');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // const quaryParams = new URLSearchParams();
        // quaryParams.set("year", year)
        // quaryParams.set("week_number", week_number)

        fetchSuggestion();
    }, [year, week_number]);

    if (isLoading) {
    return <Loader mt="md" />;
  }

  return (
    <Paper withBorder p="md" radius="md" mt="lg">
      <Stack>
        <Title order={3}>AI Weekly Summary</Title>

        {error && <Alert color="red">{error}</Alert>}

        {suggestion ? (
          <>
            <AiSuggestionForm year={year} week_number={week_number} /> 
          </>
        ) : (
             <Text>No summary generated for this week.</Text>
        )}
      </Stack>
    </Paper>
  );
}
