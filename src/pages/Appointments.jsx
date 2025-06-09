import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { appointmentService, patientService, doctorService } from '../services'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('list') // 'list' or 'calendar'
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'consultation',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll()
      ])
      setAppointments(appointmentsData)
      setPatients(patientsData)
      setDoctors(doctorsData)
    } catch (err) {
      setError(err.message || 'Failed to load appointments')
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (editingAppointment) {
        await appointmentService.update(editingAppointment.id, formData)
        toast.success('Appointment updated successfully')
      } else {
        const newAppointment = {
          ...formData,
          status: 'scheduled',
          duration: 30
        }
        await appointmentService.create(newAppointment)
        toast.success('Appointment created successfully')
      }
      
      resetForm()
      loadData()
    } catch (err) {
      toast.error(editingAppointment ? 'Failed to update appointment' : 'Failed to create appointment')
    }
  }

  const handleEdit = (appointment) => {
    setFormData({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      notes: appointment.notes || ''
    })
    setEditingAppointment(appointment)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return
    
    try {
      await appointmentService.delete(id)
      toast.success('Appointment deleted successfully')
      loadData()
    } catch (err) {
      toast.error('Failed to delete appointment')
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentService.update(id, { status: newStatus })
      toast.success('Appointment status updated')
      loadData()
    } catch (err) {
      toast.error('Failed to update appointment status')
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      type: 'consultation',
      notes: ''
    })
    setEditingAppointment(null)
    setShowForm(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-info text-white'
      case 'completed': return 'bg-success text-white'
      case 'cancelled': return 'bg-error text-white'
      default: return 'bg-surface-300 text-surface-700'
    }
  }

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId)
    return patient ? patient.name : `Patient #${patientId}`
  }

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId)
    return doctor ? `Dr. ${doctor.name}` : `Doctor #${doctorId}`
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      getPatientName(appointment.patientId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getDoctorName(appointment.doctorId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-surface-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-surface-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load appointments</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadData}
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
          <h1 className="text-2xl font-bold text-surface-900">Appointments</h1>
          <p className="text-surface-600 mt-1">Manage patient appointments and schedules</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="flex bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-white text-surface-900 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="List" className="w-4 h-4 inline mr-1" />
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                view === 'calendar'
                  ? 'bg-white text-surface-900 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="Calendar" className="w-4 h-4 inline mr-1" />
              Calendar
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointment Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={resetForm}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-surface-900">
                      {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="text-surface-400 hover:text-surface-600"
                    >
                      <ApperIcon name="X" className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Patient *
                        </label>
                        <select
                          name="patientId"
                          value={formData.patientId}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select a patient</option>
                          {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                              {patient.name} - {patient.email}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Doctor *
                        </label>
                        <select
                          name="doctorId"
                          value={formData.doctorId}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select a doctor</option>
                          {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              Dr. {doctor.name} - {doctor.specialization}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Date *
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Time *
                        </label>
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select time</option>
                          {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Appointment Type
                        </label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="consultation">Consultation</option>
                          <option value="follow-up">Follow-up</option>
                          <option value="emergency">Emergency</option>
                          <option value="routine">Routine Check-up</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Additional notes for the appointment..."
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        {editingAppointment ? 'Update' : 'Create'} Appointment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      {view === 'list' ? (
        <div className="bg-white rounded-lg shadow-sm">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Calendar" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">No appointments found</h3>
              <p className="text-surface-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first appointment to get started'
                }
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                New Appointment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-surface-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Patient</th>
                    <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Doctor</th>
                    <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Date & Time</th>
                    <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Type</th>
                    <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment, i) => (
                    <motion.tr
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-surface-900">{getPatientName(appointment.patientId)}</p>
                          <p className="text-sm text-surface-600">ID: {appointment.patientId}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-surface-900">{getDoctorName(appointment.doctorId)}</p>
                          <p className="text-sm text-surface-600">
                            {doctors.find(d => d.id === appointment.doctorId)?.specialization || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-surface-900">{appointment.date}</p>
                          <p className="text-sm text-surface-600">{appointment.time}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-surface-100 text-surface-700 rounded-full text-xs font-medium capitalize">
                          {appointment.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${getStatusColor(appointment.status)}`}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(appointment)}
                            className="p-1 text-surface-600 hover:text-primary transition-colors"
                          >
                            <ApperIcon name="Edit" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="p-1 text-surface-600 hover:text-error transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <ApperIcon name="Calendar" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">Calendar View</h3>
            <p className="text-surface-600">Calendar view will be implemented in future updates</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments