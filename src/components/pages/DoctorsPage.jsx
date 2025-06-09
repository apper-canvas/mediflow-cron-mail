import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { doctorService } from '@/services';

import DashboardHeader from '@/components/organisms/DashboardHeader';
import FilterControls from '@/components/molecules/FilterControls';
import Modal from '@/components/molecules/Modal';
import DoctorForm from '@/components/organisms/DoctorForm';
import DoctorCardsDisplay from '@/components/organisms/DoctorCardsDisplay';
import EmptyState from '@/components/molecules/EmptyState';

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [specializationFilter, setSpecializationFilter] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        email: '',
        phone: '',
        department: '',
        availability: []
    });

    const specializations = [
        'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
        'Dermatology', 'Psychiatry', 'General Surgery', 'Internal Medicine',
        'Ophthalmology', 'ENT', 'Radiology', 'Anesthesiology'
    ];

    const departments = [
        'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
        'Surgery', 'Internal Medicine', 'Emergency', 'Radiology'
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await doctorService.getAll();
            setDoctors(data);
        } catch (err) {
            setError(err.message || 'Failed to load doctors');
            toast.error('Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.specialization || !formData.email || !formData.phone) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            if (editingDoctor) {
                await doctorService.update(editingDoctor.id, formData);
                toast.success('Doctor updated successfully');
            } else {
                await doctorService.create(formData);
                toast.success('Doctor added successfully');
            }

            resetForm();
            loadDoctors();
        } catch (err) {
            toast.error(editingDoctor ? 'Failed to update doctor' : 'Failed to add doctor');
        }
    };

    const handleEdit = (doctor) => {
        setFormData({
            name: doctor.name,
            specialization: doctor.specialization,
            email: doctor.email,
            phone: doctor.phone,
            department: doctor.department,
            availability: doctor.availability || []
        });
        setEditingDoctor(doctor);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return;

        try {
            await doctorService.delete(id);
            toast.success('Doctor deleted successfully');
            loadDoctors();
        } catch (err) {
            toast.error('Failed to delete doctor');
        }
    };

    const toggleStatus = async (doctor) => {
        try {
            const newStatus = doctor.status === 'active' ? 'inactive' : 'active';
            await doctorService.update(doctor.id, { status: newStatus });
            toast.success(`Doctor ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
            loadDoctors();
        } catch (err) {
            toast.error('Failed to update doctor status');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            specialization: '',
            email: '',
            phone: '',
            department: '',
            availability: []
        });
        setEditingDoctor(null);
        setShowForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvailabilityChange = (day, slots) => {
        setFormData(prev => ({
            ...prev,
            availability: prev.availability.map(avail =>
                avail.day === day ? { ...avail, slots } : avail
            ).concat(
                prev.availability.find(avail => avail.day === day) ? [] : [{ day, slots }]
            )
        }));
    };

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch =
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.department.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSpecialization = specializationFilter === 'all' ||
            doctor.specialization.toLowerCase().includes(specializationFilter.toLowerCase());

        return matchesSearch && matchesSpecialization;
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
                    title="Failed to load doctors"
                    message={error}
                    buttonText="Try Again"
                    onButtonClick={loadDoctors}
                />
            </div>
        );
    }

    const headerActions = [
        {
            label: 'Add Doctor',
            onClick: () => setShowForm(true),
            className: 'mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors',
            icon: 'UserPlus'
        }
    ];

    const specializationFilterOptions = [
        { value: 'all', label: 'All Specializations' },
        ...specializations.map(spec => ({ value: spec, label: spec }))
    ];

    return (
        <div className="p-6 space-y-6 max-w-full overflow-hidden">
            <DashboardHeader
                title="Doctors"
                description="Manage medical staff and their schedules"
                actions={headerActions}
            />

            <FilterControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterValue={specializationFilter}
                onFilterChange={setSpecializationFilter}
                filterOptions={specializationFilterOptions}
                placeholder="Search doctors..."
            />

            <Modal
                isOpen={showForm}
                onClose={resetForm}
                title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                maxWidth="max-w-4xl"
            >
                <DoctorForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleAvailabilityChange={handleAvailabilityChange}
                    handleSubmit={handleSubmit}
                    resetForm={resetForm}
                    editingDoctor={editingDoctor}
                    specializations={specializations}
                    departments={departments}
                    days={days}
                    timeSlots={timeSlots}
                />
            </Modal>

            <DoctorCardsDisplay
                doctors={filteredDoctors}
                searchTerm={searchTerm}
                specializationFilter={specializationFilter}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={toggleStatus}
                setShowForm={setShowForm}
            />
        </div>
    );
};

export default DoctorsPage;