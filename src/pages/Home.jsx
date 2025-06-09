import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { appointmentService, patientService, doctorService, billService } from '../services'

const Home = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [todayAppointments, setTodayAppointments] = useState([])
  const [recentPatients, setRecentPatients] = useState([])
  const [pendingBills, setPendingBills] = useState([])
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
      const todayAppts = appointments.filter(apt => apt.date === today)
      const recentPts = patients.slice(0, 3)
      const pending = bills.filter(bill => bill.status === 'pending')

      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        todayAppointments: todayAppts.length,
        pendingBills: pending.length
      })

      setTodayAppointments(todayAppts)
      setRecentPatients(recentPts)
      setPendingBills(pending.slice(0, 3))
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-info text-white'
      case 'completed': return 'bg-success text-white'
      case 'cancelled': return 'bg-error text-white'
      case 'pending': return 'bg-warning text-white'
      case 'paid': return 'bg-success text-white'
      case 'overdue': return 'bg-error text-white'
      default: return 'bg-surface-300 text-surface-700'
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-surface-600 mt-1">Welcome to MediFlow Healthcare Management</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => navigate('/appointments')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Patients', value: stats.totalPatients, icon: 'Users', color: 'text-primary' },
          { label: 'Total Doctors', value: stats.totalDoctors, icon: 'UserCheck', color: 'text-success' },
          { label: "Today's Appointments", value: stats.todayAppointments, icon: 'Calendar', color: 'text-info' },
          { label: 'Pending Bills', value: stats.pendingBills, icon: 'Receipt', color: 'text-warning' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-surface-900 mt-1">{stat.value || 0}</p>
              </div>
              <ApperIcon name={stat.icon} className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">Today's Appointments</h2>
            <button
              onClick={() => navigate('/appointments')}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View all
            </button>
          </div>
          
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-600">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.slice(0, 3).map((appointment, i) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-surface-900 truncate">
                      Patient #{appointment.patientId}
                    </p>
                    <p className="text-surface-600 text-sm">
                      Dr. {appointment.doctorId} • {appointment.time}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Patients */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">Recent Patients</h2>
            <button
              onClick={() => navigate('/patients')}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View all
            </button>
          </div>
          
          {recentPatients.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Users" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-600">No patients registered yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPatients.map((patient, i) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center justify-between p-3 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/patients')}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-surface-900 truncate">{patient.name}</p>
                    <p className="text-surface-600 text-sm">
                      {patient.email} • {patient.bloodGroup}
                    </p>
                  </div>
                  <ApperIcon name="ChevronRight" className="w-4 h-4 text-surface-400" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Pending Bills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">Pending Bills</h2>
          <button
            onClick={() => navigate('/billing')}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View all
          </button>
        </div>
        
        {pendingBills.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Receipt" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <p className="text-surface-600">No pending bills</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-2 text-surface-600 font-medium text-sm">Bill ID</th>
                  <th className="text-left py-2 text-surface-600 font-medium text-sm">Patient</th>
                  <th className="text-left py-2 text-surface-600 font-medium text-sm">Amount</th>
                  <th className="text-left py-2 text-surface-600 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingBills.map((bill, i) => (
                  <motion.tr
                    key={bill.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="hover:bg-surface-50 transition-colors cursor-pointer"
                    onClick={() => navigate('/billing')}
                  >
                    <td className="py-3 text-surface-900 font-medium">#{bill.id.slice(-6)}</td>
                    <td className="py-3 text-surface-900">Patient #{bill.patientId}</td>
                    <td className="py-3 text-surface-900 font-medium">${bill.total}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                        {bill.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Home