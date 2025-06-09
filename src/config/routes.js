import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Appointments from '../pages/Appointments'
import Patients from '../pages/Patients'
import Doctors from '../pages/Doctors'
import Billing from '../pages/Billing'
import Prescriptions from '../pages/Prescriptions'
import Settings from '../pages/Settings'

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  appointments: {
    id: 'appointments',
    label: 'Appointments',
    path: '/appointments',
    icon: 'Calendar',
    component: Appointments
  },
  patients: {
    id: 'patients',
    label: 'Patients',
    path: '/patients',
    icon: 'Users',
    component: Patients
  },
  doctors: {
    id: 'doctors',
    label: 'Doctors',
    path: '/doctors',
    icon: 'UserCheck',
    component: Doctors
  },
  billing: {
    id: 'billing',
    label: 'Billing',
    path: '/billing',
    icon: 'Receipt',
    component: Billing
  },
  prescriptions: {
    id: 'prescriptions',
    label: 'Prescriptions',
    path: '/prescriptions',
    icon: 'FileText',
    component: Prescriptions
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
}

export const routeArray = Object.values(routes)