import { delay } from '../index'

// Import mock data
import billsData from '../mockData/bills.json'

let bills = [...billsData]

const billService = {
  async getAll() {
    await delay(300)
    return [...bills]
  },

  async getById(id) {
    await delay(200)
    const bill = bills.find(b => b.id === id)
    if (!bill) {
      throw new Error('Bill not found')
    }
    return { ...bill }
  },

  async create(billData) {
    await delay(400)
    const total = billData.items?.reduce((sum, item) => sum + item.amount, 0) || 0
    const newBill = {
      ...billData,
      id: Date.now().toString(),
      total,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      items: billData.items || [],
      createdAt: new Date().toISOString()
    }
    bills.push(newBill)
    return { ...newBill }
  },

  async update(id, updateData) {
    await delay(350)
    const index = bills.findIndex(b => b.id === id)
    if (index === -1) {
      throw new Error('Bill not found')
    }
    
    // Recalculate total if items are updated
    if (updateData.items) {
      updateData.total = updateData.items.reduce((sum, item) => sum + item.amount, 0)
    }
    
    bills[index] = {
      ...bills[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    return { ...bills[index] }
  },

  async delete(id) {
    await delay(250)
    const index = bills.findIndex(b => b.id === id)
    if (index === -1) {
      throw new Error('Bill not found')
    }
    
    bills.splice(index, 1)
    return { success: true }
  },

  async getByPatientId(patientId) {
    await delay(300)
    return bills.filter(bill => bill.patientId === patientId)
  },

  async getByStatus(status) {
    await delay(300)
    return bills.filter(bill => bill.status === status)
  },

  async markAsPaid(id) {
    await delay(300)
    const index = bills.findIndex(b => b.id === id)
    if (index === -1) {
      throw new Error('Bill not found')
    }
    
    bills[index].status = 'paid'
    bills[index].paidAt = new Date().toISOString()
    
    return { ...bills[index] }
  }
}

export default billService