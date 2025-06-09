import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { prescriptionService, patientService, doctorService, appointmentService } from '../services'

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPrescription, setEditingPrescription] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentId: '',
    diagnosis: '',
    medications: [{ name: '', dosage: '', duration: '' }]
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [prescriptionsData, patientsData, doctorsData, appointmentsData] = await Promise.all([
        prescriptionService.getAll(),
        patientService.getAll(),
        doctorService.getAll(),
        appointmentService.getAll()
      ])
      setPrescriptions(prescriptionsData)
      setPatients(patientsData)
      setDoctors(doctorsData)
      setAppointments(appointmentsData)
    } catch (err) {
      setError(err.message || 'Failed to load prescriptions')
      toast.error('Failed to load prescriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.patientId || !formData.doctorId || !formData.diagnosis || 
        formData.medications.some(med => !med.name || !med.dosage || !med.duration)) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (editingPrescription) {
        await prescriptionService.update(editingPrescription.id, formData)
        toast.success('Prescription updated successfully')
      } else {
        await prescriptionService.create(formData)
        toast.success('Prescription created successfully')
      }
      
      resetForm()
      loadData()
    } catch (err) {
      toast.error(editingPrescription ? 'Failed to update prescription' : 'Failed to create prescription')
    }
  }

  const handleEdit = (prescription) => {
    setFormData({
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      appointmentId: prescription.appointmentId || '',
      diagnosis: prescription.diagnosis,
      medications: prescription.medications || [{ name: '', dosage: '', duration: '' }]
    })
    setEditingPrescription(prescription)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return
    
    try {
      await prescriptionService.delete(id)
      toast.success('Prescription deleted successfully')
      loadData()
    } catch (err) {
      toast.error('Failed to delete prescription')
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      appointmentId: '',
      diagnosis: '',
      medications: [{ name: '', dosage: '', duration: '' }]
    })
    setEditingPrescription(null)
    setShowForm(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMedicationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      )
    }))
  }

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', duration: '' }]
    }))
  }

  const removeMedication = (index) => {
    if (formData.medications.length > 1) {
      setFormData(prev => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index)
      }))
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

  const filteredPrescriptions = prescriptions.filter(prescription =>
    getPatientName(prescription.patientId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDoctorName(prescription.doctorId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medications.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handlePrint = (prescription) => {
    const printWindow = window.open('', '_blank')
    const patientName = getPatientName(prescription.patientId)
    const doctorName = getDoctorName(prescription.doctorId)
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription - ${patientName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
            .prescription-details { margin-bottom: 20px; }
            .medications { margin-top: 20px; }
            .medication-item { margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MediFlow Hospital</h1>
            <h2>Prescription</h2>
          </div>
          
          <div class="prescription-details">
            <p><strong>Patient:</strong> ${patientName}</p>
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Date:</strong> ${prescription.date}</p>
            <p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>
          </div>
          
          <div class="medications">
            <h3>Medications:</h3>
            ${prescription.medications.map(med => `
              <div class="medication-item">
                <p><strong>${med.name}</strong></p>
                <p>Dosage: ${med.dosage}</p>
                <p>Duration: ${med.duration}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p>MediFlow Healthcare Management System</p>
          </div>
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.print()
  }

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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load prescriptions</h3>
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
          <h1 className="text-2xl font-bold text-surface-900">Prescriptions</h1>
          <p className="text-surface-600 mt-1">Manage patient prescriptions and medications</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
          Create Prescription
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search prescriptions by patient, doctor, diagnosis, or medication..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Prescription Form Modal */}
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
              <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-surface-900">
                      {editingPrescription ? 'Edit Prescription' : 'Create New Prescription'}
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

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Appointment ID (Optional)
                        </label>
                        <input
                          type="text"
                          name="appointmentId"
                          value={formData.appointmentId}
                          onChange={handleInputChange}
                          placeholder="Enter appointment ID"
                          className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Diagnosis *
                      </label>
                      <textarea
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        placeholder="Enter diagnosis..."
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-surface-700">
                          Medications *
                        </label>
                        <button
                          type="button"
                          onClick={addMedication}
                          className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
                        >
                          <ApperIcon name="Plus" className="w-4 h-4 inline mr-1" />
                          Add Medication
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {formData.medications.map((medication, index) => (
                          <div key={index} className="border border-surface-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-surface-900">Medication {index + 1}</h4>
                              {formData.medications.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeMedication(index)}
                                  className="p-1 text-error hover:bg-error/10 rounded transition-colors"
                                >
                                  <ApperIcon name="Trash2" className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1">
                                  Medication Name *
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., Aspirin"
                                  value={medication.name}
                                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                  required
                                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1">
                                  Dosage *
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., 100mg twice daily"
                                  value={medication.dosage}
                                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                  required
                                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1">
                                  Duration *
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., 7 days"
                                  value={medication.duration}
                                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                  required
                                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                              </div>
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
                        {editingPrescription ? 'Update' : 'Create'} Prescription
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Prescriptions List */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="FileText" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">
              {searchTerm ? 'No prescriptions found' : 'No prescriptions created'}
            </h3>
            <p className="text-surface-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first prescription to get started'
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Prescription
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {filteredPrescriptions.map((prescription, i) => (
              <motion.div
                key={prescription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <ApperIcon name="FileText" className="w-6 h-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-surface-900 truncate">
                        {getPatientName(prescription.patientId)}
                      </h3>
                      <p className="text-sm text-surface-600">
                        by {getDoctorName(prescription.doctorId)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handlePrint(prescription)}
                      className="p-1 text-surface-600 hover:text-primary transition-colors"
                      title="Print Prescription"
                    >
                      <ApperIcon name="Printer" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(prescription)}
                      className="p-1 text-surface-600 hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prescription.id)}
                      className="p-1 text-surface-600 hover:text-error transition-colors"
                      title="Delete"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-surface-700">Diagnosis:</p>
                    <p className="text-sm text-surface-900">{prescription.diagnosis}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-surface-700 mb-2">Medications:</p>
                    <div className="space-y-2">
                      {prescription.medications.map((medication, index) => (
                        <div key={index} className="bg-surface-50 p-3 rounded-lg">
                          <p className="font-medium text-surface-900">{medication.name}</p>
                          <p className="text-sm text-surface-600">
                            {medication.dosage} • {medication.duration}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-surface-200">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-surface-400" />
                      <span className="text-sm text-surface-600">{prescription.date}</span>
                    </div>
                    <span className="text-xs text-surface-500">
                      ID: {prescription.id.slice(-6)}
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

export default Prescriptions