//JournalList.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Title, Text, Stack, Button, Loader, Collapse, Flex, Pagination, Container, Paper, Group, Select } from '@mantine/core';
import WeekEntriesGroup from '../components/WeekEntriesGroup';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

export default function JournalList() {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const filteredJournals = journals.filter((j) => {
    if (selectedYear && j.year.toString() !== selectedYear) return false;
    return true;
  });


  const fetchJournals = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`/journals?page=${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setJournals(response.data.journals);
      setPages(response.data.pages);
      setPage(response.data.page);
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

  const handleMonthFilter = async () => {
      if (!selectedYear || !selectedMonth) return;

      setLoading(true);
      try {
        const response = await axios.get(`/entries/${selectedYear}/${selectedMonth}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // 用月数据替换 journals，注意格式要和原 journals 一致（可能需要格式转换）
        const journalEntries = response.data; // 假设为 entry 数组

        // 将 entries 转换成你组件现有格式：分组 week_number, year
        const groupedByWeek = journalEntries.reduce((acc, entry) => {
          const date = dayjs(entry.entry_date);
          const week = date.isoWeek();
          const year = date.year();
          const key = `${year}-W${week}`;

          if (!acc[key]) {
            acc[key] = { year, week_number: week, entries: [] };
          }
          acc[key].entries.push(entry);
          return acc;
        }, {});

        setJournals(Object.values(groupedByWeek));
      } catch (err) {
        console.error('Failed to filter by month:', err);
      } finally {
        setLoading(false);
      }
    };

  if (loading) return <Loader mt="md" />;


  return (
    <Container>
      <Box mt="lg" mb="xl">
        <Title order={2} mt={100} mb={30} ta="center">All Journals</Title>

        <Flex justify="center" gap="md" mb="lg">
          <Select
            placeholder="Select year"
            data={Array.from({ length: 3 }, (_, i) => {
              const year = dayjs().year() - i;
              return { label: year.toString(), value: year.toString() };
            })}
            value={selectedYear}
            onChange={setSelectedYear}
            w={120}
          />
          <Select
            placeholder="Select month"
            data={Array.from({ length: 12 }, (_, i) => ({
              label: dayjs().month(i).format('MMMM'), // e.g., January
              value: (i + 1).toString(),
            }))}
            value={selectedMonth}
            onChange={setSelectedMonth}
            w={150}
          />
          <Button onClick={handleMonthFilter}>Filter</Button>
        </Flex>
        <Stack>
            {filteredJournals.map(journal => {
                const weekKey = `${journal.year}-W${journal.week_number}`;
                const startOfWeek = dayjs().year(journal.year).week(journal.week_number).startOf('isoWeek');
                const endOfWeek = startOfWeek.endOf('isoWeek');

                const dateRangeStr = `${startOfWeek.format('MMMM D, YYYY')} - ${endOfWeek.format('MMMM D, YYYY')}`;   
                
            return (
                <Paper key={weekKey} shadow="xs" p="md" withBorder radius="md">
                  <Flex justify="space-between" align="center" mb="xs">
                    <Group position="apart" mb="xs">
                      <Button
                          variant={expandedWeek === weekKey ? 'filled' : 'outline'}
                          onClick={() =>
                              setExpandedWeek(prev => (prev === weekKey ? null : weekKey))
                          }
                          size="sm"
                      >
                      Week {journal.week_number}, {journal.year}
                      </Button>
                      <Text size="sm" c="dimmed">
                      {dateRangeStr}
                      </Text>
                    </Group>

                    <Button onClick={() => navigate(`/journals/${journal.year}/${journal.week_number}/summary`)}>
                      Summary
                    </Button>
                  </Flex>

                  <Collapse in={expandedWeek === weekKey}>
                    <WeekEntriesGroup
                        year={journal.year}
                        week={journal.week_number}
                        expanded={expandedWeek === weekKey}
                    />
                  </Collapse>
                </Paper>
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






// //JournalList.jsx

// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Box, Title, Text, Stack, Button, Loader, Collapse, Flex, Pagination, Container, Paper, Group, Select } from '@mantine/core';
// import WeekEntriesGroup from '../components/WeekEntriesGroup';
// import dayjs from 'dayjs';
// import isoWeek from 'dayjs/plugin/isoWeek';
// import weekOfYear from 'dayjs/plugin/weekOfYear';

// dayjs.extend(isoWeek);
// dayjs.extend(weekOfYear);

// export default function JournalList() {
//   const navigate = useNavigate();
//   const [journals, setJournals] = useState([]);
//   const [expandedWeek, setExpandedWeek] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);

//   const [selectedYear, setSelectedYear] = useState(null);

//   const filteredJournals = journals.filter((j) => {
//     if (selectedYear && j.year.toString() !== selectedYear) return false;
//     return true;
//   });


//   const fetchJournals = async (pageNumber = 1) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`/journals?page=${pageNumber}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       setJournals(response.data.journals);
//       setPages(response.data.pages);
//       setPage(response.data.page);
//     } catch (err) {
//       console.error('Failed to load journals', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJournals();
//   }, []);

//   const handlePageChange = (newPage) => {
//     fetchJournals(newPage);
//   };

//   if (loading) return <Loader mt="md" />;


//   return (
//     <Container>
//       <Box mt="lg" mb="xl">
//         <Title order={2} mt={100} mb={30} ta="center">All Journals</Title>

//         <Flex justify="center" gap="md" mb="lg">
//           <Select
//             placeholder="Select year"
//             data={Array.from({ length: 3 }, (_, i) => {
//               const year = dayjs().year() - i;
//               return { label: year.toString(), value: year.toString() };
//             })}
//             value={selectedYear}
//             onChange={setSelectedYear}
//             w={120}
//           />
//         </Flex>
//         <Stack>
//             {filteredJournals.map(journal => {
//                 const weekKey = `${journal.year}-W${journal.week_number}`;
//                 const startOfWeek = dayjs().year(journal.year).week(journal.week_number).startOf('isoWeek');
//                 const endOfWeek = startOfWeek.endOf('isoWeek');

//                 const dateRangeStr = `${startOfWeek.format('MMMM D, YYYY')} - ${endOfWeek.format('MMMM D, YYYY')}`;   
                
//             return (
//                 <Paper key={weekKey} shadow="xs" p="md" withBorder radius="md">
//                   <Flex justify="space-between" align="center" mb="xs">
//                     <Group position="apart" mb="xs">
//                       <Button
//                           variant={expandedWeek === weekKey ? 'filled' : 'outline'}
//                           onClick={() =>
//                               setExpandedWeek(prev => (prev === weekKey ? null : weekKey))
//                           }
//                           size="sm"
//                       >
//                       Week {journal.week_number}, {journal.year}
//                       </Button>
//                       <Text size="sm" c="dimmed">
//                       {dateRangeStr}
//                       </Text>
//                     </Group>

//                     <Button onClick={() => navigate(`/journals/${journal.year}/${journal.week_number}/summary`)}>
//                       Summary
//                     </Button>
//                   </Flex>

//                   <Collapse in={expandedWeek === weekKey}>
//                     <WeekEntriesGroup
//                         year={journal.year}
//                         week={journal.week_number}
//                         expanded={expandedWeek === weekKey}
//                     />
//                   </Collapse>
//                 </Paper>
//               );
//             })}
//         </Stack>
//       </Box>

//       {/* Pagination Controls */}
//       <Flex justify="center" mt={200} mb="xl">
//         <Pagination
//             total={pages}
//             value={page}
//             onChange={handlePageChange}
//         />
//       </Flex>
//     </Container>
//   );
// }