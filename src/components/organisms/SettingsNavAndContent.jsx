import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Card from '@/components/molecules/Card';
import SettingsMenuItem from '@/components/molecules/SettingsMenuItem';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import ToggleSwitch from '@/components/molecules/ToggleSwitch';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

// Panels (Organisms, but kept internal for simplicity as they are tightly coupled to SettingsPage structure)
const GeneralSettingsForm = ({ settings, onSettingChange, onSave }) => (
    <div>
        <Heading level={2} className="text-xl font-semibold text-surface-900 mb-6">General Settings</Heading>
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Hospital Name">
                    <Input
                        type="text"
                        value={settings.hospitalName}
                        onChange={(e) => onSettingChange('hospitalName', e.target.value)}
                    />
                </FormField>
                <FormField label="Phone Number">
                    <Input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => onSettingChange('phone', e.target.value)}
                    />
                </FormField>
                <FormField label="Email Address">
                    <Input
                        type="email"
                        value={settings.email}
                        onChange={(e) => onSettingChange('email', e.target.value)}
                    />
                </FormField>
                <FormField label="Working Hours">
                    <Input
                        type="text"
                        value={settings.workingHours}
                        onChange={(e) => onSettingChange('workingHours', e.target.value)}
                    />
                </FormField>
                <div className="md:col-span-2">
                    <FormField label="Address">
                        <TextArea
                            rows={3}
                            value={settings.address}
                            onChange={(e) => onSettingChange('address', e.target.value)}
                        />
                    </FormField>
                </div>
                <FormField label="Emergency Contact">
                    <Input
                        type="tel"
                        value={settings.emergencyContact}
                        onChange={(e) => onSettingChange('emergencyContact', e.target.value)}
                    />
                </FormField>
            </div>
            <div className="flex justify-end">
                <Button
                    onClick={onSave}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Save Changes
                </Button>
            </div>
        </div>
    </div>
);

GeneralSettingsForm.propTypes = {
    settings: PropTypes.object.isRequired,
    onSettingChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};


const NotificationSettingsToggle = ({ settings, onSettingChange, onSave }) => {
    const notificationItems = [
        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
        { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
        { key: 'appointmentReminders', label: 'Appointment Reminders', description: 'Send reminders for upcoming appointments' },
        { key: 'billReminders', label: 'Bill Reminders', description: 'Send reminders for pending bills' },
        { key: 'systemAlerts', label: 'System Alerts', description: 'Receive alerts about system events' }
    ];

    return (
        <div>
            <Heading level={2} className="text-xl font-semibold text-surface-900 mb-6">Notification Settings</Heading>
            <div className="space-y-6">
                <div className="space-y-4">
                    {notificationItems.map((setting) => (
                        <ToggleSwitch
                            key={setting.key}
                            label={setting.label}
                            description={setting.description}
                            checked={settings[setting.key]}
                            onChange={(e) => onSettingChange(setting.key, e.target.checked)}
                        />
                    ))}
                </div>
                <div className="flex justify-end">
                    <Button
                        onClick={onSave}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

NotificationSettingsToggle.propTypes = {
    settings: PropTypes.object.isRequired,
    onSettingChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

const SecuritySettingsForm = ({ settings, onSettingChange, onSave }) => {
    const sessionTimeoutOptions = [
        { value: '15', label: '15 minutes' },
        { value: '30', label: '30 minutes' },
        { value: '60', label: '1 hour' },
        { value: '120', label: '2 hours' },
    ];
    const passwordExpiryOptions = [
        { value: '30', label: '30 days' },
        { value: '60', label: '60 days' },
        { value: '90', label: '90 days' },
        { value: '180', label: '180 days' },
        { value: 'never', label: 'Never' },
    ];
    const loginAttemptsOptions = [
        { value: '3', label: '3 attempts' },
        { value: '5', label: '5 attempts' },
        { value: '10', label: '10 attempts' },
    ];

    return (
        <div>
            <Heading level={2} className="text-xl font-semibold text-surface-900 mb-6">Security Settings</Heading>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Session Timeout (minutes)">
                        <Select
                            value={settings.sessionTimeout}
                            onChange={(e) => onSettingChange('sessionTimeout', e.target.value)}
                            options={sessionTimeoutOptions}
                        />
                    </FormField>
                    <FormField label="Password Expiry (days)">
                        <Select
                            value={settings.passwordExpiry}
                            onChange={(e) => onSettingChange('passwordExpiry', e.target.value)}
                            options={passwordExpiryOptions}
                        />
                    </FormField>
                    <FormField label="Max Login Attempts">
                        <Select
                            value={settings.loginAttempts}
                            onChange={(e) => onSettingChange('loginAttempts', e.target.value)}
                            options={loginAttemptsOptions}
                        />
                    </FormField>
                </div>

                <ToggleSwitch
                    label="Two-Factor Authentication"
                    description="Add an extra layer of security to your account"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => onSettingChange('twoFactorAuth', e.target.checked)}
                />

                <div className="flex justify-end">
                    <Button
                        onClick={onSave}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

SecuritySettingsForm.propTypes = {
    settings: PropTypes.object.isRequired,
    onSettingChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

const BackupRestoreActions = ({ onBackup, onRestore, backupHistory }) => (
    <div>
        <Heading level={2} className="text-xl font-semibold text-surface-900 mb-6">Backup & Restore</Heading>
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
                    <Button
                        onClick={onBackup}
                        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Start Backup
                    </Button>
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
                    <Button
                        onClick={onRestore}
                        className="w-full px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning/90 transition-colors"
                    >
                        Restore System
                    </Button>
                </div>
            </div>

            <div className="bg-surface-50 p-6 rounded-lg">
                <h4 className="font-semibold text-surface-900 mb-4">Backup History</h4>
                <div className="space-y-3">
                    {backupHistory.map((backup, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-surface-200">
                            <div>
                                <Text as="p" className="font-medium text-surface-900">{backup.date}</Text>
                                <Text as="p" className="text-sm text-surface-600">Size: {backup.size}</Text>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Text as="span" className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                                    {backup.status}
                                </Text>
                                <Button className="p-1 text-surface-600 hover:text-primary transition-colors">
                                    <ApperIcon name="Download" className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

BackupRestoreActions.propTypes = {
    onBackup: PropTypes.func.isRequired,
    onRestore: PropTypes.func.isRequired,
    backupHistory: PropTypes.array.isRequired,
};


const SettingsNavAndContent = ({
    activeTab,
    setActiveTab,
    generalSettings,
    setGeneralSettings,
    notificationSettings,
    setNotificationSettings,
    securitySettings,
    setSecuritySettings,
    handleGeneralSave,
    handleNotificationSave,
    handleSecuritySave,
    handleBackup,
    handleRestore
}) => {
    const tabs = [
        { id: 'general', label: 'General', icon: 'Settings' },
        { id: 'notifications', label: 'Notifications', icon: 'Bell' },
        { id: 'security', label: 'Security', icon: 'Shield' },
        { id: 'backup', label: 'Backup', icon: 'Database' }
    ];

    const backupHistoryData = [
        { date: '2024-01-15 10:30 AM', size: '2.4 GB', status: 'Completed' },
        { date: '2024-01-14 10:30 AM', size: '2.3 GB', status: 'Completed' },
        { date: '2024-01-13 10:30 AM', size: '2.2 GB', status: 'Completed' }
    ];

    const handleGeneralSettingChange = (key, value) => {
        setGeneralSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleNotificationSettingChange = (key, value) => {
        setNotificationSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSecuritySettingChange = (key, value) => {
        setSecuritySettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64">
                <Card className="p-4">
                    <nav className="space-y-2">
                        {tabs.map((tab) => (
                            <SettingsMenuItem
                                key={tab.id}
                                icon={tab.icon}
                                label={tab.label}
                                isActive={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                            />
                        ))}
                    </nav>
                </Card>
            </div>

            <div className="flex-1">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                >
                    {activeTab === 'general' && (
                        <GeneralSettingsForm
                            settings={generalSettings}
                            onSettingChange={handleGeneralSettingChange}
                            onSave={handleGeneralSave}
                        />
                    )}

                    {activeTab === 'notifications' && (
                        <NotificationSettingsToggle
                            settings={notificationSettings}
                            onSettingChange={handleNotificationSettingChange}
                            onSave={handleNotificationSave}
                        />
                    )}

                    {activeTab === 'security' && (
                        <SecuritySettingsForm
                            settings={securitySettings}
                            onSettingChange={handleSecuritySettingChange}
                            onSave={handleSecuritySave}
                        />
                    )}

                    {activeTab === 'backup' && (
                        <BackupRestoreActions
                            onBackup={handleBackup}
                            onRestore={handleRestore}
                            backupHistory={backupHistoryData}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
};

SettingsNavAndContent.propTypes = {
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    generalSettings: PropTypes.object.isRequired,
    setGeneralSettings: PropTypes.func.isRequired,
    notificationSettings: PropTypes.object.isRequired,
    setNotificationSettings: PropTypes.func.isRequired,
    securitySettings: PropTypes.object.isRequired,
    setSecuritySettings: PropTypes.func.isRequired,
    handleGeneralSave: PropTypes.func.isRequired,
    handleNotificationSave: PropTypes.func.isRequired,
    handleSecuritySave: PropTypes.func.isRequired,
    handleBackup: PropTypes.func.isRequired,
    handleRestore: PropTypes.func.isRequired,
};

export default SettingsNavAndContent;