import { delay } from '../index'

// Import mock data
import appointmentsData from '../mockData/appointments.json'

let appointments = [...appointmentsData]

const appointmentService = {
  async getAll() {
    await delay(300)
    return [...appointments]
  },

  async getById(id) {
    await delay(200)
    const appointment = appointments.find(apt => apt.id === id)
    if (!appointment) {
      throw new Error('Appointment not found')
    }
    return { ...appointment }
  },

  async create(appointmentData) {
    await delay(400)
    const newAppointment = {
      ...appointmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    appointments.push(newAppointment)
    return { ...newAppointment }
  },

  async update(id, updateData) {
    await delay(350)
    const index = appointments.findIndex(apt => apt.id === id)
    if (index === -1) {
      throw new Error('Appointment not found')
    }
    
    appointments[index] = {
      ...appointments[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    return { ...appointments[index] }
  },

  async delete(id) {
    await delay(250)
    const index = appointments.findIndex(apt => apt.id === id)
    if (index === -1) {
      throw new Error('Appointment not found')
    }
    
    appointments.splice(index, 1)
    return { success: true }
  },

  async getByPatientId(patientId) {
    await delay(300)
    return appointments.filter(apt => apt.patientId === patientId)
  },

  async getByDoctorId(doctorId) {
    await delay(300)
    return appointments.filter(apt => apt.doctorId === doctorId)
  },

  async getByDateRange(startDate, endDate) {
    await delay(300)
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate >= new Date(startDate) && aptDate <= new Date(endDate)
    })
  }
}

export default appointmentService