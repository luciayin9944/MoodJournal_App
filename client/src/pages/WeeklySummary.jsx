// WeeklySummary.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Group, Title, Text, Stack, Button, Loader, Collapse, Flex, Container, Paper} from '@mantine/core';
import AiSuggestionForm from "../components/AiSuggestionForm";
import WeeklyAnalysis from "../components/WeeklyAnalysis";
import dayjs from 'dayjs';


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
        fetchSuggestion();
    }, [year, week_number]);

    if (isLoading) {
    return <Loader mt="md" />;
  }

  const currentWeek = dayjs().isoWeek();
  const currentYear = dayjs().year();

  const startOfWeek = dayjs().year(currentYear).isoWeek(currentWeek).startOf('isoWeek');
  const endOfWeek = startOfWeek.endOf('isoWeek');
  const dateRangeStr = `${startOfWeek.format('MMMM D, YYYY')} - ${endOfWeek.format('MMMM D, YYYY')}`;

  return (
    <Container>
      <Title order={2} mt={50} mb={10} ta="center">Weekly Summary</Title>
      <Text size="md" c="dimmed" ta="center" mb={30}>{dateRangeStr}</Text>
        <Stack>
            <Title order={3} mt={30} mb="md" ta="center">Emotional Analysis</Title>
            <Flex>
                <WeeklyAnalysis year={year} week_number={week_number} />   
            </Flex>
        </Stack>

        <Stack mt={50}>
            <Title order={3} mt={30} mb="md" ta="center">AI Insight</Title>
            {error && <Alert color="red">{error}</Alert>}

            {suggestion ? (
                <>
                    {(() => {
                    let parsedTips = [];

                    try {
                        parsedTips = JSON.parse(suggestion.selfcare_tips);
                    } catch (e) {
                        console.error('Failed to load suggestion', e);
                        parsedTips = suggestion.selfcare_tips.split('\n');  // fallback
                    }

                    return (
                        <>
                        <Paper shadow="xs" p="xl" withBorder radius="md" mb={20}>
                            <Text fw={700} fz="lg" mb={10}> 📌 Summary</Text>
                            <Text>{suggestion.summary}</Text>
                        </Paper>

                        <Paper shadow="xs" p="xl" withBorder radius="md" mb={20}>
                            <Text fw={700} fz="lg" mb={10}>💡 Self-Care Tips</Text>
                            <Stack>
                              {parsedTips.map((tip, index) => (
                                <Text key={index}>	• {tip.trim()}</Text>
                              ))}
                            </Stack>
                        </Paper>
                        </>
                    );
                    })()}
                </>
            ) : (
                <>
                    {/* <Text>No summary generated for this week.</Text> */}
                    <AiSuggestionForm year={year} week_number={week_number} onSuccess={fetchSuggestion} />
                </>
            )}
        </Stack>
    </Container>
  );
}
