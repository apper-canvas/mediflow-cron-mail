import { delay } from '../index'

// Import mock data
import prescriptionsData from '../mockData/prescriptions.json'

let prescriptions = [...prescriptionsData]

const prescriptionService = {
  async getAll() {
    await delay(300)
    return [...prescriptions]
  },

  async getById(id) {
    await delay(200)
    const prescription = prescriptions.find(p => p.id === id)
    if (!prescription) {
      throw new Error('Prescription not found')
    }
    return { ...prescription }
  },

  async create(prescriptionData) {
    await delay(400)
    const newPrescription = {
      ...prescriptionData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      medications: prescriptionData.medications || [],
      createdAt: new Date().toISOString()
    }
    prescriptions.push(newPrescription)
    return { ...newPrescription }
  },

  async update(id, updateData) {
    await delay(350)
    const index = prescriptions.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Prescription not found')
    }
    
    prescriptions[index] = {
      ...prescriptions[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    return { ...prescriptions[index] }
  },

  async delete(id) {
    await delay(250)
    const index = prescriptions.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Prescription not found')
    }
    
    prescriptions.splice(index, 1)
    return { success: true }
  },

  async getByPatientId(patientId) {
    await delay(300)
    return prescriptions.filter(prescription => prescription.patientId === patientId)
  },

  async getByDoctorId(doctorId) {
    await delay(300)
    return prescriptions.filter(prescription => prescription.doctorId === doctorId)
  },

  async getByAppointmentId(appointmentId) {
    await delay(300)
    return prescriptions.filter(prescription => prescription.appointmentId === appointmentId)
  }
}

export default prescriptionService