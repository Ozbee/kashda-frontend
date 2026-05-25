'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CloseIcon from '@mui/icons-material/Close';
import KashdaLogo from '@/components/common/KashdaLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { navItems, logoutNavItem } from '@/theme/navConfig';
import { DRAWER_COLLAPSED_WIDTH, DRAWER_WIDTH } from '@/theme/kashdaTheme';

interface SidePanelProps {
  activeTab?: string;
}

function DrawerContent({
  activeTab,
  collapsed,
  onNavigate,
}: {
  activeTab: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const LogoutIcon = logoutNavItem.icon;

  const handleLogout = async () => {
    onNavigate?.();
    await logout();
    router.push('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box
        sx={{
          p: collapsed ? 1.5 : 3,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: 72,
        }}
      >
        {!collapsed ? (
          <KashdaLogo width={120} height={32} />
        ) : (
          <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 700 }}>
            K
          </Typography>
        )}
        {onNavigate && (
          <IconButton onClick={onNavigate} sx={{ display: { md: 'none' } }} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <List sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 1, py: 2 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={onNavigate}
                selected={active}
                sx={{
                  borderRadius: 2,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1 : 2,
                  position: 'relative',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'secondary.main',
                    borderLeft: collapsed ? 'none' : '3px solid',
                    borderLeftColor: 'secondary.main',
                    '& .MuiListItemIcon-root': { color: 'secondary.main' },
                    '&:hover': { bgcolor: 'primary.light' },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 40,
                    justifyContent: 'center',
                    color: active ? 'secondary.main' : 'text.primary',
                  }}
                >
                  <Icon />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: { fontWeight: active ? 600 : 400, fontSize: '0.95rem' },
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box
        sx={{
          flexShrink: 0,
          p: collapsed ? 1 : 2,
          borderTop: 1,
          borderColor: 'divider',
          pb: onNavigate ? { xs: 10, sm: 2 } : 2,
        }}
      >
        {!collapsed ? (
          <>
            <Card
              variant="outlined"
              sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #3a005f 0%, #2a004a 100%)',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 600 }}>
                  Account Reference
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                  {user?.accountReference ?? 'KSD-GHA-XXXXX'}
                </Typography>
              </CardContent>
            </Card>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <IconButton
            onClick={handleLogout}
            title="Logout"
            sx={{ width: '100%', borderRadius: 2 }}
            aria-label="Logout"
          >
            <LogoutIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default function SidePanel({ activeTab = 'overview' }: SidePanelProps) {
  const { isMobileOpen, isCollapsed, closeMobile } = useSidebar();

  const drawerWidth = isCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <>
      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={closeMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DrawerContent activeTab={activeTab} collapsed={false} onNavigate={closeMobile} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
          },
        }}
        open
      >
        <DrawerContent activeTab={activeTab} collapsed={isCollapsed} />
      </Drawer>
    </>
  );
}
