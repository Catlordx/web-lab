'use client';

import React from 'react';
import { Box, Card, CardContent, Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';

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
  const stats = [
    {
      title: 'Total Users',
      value: '2,845',
      icon: <PeopleIcon sx={{ fontSize: 30, color: 'white' }} />,
      iconBgColor: '#1976d2',
    },
    {
      title: 'Sales',
      value: '$24,520',
      icon: <AttachMoneyIcon sx={{ fontSize: 30, color: 'white' }} />,
      iconBgColor: '#2e7d32',
    },
    {
      title: 'Orders',
      value: '1,728',
      icon: <ShoppingCartIcon sx={{ fontSize: 30, color: 'white' }} />,
      iconBgColor: '#ed6c02',
    },
    {
      title: 'Conversion',
      value: '28.6%',
      icon: <AssessmentIcon sx={{ fontSize: 30, color: 'white' }} />,
      iconBgColor: '#9c27b0',
    },
  ];

  return (
    <Container maxWidth={false}>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          111111
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
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

      {/* Charts */}
      <Grid container spacing={3}>
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
      </Grid>
    </Container>
  );
}