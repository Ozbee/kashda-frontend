'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KashdaLogo from '@/components/common/KashdaLogo';
import { navLinks } from '@/content/landingContent';

export default function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('#') && href.length > 1) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navContent = (
    <>
      {navLinks.map((link) => (
        <Button
          key={link.label}
          component={link.href === '#' ? 'button' : 'a'}
          href={link.href === '#' ? undefined : link.href}
          onClick={() => handleNavClick(link.href)}
          sx={{
            color: 'text.primary',
            fontWeight: 500,
            '&:hover': { color: 'secondary.main', bgcolor: 'transparent' },
          }}
        >
          {link.label}
        </Button>
      ))}
    </>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, gap: 2 }}>
            <Box component={Link} href="/" sx={{ display: 'flex', mr: 'auto' }}>
              <KashdaLogo />
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flex: 1, justifyContent: 'center' }}>
              {navContent}
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
              <Button component={Link} href="/login" variant="outlined" color="inherit" size="small">
                Login
              </Button>
              <Button component={Link} href="/register" variant="contained" color="secondary" size="small">
                Sign Up
              </Button>
            </Box>

            <IconButton
              sx={{ display: { md: 'none' }, color: 'text.primary' }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{ paper: { sx: { width: 280, bgcolor: 'background.paper' } } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton onClick={() => handleNavClick(link.href)}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button component={Link} href="/login" variant="outlined" fullWidth onClick={() => setMobileOpen(false)}>
            Login
          </Button>
          <Button component={Link} href="/register" variant="contained" color="secondary" fullWidth onClick={() => setMobileOpen(false)}>
            Sign Up
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
