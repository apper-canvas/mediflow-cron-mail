export { default as appointmentService } from './api/appointmentService'
export { default as patientService } from './api/patientService'
export { default as doctorService } from './api/doctorService'
export { default as prescriptionService } from './api/prescriptionService'
export { default as billService } from './api/billService'

// Utility function for delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))