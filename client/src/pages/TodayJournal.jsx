import { useState, useEffect } from 'react';
import axios from 'axios';
import { Title, Text, Card, Box, Loader, Button, Notification } from '@mantine/core';
import dayjs from 'dayjs'; 
import NewEntryForm from '../components/NewEntryForm';

export default function TodayJournal() {
  const [todayEntry, setTodayEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)

  const todayStr = dayjs().format('YYYY-MM-DD');

  const fetchTodayEntry = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/entries/today`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTodayEntry(res.data || null);
    } catch (err) {
        if (err.response?.status === 404) {
            // No entry for today; don't treat as error
            setTodayEntry(null);
            setError(null);
        } else {
            // Other unexpected errors
            setError(err.response?.data?.error || 'Failed to load entry.');
        }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayEntry();
  }, []);

  return (
    <Box p="md">
      <Title order={2}>Today's Journal</Title>
      <Text size="sm" c="dimmed">Date: {todayStr}</Text>

      {loading ? (
        <Loader mt="md" />
      ) : todayEntry ? (
        <Card mt="md" shadow="sm" padding="md" withBorder>
          {/* <Text size="sm" c="dimmed">Date: {todayStr}</Text> */}
          <Text mt="sm">Mood Score: {todayEntry.mood_score}</Text>
          <Text>Mood Tag: {todayEntry.mood_tag}</Text>
          <Text mt="sm">Notes:</Text>
          <Text>{todayEntry.notes}</Text>
        </Card>
      ) : (
        <Box mt="md">
          <Text>No entry found for today. Add one below:</Text>
          <NewEntryForm
            defaultDate={new Date()}
            editableDate={false}
            onSuccess={() => {
              fetchTodayEntry();
            }}
          />
        </Box>
      )}
      {error && (
        <Notification color="red" onClose={() => setError(null)}>
            {error}
        </Notification>
      )}
    </Box>
  );
}
