'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import Layout from '../../components/layout/Layout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { fetchProfileStart, fetchProfileSuccess, fetchProfileFailure } from '../../redux/slices/userSlice';
import { logout } from '../../redux/slices/authSlice';

// Interface matching the one in userSlice.ts
interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: number;
  points: number;
  level: number;
  nextLevelPoints: number;
  badgesEarned: string[];
  badges: Badge[];
  eventsAttended: string[];
  eventsRegistered: string[];
  hoursVolunteered: number;
  stats: {
    totalEvents: number;
    totalHours: number;
    categoryDistribution: CategoryCount[];
    monthlyActivity: MonthlyActivity[];
  };
}

interface CategoryCount {
  name: string;
  count: number;
}

interface MonthlyActivity {
  month: string;
  hours: number;
}

// Mock past events
const pastEvents = [
  {
    id: 'event1',
    title: 'Beach Cleanup Drive',
    date: '2023-06-15',
    category: 'Environment',
    hours: 4,
    points: 120,
    role: 'Volunteer',
  },
  {
    id: 'event2',
    title: 'Food Distribution',
    date: '2023-07-22',
    category: 'Community',
    hours: 3,
    points: 90,
    role: 'Team Lead',
  },
  {
    id: 'event3',
    title: 'Tree Plantation Drive',
    date: '2023-08-10',
    category: 'Environment',
    hours: 5,
    points: 150,
    role: 'Volunteer',
  },
];

// Mock upcoming events
const upcomingEvents = [
  {
    id: 'event4',
    title: 'Coding Workshop for Kids',
    date: '2023-10-15',
    category: 'Education',
    hours: 3,
    role: 'Mentor',
  },
  {
    id: 'event5',
    title: 'Charity Run',
    date: '2023-11-05',
    category: 'Health',
    hours: 4,
    role: 'Participant',
  },
];

// Mock API call
const mockFetchUserProfile = async (userId: string): Promise<UserProfile> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user profile data matching the userSlice's UserProfile interface
  return {
    id: userId,
    displayName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    photoURL: '',
    phoneNumber: '+91 9876543210',
    createdAt: Date.now() - 7890000000, // About 3 months ago
    points: 720,
    level: 4,
    nextLevelPoints: 180,
    badgesEarned: ['badge1', 'badge2', 'badge3', 'badge4', 'badge6'],
    badges: [
      {
        id: 'badge1',
        name: 'Environmental Protector',
        description: 'Participated in 5+ environmental events',
        icon: '🌱',
        earnedDate: '2023-06-15',
      },
      {
        id: 'badge2',
        name: 'Community Champion',
        description: 'Completed 10+ community events',
        icon: '🏆',
        earnedDate: '2023-07-22',
      },
      {
        id: 'badge3',
        name: 'Team Leader',
        description: 'Led a team in 3+ events',
        icon: '👑',
        earnedDate: '2023-08-10',
      },
      {
        id: 'badge4',
        name: 'Marathon Volunteer',
        description: 'Volunteered for over 40 hours',
        icon: '⏱️',
        earnedDate: '2023-09-05',
      },
      {
        id: 'badge5',
        name: 'Versatile Volunteer',
        description: 'Participated in 5+ different categories',
        icon: '🌈',
        earnedDate: '',
      },
      {
        id: 'badge6',
        name: 'Dedicated Member',
        description: 'Active for over 6 months',
        icon: '📅',
        earnedDate: '2023-09-30',
      },
    ],
    eventsAttended: ['event1', 'event2', 'event3'],
    eventsRegistered: ['event4', 'event5'],
    hoursVolunteered: 42,
    stats: {
      totalEvents: 10,
      totalHours: 42,
      categoryDistribution: [
        { name: 'Environment', count: 30 },
        { name: 'Education', count: 25 },
        { name: 'Community', count: 20 },
        { name: 'Health', count: 15 },
        { name: 'Arts', count: 10 },
      ],
      monthlyActivity: [
        { month: '2023-01', hours: 3 },
        { month: '2023-02', hours: 5 },
        { month: '2023-03', hours: 0 },
        { month: '2023-04', hours: 7 },
        { month: '2023-05', hours: 3 },
        { month: '2023-06', hours: 5 },
        { month: '2023-07', hours: 8 },
        { month: '2023-08', hours: 4 },
        { month: '2023-09', hours: 7 },
      ],
    },
  };
};

// Badge interface
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
}

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile: user, isLoading: loading, error } = useSelector((state: RootState) => state.user);
  const authUser = useSelector((state: RootState) => state.auth.user);
  
  const [certificateLoading, setCertificateLoading] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [showCertModal, setShowCertModal] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  
  // Refs for focus management
  const modalRef = React.useRef<HTMLDivElement>(null);
  const returnFocusRef = React.useRef<HTMLButtonElement | null>(null);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle keyboard navigation for tabs
  const handleTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      const newValue = (tabValue + direction + 3) % 3; // 3 is the number of tabs
      setTabValue(newValue);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };
  
  // Handle Get Certificate
  const handleGetCertificate = (eventId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    // Store the button that was clicked to return focus later
    returnFocusRef.current = event.currentTarget;
    setCurrentEventId(eventId);
    setShowCertModal(true);
  };
  
  // Handle certificate download
  const handleCertificateDownload = () => {
    if (!currentEventId) return;
    
    setCertificateLoading(currentEventId);
    // Simulate download
    setTimeout(() => {
      alert(`Certificate for event ${currentEventId} downloaded successfully!`);
      setCertificateLoading(null);
    }, 1000);
  };
  
  // Handle email certificate
  const handleEmailCertificate = () => {
    if (!currentEventId) return;
    
    setCertificateLoading(currentEventId);
    // Simulate email sending
    setTimeout(() => {
      alert(`Certificate for event ${currentEventId} has been emailed to ${user.email}`);
      setCertificateLoading(null);
    }, 1000);
  };
  
  // Close certificate modal
  const handleCloseCertModal = () => {
    setShowCertModal(false);
    setCurrentEventId(null);
    // Return focus to the button that opened the modal
    if (returnFocusRef.current) {
      setTimeout(() => {
        returnFocusRef.current?.focus();
      }, 0);
    }
  };
  
  // Handle escape key for modal
  const handleModalKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleCloseCertModal();
    }
  };
  
  // Focus the modal when it opens
  useEffect(() => {
    if (showCertModal && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showCertModal]);

  useEffect(() => {
    // Simple approach: if we have auth user data but no profile data yet
    if (authUser && (!user || !user.id)) {
      // Create a simple profile from auth data
      const simpleProfile = {
        id: authUser.uid,
        displayName: authUser.displayName || 'User',
        email: authUser.email || 'user@example.com',
        photoURL: authUser.photoURL || '',
        phoneNumber: "",
        createdAt: Date.now() - 7890000000,
        points: 0,
        level: 1,
        nextLevelPoints: 100,
        badgesEarned: [],
        badges: [],
        eventsAttended: [],
        eventsRegistered: [],
        hoursVolunteered: 0,
        stats: {
          totalEvents: 0,
          totalHours: 0,
          categoryDistribution: [],
          monthlyActivity: []
        }
      };
      
      dispatch(fetchProfileSuccess(simpleProfile));
    }
  }, [authUser, user, dispatch]);
  
  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }
  
  if (error || !user) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error">
            {error || 'Failed to load profile. Please try again later.'}
          </Alert>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Profile Header */}
        <Paper elevation={1} sx={{ mb: 3 }}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              {user.displayName}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Chip 
                label={`Level ${user.level}`} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={`${user.points} Points`} 
                color="secondary" 
                variant="outlined" 
              />
            </Box>
          </Box>
          
          {/* Tabs Section */}
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="Overview" 
              id="profile-tab-0"
              aria-controls="profile-tabpanel-0"
              onKeyDown={(e) => handleTabKeyDown(e, 0)}
              tabIndex={tabValue === 0 ? 0 : -1}
            />
            <Tab 
              label="Past Events" 
              id="profile-tab-1"
              aria-controls="profile-tabpanel-1"
              onKeyDown={(e) => handleTabKeyDown(e, 1)}
              tabIndex={tabValue === 1 ? 0 : -1}
            />
            <Tab 
              label="Upcoming Events" 
              id="profile-tab-2"
              aria-controls="profile-tabpanel-2"
              onKeyDown={(e) => handleTabKeyDown(e, 2)}
              tabIndex={tabValue === 2 ? 0 : -1}
            />
          </Tabs>
          
          {/* Overview Panel */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                      {user.stats.totalEvents}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Events
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                      {user.hoursVolunteered}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hours
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                      {user.stats.monthlyActivity.filter(month => month.hours > 0).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Months
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Account Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Member Since
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {user.phoneNumber || 'Not provided'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Next Level
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {user.nextLevelPoints} points needed for Level {user.level + 1}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                
                {/* Logout Button */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={handleLogout}
                    sx={{ minWidth: '150px' }}
                    aria-label="Logout from your account"
                  >
                    Logout
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Past Events Panel */}
          <TabPanel value={tabValue} index={1}>
            {pastEvents.length > 0 ? (
              <>
                <Box>
                  {pastEvents.map((event) => (
                    <Box key={event.id} sx={{ py: 1 }}>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item xs={8}>
                          <Typography variant="body1" fontWeight="medium">
                            {event.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event.date} • {event.category} • {event.hours} hrs
                          </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={(event) => handleGetCertificate(event.id, event)}
                              disabled={certificateLoading === event.id}
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {certificateLoading === event.id ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                'Get Certificate'
                              )}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                You have not participated in any events yet.
              </Typography>
            )}
          </TabPanel>
          
          {/* Upcoming Events Panel */}
          <TabPanel value={tabValue} index={2}>
            {upcomingEvents.length > 0 ? (
              <>
                <Box>
                  {upcomingEvents.map((event) => (
                    <Box key={event.id} sx={{ py: 1 }}>
                      <Grid container alignItems="center">
                        <Grid item xs={9}>
                          <Typography variant="body1" fontWeight="medium">
                            {event.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event.date} • {event.category} • {event.hours} hrs
                          </Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ textAlign: 'right' }}>
                          <Button
                            size="small"
                            component={Link}
                            href={`/events/${event.id}`}
                            variant="contained"
                            color="primary"
                            aria-label={`View details for ${event.title}`}
                          >
                            View
                          </Button>
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body1" gutterBottom>
                  You don't have any upcoming events.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  component={Link}
                  href="/events"
                  aria-label="Browse available events"
                >
                  Browse Events
                </Button>
              </Box>
            )}
          </TabPanel>
        </Paper>
        
        {/* Certificate Modal */}
        <Dialog 
          open={showCertModal} 
          onClose={handleCloseCertModal}
          maxWidth="sm"
          fullWidth
          aria-labelledby="certificate-dialog-title"
          onKeyDown={handleModalKeyDown}
        >
          <DialogTitle id="certificate-dialog-title">
            {currentEventId && findEventById(currentEventId, pastEvents)?.title} Certificate
          </DialogTitle>
          <DialogContent>
            <Box 
              sx={{ mb: 3, textAlign: 'center' }}
              ref={modalRef} 
              tabIndex={-1}
            >
              {/* Certificate Preview */}
              <Paper 
                elevation={0} 
                sx={{ 
                  border: '3px solid #c9a97a', 
                  p: 4, 
                  mb: 2,
                  backgroundImage: 'linear-gradient(135deg, #fffdf7 0%, #f9f5e9 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(201, 169, 122, 0.1) 10%, transparent 50%)',
                    backgroundSize: '20px 20px',
                    backgroundRepeat: 'repeat',
                    zIndex: 0,
                  }
                }}
              >
                {/* Logo */}
                <Box sx={{ textAlign: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
                  <img 
                    src="/images/samarthanam-logo.png" 
                    alt="Samarthanam Logo" 
                    style={{ height: '60px', objectFit: 'contain' }}
                  />
                </Box>
                
                <Box sx={{ 
                  position: 'relative', 
                  zIndex: 1,
                  border: '1px solid #c9a97a',
                  borderRadius: '5px',
                  p: 3,
                  background: 'rgba(255,255,255,0.7)'
                }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2, 
                      fontFamily: 'serif', 
                      fontWeight: 'bold',
                      color: '#7a5c20',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '2px'
                    }}
                  >
                    Certificate of Achievement
                  </Typography>
                  
                  <Divider sx={{ mb: 3, borderColor: '#c9a97a', borderWidth: '1px' }} />
                  
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', textAlign: 'center', color: '#555' }}>
                    This certifies that
                  </Typography>
                  
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 'bold', 
                      fontFamily: 'serif',
                      textAlign: 'center',
                      color: '#2a4d69',
                      padding: '10px 0',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '25%',
                        width: '50%',
                        height: '1px',
                        backgroundColor: '#c9a97a',
                      }
                    }}
                  >
                    {user.displayName}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 1, textAlign: 'center', color: '#555' }}>
                    has successfully participated in
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: '#2a4d69'
                    }}
                  >
                    {currentEventId && findEventById(currentEventId, pastEvents)?.title}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-end',
                    mt: 4
                  }}>
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666' }}>
                        Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {currentEventId && findEventById(currentEventId, pastEvents)?.date}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666' }}>
                        Certificate ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        CTG-{currentEventId}-{user.id.substring(0, 4)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center', flex: 1 }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666' }}>
                        Director
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        Samarthanam Trust
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleCertificateDownload}
                  disabled={certificateLoading === currentEventId}
                  aria-label="Download certificate"
                >
                  {certificateLoading === currentEventId ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    'Download Certificate'
                  )}
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleEmailCertificate}
                  disabled={certificateLoading === currentEventId}
                  aria-label="Email certificate"
                >
                  Send to Email
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseCertModal} 
              color="primary"
              aria-label="Close certificate dialog"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}

// Helper function to find event by ID
function findEventById(id: string, events: any[]) {
  return events.find(event => event.id === id) || null;
} 