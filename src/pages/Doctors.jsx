import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { doctorService } from '../services'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [specializationFilter, setSpecializationFilter] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    department: '',
    availability: []
  })

  const specializations = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 
    'Dermatology', 'Psychiatry', 'General Surgery', 'Internal Medicine',
    'Ophthalmology', 'ENT', 'Radiology', 'Anesthesiology'
  ]

  const departments = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
    'Surgery', 'Internal Medicine', 'Emergency', 'Radiology'
  ]

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await doctorService.getAll()
      setDoctors(data)
    } catch (err) {
      setError(err.message || 'Failed to load doctors')
      toast.error('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.specialization || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (editingDoctor) {
        await doctorService.update(editingDoctor.id, formData)
        toast.success('Doctor updated successfully')
      } else {
        await doctorService.create(formData)
        toast.success('Doctor added successfully')
      }
      
      resetForm()
      loadDoctors()
    } catch (err) {
      toast.error(editingDoctor ? 'Failed to update doctor' : 'Failed to add doctor')
    }
  }

  const handleEdit = (doctor) => {
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
      department: doctor.department,
      availability: doctor.availability || []
    })
    setEditingDoctor(doctor)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return
    
    try {
      await doctorService.delete(id)
      toast.success('Doctor deleted successfully')
      loadDoctors()
    } catch (err) {
      toast.error('Failed to delete doctor')
    }
  }

  const toggleStatus = async (doctor) => {
    try {
      const newStatus = doctor.status === 'active' ? 'inactive' : 'active'
      await doctorService.update(doctor.id, { status: newStatus })
      toast.success(`Doctor ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
      loadDoctors()
    } catch (err) {
      toast.error('Failed to update doctor status')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      department: '',
      availability: []
    })
    setEditingDoctor(null)
    setShowForm(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvailabilityChange = (day, slots) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.map(avail =>
        avail.day === day ? { ...avail, slots } : avail
      ).concat(
        prev.availability.find(avail => avail.day === day) ? [] : [{ day, slots }]
      )
    }))
  }

  const getAvailabilityForDay = (day) => {
    const availability = formData.availability.find(avail => avail.day === day)
    return availability ? availability.slots : []
  }

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecialization = specializationFilter === 'all' || 
      doctor.specialization.toLowerCase().includes(specializationFilter.toLowerCase())
    
    return matchesSearch && matchesSpecialization
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load doctors</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadDoctors}
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
          <h1 className="text-2xl font-bold text-surface-900">Doctors</h1>
          <p className="text-surface-600 mt-1">Manage medical staff and their schedules</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="UserPlus" className="w-4 h-4 inline mr-2" />
          Add Doctor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Form Modal */}
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
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-surface-900">
                      {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
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
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Specialization *
                        </label>
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select specialization</option>
                          {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Department
                        </label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select department</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-4">
                        Availability Schedule
                      </label>
                      <div className="space-y-4">
                        {days.map(day => (
                          <div key={day} className="border border-surface-200 rounded-lg p-4">
                            <h4 className="font-medium text-surface-900 mb-3">{day}</h4>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                              {timeSlots.map(slot => (
                                <label key={slot} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={getAvailabilityForDay(day).includes(slot)}
                                    onChange={(e) => {
                                      const currentSlots = getAvailabilityForDay(day)
                                      const newSlots = e.target.checked
                                        ? [...currentSlots, slot]
                                        : currentSlots.filter(s => s !== slot)
                                      handleAvailabilityChange(day, newSlots)
                                    }}
                                    className="rounded border-surface-300 text-primary focus:ring-primary"
                                  />
                                  <span className="text-sm text-surface-700">{slot}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
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
                        {editingDoctor ? 'Update' : 'Add'} Doctor
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Doctors List */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="UserCheck" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">
              {searchTerm || specializationFilter !== 'all' ? 'No doctors found' : 'No doctors added'}
            </h3>
            <p className="text-surface-600 mb-6">
              {searchTerm || specializationFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first doctor to get started'
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Doctor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredDoctors.map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <ApperIcon name="UserCheck" className="w-6 h-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-surface-900 truncate">Dr. {doctor.name}</h3>
                      <p className="text-sm text-surface-600">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleStatus(doctor)}
                      className={`p-1 rounded transition-colors ${
                        doctor.status === 'active'
                          ? 'text-success hover:text-success/80'
                          : 'text-surface-400 hover:text-surface-600'
                      }`}
                    >
                      <ApperIcon name={doctor.status === 'active' ? 'CheckCircle' : 'XCircle'} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="p-1 text-surface-600 hover:text-primary transition-colors"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="p-1 text-surface-600 hover:text-error transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Mail" className="w-4 h-4 text-surface-400" />
                    <span className="text-sm text-surface-600 truncate">{doctor.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Phone" className="w-4 h-4 text-surface-400" />
                    <span className="text-sm text-surface-600">{doctor.phone}</span>
                  </div>
                  {doctor.department && (
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Building" className="w-4 h-4 text-surface-400" />
                      <span className="text-sm text-surface-600">{doctor.department}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-surface-200">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doctor.status === 'active'
                      ? 'bg-success/10 text-success'
                      : 'bg-surface-100 text-surface-600'
                  }`}>
                    {doctor.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Calendar" className="w-4 h-4 text-surface-400" />
                    <span className="text-xs text-surface-600">
                      {doctor.availability?.length || 0} days available
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors