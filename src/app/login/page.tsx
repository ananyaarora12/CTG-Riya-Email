'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, Google, Facebook } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';

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
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Additional fields for volunteer
  const [skills, setSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState('');
  const [bio, setBio] = useState('');
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
    setRegisterSuccess(false);
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simplify login - accept any credentials
      dispatch(login({
        uid: '123456',
        email,
        displayName: name || email.split('@')[0], // Use name if provided, otherwise part of email
        role: isAdmin ? 'admin' : 'user',
        photoURL: '' // Remove avatar generation
      }));
      
      // Always redirect to profile page
      router.push('/profile');
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // For demo purposes, we're just simulating registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call your registration API here
      // const response = await registerUser(name, email, password, {
      //   role: 'volunteer',
      //   skills,
      //   availability,
      //   bio
      // });
      
      // If registration is successful, show success message
      setRegisterSuccess(true);
      setSkills([]);
      setAvailability('');
      setBio('');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = () => {
    // In a real app, you would implement OAuth login with Google
    console.log('Google login');
  };
  
  const handleFacebookLogin = () => {
    // In a real app, you would implement OAuth login with Facebook
    console.log('Facebook login');
  };
  
  return (
    <Layout>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          
          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {registerSuccess && tabValue === 1 && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Registration successful! Please check your email to verify your account.
              </Alert>
            )}
            
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h5" component="h1" gutterBottom align="center">
                Welcome Back
              </Typography>
              
              <form onSubmit={handleLogin}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
                />
                
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
                  <FormLabel component="legend">Login Type</FormLabel>
                  <RadioGroup
                    row
                    value={isAdmin ? 'admin' : 'volunteer'}
                    onChange={(e) => setIsAdmin(e.target.value === 'admin')}
                  >
                    <FormControlLabel value="volunteer" control={<Radio />} label="Volunteer" />
                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                  </RadioGroup>
                </FormControl>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <MuiLink component="button" variant="body2" onClick={() => {}}>
                    Forgot password?
                  </MuiLink>
                </Box>
              </form>
              
              <Divider sx={{ my: 3 }}>OR</Divider>
              
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
                sx={{ mb: 2 }}
              >
                Continue with Google
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<Facebook />}
                onClick={handleFacebookLogin}
              >
                Continue with Facebook
              </Button>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h5" component="h1" gutterBottom align="center">
                Volunteer Registration
              </Typography>
              
              <form onSubmit={handleRegister}>
                <TextField
                  label="Full Name"
                  type="text"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Volunteer Information
                  </Typography>
                </Divider>
                
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="skills-label">Select Skills</InputLabel>
                  <Select
                    labelId="skills-label"
                    multiple
                    value={skills}
                    onChange={(e) => setSkills(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
                    label="Select Skills"
                    renderValue={(selected) => (selected as string[]).join(', ')}
                  >
                    <MenuItem value="teaching">Teaching</MenuItem>
                    <MenuItem value="event_planning">Event Planning</MenuItem>
                    <MenuItem value="first_aid">First Aid</MenuItem>
                    <MenuItem value="fundraising">Fundraising</MenuItem>
                    <MenuItem value="translation">Translation</MenuItem>
                    <MenuItem value="tech_support">Tech Support</MenuItem>
                    <MenuItem value="counseling">Counseling</MenuItem>
                    <MenuItem value="photography">Photography</MenuItem>
                  </Select>
                  <FormHelperText>Select the skills you can offer</FormHelperText>
                </FormControl>
                
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="availability-label">Availability</InputLabel>
                  <Select
                    labelId="availability-label"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    label="Availability"
                  >
                    <MenuItem value="weekends">Weekends Only</MenuItem>
                    <MenuItem value="weekdays">Weekdays Only</MenuItem>
                    <MenuItem value="evenings">Evenings Only</MenuItem>
                    <MenuItem value="flexible">Flexible</MenuItem>
                  </Select>
                  <FormHelperText>When are you available to volunteer?</FormHelperText>
                </FormControl>
                
                <TextField
                  label="Short Bio"
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a little about yourself and why you want to volunteer"
                />
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
                  By registering, you agree to our{' '}
                  <MuiLink component={Link} href="/terms">
                    Terms of Service
                  </MuiLink>{' '}
                  and{' '}
                  <MuiLink component={Link} href="/privacy">
                    Privacy Policy
                  </MuiLink>
                </Typography>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? 'Creating account...' : 'Register as Volunteer'}
                </Button>
              </form>
              
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<Google />}
                  onClick={handleGoogleLogin}
                >
                  Continue with Google
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<Facebook />}
                  onClick={handleFacebookLogin}
                >
                  Continue with Facebook
                </Button>
              </Box>
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
} 