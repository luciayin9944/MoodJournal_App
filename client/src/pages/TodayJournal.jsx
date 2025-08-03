import { useState, useEffect } from 'react';
import axios from 'axios';
import {Title, Text, Card, Box, Loader, Button, Notification, Group} from '@mantine/core';
import dayjs from 'dayjs'; 
import NewEntryForm from '../components/NewEntryForm';
import EditEntryForm from '../components/EditEntryForm';

export default function TodayJournal() {
  const [todayEntry, setTodayEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
        setTodayEntry(null); // no entry = show create form
        setError(null);
      } else {
        setError(err.response?.data?.error || 'Failed to load entry.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayEntry();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`/entries/${todayEntry.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTodayEntry(null);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete entry.');
    }
  };

  return (
    <Box p="md">
      <Title order={2}>Today's Journal</Title>
      <Text size="sm" c="dimmed">Date: {todayStr}</Text>

      {loading ? (
        <Loader mt="md" />
      ) : isEditing && todayEntry ? (
        <EditEntryForm
          entry={todayEntry}
          onUpdate={(updatedEntry) => {
            setTodayEntry(updatedEntry);
            setIsEditing(false);
          }}
        />
      ) : todayEntry ? (
        <Card mt="md" shadow="sm" padding="md" withBorder>
          <Text mt="sm">Mood Score: {todayEntry.mood_score}</Text>
          <Text>Mood Tag: {todayEntry.mood_tag}</Text>
          <Text mt="sm">Notes:</Text>
          <Text>{todayEntry.notes}</Text>

          <Group mt="md">
            <Button color="blue" variant="outline" size="xs" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button color="red" variant="outline" size="xs" onClick={handleDelete}>
              Delete
            </Button>
          </Group>
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
        <Notification color="red" onClose={() => setError(null)} mt="md">
          {error}
        </Notification>
      )}
    </Box>
  );
}


