'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Layout from '../../components/layout/Layout';

export default function AdminDashboardPage() {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}>
          <Typography variant="h2" component="h1" gutterBottom align="center">
            Admin Dashboard
          </Typography>
          <Typography variant="body1" align="center">
            Welcome to the admin dashboard. This page is under construction.
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
} 