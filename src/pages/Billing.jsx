import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { billService, patientService } from '../services'

const Billing = () => {
  const [bills, setBills] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingBill, setEditingBill] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentId: '',
    items: [{ description: '', amount: 0 }]
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [billsData, patientsData] = await Promise.all([
        billService.getAll(),
        patientService.getAll()
      ])
      setBills(billsData)
      setPatients(patientsData)
    } catch (err) {
      setError(err.message || 'Failed to load billing data')
      toast.error('Failed to load billing data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.patientId || formData.items.some(item => !item.description || !item.amount)) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (editingBill) {
        await billService.update(editingBill.id, formData)
        toast.success('Bill updated successfully')
      } else {
        await billService.create(formData)
        toast.success('Bill created successfully')
      }
      
      resetForm()
      loadData()
    } catch (err) {
      toast.error(editingBill ? 'Failed to update bill' : 'Failed to create bill')
    }
  }

  const handleEdit = (bill) => {
    setFormData({
      patientId: bill.patientId,
      appointmentId: bill.appointmentId || '',
      items: bill.items || [{ description: '', amount: 0 }]
    })
    setEditingBill(bill)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return
    
    try {
      await billService.delete(id)
      toast.success('Bill deleted successfully')
      loadData()
    } catch (err) {
      toast.error('Failed to delete bill')
    }
  }

  const handleMarkAsPaid = async (id) => {
    try {
      await billService.markAsPaid(id)
      toast.success('Bill marked as paid')
      loadData()
    } catch (err) {
      toast.error('Failed to update bill status')
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: '',
      appointmentId: '',
      items: [{ description: '', amount: 0 }]
    })
    setEditingBill(null)
    setShowForm(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : item
      )
    }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', amount: 0 }]
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-success text-white'
      case 'pending': return 'bg-warning text-white'
      case 'overdue': return 'bg-error text-white'
      default: return 'bg-surface-300 text-surface-700'
    }
  }

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId)
    return patient ? patient.name : `Patient #${patientId}`
  }

  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      getPatientName(bill.patientId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0)

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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load billing data</h3>
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
          <h1 className="text-2xl font-bold text-surface-900">Billing</h1>
          <p className="text-surface-600 mt-1">Manage patient bills and payments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
          Create Bill
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Bills', 
            value: bills.length, 
            icon: 'Receipt', 
            color: 'text-primary',
            bgColor: 'bg-primary/10'
          },
          { 
            label: 'Paid Bills', 
            value: bills.filter(b => b.status === 'paid').length, 
            icon: 'CheckCircle', 
            color: 'text-success',
            bgColor: 'bg-success/10'
          },
          { 
            label: 'Pending Bills', 
            value: bills.filter(b => b.status === 'pending').length, 
            icon: 'Clock', 
            color: 'text-warning',
            bgColor: 'bg-warning/10'
          },
          { 
            label: 'Total Revenue', 
            value: `$${bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total, 0).toLocaleString()}`, 
            icon: 'DollarSign', 
            color: 'text-success',
            bgColor: 'bg-success/10'
          }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-surface-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search bills..."
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
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Bill Form Modal */}
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
                      {editingBill ? 'Edit Bill' : 'Create New Bill'}
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
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-surface-700">
                          Bill Items *
                        </label>
                        <button
                          type="button"
                          onClick={addItem}
                          className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
                        >
                          <ApperIcon name="Plus" className="w-4 h-4 inline mr-1" />
                          Add Item
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.items.map((item, index) => (
                          <div key={index} className="flex gap-3 items-end">
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            <div className="w-32">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Amount"
                                value={item.amount || ''}
                                onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            {formData.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="p-2 text-error hover:bg-error/10 rounded transition-colors"
                              >
                                <ApperIcon name="Trash2" className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-surface-200">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-surface-900">Total:</span>
                          <span className="text-xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
                        </div>
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
                        {editingBill ? 'Update' : 'Create'} Bill
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bills List */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredBills.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Receipt" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No bills found</h3>
            <p className="text-surface-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first bill to get started'
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Bill
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-surface-200">
                <tr>
                  <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Bill ID</th>
                  <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Patient</th>
                  <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Date</th>
                  <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Amount</th>
                  <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-surface-600 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill, i) => (
                  <motion.tr
                    key={bill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="font-medium text-surface-900">#{bill.id.slice(-6)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-surface-900">{getPatientName(bill.patientId)}</p>
                      <p className="text-sm text-surface-600">ID: {bill.patientId}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-surface-900">{bill.date}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-surface-900">${bill.total}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        {bill.status === 'pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(bill.id)}
                            className="p-1 text-success hover:bg-success/10 rounded transition-colors"
                            title="Mark as Paid"
                          >
                            <ApperIcon name="CheckCircle" className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(bill)}
                          className="p-1 text-surface-600 hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bill.id)}
                          className="p-1 text-surface-600 hover:text-error transition-colors"
                          title="Delete"
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
    </div>
  )
}

export default Billing