import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { appointmentService, patientService, doctorService, billService } from '@/services';

import DashboardHeader from '@/components/organisms/DashboardHeader';
import DashboardOverviewStats from '@/components/organisms/DashboardOverviewStats';
import TodaysAppointmentsSection from '@/components/organisms/TodaysAppointmentsSection';
import RecentPatientsSection from '@/components/organisms/RecentPatientsSection';
import PendingBillsSection from '@/components/organisms/PendingBillsSection';
import EmptyState from '@/components/molecules/EmptyState';

const HomePage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [recentPatients, setRecentPatients] = useState([]);
    const [pendingBills, setPendingBills] = useState([]);
    const [allPatients, setAllPatients] = useState([]); // To create patientMap
    const [allDoctors, setAllDoctors] = useState([]); // To create doctorMap
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const patientMap = useMemo(() => {
        return allPatients.reduce((acc, patient) => {
            acc[patient.id] = patient;
            return acc;
        }, {});
    }, [allPatients]);

    const doctorMap = useMemo(() => {
        return allDoctors.reduce((acc, doctor) => {
            acc[doctor.id] = doctor;
            return acc;
        }, {});
    }, [allDoctors]);

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
            const todayAppts = appointments.filter(apt => apt.date === today);
            const recentPts = patients.slice(0, 3);
            const pending = bills.filter(bill => bill.status === 'pending');

            setStats({
                totalPatients: patients.length,
                totalDoctors: doctors.length,
                todayAppointments: todayAppts.length,
                pendingBills: pending.length
            });

            setTodayAppointments(todayAppts);
            setRecentPatients(recentPts);
            setPendingBills(pending.slice(0, 3));
            setAllPatients(patients);
            setAllDoctors(doctors);

        } catch (err) {
            setError(err.message || 'Failed to load dashboard data');
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-info text-white';
            case 'completed': return 'bg-success text-white';
            case 'cancelled': return 'bg-error text-white';
            case 'pending': return 'bg-warning text-white';
            case 'paid': return 'bg-success text-white';
            case 'overdue': return 'bg-error text-white';
            default: return 'bg-surface-300 text-surface-700';
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
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
        }
    ];

    return (
        <div className="p-6 space-y-6 max-w-full overflow-hidden">
            <DashboardHeader
                title="Dashboard"
                description="Welcome to MediFlow Healthcare Management"
                actions={headerActions}
            />

            <DashboardOverviewStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TodaysAppointmentsSection
                    appointments={todayAppointments}
                    patientMap={patientMap}
                    doctorMap={doctorMap}
                    getStatusColor={getStatusColor}
                />
                <RecentPatientsSection
                    patients={recentPatients}
                />
            </div>

            <PendingBillsSection
                bills={pendingBills}
                getStatusColor={getStatusColor}
                patientMap={patientMap}
            />
        </div>
    );
};

export default HomePage;