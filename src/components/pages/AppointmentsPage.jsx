import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { appointmentService, patientService, doctorService } from '@/services';

import DashboardHeader from '@/components/organisms/DashboardHeader';
import FilterControls from '@/components/molecules/FilterControls';
import Modal from '@/components/molecules/Modal';
import AppointmentForm from '@/components/organisms/AppointmentForm';
import AppointmentsListTable from '@/components/organisms/AppointmentsListTable';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import { motion } from 'framer-motion';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('list'); // 'list' or 'calendar'
    const [showForm, setShowForm] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        type: 'consultation',
        notes: ''
    });

    const patientMap = useMemo(() => {
        return patients.reduce((acc, patient) => {
            acc[patient.id] = patient;
            return acc;
        }, {});
    }, [patients]);

    const doctorMap = useMemo(() => {
        return doctors.reduce((acc, doctor) => {
            acc[doctor.id] = doctor;
            return acc;
        }, {});
    }, [doctors]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [appointmentsData, patientsData, doctorsData] = await Promise.all([
                appointmentService.getAll(),
                patientService.getAll(),
                doctorService.getAll()
            ]);
            setAppointments(appointmentsData);
            setPatients(patientsData);
            setDoctors(doctorsData);
        } catch (err) {
            setError(err.message || 'Failed to load appointments');
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            if (editingAppointment) {
                await appointmentService.update(editingAppointment.id, formData);
                toast.success('Appointment updated successfully');
            } else {
                const newAppointment = {
                    ...formData,
                    status: 'scheduled',
                    duration: 30
                };
                await appointmentService.create(newAppointment);
                toast.success('Appointment created successfully');
            }

            resetForm();
            loadData();
        } catch (err) {
            toast.error(editingAppointment ? 'Failed to update appointment' : 'Failed to create appointment');
        }
    };

    const handleEdit = (appointment) => {
        setFormData({
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            date: appointment.date,
            time: appointment.time,
            type: appointment.type,
            notes: appointment.notes || ''
        });
        setEditingAppointment(appointment);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) return;

        try {
            await appointmentService.delete(id);
            toast.success('Appointment deleted successfully');
            loadData();
        } catch (err) {
            toast.error('Failed to delete appointment');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await appointmentService.update(id, { status: newStatus });
            toast.success('Appointment status updated');
            loadData();
        } catch (err) {
            toast.error('Failed to update appointment status');
        }
    };

    const resetForm = () => {
        setFormData({
            patientId: '',
            doctorId: '',
            date: '',
            time: '',
            type: 'consultation',
            notes: ''
        });
        setEditingAppointment(null);
        setShowForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-info text-white';
            case 'completed': return 'bg-success text-white';
            case 'cancelled': return 'bg-error text-white';
            default: return 'bg-surface-300 text-surface-700';
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        const patientName = patientMap[appointment.patientId]?.name || `Patient #${appointment.patientId}`;
        const doctorName = doctorMap[appointment.doctorId]?.name || `Doctor #${appointment.doctorId}`;

        const matchesSearch =
            patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

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
        );
    }

    if (error) {
        return (
            <div className="p-6 flex items-center justify-center min-h-96">
                <EmptyState
                    icon="AlertCircle"
                    title="Failed to load appointments"
                    message={error}
                    buttonText="Try Again"
                    onButtonClick={loadData}
                />
            </div>
        );
    }

    const headerActions = [
        <div key="view-toggle" className="flex bg-surface-100 rounded-lg p-1">
            <Button
                onClick={() => setView('list')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    view === 'list'
                        ? 'bg-white text-surface-900 shadow-sm'
                        : 'text-surface-600 hover:text-surface-900'
                }`}
            >
                <ApperIcon name="List" className="w-4 h-4 inline mr-1" />
                List
            </Button>
            <Button
                onClick={() => setView('calendar')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    view === 'calendar'
                        ? 'bg-white text-surface-900 shadow-sm'
                        : 'text-surface-600 hover:text-surface-900'
                }`}
            >
                <ApperIcon name="Calendar" className="w-4 h-4 inline mr-1" />
                Calendar
            </Button>
        </div>,
        {
            label: 'New Appointment',
            onClick: () => setShowForm(true),
            className: 'px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors',
            icon: 'Plus'
        }
    ];

    const statusFilterOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <div className="p-6 space-y-6 max-w-full overflow-hidden">
            <DashboardHeader
                title="Appointments"
                description="Manage patient appointments and schedules"
                actions={headerActions}
            />

            <FilterControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterValue={statusFilter}
                onFilterChange={setStatusFilter}
                filterOptions={statusFilterOptions}
                placeholder="Search appointments..."
            />

            <Modal
                isOpen={showForm}
                onClose={resetForm}
                title={editingAppointment ? 'Edit Appointment' : 'New Appointment'}
            >
                <AppointmentForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    resetForm={resetForm}
                    patients={patients}
                    doctors={doctors}
                    editingAppointment={editingAppointment}
                />
            </Modal>

            {view === 'list' ? (
                <AppointmentsListTable
                    appointments={filteredAppointments}
                    patientMap={patientMap}
                    doctorMap={doctorMap}
                    getStatusColor={getStatusColor}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleStatusChange={handleStatusChange}
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    setShowForm={setShowForm}
                />
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-center py-12">
                        <ApperIcon name="Calendar" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                        <Heading level={3} className="text-lg font-medium text-surface-900 mb-2">Calendar View</Heading>
                        <Text as="p" className="text-surface-600">Calendar view will be implemented in future updates</Text>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentsPage;