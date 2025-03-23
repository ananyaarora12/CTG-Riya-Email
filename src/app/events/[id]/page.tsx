'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  CardActions,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FlagIcon from '@mui/icons-material/Flag';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format, parseISO } from 'date-fns';
import Layout from '../../../components/layout/Layout';
import { sampleEvents } from '../page';
import { RootState } from '../../../redux/store';
import VolunteerCertificate from '@/components/certificates/VolunteerCertificate';

const EventDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegisteredParticipant, setIsRegisteredParticipant] = useState(false);
  const [isRegisteredVolunteer, setIsRegisteredVolunteer] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [certificateType, setCertificateType] = useState<'volunteer' | 'participant'>('participant');
  
  // Define status based on dates
  const isUpcoming = event && new Date(event.startDate) > new Date();
  const isOngoing = event && new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date();
  const isCompleted = event && new Date(event.endDate) < new Date();
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // For now, we'll simulate it with a delay
        setTimeout(() => {
          const eventId = params.id as string;
          const foundEvent = sampleEvents.find(e => e.id === eventId);
          
          if (foundEvent) {
            // Customize image for Indian context
            const customizedEvent = {
              ...foundEvent,
              imageUrl: getIndianEventImage(foundEvent.category),
            };
            setEvent(customizedEvent);
          } else {
            setError('Event not found');
          }
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load event details');
        setLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [params.id]);
  
  useEffect(() => {
    // This would normally check if the user is registered for this event
    // For demo purposes we'll simulate a check based on the event ID
    const checkRegistrationStatus = () => {
      // Simulate API call to check if user is registered
      setTimeout(() => {
        // For demo, let's say users are registered for certain event IDs
        const registeredParticipantEvents = ['event1', 'event3', 'test-sports-day'];
        const registeredVolunteerEvents = ['event2', 'event4', 'test-fundraising'];
        
        setIsRegisteredParticipant(registeredParticipantEvents.includes(params.id));
        setIsRegisteredVolunteer(registeredVolunteerEvents.includes(params.id));
      }, 500);
    };
    
    if (isAuthenticated) {
      checkRegistrationStatus();
    }
  }, [isAuthenticated, params.id]);
  
  // Function to provide culturally relevant images
  const getIndianEventImage = (category: string) => {
    const images: Record<string, string> = {
      'Education': 'https://images.unsplash.com/photo-1456243762991-9bc5d5e960db?q=80&w=1000&auto=format&fit=crop',
      'Health': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop',
      'Environment': 'https://images.unsplash.com/photo-1590274853856-f808e6a0c5f2?q=80&w=1000&auto=format&fit=crop',
      'Community': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop',
      'Cultural': 'https://images.unsplash.com/photo-1603206004639-22003d78a0d6?q=80&w=1000&auto=format&fit=crop',
      'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop',
      'Tech': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop',
      'Fundraising': 'https://images.unsplash.com/photo-1593113598332-cd59a93333c3?q=80&w=1000&auto=format&fit=crop',
      'default': 'https://images.unsplash.com/photo-1524592714635-d77511a4834d?q=80&w=1000&auto=format&fit=crop',
    };
    
    return images[category] || images['default'];
  };
  
  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/events/${params.id}/register`);
      return;
    }
    
    router.push(`/events/${params.id}/register`);
  };
  
  const handleOpenCertificate = (type: 'volunteer' | 'participant') => {
    setCertificateType(type);
    setCertificateDialogOpen(true);
  };
  
  const handleCloseCertificate = () => {
    setCertificateDialogOpen(false);
  };
  
  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }
  
  if (error || !event) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Alert severity="error" sx={{ mt: 4 }}>
            {error || 'Event not found'}
          </Alert>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="contained" onClick={() => router.push('/events')}>
              Back to Events
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }
  
  // Assuming event data is available
  return (
    <Layout>
      <Box 
        sx={{ 
          height: { xs: '200px', md: '300px' }, 
          width: '100%', 
          overflow: 'hidden', 
          position: 'relative',
          bgcolor: 'rgba(0,0,0,0.7)'
        }}
      >
        <Box 
          component="img"
          src={event.imageUrl} 
          alt={event.title}
          sx={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            opacity: 0.7
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            p: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth="lg">
            <Chip 
              label={event.category} 
              color="primary" 
              size="small" 
              sx={{ mb: 1, fontWeight: 'bold' }} 
            />
            <Typography variant="h4" component="h1" fontWeight="bold">
              {event.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ mr: 0.5, fontSize: 18 }} />
                <Typography variant="body2">
                  {format(parseISO(event.startDate), 'EEEE, MMMM d, yyyy')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                <Typography variant="body2">
                  {format(parseISO(event.startDate), 'h:mm a')} - {format(parseISO(event.endDate), 'h:mm a')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 0.5, fontSize: 18 }} />
                <Typography variant="body2">{event.location}</Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                About This Event
              </Typography>
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Event Details
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Date and Time" 
                    secondary={`${format(parseISO(event.startDate), 'EEEE, MMMM d, yyyy')} • ${format(parseISO(event.startDate), 'h:mm a')} - ${format(parseISO(event.endDate), 'h:mm a')}`} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Location" 
                    secondary={event.location} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Capacity" 
                    secondary={`${event.participants ? event.participants.length : 0} / ${event.participantLimit} volunteers registered`} 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Join This Event
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" paragraph fontWeight="medium">
                  {isCompleted ? "Event has concluded" : 
                   isUpcoming ? "Please select how you want to participate:" : 
                   "Event in progress:"}
                </Typography>
                
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    mb: 2, 
                    py: 1.5,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }}
                  onClick={isUpcoming ? () => router.push(`/events/${params.id}/participant-register`) : undefined}
                  disabled={isCompleted}
                >
                  {isUpcoming ? "Register as Participant" : 
                   isOngoing ? "Walk-in Registration Available" :
                   "Registration Closed"}
                </Button>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                  For those with disabilities who wish to participate in the event
                </Typography>
                
                <Button 
                  variant="contained" 
                  fullWidth
                  color="secondary"
                  sx={{ 
                    mb: 2, 
                    py: 1.5 
                  }}
                  onClick={handleRegisterClick}
                  disabled={isOngoing || isCompleted}
                >
                  {isUpcoming ? "Register as Volunteer" : "Registration Closed"}
                </Button>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                  For those who wish to help organize and support the event
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Event Feedback
                </Typography>

                <Button 
                  variant="outlined" 
                  fullWidth
                  sx={{ mb: 2, py: 1.5 }}
                  onClick={() => router.push(`/events/${params.id}/feedback`)}
                  disabled={isUpcoming}
                >
                  Provide Feedback
                </Button>
                
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  For participants and volunteers who have attended this event
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Certificate Dialog */}
      {event && (
        <VolunteerCertificate
          open={certificateDialogOpen}
          onClose={handleCloseCertificate}
          eventData={{
            title: event.title,
            startDate: event.startDate,
            endDate: event.endDate || event.startDate,
            location: event.location,
            organizerName: event.organizer || 'Samarthanam Trust',
            category: event.category || 'Community',
            id: params.id,
          }}
          userData={{
            name: 'John Doe', // Replace with actual user data in real app
            email: 'john.doe@example.com', // Replace with actual user data in real app
            volunteerHours: 4, // Replace with actual hours in real app
          }}
          certificateType={certificateType}
        />
      )}
    </Layout>
  );
};

export default EventDetailsPage; 