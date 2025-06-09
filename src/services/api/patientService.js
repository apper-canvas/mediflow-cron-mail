import { delay } from '../index'

// Import mock data
import patientsData from '../mockData/patients.json'

let patients = [...patientsData]

const patientService = {
  async getAll() {
    await delay(300)
    return [...patients]
  },

  async getById(id) {
    await delay(200)
    const patient = patients.find(p => p.id === id)
    if (!patient) {
      throw new Error('Patient not found')
    }
    return { ...patient }
  },

  async create(patientData) {
    await delay(400)
    const newPatient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      medicalHistory: patientData.medicalHistory || []
    }
    patients.push(newPatient)
    return { ...newPatient }
  },

  async update(id, updateData) {
    await delay(350)
    const index = patients.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Patient not found')
    }
    
    patients[index] = {
      ...patients[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    return { ...patients[index] }
  },

  async delete(id) {
    await delay(250)
    const index = patients.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Patient not found')
    }
    
    patients.splice(index, 1)
    return { success: true }
  },

  async search(query) {
    await delay(250)
    const lowercaseQuery = query.toLowerCase()
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(lowercaseQuery) ||
      patient.email.toLowerCase().includes(lowercaseQuery) ||
      patient.phone.includes(query)
    )
  }
}

export default patientService