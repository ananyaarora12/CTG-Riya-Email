'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Divider,
  IconButton,
  Tabs,
  Tab,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SchoolIcon from '@mui/icons-material/School';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import BarChartIcon from '@mui/icons-material/BarChart';
import WorkIcon from '@mui/icons-material/Work';
import { sampleEvents } from './events/page';
import { THEME_COLORS } from '../components/layout/Layout';

// Color scheme constants
const COLORS = {
  primary: THEME_COLORS.orange,
  secondary: THEME_COLORS.offBlack,
  dark: THEME_COLORS.offBlack,
  light: THEME_COLORS.white,
  grey: THEME_COLORS.offWhiteGrey
};

// Progress data for volunteer initiatives
const progressData = [
  { 
    title: 'Education Support', 
    current: 12750, 
    goal: 15000, 
    percentage: 85, 
    color: COLORS.secondary,
    icon: <SchoolIcon sx={{ fontSize: 32, color: COLORS.secondary }} />
  },
  { 
    title: 'Skills Training', 
    current: 3400, 
    goal: 5000, 
    percentage: 68, 
    color: COLORS.primary,
    icon: <WorkIcon sx={{ fontSize: 32, color: COLORS.primary }} />
  },
  { 
    title: 'Community Events', 
    current: 360, 
    goal: 500, 
    percentage: 72, 
    color: COLORS.secondary,
    icon: <CalendarMonthIcon sx={{ fontSize: 32, color: COLORS.secondary }} />
  },
  { 
    title: 'Job Placements', 
    current: 2325, 
    goal: 2500, 
    percentage: 93, 
    color: COLORS.primary,
    icon: <WorkIcon sx={{ fontSize: 32, color: COLORS.primary }} />
  },
];

// Hero carousel images
const heroImages = [
  {
    url: '/images/education.jpg',
    title: 'Education for the Disabled',
    subtitle: 'Providing equal education opportunities to people with disabilities',
  },
  {
    url: '/images/sports.jpg',
    title: 'Blind Cricket Initiative',
    subtitle: 'Promoting sports as a rightful pursuit for people with disabilities',
  },
  {
    url: '/images/arts.jpg',
    title: 'Arts & Culture Programs',
    subtitle: 'Supporting disabled artists in music and performing arts',
  }
];

// Impact statistics
const impactStats = [
  { value: 15000, label: 'Lives Impacted', icon: <GroupsIcon sx={{ fontSize: 40, color: COLORS.secondary }} /> },
  { value: 350, label: 'Events Completed', icon: <CalendarMonthIcon sx={{ fontSize: 40, color: COLORS.primary }} /> },
  { value: 750, label: 'Active Volunteers', icon: <VolunteerActivismIcon sx={{ fontSize: 40, color: COLORS.secondary }} /> },
  { value: 45000, label: 'Volunteer Hours', icon: <AccessibilityNewIcon sx={{ fontSize: 40, color: COLORS.primary }} /> },
];

// Initiative areas
const initiatives = [
  { 
    title: 'Education', 
    icon: <SchoolIcon sx={{ fontSize: 60, color: COLORS.primary }} />,
    description: 'Supporting accessible education for visually impaired students through teaching assistance and resource development.',
    image: '/images/education.jpg'
  },
  { 
    title: 'Livelihood', 
    icon: <WorkIcon sx={{ fontSize: 60, color: COLORS.secondary }} />,
    description: 'Creating job opportunities and skill development programs to enhance employability and independence.',
    image: '/images/livelihood.jpg'
  },
  { 
    title: 'Sports', 
    icon: <GroupsIcon sx={{ fontSize: 60, color: COLORS.primary }} />,
    description: 'Establishing cricket for the blind and other sports activities to build confidence and abilities.',
    image: '/images/sports.jpg'
  },
  { 
    title: 'Arts & Culture', 
    icon: <BarChartIcon sx={{ fontSize: 60, color: COLORS.secondary }} />,
    description: 'Supporting artists with disabilities who excel in Indian classical, folk dance and music.',
    image: '/images/arts.jpg'
  },
];

// Testimonials
const testimonials = [
  {
    quote: "I believe in building a society where people with disabilities are potential tax-payers but not dole recipients.",
    name: "Dr. Mahantesh G Kivadasannavar",
    role: "Founder Chairman – Samarthanam International",
    avatar: "/images/founder.jpg"
  },
  {
    quote: "Samarthanam has provided me opportunities to gain new skills that have transformed my life. I'm now more confident and independent.",
    name: "Sai Prasanna",
    role: "Program Beneficiary",
    avatar: "/images/education.jpg"
  },
  {
    quote: "As a volunteer, working with Samarthanam's blind cricket initiative has been an incredible experience. Sport truly empowers people with disabilities.",
    name: "Bhavani Kedia",
    role: "Volunteer",
    avatar: "/images/sports.jpg"
  }
];

// Animation for counting up numbers
interface CountUpAnimationProps {
  end: number;
  duration?: number;
}

const CountUpAnimation = ({ end, duration = 2000 }: CountUpAnimationProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  
  return <>{count.toLocaleString()}</>;
};

// Helper function to get featured events based on tab
const getFeaturedEvents = (tab: number) => {
  // Filter events based on tab
  switch(tab) {
    case 0: // Upcoming
      return sampleEvents.filter(event => event.status === 'upcoming').slice(0, 1);
    case 1: // Trending
      // For trending, we'll use events with high participation rates
      return sampleEvents
        .filter(event => event.currentParticipants / event.participantsLimit > 0.7)
        .slice(0, 1);
    case 2: // New
      // For new events, we'll use the most recent upcoming events
      return sampleEvents
        .filter(event => event.status === 'upcoming')
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        .slice(0, 1);
    default:
      return [sampleEvents[0]];
  }
};

export default function HomePage() {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNextSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
  };

  const handlePrevSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentHeroSlide]);

  return (
    <Layout>
      {/* Hero Carousel Section */}
      <Box 
        sx={{ 
          position: 'relative',
          height: { xs: '60vh', md: '80vh' },
          overflow: 'hidden',
        }}
      >
        {heroImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: currentHeroSlide === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: COLORS.light,
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <Container maxWidth="md">
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                }}
              >
                {image.title}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  maxWidth: '800px',
                  mx: 'auto',
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                {image.subtitle}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/events"
                  sx={{
                    bgcolor: COLORS.primary,
                    '&:hover': {
                      bgcolor: COLORS.secondary,
                    },
                    px: 4,
                    py: 1.5,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  }}
                >
                  Volunteer Now
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/donate"
                  sx={{
                    bgcolor: COLORS.light,
                    color: COLORS.primary,
                    '&:hover': {
                      bgcolor: COLORS.primary,
                      color: COLORS.light,
                    },
                    px: 4,
                    py: 1.5,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontWeight: 'bold',
                  }}
                >
                  Donate
                </Button>
              </Box>
            </Container>
          </Box>
        ))}
        
        {/* Carousel navigation buttons */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 20, 
            left: 0, 
            right: 0, 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2 
          }}
        >
          {heroImages.map((_, index) => (
            <Box 
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: currentHeroSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </Box>
        
        <IconButton 
          sx={{ 
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.2)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
            display: { xs: 'none', md: 'flex' }
          }}
          onClick={handlePrevSlide}
        >
          <NavigateBeforeIcon fontSize="large" />
        </IconButton>
        
        <IconButton 
          sx={{ 
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.2)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
            display: { xs: 'none', md: 'flex' }
          }}
          onClick={handleNextSlide}
        >
          <NavigateNextIcon fontSize="large" />
        </IconButton>
      </Box>
      
      {/* Impact Statistics Section - Floating Design */}
      <Box 
        sx={{ 
          py: 10, 
          position: 'relative',
          overflow: 'hidden',
          background: COLORS.grey,
        }}
      >
        {/* Background decoration elements */}
        <Box sx={{ 
          position: 'absolute', 
          width: '300px', 
          height: '300px', 
          borderRadius: '50%', 
          background: `radial-gradient(circle, ${COLORS.secondary}14 0%, ${COLORS.secondary}00 70%)`,
          top: '-100px',
          left: '-100px',
          zIndex: 0
        }} />
        
        <Box sx={{ 
          position: 'absolute', 
          width: '200px', 
          height: '200px', 
          borderRadius: '50%', 
          background: `radial-gradient(circle, ${COLORS.primary}14 0%, ${COLORS.primary}00 70%)`,
          bottom: '50px',
          right: '10%',
          zIndex: 0
        }} />
        
        <Container 
          maxWidth="lg" 
          sx={{ 
            position: 'relative', 
            zIndex: 1,
            px: { xs: 2, md: 3 }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: { xs: 3, md: 0 },
            justifyContent: 'center',
            alignItems: 'center',
            transform: 'translateY(20px)'
          }}>
            {impactStats.map((stat, index) => (
              <Box 
                key={index} 
                sx={{
                  width: { xs: '45%', sm: '45%', md: '22%' },
                  position: 'relative',
                  transform: { 
                    xs: 'none', 
                    md: `translateY(${index % 2 === 0 ? '-20px' : '20px'})` 
                  },
                  zIndex: 2,
                  transition: 'transform 0.4s ease',
                  '&:hover': {
                    transform: { 
                      xs: 'translateY(-10px)', 
                      md: `translateY(${index % 2 === 0 ? '-30px' : '10px'})` 
                    },
                  },
                }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 3,
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: index % 2 === 0 ? COLORS.secondary : COLORS.primary,
                    }
                  }}
                >
                  <Box sx={{ 
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60px'
                  }}>
                    {React.cloneElement(stat.icon, { 
                      sx: { 
                        fontSize: 50,
                        color: index % 2 === 0 ? COLORS.secondary : COLORS.primary 
                      } 
                    })}
                  </Box>
                  
                  <Typography
                    variant="h3"
                    component="p"
                    sx={{ 
                      fontWeight: 800,
                      lineHeight: 1.1,
                      mb: 1,
                      color: index % 2 === 0 ? COLORS.secondary : COLORS.primary,
                      fontSize: { xs: '2.5rem', md: '3rem' }
                    }}
                  >
                    <CountUpAnimation end={stat.value} />+
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      color: COLORS.dark,
                      fontSize: '1.1rem'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      
      {/* Initiatives Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ position: 'relative', mb: 4, display: 'inline-block', mx: 'auto', width: '100%', textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{ 
              mb: 1,
              fontWeight: 'bold',
              color: COLORS.secondary
            }}
          >
            Our Initiatives
          </Typography>
          <Box 
            sx={{ 
              width: '60px', 
              height: '4px', 
              backgroundColor: COLORS.primary,
              mx: 'auto',
              mb: 3
            }}
          />
        </Box>
        
        <Typography
          variant="h6"
          component="p"
          align="center"
          color={COLORS.dark}
          sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
        >
          Focused on creating meaningful impact through these key areas
        </Typography>
        
        <Grid container spacing={3}>
          {initiatives.map((initiative, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box 
                  sx={{ 
                    height: '120px', 
                    backgroundColor: index % 2 === 0 ? COLORS.secondary : COLORS.primary,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white'
                  }}
                >
                  {initiative.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1, color: COLORS.dark }}>
                    {initiative.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {initiative.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Featured Events Section with minimalist design */}
      <Box 
        sx={{ 
          py: 8,
          background: COLORS.dark,
          color: COLORS.light,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{ 
              mb: 2,
              fontWeight: 'bold',
              color: COLORS.light,
            }}
          >
            Featured Events
          </Typography>
          
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ 
              mb: 4,
              '& .MuiTabs-indicator': {
                backgroundColor: COLORS.primary,
                height: 3,
              },
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                '&.Mui-selected': {
                  color: COLORS.light,
                },
              },
            }}
          >
            <Tab label="Upcoming" />
            <Tab label="Trending" />
            <Tab label="New" />
          </Tabs>
          
          {/* Single large featured event based on active tab */}
          {getFeaturedEvents(activeTab).map((event) => (
            <Card 
              key={event.id}
              sx={{ 
                bgcolor: '#1a1a1a',
                color: COLORS.light,
                borderRadius: 4,
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
                mb: 5,
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <CardActionArea component={Link} href={`/events/${event.id}`}>
                <div style={{ height: '500px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={event.image}
                    alt={event.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      filter: 'brightness(0.7)'
                    }}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 4,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8) 70%)'
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      component="h3"
                      sx={{ 
                        color: COLORS.light, 
                        fontWeight: 'bold',
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      {event.title}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 1
                    }}>
                      <Typography 
                        sx={{ 
                          color: COLORS.secondary, 
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        }}
                      >
                        {new Date(event.startDate).toLocaleDateString()}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: COLORS.light,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          px: 2,
                          py: 0.5,
                          borderRadius: 10,
                          fontWeight: 'medium'
                        }}
                      >
                        {event.participantsLimit - event.currentParticipants} spots left
                      </Typography>
                    </Box>
                  </Box>
                </div>
              </CardActionArea>
            </Card>
          ))}
          
          <Box sx={{ textAlign: 'center' }}>
            <Button 
              variant="outlined" 
              component={Link}
              href="/events"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                borderColor: COLORS.primary,
                color: COLORS.light, 
                borderWidth: 2,
                px: 4,
                py: 1.5,
                borderRadius: 8,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: COLORS.primary,
                  backgroundColor: `${COLORS.primary}33`,
                  borderWidth: 2,
                },
              }}
            >
              Explore All Events
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Volunteer Progress Chart */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ position: 'relative', mb: 4, display: 'inline-block', mx: 'auto', width: '100%', textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{ 
              mb: 1,
              fontWeight: 'bold',
              color: COLORS.secondary
            }}
          >
            Volunteer Progress
          </Typography>
          <Box 
            sx={{ 
              width: '60px', 
              height: '4px', 
              backgroundColor: COLORS.primary,
              mx: 'auto',
              mb: 3
            }}
          />
        </Box>
        
        <Typography
          variant="h6"
          component="p"
          align="center"
          color={COLORS.dark}
          sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
        >
          Track our collective impact across key initiatives
        </Typography>
        
        <Box sx={{ 
          background: COLORS.light,
          borderRadius: 3, 
          p: 3,
          boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
        }}>
          <Grid container spacing={3}>
            {progressData.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%',
                  p: 2,
                  backgroundColor: COLORS.light,
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  },
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {item.icon}
                    <Typography variant="h6" fontWeight="bold" sx={{ ml: 1, color: COLORS.dark }}>
                      {item.title}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    position: 'relative', 
                    width: '100%',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      width: '70%',
                      height: `${Math.max(item.percentage, 5)}%`,
                      borderRadius: '8px 8px 0 0',
                      background: `linear-gradient(180deg, ${item.color}BB 0%, ${item.color} 100%)`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      pt: 1,
                      boxShadow: `0 4px 12px ${item.color}40`,
                      '&:hover': {
                        height: `${Math.min(item.percentage + 3, 100)}%`,
                        background: `linear-gradient(180deg, ${item.color} 0%, ${item.color} 100%)`,
                      },
                      transition: 'height 0.3s ease, background 0.3s ease',
                    }}>
                      <Typography variant="h5" sx={{ color: COLORS.light, fontWeight: 'bold' }}>
                        {item.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', mt: 'auto' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      {item.current.toLocaleString()} / {item.goal.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: item.color }}>
                      {item.current > 0 ? `${Math.round((item.current / item.goal) * 100)}% Complete` : 'Not Started'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
}
