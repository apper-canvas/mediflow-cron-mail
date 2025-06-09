import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { appointmentService, patientService, doctorService, billService } from '../services'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [recentActivity, setRecentActivity] = useState([])
  const [quickMetrics, setQuickMetrics] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [appointments, patients, doctors, bills] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll(),
        billService.getAll()
      ])

      const today = new Date().toISOString().split('T')[0]
      const thisWeek = new Date()
      thisWeek.setDate(thisWeek.getDate() - 7)

      const todayAppointments = appointments.filter(apt => apt.date === today)
      const completedToday = todayAppointments.filter(apt => apt.status === 'completed')
      const pendingBills = bills.filter(bill => bill.status === 'pending')
      const activeDoctors = doctors.filter(doc => doc.status === 'active')

      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        todayAppointments: todayAppointments.length,
        completedAppointments: completedToday.length,
        pendingBills: pendingBills.length,
        totalRevenue: bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total, 0)
      })

      setQuickMetrics({
        appointmentCompletionRate: todayAppointments.length > 0 ? Math.round((completedToday.length / todayAppointments.length) * 100) : 0,
        averageBillAmount: bills.length > 0 ? Math.round(bills.reduce((sum, b) => sum + b.total, 0) / bills.length) : 0,
        activeDoctorCount: activeDoctors.length
      })

      // Generate recent activity
      const activity = [
        ...appointments.slice(-3).map(apt => ({
          id: apt.id,
          type: 'appointment',
          message: `Appointment scheduled for ${apt.date}`,
          time: '2 hours ago',
          icon: 'Calendar'
        })),
        ...patients.slice(-2).map(patient => ({
          id: patient.id,
          type: 'patient',
          message: `New patient registered: ${patient.name}`,
          time: '4 hours ago',
          icon: 'UserPlus'
        }))
      ].slice(0, 5)

      setRecentActivity(activity)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-surface-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-surface-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-16 bg-surface-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load dashboard</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Analytics Dashboard</h1>
          <p className="text-surface-600 mt-1">Hospital management overview and insights</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => navigate('/appointments')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
            New Appointment
          </button>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 inline mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Patients', 
            value: stats.totalPatients, 
            icon: 'Users', 
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            change: '+12%',
            changeColor: 'text-success'
          },
          { 
            label: 'Active Doctors', 
            value: stats.totalDoctors, 
            icon: 'UserCheck', 
            color: 'text-success',
            bgColor: 'bg-success/10',
            change: '+3%',
            changeColor: 'text-success'
          },
          { 
            label: "Today's Appointments", 
            value: stats.todayAppointments, 
            icon: 'Calendar', 
            color: 'text-info',
            bgColor: 'bg-info/10',
            change: '+8%',
            changeColor: 'text-success'
          },
          { 
            label: 'Pending Bills', 
            value: stats.pendingBills, 
            icon: 'Receipt', 
            color: 'text-warning',
            bgColor: 'bg-warning/10',
            change: '-5%',
            changeColor: 'text-success'
          }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-sm font-medium ${stat.changeColor}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-surface-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-surface-900">{stat.value || 0}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-900">Completion Rate</h3>
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-success" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {quickMetrics.appointmentCompletionRate}%
            </div>
            <p className="text-surface-600 text-sm">Today's appointments completed</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-900">Average Bill</h3>
            <ApperIcon name="DollarSign" className="w-5 h-5 text-success" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">
              ${quickMetrics.averageBillAmount}
            </div>
            <p className="text-surface-600 text-sm">Per patient billing amount</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-900">Total Revenue</h3>
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-success" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">
              ${stats.totalRevenue?.toLocaleString() || 0}
            </div>
            <p className="text-surface-600 text-sm">From paid invoices</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Recent Activity</h3>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              View all
            </button>
          </div>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Activity" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-600">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center space-x-4 p-3 hover:bg-surface-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={activity.icon} className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-surface-900 text-sm font-medium truncate">
                      {activity.message}
                    </p>
                    <p className="text-surface-600 text-xs">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'New Patient', icon: 'UserPlus', path: '/patients', color: 'bg-primary' },
              { label: 'Book Appointment', icon: 'Calendar', path: '/appointments', color: 'bg-info' },
              { label: 'Add Doctor', icon: 'UserCheck', path: '/doctors', color: 'bg-success' },
              { label: 'Create Bill', icon: 'Receipt', path: '/billing', color: 'bg-warning' }
            ].map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.path)}
                className={`${action.color} text-white p-4 rounded-lg text-center hover:opacity-90 transition-all`}
              >
                <ApperIcon name={action.icon} className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard