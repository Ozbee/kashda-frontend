'use client';

import { useRouter, usePathname } from 'next/navigation';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { navItems } from '@/theme/navConfig';

interface MobileBottomNavProps {
  activeTab: string;
}

export default function MobileBottomNav({ activeTab }: MobileBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeIndex = navItems.findIndex(
    (item) => item.id === activeTab || pathname === item.href
  );

  return (
    <Paper
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      elevation={8}
    >
      <BottomNavigation
        showLabels
        value={activeIndex >= 0 ? activeIndex : 0}
        onChange={(_, newValue) => {
          router.push(navItems[newValue].href);
        }}
        sx={{
          '& .MuiBottomNavigationAction-root.Mui-selected': {
            color: 'secondary.main',
          },
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <BottomNavigationAction
              key={item.id}
              label={item.mobileLabel ?? item.label}
              icon={<Icon fontSize="small" />}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}
