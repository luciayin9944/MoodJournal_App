// MonthlyMoodScores.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Text, Loader, Alert, Box, Title, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, ResponsiveContainer} from "recharts";

export default function MonthlyMoodScores({ year, month }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/entries/${year}/${month}/analysis`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setData(response.data?.entries || []);
      } catch (err) {
                console.error(err);
                setError("Failed to fetch entries.");
      } finally {
          setIsLoading(false);
      }
    };
    fetchEntries();
  }, [year, month]);

  const moodScoreData = data?.map(entry => ({
    date:entry.entry_date,
    mood_score:entry.mood_score
  })) || [];

  return (
    <Container size="md" mt="lg">
        {isLoading && <Loader />}
        {error && (
            <Alert icon={<IconAlertCircle />} color="red" mt="md">
            {error}
            </Alert>
        )}
        {!isLoading && data?.length === 0 && (
          <Text c="dimmed" ta="center" mt="md">
            No mood journal for this month yet.
          </Text>
        )}

        {!isLoading && data?.length > 0 && (
          <Box>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={moodScoreData}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="date" />
                <YAxis domain={[1, 10]} />
                <RechartTooltip />
                <Line dataKey="mood_score" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
    </Container> 
  );   
}