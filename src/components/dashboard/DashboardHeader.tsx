'use client';

import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoutIcon from '@mui/icons-material/Logout';
import KashdaLogo from '@/components/common/KashdaLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';

export default function DashboardHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { toggleMobile, toggleCollapsed, isCollapsed } = useSidebar();

  const initial = user?.name?.charAt(0).toUpperCase() ?? 'U';

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        background: 'linear-gradient(to right, #3a005f, #2a004a)',
        borderBottom: '1px solid #4a007a',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
          opacity: 0.4,
        },
      }}
    >
      <Toolbar sx={{ gap: 2, px: { xs: 2, sm: 3 }, minHeight: { xs: 64, sm: 72 } }}>
        <IconButton
          edge="start"
          onClick={toggleMobile}
          sx={{ display: { md: 'none' } }}
          aria-label="Open menu"
        >
          <MenuIcon />
        </IconButton>

        <IconButton
          onClick={toggleCollapsed}
          sx={{ display: { xs: 'none', md: 'flex' } }}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>

        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          <KashdaLogo width={100} height={28} />
        </Box>

        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            bgcolor: 'background.default',
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            px: 2,
            py: 0.75,
            flex: 1,
            maxWidth: 420,
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <InputBase placeholder="Search..." sx={{ flex: 1, fontSize: '0.95rem' }} />
        </Box>

        <Box sx={{ flexGrow: 1, display: { sm: 'none' } }} />

        <Typography
          variant="h6"
          color="secondary.main"
          sx={{ fontWeight: 700, display: { xs: 'none', md: 'block' } }}
        >
          KASHDA
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />

        <IconButton aria-label="Notifications" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
          <NotificationsNoneIcon />
        </IconButton>

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {user?.name ?? 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.phoneNumber ?? ''}
          </Typography>
        </Box>

        <IconButton
          onClick={handleLogout}
          aria-label="Logout"
          sx={{
            display: { xs: 'inline-flex', md: 'none' },
            color: 'secondary.main',
          }}
        >
          <LogoutIcon />
        </IconButton>

        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            border: 2,
            borderColor: 'secondary.main',
            fontWeight: 700,
          }}
        >
          {initial}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
