import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [generalSettings, setGeneralSettings] = useState({
    hospitalName: 'MediFlow Hospital',
    address: '123 Healthcare Street, Medical City, MC 12345',
    phone: '+1-555-HOSPITAL',
    email: 'contact@mediflow.com',
    workingHours: '08:00 - 18:00',
    emergencyContact: '+1-555-EMERGENCY'
  })
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    billReminders: true,
    systemAlerts: true
  })

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginAttempts: '3',
    twoFactorAuth: false
  })

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'backup', label: 'Backup', icon: 'Database' }
  ]

  const handleGeneralSave = () => {
    // Simulate API call
    setTimeout(() => {
      toast.success('General settings saved successfully')
    }, 500)
  }

  const handleNotificationSave = () => {
    // Simulate API call
    setTimeout(() => {
      toast.success('Notification settings saved successfully')
    }, 500)
  }

  const handleSecuritySave = () => {
    // Simulate API call
    setTimeout(() => {
      toast.success('Security settings saved successfully')
    }, 500)
  }

  const handleBackup = () => {
    // Simulate backup
    toast.info('Backup started. This may take a few minutes...')
    setTimeout(() => {
      toast.success('Backup completed successfully')
    }, 3000)
  }

  const handleRestore = () => {
    if (window.confirm('Are you sure you want to restore from backup? This will overwrite current data.')) {
      toast.info('Restore started. This may take a few minutes...')
      setTimeout(() => {
        toast.success('System restored successfully')
      }, 3000)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
        <p className="text-surface-600 mt-1">Manage your hospital system configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-surface-700 hover:bg-surface-100'
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            {activeTab === 'general' && (
              <div>
                <h2 className="text-xl font-semibold text-surface-900 mb-6">General Settings</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Hospital Name
                      </label>
                      <input
                        type="text"
                        value={generalSettings.hospitalName}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, hospitalName: e.target.value }))}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={generalSettings.phone}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={generalSettings.email}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Working Hours
                      </label>
                      <input
                        type="text"
                        value={generalSettings.workingHours}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, workingHours: e.target.value }))}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Address
                      </label>
                      <textarea
                        rows={3}
                        value={generalSettings.address}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Emergency Contact
                      </label>
                      <input
                        type="tel"
                        value={generalSettings.emergencyContact}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, emergencyContact: e.target.value }))}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleGeneralSave}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-surface-900 mb-6">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                      { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                      { key: 'appointmentReminders', label: 'Appointment Reminders', description: 'Send reminders for upcoming appointments' },
                      { key: 'billReminders', label: 'Bill Reminders', description: 'Send reminders for pending bills' },
                      { key: 'systemAlerts', label: 'System Alerts', description: 'Receive alerts about system events' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-surface-900">{setting.label}</h4>
                          <p className="text-sm text-surface-600">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[setting.key]}
                            onChange={(e) => setNotificationSettings(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNotificationSave}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-surface-900 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <select
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Password Expiry (days)
                      </label>
                      <select
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: e.target.value }))}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                        <option value="180">180 days</option>
                        <option value="never">Never</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Max Login Attempts
                      </label>
                      <select
                        value={securitySettings.loginAttempts}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: e.target.value }))}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="3">3 attempts</option>
                        <option value="5">5 attempts</option>
                        <option value="10">10 attempts</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 border border-surface-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-surface-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-surface-600">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSecuritySave}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'backup' && (
              <div>
                <h2 className="text-xl font-semibold text-surface-900 mb-6">Backup & Restore</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border border-surface-200 rounded-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Download" className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-surface-900">Create Backup</h3>
                          <p className="text-sm text-surface-600">Create a full system backup</p>
                        </div>
                      </div>
                      <button
                        onClick={handleBackup}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Start Backup
                      </button>
                    </div>

                    <div className="p-6 border border-surface-200 rounded-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Upload" className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-surface-900">Restore System</h3>
                          <p className="text-sm text-surface-600">Restore from previous backup</p>
                        </div>
                      </div>
                      <button
                        onClick={handleRestore}
                        className="w-full px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning/90 transition-colors"
                      >
                        Restore System
                      </button>
                    </div>
                  </div>

                  <div className="bg-surface-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-surface-900 mb-4">Backup History</h4>
                    <div className="space-y-3">
                      {[
                        { date: '2024-01-15 10:30 AM', size: '2.4 GB', status: 'Completed' },
                        { date: '2024-01-14 10:30 AM', size: '2.3 GB', status: 'Completed' },
                        { date: '2024-01-13 10:30 AM', size: '2.2 GB', status: 'Completed' }
                      ].map((backup, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-surface-200">
                          <div>
                            <p className="font-medium text-surface-900">{backup.date}</p>
                            <p className="text-sm text-surface-600">Size: {backup.size}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                              {backup.status}
                            </span>
                            <button className="p-1 text-surface-600 hover:text-primary transition-colors">
                              <ApperIcon name="Download" className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Settings