import { delay } from '../index'

// Import mock data
import doctorsData from '../mockData/doctors.json'

let doctors = [...doctorsData]

const doctorService = {
  async getAll() {
    await delay(300)
    return [...doctors]
  },

  async getById(id) {
    await delay(200)
    const doctor = doctors.find(d => d.id === id)
    if (!doctor) {
      throw new Error('Doctor not found')
    }
    return { ...doctor }
  },

  async create(doctorData) {
    await delay(400)
    const newDoctor = {
      ...doctorData,
      id: Date.now().toString(),
      status: 'active',
      availability: doctorData.availability || [],
      createdAt: new Date().toISOString()
    }
    doctors.push(newDoctor)
    return { ...newDoctor }
  },

  async update(id, updateData) {
    await delay(350)
    const index = doctors.findIndex(d => d.id === id)
    if (index === -1) {
      throw new Error('Doctor not found')
    }
    
    doctors[index] = {
      ...doctors[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    return { ...doctors[index] }
  },

  async delete(id) {
    await delay(250)
    const index = doctors.findIndex(d => d.id === id)
    if (index === -1) {
      throw new Error('Doctor not found')
    }
    
    doctors.splice(index, 1)
    return { success: true }
  },

  async getBySpecialization(specialization) {
    await delay(300)
    return doctors.filter(doctor => 
      doctor.specialization.toLowerCase().includes(specialization.toLowerCase())
    )
  },

  async search(query) {
    await delay(250)
    const lowercaseQuery = query.toLowerCase()
    return doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(lowercaseQuery) ||
      doctor.specialization.toLowerCase().includes(lowercaseQuery) ||
      doctor.department.toLowerCase().includes(lowercaseQuery)
    )
  }
}

export default doctorService