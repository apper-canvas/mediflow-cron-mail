import React, { useState } from 'react';
import { toast } from 'react-toastify';

import DashboardHeader from '@/components/organisms/DashboardHeader';
import SettingsNavAndContent from '@/components/organisms/SettingsNavAndContent';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [generalSettings, setGeneralSettings] = useState({
        hospitalName: 'MediFlow Hospital',
        address: '123 Healthcare Street, Medical City, MC 12345',
        phone: '+1-555-HOSPITAL',
        email: 'contact@mediflow.com',
        workingHours: '08:00 - 18:00',
        emergencyContact: '+1-555-EMERGENCY'
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        appointmentReminders: true,
        billReminders: true,
        systemAlerts: true
    });

    const [securitySettings, setSecuritySettings] = useState({
        sessionTimeout: '30',
        passwordExpiry: '90',
        loginAttempts: '3',
        twoFactorAuth: false
    });

    const handleGeneralSave = () => {
        // Simulate API call
        setTimeout(() => {
            toast.success('General settings saved successfully');
        }, 500);
    };

    const handleNotificationSave = () => {
        // Simulate API call
        setTimeout(() => {
            toast.success('Notification settings saved successfully');
        }, 500);
    };

    const handleSecuritySave = () => {
        // Simulate API call
        setTimeout(() => {
            toast.success('Security settings saved successfully');
        }, 500);
    };

    const handleBackup = () => {
        // Simulate backup
        toast.info('Backup started. This may take a few minutes...');
        setTimeout(() => {
            toast.success('Backup completed successfully');
        }, 3000);
    };

    const handleRestore = () => {
        if (window.confirm('Are you sure you want to restore from backup? This will overwrite current data.')) {
            toast.info('Restore started. This may take a few minutes...');
            setTimeout(() => {
                toast.success('System restored successfully');
            }, 3000);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-full overflow-hidden">
            <DashboardHeader
                title="Settings"
                description="Manage your hospital system configuration"
            />

            <SettingsNavAndContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                generalSettings={generalSettings}
                setGeneralSettings={setGeneralSettings}
                notificationSettings={notificationSettings}
                setNotificationSettings={setNotificationSettings}
                securitySettings={securitySettings}
                setSecuritySettings={setSecuritySettings}
                handleGeneralSave={handleGeneralSave}
                handleNotificationSave={handleNotificationSave}
                handleSecuritySave={handleSecuritySave}
                handleBackup={handleBackup}
                handleRestore={handleRestore}
            />
        </div>
    );
};

export default SettingsPage;