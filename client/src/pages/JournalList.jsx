//JournalList.jsx


import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Title, Text, Stack, Button, Loader, Collapse, Flex, Pagination, Container } from '@mantine/core';
import WeekEntriesGroup from '../components/WeekEntriesGroup';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

export default function JournalList() {
  const [journals, setJournals] = useState([]);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const currentWeek = dayjs().isoWeek();
  const currentYear = dayjs().year();

  const fetchJournals = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`/journals?page=${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setJournals(res.data.journals);
      setPages(res.data.pages);
      setPage(res.data.page);
    } catch (err) {
      console.error('Failed to load journals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const handlePageChange = (newPage) => {
    fetchJournals(newPage);
  };

  if (loading) return <Loader mt="md" />;

  const currentWeekJournal = journals.find(j => j.year === currentYear && j.week_number === currentWeek);
  const pastJournals = journals.filter(j => !(j.year === currentYear && j.week_number === currentWeek));

  return (
    <Container>
      <Box mt="lg" mb="xl">
        <Title order={2}>Current Week's Journals</Title>
        {currentWeekJournal ? (
            <WeekEntriesGroup
                year={currentYear}
                week={currentWeek}
                expanded={true}
            />
        ) : (
            <p>No journals for this week.</p>
        )}
      </Box>

      <Box mt="lg" mb="xl">
        <Title order={2} mt="xl">Past Weeks</Title>
        <Stack>
            {pastJournals.map(journal => {
            const weekKey = `${journal.year}-W${journal.week_number}`;
            const startOfWeek = dayjs().year(journal.year).isoWeek(journal.week_number).startOf('isoWeek');
            const endOfWeek = startOfWeek.endOf('isoWeek');

            const dateRangeStr = `${startOfWeek.format('MMMM D, YYYY')} - ${endOfWeek.format('MMMM D, YYYY')}`;
                
            return (
                <Box>
                <Flex key={weekKey} align="center" gap="sm">
                    <Text>	•  {dateRangeStr}</Text>
                    <Button
                        variant={expandedWeek === weekKey ? 'filled' : 'outline'}
                        onClick={() =>
                        setExpandedWeek(prev => (prev === weekKey ? null : weekKey))
                        }
                    >
                        Week {journal.week_number}, {journal.year}
                    </Button>
                </Flex>
                <Collapse in={expandedWeek === weekKey}>
                    <WeekEntriesGroup
                        year={journal.year}
                        week={journal.week_number}
                        expanded={expandedWeek === weekKey}
                    />
                </Collapse>
                </Box>
            );
            })}
        </Stack>
      </Box>

      {/* Pagination Controls */}
      <Flex justify="center" mt={200} mb="xl">
        <Pagination
            total={pages}
            value={page}
            onChange={handlePageChange}
        />
      </Flex>
    </Container>
  );
}