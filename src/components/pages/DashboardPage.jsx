import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { appointmentService, patientService, doctorService, billService } from '@/services';

import DashboardHeader from '@/components/organisms/DashboardHeader';
import AnalyticsOverview from '@/components/organisms/AnalyticsOverview';
import PerformanceMetrics from '@/components/organisms/PerformanceMetrics';
import RecentActivityLog from '@/components/organisms/RecentActivityLog';
import QuickActionsDashboard from '@/components/organisms/QuickActionsDashboard';
import EmptyState from '@/components/molecules/EmptyState';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [recentActivity, setRecentActivity] = useState([]);
    const [quickMetrics, setQuickMetrics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allBills, setAllBills] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [appointments, patients, doctors, bills] = await Promise.all([
                appointmentService.getAll(),
                patientService.getAll(),
                doctorService.getAll(),
                billService.getAll()
            ]);

            const today = new Date().toISOString().split('T')[0];
            const todayAppointments = appointments.filter(apt => apt.date === today);
            const completedToday = todayAppointments.filter(apt => apt.status === 'completed');
            const pendingBills = bills.filter(bill => bill.status === 'pending');
            const activeDoctors = doctors.filter(doc => doc.status === 'active');
            const totalRevenue = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total, 0);


            setStats({
                totalPatients: patients.length,
                totalDoctors: doctors.length, // This seems to be used as active doctors count in original
                todayAppointments: todayAppointments.length,
                completedAppointments: completedToday.length,
                pendingBills: pendingBills.length,
                totalRevenue: totalRevenue,
                activeDoctorCount: activeDoctors.length // Actual active count
            });

            setQuickMetrics({
                appointmentCompletionRate: todayAppointments.length > 0 ? Math.round((completedToday.length / todayAppointments.length) * 100) : 0,
                averageBillAmount: bills.length > 0 ? Math.round(bills.reduce((sum, b) => sum + b.total, 0) / bills.length) : 0,
            });

            setAllBills(bills); // Store all bills for totalRevenue calculation in PerformanceMetrics

            // Generate recent activity
            const activity = [
                ...appointments.slice(-3).map(apt => ({
                    id: apt.id,
                    type: 'appointment',
                    message: `Appointment scheduled for ${apt.date}`,
                    time: '2 hours ago',
                    icon: 'Calendar'
                })),
                ...patients.slice(-2).map(patient => ({
                    id: patient.id,
                    type: 'patient',
                    message: `New patient registered: ${patient.name}`,
                    time: '4 hours ago',
                    icon: 'UserPlus'
                }))
            ].slice(0, 5); // Ensure max 5 items

            setRecentActivity(activity);
        } catch (err) {
            setError(err.message || 'Failed to load dashboard data');
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                            <div className="h-4 bg-surface-200 rounded w-3/4 mb-4"></div>
                            <div className="h-8 bg-surface-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                            <div className="h-6 bg-surface-200 rounded w-1/2 mb-4"></div>
                            <div className="space-y-3">
                                {[...Array(3)].map((_, j) => (
                                    <div key={j} className="h-16 bg-surface-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 flex items-center justify-center min-h-96">
                <EmptyState
                    icon="AlertCircle"
                    title="Failed to load dashboard"
                    message={error}
                    buttonText="Try Again"
                    onButtonClick={loadDashboardData}
                />
            </div>
        );
    }

    const headerActions = [
        {
            label: 'New Appointment',
            onClick: () => navigate('/appointments'),
            className: 'px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors',
            icon: 'Plus'
        },
        {
            label: 'Refresh',
            onClick: loadDashboardData,
            className: 'px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors',
            icon: 'RefreshCw'
        }
    ];

    return (
        <div className="p-6 space-y-6 max-w-full overflow-hidden">
            <DashboardHeader
                title="Analytics Dashboard"
                description="Hospital management overview and insights"
                actions={headerActions}
            />

            <AnalyticsOverview stats={stats} />

            <PerformanceMetrics quickMetrics={quickMetrics} totalRevenue={stats.totalRevenue} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivityLog recentActivity={recentActivity} />
                <QuickActionsDashboard />
            </div>
        </div>
    );
};

export default DashboardPage;