//JournalEntryCard.jsx

import { Card, Text } from '@mantine/core';
import dayjs from 'dayjs';

export default function JournalEntryCard({ entry }) {
  return (
    <Card shadow="sm" p="md" radius="md" withBorder>
      <Text size="sm" color="dimmed">
        {dayjs(entry.entry_date).format('dddd, MMM D')}
      </Text>
      <Text>Mood: {entry.mood_score} ({entry.mood_tag})</Text>
      <Text size="sm" mt="sm">{entry.notes}</Text>
    </Card>
  );
}