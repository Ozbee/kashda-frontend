'use client';

import Box from '@mui/material/Box';
import { SidebarProvider } from '@/contexts/SidebarContext';
import SidePanel from '@/components/dashboard/SidePanel';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export default function DashboardLayout({
  children,
  activeTab = 'overview',
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <SidePanel activeTab={activeTab} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            pb: { xs: 8, md: 0 },
          }}
        >
          <DashboardHeader />
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              px: { xs: 2, sm: 3, lg: 4 },
              py: { xs: 2, sm: 3 },
            }}
          >
            {children}
          </Box>
        </Box>
        <MobileBottomNav activeTab={activeTab} />
      </Box>
    </SidebarProvider>
  );
}
