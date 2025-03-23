'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { THEME_COLORS } from './Layout';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/events' },
  { name: 'Calendar', path: '/calendar' },
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Donate', path: '/donate' },
];

const Header = () => {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const isOrganizer = user?.role === 'organizer' || user?.role === 'admin';
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    handleUserMenuClose();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
        <img 
          src="/images/samarthanam-logo.png" 
          alt="Samarthanam Logo" 
          style={{ width: '180px', height: '60px', objectFit: 'contain' }}
        />
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              selected={pathname === item.path}
              sx={{
                textAlign: 'center',
                color: pathname === item.path ? THEME_COLORS.orange : THEME_COLORS.offBlack,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: THEME_COLORS.orange,
                  backgroundColor: `${THEME_COLORS.offWhiteGrey}`,
                },
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {isAuthenticated ? (
          <>
            {isOrganizer && (
              <ListItem disablePadding>
                <ListItemButton 
                  component={Link} 
                  href="/events/create"
                  sx={{ 
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: THEME_COLORS.orange,
                      backgroundColor: `${THEME_COLORS.offWhiteGrey}`,
                    },
                  }}
                >
                  <ListItemText primary="Create Event" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href="/profile"
                sx={{ 
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: THEME_COLORS.orange,
                    backgroundColor: `${THEME_COLORS.offWhiteGrey}`,
                  },
                }}
              >
                <ListItemText primary="My Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={handleLogout}
                sx={{ 
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: THEME_COLORS.orange,
                    backgroundColor: `${THEME_COLORS.offWhiteGrey}`,
                  },
                }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              href="/login"
              sx={{ 
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: THEME_COLORS.orange,
                  backgroundColor: `${THEME_COLORS.offWhiteGrey}`,
                },
              }}
            >
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="sticky" elevation={1} sx={{ 
        backgroundColor: THEME_COLORS.white, 
        color: THEME_COLORS.offBlack,
        borderBottom: `1px solid ${THEME_COLORS.offWhiteGrey}`
      }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' }, color: THEME_COLORS.offBlack }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src="/images/samarthanam-logo.png" 
                    alt="Samarthanam Logo" 
                    style={{ width: '140px', height: '50px', objectFit: 'contain' }}
                  />
                </Link>
              </Box>
              
              <Typography
                variant="h6"
                noWrap
                component={Link}
                href="/"
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  fontWeight: 700,
                  color: THEME_COLORS.offBlack,
                  textDecoration: 'none',
                }}
              >
                SAMARTHANAM
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                {navItems.map((item) => (
                  <Button 
                    key={item.name} 
                    component={Link}
                    href={item.path}
                    sx={{ 
                      color: THEME_COLORS.offBlack,
                      mx: 1,
                      position: 'relative',
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: THEME_COLORS.orange,
                        backgroundColor: 'transparent',
                      },
                      '&::after': pathname === item.path ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '50%',
                        height: '2px',
                        backgroundColor: THEME_COLORS.orange,
                      } : {}
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
                
                {isAuthenticated && isOrganizer && (
                  <Button 
                    component={Link}
                    href="/events/create"
                    sx={{ 
                      color: THEME_COLORS.white,
                      backgroundColor: THEME_COLORS.orange,
                      mx: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: THEME_COLORS.offBlack,
                        color: THEME_COLORS.orange,
                      }
                    }}
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    Create Event
                  </Button>
                )}
                
                {!isAuthenticated && (
                  <Button 
                    component={Link}
                    href="/login"
                    variant="contained"
                    sx={{ 
                      backgroundColor: THEME_COLORS.offBlack,
                      color: THEME_COLORS.orange,
                      ml: 2,
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: THEME_COLORS.orange,
                        color: THEME_COLORS.white,
                      }
                    }}
                  >
                    Login
                  </Button>
                )}

                {isAuthenticated && (
                  <Button 
                    component={Link}
                    href="/profile"
                    variant="outlined"
                    sx={{ 
                      borderColor: THEME_COLORS.orange,
                      color: THEME_COLORS.orange,
                      ml: 2,
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: THEME_COLORS.orange,
                        color: THEME_COLORS.white,
                        borderColor: THEME_COLORS.orange,
                      }
                    }}
                  >
                    My Profile
                  </Button>
                )}
              </Box>
              
              {isAuthenticated ? (
                <>
                  <Menu
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={false}
                  >
                    <MenuItem 
                      component={Link} 
                      href="/profile" 
                      onClick={handleUserMenuClose}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: THEME_COLORS.orange,
                          backgroundColor: THEME_COLORS.offWhiteGrey,
                        }
                      }}
                    >
                      My Profile
                    </MenuItem>
                    {isOrganizer && (
                      <MenuItem 
                        component={Link} 
                        href="/events/create" 
                        onClick={handleUserMenuClose}
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: THEME_COLORS.orange,
                            backgroundColor: THEME_COLORS.offWhiteGrey,
                          }
                        }}
                      >
                        Create Event
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: THEME_COLORS.orange,
                          backgroundColor: THEME_COLORS.offWhiteGrey,
                        }
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : null}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Header; 