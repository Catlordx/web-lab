'use client';

import React from 'react';
import { Box, Card, CardContent, Container, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { LineChart, PieChart, ScatterChart } from '@mui/x-charts';
// Styled components
const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatsIconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 60,
  width: 60,
  borderRadius: '50%',
  marginBottom: theme.spacing(2),
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '300px',
  display: 'flex',
  flexDirection: 'column',
}));

export default function HomePage() {
  // Mock data for statistics
  const data = [
    {
      id: 'data-0',
      x1: 329.39,
      x2: 391.29,
      y1: 443.28,
      y2: 153.9,
    },
    {
      id: 'data-1',
      x1: 96.94,
      x2: 139.6,
      y1: 110.5,
      y2: 217.8,
    },
    {
      id: 'data-2',
      x1: 336.35,
      x2: 282.34,
      y1: 175.23,
      y2: 286.32,
    },
    {
      id: 'data-3',
      x1: 159.44,
      x2: 384.85,
      y1: 195.97,
      y2: 325.12,
    },
    {
      id: 'data-4',
      x1: 188.86,
      x2: 182.27,
      y1: 351.77,
      y2: 144.58,
    },
    {
      id: 'data-5',
      x1: 143.86,
      x2: 360.22,
      y1: 43.253,
      y2: 146.51,
    },
    {
      id: 'data-6',
      x1: 202.02,
      x2: 209.5,
      y1: 376.34,
      y2: 309.69,
    },
    {
      id: 'data-7',
      x1: 384.41,
      x2: 258.93,
      y1: 31.514,
      y2: 236.38,
    },
    {
      id: 'data-8',
      x1: 256.76,
      x2: 70.571,
      y1: 231.31,
      y2: 440.72,
    },
    {
      id: 'data-9',
      x1: 143.79,
      x2: 419.02,
      y1: 108.04,
      y2: 20.29,
    },
    {
      id: 'data-10',
      x1: 103.48,
      x2: 15.886,
      y1: 321.77,
      y2: 484.17,
    },
    {
      id: 'data-11',
      x1: 272.39,
      x2: 189.03,
      y1: 120.18,
      y2: 54.962,
    },
    {
      id: 'data-12',
      x1: 23.57,
      x2: 456.4,
      y1: 366.2,
      y2: 418.5,
    },
    {
      id: 'data-13',
      x1: 219.73,
      x2: 235.96,
      y1: 451.45,
      y2: 181.32,
    },
    {
      id: 'data-14',
      x1: 54.99,
      x2: 434.5,
      y1: 294.8,
      y2: 440.9,
    },
    {
      id: 'data-15',
      x1: 134.13,
      x2: 383.8,
      y1: 121.83,
      y2: 273.52,
    },
    {
      id: 'data-16',
      x1: 12.7,
      x2: 270.8,
      y1: 287.7,
      y2: 346.7,
    },
    {
      id: 'data-17',
      x1: 176.51,
      x2: 119.17,
      y1: 134.06,
      y2: 74.528,
    },
    {
      id: 'data-18',
      x1: 65.05,
      x2: 78.93,
      y1: 104.5,
      y2: 150.9,
    },
    {
      id: 'data-19',
      x1: 162.25,
      x2: 63.707,
      y1: 413.07,
      y2: 26.483,
    },
    {
      id: 'data-20',
      x1: 68.88,
      x2: 150.8,
      y1: 74.68,
      y2: 333.2,
    },
    {
      id: 'data-21',
      x1: 95.29,
      x2: 329.1,
      y1: 360.6,
      y2: 422.0,
    },
    {
      id: 'data-22',
      x1: 390.62,
      x2: 10.01,
      y1: 330.72,
      y2: 488.06,
    },
  ];
  const stats = [
    {
      title: '今日到馆人数',
      value: '2,845',
      icon: <PeopleIcon sx={{ fontSize: 30, color: 'white' }} />,
      iconBgColor: '#1976d2',
    },
    {
      title: '总藏书量',
      value: '4,520',
      icon: <LeaderboardOutlinedIcon sx={{ fontSize: 30, color: 'white' }} />,
      iconBgColor: '#ed6c02',
    },
    {
      title: '可借书籍数',
      value: '3,128',
      icon: <TaskAltOutlinedIcon sx={{ fontSize: 30, color: 'white' }} />,
      iconBgColor: '#2e7d32',
    },
    {
      title: '逾期未还书籍数',
      value: '87',
      icon: <AssessmentIcon sx={{ fontSize: 30, color: 'white' }} />,
      iconBgColor: '#9c27b0',
    },
  ];

  return (
    <Container maxWidth={false}>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          图书租借情况总览
        </Typography>
        {/* <Typography variant="body1" color="text.secondary">
          111111
        </Typography> */}
      </Box>

      {/* Stats Cards */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          {stats.map((stat, index) => (
            <Grid size={3} key={index}>
              <StatsCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" component="div" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" component="div" fontWeight="bold">
                        {stat.value}
                      </Typography>
                    </Box>
                    <StatsIconBox sx={{ bgcolor: stat.iconBgColor }}>
                      {stat.icon}
                    </StatsIconBox>
                  </Box>
                </CardContent>
              </StatsCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <ChartContainer>
        <center>
          {/* TODO make the fake data to be true data recieved from the backend */}
          <LineChart
            xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7] }]}
            series={[
              {
                data: [15, 33, 17, 24, 5, 73, 12],
                color: '#1976d2',
              },
            ]}
            width={900}
            height={300}
          />
        </center>
      </ChartContainer>

      <center className='mb-4'>
        <Typography variant="body2" color="text.secondary">
          图书借阅趋势图
        </Typography>
      </center>

      <Grid container spacing={2}>
        <Grid size={6}>
          <ScatterChart
            width={600}
            height={300}
            series={[
              {
                label: 'Series A',
                data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
              },
              {
                label: 'Series B',
                data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
              },
            ]}
          />
        </Grid>
        <Grid size={6}>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: '科技' },
                  { id: 1, value: 15, label: '财经' },
                  { id: 2, value: 20, label: '文学' },
                ],
              },
            ]}
            width={400}
            height={200}
          />
        </Grid>

      </Grid>

      {/* Charts */}
      {/* <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ChartContainer>
            <Typography variant="h6" gutterBottom>
              Weekly Revenue
            </Typography>
            <Box sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="body2" color="text.secondary">
                Chart visualization would go here (requires Chart.js or other library)
              </Typography>
            </Box>
          </ChartContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartContainer>
            <Typography variant="h6" gutterBottom>
              Traffic Sources
            </Typography>
            <Box sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="body2" color="text.secondary">
                Pie chart would go here
              </Typography>
            </Box>
          </ChartContainer>
        </Grid>
        <Grid item xs={12}>
          <ChartContainer>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              mt: 2
            }}>
              <Typography variant="body2" sx={{ py: 1 }}>
                User John Smith completed purchase - 12 minutes ago
              </Typography>
              <Typography variant="body2" sx={{ py: 1 }}>
                New user registration: Sarah Johnson - 45 minutes ago
              </Typography>
              <Typography variant="body2" sx={{ py: 1 }}>
                Inventory alert: Product SKU-1234 low stock - 1 hour ago
              </Typography>
              <Typography variant="body2" sx={{ py: 1 }}>
                System update completed successfully - 3 hours ago
              </Typography>
            </Box>
          </ChartContainer>
        </Grid>
      </Grid> */}
    </Container>
  );
}