import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import AppointmentsPage from '@/components/pages/AppointmentsPage';
import PatientsPage from '@/components/pages/PatientsPage';
import DoctorsPage from '@/components/pages/DoctorsPage';
import BillingPage from '@/components/pages/BillingPage';
import PrescriptionsPage from '@/components/pages/PrescriptionsPage';
import SettingsPage from '@/components/pages/SettingsPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: DashboardPage
  },
  appointments: {
    id: 'appointments',
    label: 'Appointments',
    path: '/appointments',
    icon: 'Calendar',
component: AppointmentsPage
  },
  patients: {
    id: 'patients',
    label: 'Patients',
    path: '/patients',
    icon: 'Users',
component: PatientsPage
  },
  doctors: {
    id: 'doctors',
    label: 'Doctors',
    path: '/doctors',
    icon: 'UserCheck',
component: DoctorsPage
  },
  billing: {
    id: 'billing',
    label: 'Billing',
    path: '/billing',
    icon: 'Receipt',
component: BillingPage
  },
  prescriptions: {
    id: 'prescriptions',
    label: 'Prescriptions',
    path: '/prescriptions',
    icon: 'FileText',
component: PrescriptionsPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
component: SettingsPage
  }
}

export const routeArray = Object.values(routes)