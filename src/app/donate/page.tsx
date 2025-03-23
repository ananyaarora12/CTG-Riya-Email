'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  FormControl, 
  FormControlLabel, 
  RadioGroup, 
  Radio, 
  InputLabel, 
  Select,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Chip
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SchoolIcon from '@mui/icons-material/School';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsIcon from '@mui/icons-material/Sports';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WorkIcon from '@mui/icons-material/Work';
import Layout from '../../components/layout/Layout';
import { THEME_COLORS } from '../../components/layout/Layout';

// Donation options
const donationOptions = [
  { 
    id: 'education', 
    title: 'Education Support', 
    description: 'Help provide education to children with disabilities',
    amounts: [1000, 2000, 5000, 10000, 20000],
    icon: <SchoolIcon sx={{ fontSize: 40, color: THEME_COLORS.orange }} />
  },
  { 
    id: 'livelihood', 
    title: 'Livelihood Program', 
    description: 'Support skills training and job placement for people with disabilities',
    amounts: [2000, 3800, 6000, 15000, 25000],
    icon: <WorkIcon sx={{ fontSize: 40, color: THEME_COLORS.orange }} />
  },
  { 
    id: 'arts', 
    title: 'Arts & Culture', 
    description: 'Support disabled artists in music and performing arts',
    amounts: [1000, 3000, 5000, 10000, 15000],
    icon: <MusicNoteIcon sx={{ fontSize: 40, color: THEME_COLORS.orange }} />
  },
  { 
    id: 'sports', 
    title: 'Sports Programs', 
    description: 'Help visually impaired and disabled athletes achieve their dreams',
    amounts: [2000, 4000, 8000, 12000, 20000],
    icon: <SportsIcon sx={{ fontSize: 40, color: THEME_COLORS.orange }} />
  },
  { 
    id: 'nutrition', 
    title: 'Nutrition & Meals', 
    description: 'Provide nutritious meals to children with disabilities',
    amounts: [1500, 4000, 6000, 17000, 30000],
    icon: <RestaurantIcon sx={{ fontSize: 40, color: THEME_COLORS.orange }} />
  },
];

export default function DonatePage() {
  const [selectedCategory, setSelectedCategory] = useState('education');
  const [donationAmount, setDonationAmount] = useState<number | string>(1000);
  const [customAmount, setCustomAmount] = useState<boolean>(false);
  const [donorType, setDonorType] = useState('individual');
  const [donationPurpose, setDonationPurpose] = useState('general');
  const [formData, setFormData] = useState({
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    panCard: '',
    message: '',
    dedicateName: '',
    organizationName: '',
    donationDate: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCustomAmount(false);
    // Set first default amount for the selected category
    const categoryData = donationOptions.find(option => option.id === category);
    if (categoryData) {
      setDonationAmount(categoryData.amounts[0]);
    }
  };

  const handleAmountChange = (amount: number | string) => {
    setDonationAmount(amount);
    setCustomAmount(false);
  };

  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDonationAmount(event.target.value);
  };

  const handleCustomAmountToggle = () => {
    setCustomAmount(true);
    setDonationAmount('');
  };

  const handleDonorTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDonorType((event.target as HTMLInputElement).value);
  };

  const handleDonationPurposeChange = (event: SelectChangeEvent) => {
    setDonationPurpose(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTitleChange = (event: SelectChangeEvent) => {
    setFormData({
      ...formData,
      title: event.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Form validation
    if (!formData.firstName || !formData.email || !formData.phone) {
      setError('Please fill all required fields');
      return;
    }
    
    // Ensure the donation date is the current date/time when submitted
    const donationPayload = {
      ...formData,
      donationDate: new Date().toISOString(),
      amount: donationAmount,
      category: selectedCategory,
      donorType: donorType,
      donationPurpose: donationPurpose
    };
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log the payload that would be sent to the server
      console.log('Donation payload:', donationPayload);
      
      // If donation was successful
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: 'Mr',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        panCard: '',
        message: '',
        dedicateName: '',
        organizationName: '',
        donationDate: new Date().toISOString(),
      });
      
    } catch (err) {
      setError('Failed to process donation. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  const getCurrentCategory = () => {
    return donationOptions.find(option => option.id === selectedCategory) || donationOptions[0];
  };

  const currentCategory = getCurrentCategory();

  return (
    <Layout>
      <Box
        sx={{
          backgroundImage: 'linear-gradient(135deg, rgba(252, 190, 97, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
          py: { xs: 6, md: 10 },
          borderBottom: `1px solid ${THEME_COLORS.offWhiteGrey}`
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={10} lg={8} textAlign="center">
              <Box mb={4} display="flex" justifyContent="center">
                <FavoriteIcon sx={{ fontSize: 48, color: THEME_COLORS.orange, mr: 2 }} />
              </Box>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" color={THEME_COLORS.offBlack}>
                Make a Donation
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Your contribution helps us empower people with disabilities through education, livelihood, 
                sports, arts & culture programs. All donations are tax-deductible under Section 80G.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ 
              p: 3, 
              height: '100%',
              border: `1px solid ${THEME_COLORS.offWhiteGrey}`,
              bgcolor: 'background.paper' 
            }}>
              <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color={THEME_COLORS.offBlack}>
                Choose a Category
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Select where you would like your donation to be directed
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                {donationOptions.map((option) => (
                  <Button
                    key={option.id}
                    fullWidth
                    size="large"
                    variant={selectedCategory === option.id ? "contained" : "outlined"}
                    startIcon={option.icon}
                    onClick={() => handleCategoryChange(option.id)}
                    sx={{
                      justifyContent: 'flex-start',
                      mb: 2,
                      py: 1.5,
                      color: selectedCategory === option.id ? 'white' : THEME_COLORS.offBlack,
                      bgcolor: selectedCategory === option.id ? THEME_COLORS.orange : 'transparent',
                      borderColor: THEME_COLORS.orange,
                      '&:hover': {
                        bgcolor: selectedCategory === option.id ? THEME_COLORS.orange : `${THEME_COLORS.orange}15`,
                      }
                    }}
                  >
                    {option.title}
                  </Button>
                ))}
              </Box>
              
              <Box sx={{ mt: 4, p: 2, bgcolor: `${THEME_COLORS.orange}10`, borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Your donation is eligible for tax exemption under Section 80G of the Income Tax Act.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ 
              p: 3, 
              border: `1px solid ${THEME_COLORS.offWhiteGrey}`,
              bgcolor: 'background.paper'
            }}>
              <form onSubmit={handleSubmit}>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color={THEME_COLORS.offBlack}>
                  {currentCategory.title}
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  {currentCategory.description}
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Select Amount
                  </Typography>
                  <Grid container spacing={2}>
                    {currentCategory.amounts.map((amount) => (
                      <Grid item key={amount}>
                        <Button
                          variant={donationAmount === amount && !customAmount ? "contained" : "outlined"}
                          onClick={() => handleAmountChange(amount)}
                          sx={{
                            color: donationAmount === amount && !customAmount ? 'white' : THEME_COLORS.offBlack,
                            bgcolor: donationAmount === amount && !customAmount ? THEME_COLORS.orange : 'transparent',
                            borderColor: THEME_COLORS.orange,
                            '&:hover': {
                              bgcolor: donationAmount === amount && !customAmount ? THEME_COLORS.orange : `${THEME_COLORS.orange}15`,
                            }
                          }}
                        >
                          ₹{amount.toLocaleString()}
                        </Button>
                      </Grid>
                    ))}
                    <Grid item>
                      <Button
                        variant={customAmount ? "contained" : "outlined"}
                        onClick={handleCustomAmountToggle}
                        sx={{
                          color: customAmount ? 'white' : THEME_COLORS.offBlack,
                          bgcolor: customAmount ? THEME_COLORS.orange : 'transparent',
                          borderColor: THEME_COLORS.orange,
                          '&:hover': {
                            bgcolor: customAmount ? THEME_COLORS.orange : `${THEME_COLORS.orange}15`,
                          }
                        }}
                      >
                        Custom
                      </Button>
                    </Grid>
                  </Grid>
                  
                  {customAmount && (
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Enter Amount (₹)"
                      type="number"
                      value={donationAmount}
                      onChange={handleCustomAmountChange}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                      }}
                    />
                  )}
                </Box>
                
                <Divider sx={{ my: 4 }} />
                
                <Typography variant="h6" gutterBottom>
                  Donor Type
                </Typography>
                <RadioGroup
                  row
                  name="donorType"
                  value={donorType}
                  onChange={handleDonorTypeChange}
                >
                  <FormControlLabel value="individual" control={<Radio />} label="Individual" />
                  <FormControlLabel value="organization" control={<Radio />} label="Organization" />
                </RadioGroup>
                
                {donorType === 'organization' && (
                  <TextField
                    required
                    margin="normal"
                    fullWidth
                    label="Organization Name"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                  />
                )}
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Donation Purpose
                  </Typography>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Purpose</InputLabel>
                    <Select
                      value={donationPurpose}
                      label="Purpose"
                      onChange={handleDonationPurposeChange}
                    >
                      <MenuItem value="general">General Donation</MenuItem>
                      <MenuItem value="memory">In Memory Of</MenuItem>
                      <MenuItem value="occasion">Occasion/Celebration</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {donationPurpose !== 'general' && (
                    <TextField
                      margin="normal"
                      fullWidth
                      label={donationPurpose === 'memory' ? "In Memory Of" : "For Occasion/Celebration"}
                      name="dedicateName"
                      value={formData.dedicateName}
                      onChange={handleInputChange}
                    />
                  )}
                </Box>
                
                <Divider sx={{ my: 4 }} />
                
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Title</InputLabel>
                      <Select
                        value={formData.title}
                        label="Title"
                        onChange={handleTitleChange}
                      >
                        <MenuItem value="Mr">Mr</MenuItem>
                        <MenuItem value="Mrs">Mrs</MenuItem>
                        <MenuItem value="Ms">Ms</MenuItem>
                        <MenuItem value="Dr">Dr</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      required
                      margin="normal"
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      margin="normal"
                      fullWidth
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      margin="normal"
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="PAN Card Number (for tax benefits)"
                      name="panCard"
                      value={formData.panCard}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Message (Optional)"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4, mb: 2 }}>
                  <Alert severity="info">
                    All donations are eligible for tax exemption under Section 80G of the Income Tax Act. A receipt will be sent to your email.
                  </Alert>
                </Box>
                
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Chip 
                    icon={<FavoriteIcon />} 
                    label={`Donating: ₹${Number(donationAmount).toLocaleString()}`} 
                    sx={{ 
                      mb: 3, 
                      fontSize: '1.1rem', 
                      py: 2,
                      px: 1,
                      backgroundColor: THEME_COLORS.offWhiteGrey
                    }} 
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading || !donationAmount}
                    sx={{
                      py: 2,
                      bgcolor: THEME_COLORS.orange,
                      '&:hover': {
                        bgcolor: THEME_COLORS.offBlack,
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Thank you for your generous donation! A confirmation has been sent to your email.
        </Alert>
      </Snackbar>
    </Layout>
  );
} 