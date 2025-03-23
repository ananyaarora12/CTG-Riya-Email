'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Alert,
  Divider,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format, parseISO } from 'date-fns';
import confetti from 'canvas-confetti';
import Layout from '../../../../components/layout/Layout';
import { sampleEvents } from '../../page';
import { RootState } from '../../../../redux/store';

interface ParticipantFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  disabilityType: string;
  accessibilityNeeds: string;
  dietaryRestrictions: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  needsAssistance: boolean;
  assistanceDetails: string;
  attendingWith: string;
  medicalConditions: string;
  heardAboutEvent: string;
  agreedToTerms: boolean;
}

const ParticipantRegistrationPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [activeStep, setActiveStep] = useState(0);
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState<ParticipantFormData>({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    disabilityType: '',
    accessibilityNeeds: '',
    dietaryRestrictions: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    needsAssistance: false,
    assistanceDetails: '',
    attendingWith: '',
    medicalConditions: '',
    heardAboutEvent: '',
    agreedToTerms: false,
  });
  
  // Steps in the registration process
  const steps = ['Personal Information', 'Accessibility Needs', 'Additional Details', 'Review & Confirm'];
  
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
            setEvent(foundEvent);
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    if (!name) return;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const validateStep = (step: number): boolean => {
    let isValid = true;
    let errorMessage = '';
    
    switch (step) {
      case 0: // Personal Information
        if (!formData.firstName.trim()) {
          errorMessage = 'First name is required';
          isValid = false;
        } else if (!formData.lastName.trim()) {
          errorMessage = 'Last name is required';
          isValid = false;
        } else if (!formData.email.trim()) {
          errorMessage = 'Email is required';
          isValid = false;
        } else if (!formData.phone.trim()) {
          errorMessage = 'Phone number is required';
          isValid = false;
        } else if (!formData.dateOfBirth.trim()) {
          errorMessage = 'Date of birth is required';
          isValid = false;
        }
        break;
        
      case 1: // Accessibility Needs
        if (!formData.disabilityType.trim()) {
          errorMessage = 'Disability type is required';
          isValid = false;
        }
        break;
        
      case 2: // Additional Details
        if (!formData.emergencyContactName.trim()) {
          errorMessage = 'Emergency contact name is required';
          isValid = false;
        } else if (!formData.emergencyContactPhone.trim()) {
          errorMessage = 'Emergency contact phone is required';
          isValid = false;
        }
        break;
        
      case 3: // Review & Confirm
        if (!formData.agreedToTerms) {
          errorMessage = 'You must agree to the terms and conditions';
          isValid = false;
        }
        break;
    }
    
    if (!isValid) {
      setError(errorMessage);
    } else {
      setError(null);
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate an API call to register for the event
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success! Show confetti 🎉
      const end = Date.now() + 1000;
      
      // Create confetti celebration
      const runConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#005CA9', '#E63E11', '#FFC107', '#FFFFFF', '#4CAF50'],
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(runConfetti);
        }
      };
      
      runConfetti();
      
      setRegistrationSuccess(true);
      setLoading(false);
      
    } catch (err) {
      setError('Failed to complete registration. Please try again.');
      setLoading(false);
    }
  };
  
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText="Format: MM/DD/YYYY"
                />
              </Grid>
            </Grid>
          </Box>
        );
        
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Accessibility Needs
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Type of Disability</InputLabel>
                  <Select
                    name="disabilityType"
                    value={formData.disabilityType}
                    onChange={handleInputChange}
                    label="Type of Disability"
                  >
                    <MenuItem value="visual">Visual Impairment</MenuItem>
                    <MenuItem value="hearing">Hearing Impairment</MenuItem>
                    <MenuItem value="physical">Physical Disability</MenuItem>
                    <MenuItem value="cognitive">Cognitive Disability</MenuItem>
                    <MenuItem value="multiple">Multiple Disabilities</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="accessibilityNeeds"
                  label="Accessibility Accommodations Needed"
                  value={formData.accessibilityNeeds}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  placeholder="Please specify any accessibility accommodations you need (e.g., braille materials, sign language interpreter, wheelchair access)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="dietaryRestrictions"
                  label="Dietary Restrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  placeholder="Any food allergies or dietary requirements"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="needsAssistance"
                      checked={formData.needsAssistance}
                      onChange={handleInputChange}
                    />
                  }
                  label="I will need assistance during the event"
                />
              </Grid>
              {formData.needsAssistance && (
                <Grid item xs={12}>
                  <TextField
                    name="assistanceDetails"
                    label="Assistance Details"
                    value={formData.assistanceDetails}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={2}
                    margin="normal"
                    placeholder="Please specify what type of assistance you will need"
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        );
        
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Additional Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="attendingWith"
                  label="Are you attending with a caregiver or companion?"
                  value={formData.attendingWith}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  placeholder="If yes, please provide their name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="medicalConditions"
                  label="Medical Conditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={2}
                  margin="normal"
                  placeholder="Please list any medical conditions that event staff should be aware of"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="emergencyContactName"
                  label="Emergency Contact Name"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="emergencyContactPhone"
                  label="Emergency Contact Phone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="heardAboutEvent"
                  label="How did you hear about this event?"
                  value={formData.heardAboutEvent}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  select
                >
                  <MenuItem value="website">Samarthanam Website</MenuItem>
                  <MenuItem value="social">Social Media</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="friend">Friend/Family</MenuItem>
                  <MenuItem value="organization">Another Organization</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        );
        
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review & Confirm
            </Typography>
            
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">First Name</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formData.firstName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Last Name</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formData.lastName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formData.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Phone</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formData.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Date of Birth</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formData.dateOfBirth || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Disability Type</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formData.disabilityType}</Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Accessibility Needs
              </Typography>
              <Typography variant="body1" paragraph>
                {formData.accessibilityNeeds || 'None specified'}
              </Typography>
              
              <Typography variant="subtitle2">Needs Assistance</Typography>
              <Typography variant="body1" paragraph>
                {formData.needsAssistance ? 'Yes' : 'No'}
                {formData.needsAssistance && formData.assistanceDetails && ` - ${formData.assistanceDetails}`}
              </Typography>
              
              <Typography variant="subtitle2">Dietary Restrictions</Typography>
              <Typography variant="body1" paragraph>
                {formData.dietaryRestrictions || 'None specified'}
              </Typography>
              
              <Typography variant="subtitle2">Attending With</Typography>
              <Typography variant="body1" paragraph>
                {formData.attendingWith || 'Attending alone'}
              </Typography>
              
              <Typography variant="subtitle2">Emergency Contact</Typography>
              <Typography variant="body1" paragraph>
                {formData.emergencyContactName} ({formData.emergencyContactPhone})
              </Typography>
            </Paper>
            
            <FormControlLabel
              control={
                <Checkbox
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  required
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the event terms and conditions and understand that my information will be used only for 
                  the purpose of this event. Samarthanam will contact me with necessary event details and accommodations.
                </Typography>
              }
            />
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  if (loading && !registrationSuccess) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }
  
  if (error && !registrationSuccess) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="contained" onClick={() => router.push(`/events/${params.id}`)}>
              Back to Event
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }
  
  if (registrationSuccess) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Registration Complete!
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
              You have successfully registered as a participant for this event.
            </Typography>
            <Typography variant="body1" paragraph>
              Thank you for registering! We will contact you soon with further details about the event.
              We look forward to having you with us.
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              A confirmation email has been sent to <strong>{formData.email}</strong>.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={() => router.push('/events')}
                sx={{ mr: 2 }}
              >
                Explore More Events
              </Button>
              <Button 
                variant="outlined"
                size="large"
                onClick={() => router.push(`/events/${params.id}`)}
              >
                Back to Event
              </Button>
            </Box>
          </Paper>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
            Participant Registration
          </Typography>
          {event && (
            <Typography variant="h6" gutterBottom align="center" sx={{ mb: 4 }}>
              {event.title}
            </Typography>
          )}
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Box>
                <Button
                  variant="contained"
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                  disabled={loading}
                >
                  {activeStep === steps.length - 1 ? 'Complete Registration' : 'Next'}
                </Button>
                {loading && activeStep === steps.length - 1 && (
                  <CircularProgress size={24} sx={{ ml: 2 }} />
                )}
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ParticipantRegistrationPage; 