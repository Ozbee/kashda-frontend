import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HistoryIcon from '@mui/icons-material/History';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import type { SvgIconComponent } from '@mui/icons-material';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: SvgIconComponent;
  mobileLabel?: string;
}

export const navItems: NavItem[] = [
  { id: 'overview', label: 'Dashboard', mobileLabel: 'Home', href: '/dashboard', icon: DashboardIcon },
  { id: 'bills', label: 'Bills', href: '/dashboard/bills', icon: ReceiptLongIcon },
  { id: 'payments', label: 'Payment History', mobileLabel: 'History', href: '/dashboard/payments', icon: HistoryIcon },
  { id: 'profile', label: 'Profile', href: '/dashboard/profile', icon: PersonOutlinedIcon },
  { id: 'support', label: 'Support', href: '/dashboard/support', icon: HelpOutlinedIcon },
];

export const logoutNavItem = {
  label: 'Logout',
  icon: LogoutIcon,
};
